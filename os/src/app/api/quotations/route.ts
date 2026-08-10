import { z } from "zod";
import { Prisma, QuotationStatus, QuotePaymentPlanType, QuotePaymentStatus } from "@prisma/client";
import { ForbiddenError, requirePermission, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { writeAudit } from "@/lib/audit";
import { roleHasPermission } from "@/lib/rbac";
import {
  createSecureToken,
  getCompanyProfile,
  nextQuotationNumber,
} from "@/lib/quotations/numbering";
import {
  defaultTermsText,
  inrToPaise,
  persistQuotationTotals,
} from "@/lib/quotations/engine";

const itemSchema = z.object({
  serviceName: z.string().min(1),
  category: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  quantity: z.number().positive().default(1),
  unitPriceInr: z.number().nonnegative(),
  discountPercent: z.number().min(0).max(100).optional().default(0),
  discountAmountInr: z.number().nonnegative().optional(),
  gstPercent: z.number().min(0).max(100).optional(),
  billingType: z.string().optional().default("one_time"),
  catalogServiceId: z.string().optional().nullable(),
});

const createSchema = z.object({
  clientId: z.string().min(1),
  organizationId: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  internalNotes: z.string().optional().nullable(),
  items: z.array(itemSchema).optional(),
  advancePercent: z.number().min(0).max(100).optional(),
  validUntil: z.string().datetime().or(z.string().min(1)).optional(),
  paymentPlanType: z.nativeEnum(QuotePaymentPlanType).optional(),
  termsTemplateId: z.string().optional().nullable(),
  whyChooseEnabled: z.boolean().optional(),
  showTrust: z.boolean().optional(),
});

export async function GET(req: Request) {
  try {
    const session = await requireUser(req);
    if (
      !roleHasPermission(session.globalRole, "deal:read") &&
      !roleHasPermission(session.globalRole, "finance:read")
    ) {
      throw new ForbiddenError("Missing permission: deal:read or finance:read");
    }

    const url = new URL(req.url);
    const status = url.searchParams.get("status");
    const paymentStatus = url.searchParams.get("paymentStatus");
    const q = url.searchParams.get("q")?.trim();
    const take = Math.min(200, Math.max(1, Number(url.searchParams.get("take") || 100)));

    const where: Prisma.QuotationWhereInput = {};
    if (status) {
      if (!Object.values(QuotationStatus).includes(status as QuotationStatus)) {
        return jsonError("Invalid status", 400);
      }
      where.status = status as QuotationStatus;
    }
    if (paymentStatus) {
      if (!Object.values(QuotePaymentStatus).includes(paymentStatus as QuotePaymentStatus)) {
        return jsonError("Invalid paymentStatus", 400);
      }
      where.paymentStatus = paymentStatus as QuotePaymentStatus;
    }
    if (q) {
      where.OR = [
        { quotationNumber: { contains: q, mode: "insensitive" } },
        { title: { contains: q, mode: "insensitive" } },
        { client: { companyName: { contains: q, mode: "insensitive" } } },
        { client: { email: { contains: q, mode: "insensitive" } } },
        { client: { mobile: { contains: q, mode: "insensitive" } } },
        { client: { clientCode: { contains: q, mode: "insensitive" } } },
      ];
    }

    const quotations = await prisma.quotation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      include: {
        client: {
          select: {
            id: true,
            clientCode: true,
            companyName: true,
            contactPerson: true,
            email: true,
            mobile: true,
          },
        },
        _count: { select: { items: true, payments: true } },
      },
    });

    return jsonOk({ quotations, count: quotations.length });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(req: Request) {
  try {
    const session = await requirePermission("deal:write", req);
    const body = createSchema.parse(await req.json());

    const client = await prisma.quoteClient.findUnique({ where: { id: body.clientId } });
    if (!client) return jsonError("Client not found", 404);

    const company = await getCompanyProfile();
    const quotationNumber = await nextQuotationNumber(
      company.quotationPrefix,
      company.quotationDigits,
    );
    const secureToken = createSecureToken();

    const validityDays = company.defaultValidityDays || 15;
    const validUntil = body.validUntil
      ? new Date(body.validUntil)
      : new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000);
    if (Number.isNaN(validUntil.getTime())) {
      return jsonError("Invalid validUntil date", 400);
    }

    let termsSnapshot = defaultTermsText();
    let termsVersion: string | null = null;
    if (body.termsTemplateId) {
      const tmpl = await prisma.termsTemplate.findUnique({ where: { id: body.termsTemplateId } });
      if (tmpl) {
        termsSnapshot = tmpl.body;
        termsVersion = tmpl.id;
      }
    } else {
      const defaultTmpl = await prisma.termsTemplate.findFirst({
        where: { isDefault: true, isActive: true, archived: false },
      });
      if (defaultTmpl) {
        termsSnapshot = defaultTmpl.body;
        termsVersion = defaultTmpl.id;
      }
    }

    const advancePercent = body.advancePercent ?? company.defaultAdvancePct ?? 60;
    const gstDefault = company.defaultGstPercent ?? 18;

    const quotation = await prisma.quotation.create({
      data: {
        clientId: client.id,
        organizationId: body.organizationId || client.organizationId || null,
        quotationNumber,
        secureToken,
        status: "DRAFT",
        paymentStatus: "UNPAID",
        validUntil,
        title: body.title || null,
        notes: body.notes || null,
        internalNotes: body.internalNotes || null,
        currency: company.currency || "INR",
        companyState: company.state || "Maharashtra",
        clientState: client.state || null,
        paymentPlanType: body.paymentPlanType || "ADVANCE_BALANCE",
        advancePercent,
        termsTemplateId: body.termsTemplateId || termsVersion,
        termsSnapshot,
        termsVersion,
        whyChooseEnabled: body.whyChooseEnabled ?? company.showWhyChoose,
        showTrust: body.showTrust ?? true,
        createdById: session.userId,
        items: body.items?.length
          ? {
              create: body.items.map((item, i) => ({
                sortOrder: i,
                serviceName: item.serviceName,
                category: item.category || null,
                description: item.description || null,
                quantity: item.quantity,
                unitPricePaise: inrToPaise(item.unitPriceInr),
                discountPercent: item.discountPercent ?? 0,
                discountPaise: item.discountAmountInr
                  ? inrToPaise(item.discountAmountInr)
                  : 0,
                gstPercent: item.gstPercent ?? gstDefault,
                billingType: item.billingType || "one_time",
                catalogServiceId: item.catalogServiceId || null,
              })),
            }
          : undefined,
      },
    });

    const result = body.items?.length
      ? await persistQuotationTotals(quotation.id)
      : await prisma.quotation.findUniqueOrThrow({
          where: { id: quotation.id },
          include: { items: { orderBy: { sortOrder: "asc" } }, client: true },
        });

    await prisma.quotationEvent.create({
      data: {
        quotationId: quotation.id,
        type: "quotation.created",
        message: `Draft quotation ${quotationNumber} created`,
        actorUserId: session.userId,
        meta: { quotationNumber, itemCount: body.items?.length || 0 },
      },
    });

    await writeAudit({
      action: "quotation.create",
      userId: session.userId,
      organizationId: quotation.organizationId,
      entity: "quotation",
      entityId: quotation.id,
      after: {
        quotationNumber,
        clientId: client.id,
        status: "DRAFT",
      },
    });

    return jsonOk(result);
  } catch (err) {
    return handleApiError(err);
  }
}
