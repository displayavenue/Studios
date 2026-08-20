import { randomBytes } from "crypto";
import { prisma } from "../db";

export function createSecureToken(bytes = 24) {
  return randomBytes(bytes).toString("base64url");
}

export async function nextQuotationNumber(prefix = "DA", digits = 5) {
  const year = new Date().getFullYear();
  const seq = await prisma.$transaction(async (tx) => {
    const row = await tx.quotationSequence.upsert({
      where: { prefix_year: { prefix, year } },
      create: { prefix, year, lastNumber: 1 },
      update: { lastNumber: { increment: 1 } },
    });
    return row.lastNumber;
  });
  return `${prefix}-${year}-${String(seq).padStart(digits, "0")}`;
}

export function indianFyLabel(date = new Date()) {
  const y = date.getFullYear();
  const m = date.getMonth(); // 0-based
  const start = m >= 3 ? y : y - 1;
  const end = String(start + 1).slice(-2);
  return `${start}-${end}`;
}

export async function nextInvoiceNumber(prefix = "DAV", digits = 5) {
  const fyLabel = indianFyLabel();
  const seq = await prisma.$transaction(async (tx) => {
    const row = await tx.invoiceSequence.upsert({
      where: { prefix_fyLabel: { prefix, fyLabel } },
      create: { prefix, fyLabel, lastNumber: 1 },
      update: { lastNumber: { increment: 1 } },
    });
    return row.lastNumber;
  });
  return `${prefix}/${fyLabel}/${String(seq).padStart(digits, "0")}`;
}

export async function nextReceiptNumber(prefix = "DAR", digits = 5) {
  const fyLabel = indianFyLabel();
  const seq = await prisma.$transaction(async (tx) => {
    const row = await tx.receiptSequence.upsert({
      where: { prefix_fyLabel: { prefix, fyLabel } },
      create: { prefix, fyLabel, lastNumber: 1 },
      update: { lastNumber: { increment: 1 } },
    });
    return row.lastNumber;
  });
  return `${prefix}/${fyLabel}/${String(seq).padStart(digits, "0")}`;
}

export async function nextClientCode() {
  const count = await prisma.quoteClient.count();
  return `CL-${String(count + 1).padStart(5, "0")}`;
}

export async function getCompanyProfile() {
  const existing = await prisma.companyProfile.findFirst({ orderBy: { createdAt: "asc" } });
  if (existing) return existing;
  return prisma.companyProfile.create({
    data: {
      legalName: "Mediashouter",
      brandName: "DisplayAvenue",
      gstin: "27ALJPY9454C1ZJ",
      phone: "9222122333",
      website: "https://displayavenue.com",
      state: "Maharashtra",
      country: "India",
      defaultGstPercent: 18,
      defaultAdvancePct: 60,
      defaultValidityDays: 15,
      quotationPrefix: "DA",
      quotationDigits: 5,
      invoicePrefix: "DAV",
      receiptPrefix: "DAR",
      whyChooseItems: [
        "Strategy-focused execution",
        "Transparent scope",
        "Professional reporting",
        "Dedicated support",
        "Technology-driven marketing",
      ],
      trustItems: [
        "GST Registered Business",
        "Secure Online Payment",
        "Transparent Pricing",
        "Defined Scope",
        "Professional Documentation",
      ],
      whatsappTemplate:
        "Hello {{client_name}},\n\nPlease find your quotation from DisplayAvenue.\n\nQuotation No:\n{{quotation_number}}\n\nTotal:\n{{grand_total}}\n\nAdvance:\n{{advance}}\n\nPlease review and accept the quotation here:\n{{secure_link}}\n\nRegards,\nDisplayAvenue\nMediashouter",
      emailSubjectTemplate: "Quotation {{quotation_number}} from DisplayAvenue",
      emailBodyTemplate:
        "Hello {{client_name}},\n\nPlease find your quotation from DisplayAvenue.\n\nQuotation Number: {{quotation_number}}\nQuotation Value: {{grand_total}}\nAdvance Payable: {{advance}}\nValid Until: {{valid_until}}\n\nPlease click below to review the quotation:\n{{secure_link}}\n\nRegards,\nDisplayAvenue\nMediashouter",
    },
  });
}
