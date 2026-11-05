import { z } from "zod";
import { QuotePaymentPlanType } from "@prisma/client";
import { ForbiddenError, requirePermission, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { writeAudit } from "@/lib/audit";
import { roleHasPermission } from "@/lib/rbac";
import { inrToPaise, persistQuotationTotals } from "@/lib/quotations/engine";
import { getCompanyProfile } from "@/lib/quotations/numbering";

type Params = { params: Promise<{ id: string }> };

const itemSchema = z.object({
  id: z.string().optional(),
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
  sortOrder: z.number().int().optional(),
});

const updateSchema = z.object({
  title: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  internalNotes: z.string().optional().nullable(),
  validUntil: z.string().datetime().or(z.string().min(1)).optional(),
  advancePercent: z.number().min(0).max(100).optional(),
  paymentPlanType: z.nativeEnum(QuotePaymentPlanType).optional(),
  termsSnapshot: z.string().optional().nullable(),
  termsTemplateId: z.string().optional().nullable(),
  whyChooseEnabled: z.boolean().optional(),
  showTrust: z.boolean().optional(),
  clientState: z.string().optional().nullable(),
  items: z.array(itemSchema).optional(),
});

async function requireQuoteRead(req: Request) {
  const session = await requireUser(req);
  if (
    !roleHasPermission(session.globalRole, "deal:read") &&
    !roleHasPermission(session.globalRole, "finance:read")
  ) {
    throw new ForbiddenError("Missing permission: deal:read or finance:read");
  }
  return session;
}

export async function GET(req: Request, { params }: Params) {
  try {
    await requireQuoteRead(req);
    const { id } = await params;

    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: {
        client: true,
        items: { orderBy: { sortOrder: "asc" } },
        payments: { orderBy: { createdAt: "desc" } },
        events: { orderBy: { createdAt: "desc" }, take: 100 },
        acceptances: { orderBy: { acceptedAt: "desc" } },
        milestones: { orderBy: { sortOrder: "asc" } },
      },
    });
    if (!quotation) return jsonError("Quotation not found", 404);
    return jsonOk(quotation);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const session = await requirePermission("deal:write", req);
    const { id } = await params;
    const body = updateSchema.parse(await req.json());

    const existing = await prisma.quotation.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!existing) return jsonError("Quotation not found", 404);
    if (existing.isImmutable) {
      return jsonError("Accepted quotation cannot be modified", 409);
    }
    if (existing.status !== "DRAFT" && existing.status !== "SENT" && existing.status !== "VIEWED") {
      return jsonError("Only draft/sent/viewed quotations can be edited", 409);
    }

    const company = await getCompanyProfile();
    const gstDefault = company.defaultGstPercent ?? 18;

    let validUntil: Date | undefined;
    if (body.validUntil) {
      validUntil = new Date(body.validUntil);
      if (Number.isNaN(validUntil.getTime())) {
        return jsonError("Invalid validUntil date", 400);
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.quotation.update({
        where: { id },
        data: {
          title: body.title === undefined ? undefined : body.title,
          notes: body.notes === undefined ? undefined : body.notes,
          internalNotes: body.internalNotes === undefined ? undefined : body.internalNotes,
          validUntil,
          advancePercent: body.advancePercent,
          paymentPlanType: body.paymentPlanType,
          termsSnapshot: body.termsSnapshot === undefined ? undefined : body.termsSnapshot,
          termsTemplateId: body.termsTemplateId === undefined ? undefined : body.termsTemplateId,
          whyChooseEnabled: body.whyChooseEnabled,
          showTrust: body.showTrust,
          clientState: body.clientState === undefined ? undefined : body.clientState,
        },
      });

      if (body.items) {
        await tx.quotationItem.deleteMany({ where: { quotationId: id } });
        if (body.items.length) {
          await tx.quotationItem.createMany({
            data: body.items.map((item, i) => ({
              quotationId: id,
              sortOrder: item.sortOrder ?? i,
              serviceName: item.serviceName,
              category: item.category || null,
              description: item.description || null,
              quantity: item.quantity,
              unitPricePaise: inrToPaise(item.unitPriceInr),
              discountPercent: item.discountPercent ?? 0,
              discountPaise: item.discountAmountInr ? inrToPaise(item.discountAmountInr) : 0,
              gstPercent: item.gstPercent ?? gstDefault,
              billingType: item.billingType || "one_time",
              catalogServiceId: item.catalogServiceId || null,
            })),
          });
        }
      }
    });

    const updated = body.items
      ? await persistQuotationTotals(id)
      : body.advancePercent != null
        ? await persistQuotationTotals(id)
        : await prisma.quotation.findUniqueOrThrow({
            where: { id },
            include: { items: { orderBy: { sortOrder: "asc" } }, client: true },
          });

    await prisma.quotationEvent.create({
      data: {
        quotationId: id,
        type: "quotation.updated",
        message: "Quotation updated",
        actorUserId: session.userId,
      },
    });

    await writeAudit({
      action: "quotation.update",
      userId: session.userId,
      organizationId: existing.organizationId,
      entity: "quotation",
      entityId: id,
      before: { status: existing.status, grandTotalPaise: existing.grandTotalPaise },
      after: {
        status: updated.status,
        grandTotalPaise: updated.grandTotalPaise,
      },
    });

    return jsonOk(updated);
  } catch (err) {
    if (err instanceof Error && /cannot be modified/i.test(err.message)) {
      return jsonError(err.message, 409);
    }
    return handleApiError(err);
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const session = await requirePermission("deal:write", req);
    const { id } = await params;

    const existing = await prisma.quotation.findUnique({ where: { id } });
    if (!existing) return jsonError("Quotation not found", 404);
    if (existing.status !== "DRAFT") {
      return jsonError("Only draft quotations can be deleted", 409);
    }

    await prisma.quotation.delete({ where: { id } });

    await writeAudit({
      action: "quotation.delete",
      userId: session.userId,
      organizationId: existing.organizationId,
      entity: "quotation",
      entityId: id,
      before: { quotationNumber: existing.quotationNumber, status: existing.status },
    });

    return jsonOk({ deleted: true, id });
  } catch (err) {
    return handleApiError(err);
  }
}
