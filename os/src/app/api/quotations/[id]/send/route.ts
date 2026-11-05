import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { writeAudit } from "@/lib/audit";
import { formatInr } from "@/lib/quotations/money";
import { getCompanyProfile } from "@/lib/quotations/numbering";
import { publicQuotationPath } from "@/lib/quotations/payments";
import { replaceTemplate } from "@/lib/quotations/engine";

type Params = { params: Promise<{ id: string }> };

function appBaseUrl() {
  return (
    process.env.APP_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3001"
  ).replace(/\/$/, "");
}

export async function POST(req: Request, { params }: Params) {
  try {
    const session = await requirePermission("deal:write", req);
    const { id } = await params;

    const quotation = await prisma.quotation.findUnique({
      where: { id },
      include: { client: true, items: true },
    });
    if (!quotation) return jsonError("Quotation not found", 404);
    if (["CANCELLED", "REJECTED", "EXPIRED"].includes(quotation.status)) {
      return jsonError("This quotation cannot be sent", 409);
    }
    if (quotation.items.length === 0) {
      return jsonError("Add at least one item before sending", 400);
    }

    const company = await getCompanyProfile();
    const publicPath = publicQuotationPath(quotation.quotationNumber, quotation.secureToken);
    const secureLink = `${appBaseUrl()}${publicPath}`;

    const keepStatus =
      quotation.status === "ACCEPTED" ||
      quotation.status === "PARTIALLY_PAID" ||
      quotation.status === "PAID";

    const sent = await prisma.quotation.update({
      where: { id },
      data: {
        status: keepStatus ? quotation.status : "SENT",
        sentAt: quotation.sentAt || new Date(),
      },
      include: { client: true },
    });

    const vars: Record<string, string> = {
      client_name: quotation.client.contactPerson || quotation.client.companyName,
      company_name: quotation.client.companyName,
      quotation_number: quotation.quotationNumber,
      grand_total: formatInr(quotation.grandTotalPaise),
      advance: formatInr(quotation.advancePaise),
      balance: formatInr(quotation.balancePaise),
      valid_until: quotation.validUntil.toLocaleDateString("en-IN"),
      secure_link: secureLink,
      brand_name: company.brandName,
    };

    const whatsappMessage = replaceTemplate(
      company.whatsappTemplate ||
        "Hello {{client_name}},\n\nPlease find your quotation {{quotation_number}}.\nTotal: {{grand_total}}\nLink: {{secure_link}}\n\nRegards,\n{{brand_name}}",
      vars,
    );
    const emailSubject = replaceTemplate(
      company.emailSubjectTemplate || "Quotation {{quotation_number}} from {{brand_name}}",
      vars,
    );
    const emailBody = replaceTemplate(
      company.emailBodyTemplate ||
        "Hello {{client_name}},\n\nPlease review quotation {{quotation_number}}.\nTotal: {{grand_total}}\nAdvance: {{advance}}\nValid until: {{valid_until}}\n\n{{secure_link}}\n\nRegards,\n{{brand_name}}",
      vars,
    );

    await prisma.quotationEvent.create({
      data: {
        quotationId: id,
        type: "quotation.sent",
        message: "Quotation marked as SENT",
        actorUserId: session.userId,
        meta: { secureLink },
      },
    });

    await writeAudit({
      action: "quotation.send",
      userId: session.userId,
      organizationId: quotation.organizationId,
      entity: "quotation",
      entityId: id,
      after: { status: sent.status, sentAt: sent.sentAt, secureLink },
    });

    return jsonOk({
      quotation: sent,
      publicUrl: secureLink,
      publicPath,
      whatsapp: {
        message: whatsappMessage,
        to: quotation.client.whatsapp || quotation.client.mobile || null,
      },
      email: {
        subject: emailSubject,
        body: emailBody,
        to: quotation.client.email || null,
      },
    });
  } catch (err) {
    return handleApiError(err);
  }
}
