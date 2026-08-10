import { z } from "zod";
import { Prisma } from "@prisma/client";
import { ForbiddenError, requirePermission, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonOk } from "@/lib/api";
import { writeAudit } from "@/lib/audit";
import { roleHasPermission } from "@/lib/rbac";
import { getCompanyProfile } from "@/lib/quotations/numbering";

const updateSchema = z.object({
  legalName: z.string().optional(),
  brandName: z.string().optional(),
  gstin: z.string().optional(),
  pan: z.string().optional().nullable(),
  phone: z.string().optional(),
  whatsapp: z.string().optional().nullable(),
  email: z.string().email().optional().nullable().or(z.literal("")),
  website: z.string().optional().nullable(),
  registeredAddress: z.string().optional().nullable(),
  billingAddress: z.string().optional().nullable(),
  state: z.string().optional(),
  city: z.string().optional().nullable(),
  pincode: z.string().optional().nullable(),
  country: z.string().optional(),
  logoUrl: z.string().optional().nullable(),
  faviconUrl: z.string().optional().nullable(),
  authorizedPerson: z.string().optional().nullable(),
  designation: z.string().optional().nullable(),
  signatureUrl: z.string().optional().nullable(),
  bankName: z.string().optional().nullable(),
  accountName: z.string().optional().nullable(),
  accountNumber: z.string().optional().nullable(),
  ifsc: z.string().optional().nullable(),
  upiId: z.string().optional().nullable(),
  defaultGstPercent: z.number().min(0).max(100).optional(),
  defaultAdvancePct: z.number().min(0).max(100).optional(),
  defaultValidityDays: z.number().int().positive().optional(),
  quotationPrefix: z.string().optional(),
  quotationDigits: z.number().int().min(3).max(8).optional(),
  invoicePrefix: z.string().optional(),
  receiptPrefix: z.string().optional(),
  currency: z.string().optional(),
  razorpayEnabled: z.boolean().optional(),
  subscriptionEnabled: z.boolean().optional(),
  showWhyChoose: z.boolean().optional(),
  whyChooseItems: z.unknown().optional(),
  trustItems: z.unknown().optional(),
  whatsappTemplate: z.string().optional().nullable(),
  emailSubjectTemplate: z.string().optional().nullable(),
  emailBodyTemplate: z.string().optional().nullable(),
});

export async function GET(req: Request) {
  try {
    const session = await requireUser(req);
    if (
      !roleHasPermission(session.globalRole, "admin:settings") &&
      !roleHasPermission(session.globalRole, "finance:read")
    ) {
      throw new ForbiddenError("Missing permission: admin:settings or finance:read");
    }

    const profile = await getCompanyProfile();
    return jsonOk(profile);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PUT(req: Request) {
  try {
    const session = await requirePermission("admin:settings", req);
    const body = updateSchema.parse(await req.json());
    const existing = await getCompanyProfile();

    const profile = await prisma.companyProfile.update({
      where: { id: existing.id },
      data: {
        legalName: body.legalName,
        brandName: body.brandName,
        gstin: body.gstin,
        pan: body.pan,
        phone: body.phone,
        whatsapp: body.whatsapp,
        email: body.email === "" ? null : body.email,
        website: body.website === null ? undefined : body.website,
        registeredAddress: body.registeredAddress,
        billingAddress: body.billingAddress,
        state: body.state,
        city: body.city,
        pincode: body.pincode,
        country: body.country,
        logoUrl: body.logoUrl,
        faviconUrl: body.faviconUrl,
        authorizedPerson: body.authorizedPerson,
        designation: body.designation,
        signatureUrl: body.signatureUrl,
        bankName: body.bankName,
        accountName: body.accountName,
        accountNumber: body.accountNumber,
        ifsc: body.ifsc,
        upiId: body.upiId,
        defaultGstPercent: body.defaultGstPercent,
        defaultAdvancePct: body.defaultAdvancePct,
        defaultValidityDays: body.defaultValidityDays,
        quotationPrefix: body.quotationPrefix,
        quotationDigits: body.quotationDigits,
        invoicePrefix: body.invoicePrefix,
        receiptPrefix: body.receiptPrefix,
        currency: body.currency,
        razorpayEnabled: body.razorpayEnabled,
        subscriptionEnabled: body.subscriptionEnabled,
        showWhyChoose: body.showWhyChoose,
        whyChooseItems:
          body.whyChooseItems === undefined
            ? undefined
            : (body.whyChooseItems as Prisma.InputJsonValue),
        trustItems:
          body.trustItems === undefined
            ? undefined
            : (body.trustItems as Prisma.InputJsonValue),
        whatsappTemplate: body.whatsappTemplate,
        emailSubjectTemplate: body.emailSubjectTemplate,
        emailBodyTemplate: body.emailBodyTemplate,
      },
    });

    await writeAudit({
      action: "company_profile.update",
      userId: session.userId,
      entity: "company_profile",
      entityId: profile.id,
      after: {
        brandName: profile.brandName,
        legalName: profile.legalName,
        gstin: profile.gstin,
      },
    });

    return jsonOk(profile);
  } catch (err) {
    return handleApiError(err);
  }
}
