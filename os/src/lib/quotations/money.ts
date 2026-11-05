/**
 * Indian GST + money helpers for quotations.
 * Amounts stored as integer paise (1 INR = 100 paise) to avoid float errors.
 */

export type GstMode = "CGST_SGST" | "IGST" | "NONE";

export type LineInput = {
  quantity: number;
  unitPriceInr: number;
  discountPercent?: number;
  discountAmountInr?: number;
  gstPercent: number;
};

export type LineCalc = {
  quantity: number;
  unitPricePaise: number;
  discountPaise: number;
  taxablePaise: number;
  gstPaise: number;
  totalPaise: number;
  gstPercent: number;
};

export type QuoteTotals = {
  subtotalPaise: number;
  discountPaise: number;
  taxablePaise: number;
  cgstPaise: number;
  sgstPaise: number;
  igstPaise: number;
  totalGstPaise: number;
  grandTotalPaise: number;
  gstMode: GstMode;
};

export function inrToPaise(inr: number): number {
  return Math.round(Number(inr || 0) * 100);
}

export function paiseToInr(paise: number): number {
  return Math.round(Number(paise || 0)) / 100;
}

export function formatInr(paiseOrInr: number, fromPaise = true): string {
  const inr = fromPaise ? paiseToInr(paiseOrInr) : paiseOrInr;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(inr);
}

export function calcLine(input: LineInput): LineCalc {
  const qty = Math.max(0, Number(input.quantity) || 0);
  const unitPricePaise = inrToPaise(input.unitPriceInr);
  const gross = Math.round(qty * unitPricePaise);
  let discountPaise = 0;
  if (input.discountAmountInr != null && input.discountAmountInr > 0) {
    discountPaise = inrToPaise(input.discountAmountInr);
  } else if (input.discountPercent && input.discountPercent > 0) {
    discountPaise = Math.round((gross * input.discountPercent) / 100);
  }
  discountPaise = Math.min(discountPaise, gross);
  const taxablePaise = gross - discountPaise;
  const gstPercent = Math.max(0, Number(input.gstPercent) || 0);
  const gstPaise = Math.round((taxablePaise * gstPercent) / 100);
  return {
    quantity: qty,
    unitPricePaise,
    discountPaise,
    taxablePaise,
    gstPaise,
    totalPaise: taxablePaise + gstPaise,
    gstPercent,
  };
}

export function sameState(a?: string | null, b?: string | null): boolean {
  const norm = (s?: string | null) =>
    String(s || "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  const left = norm(a);
  const right = norm(b);
  if (!left || !right) return true; // default CGST/SGST when unknown
  return left === right;
}

export function calcQuoteTotals(
  lines: LineCalc[],
  companyState?: string | null,
  clientState?: string | null,
): QuoteTotals {
  const subtotalPaise = lines.reduce(
    (s, l) => s + l.taxablePaise + l.discountPaise,
    0,
  );
  const discountPaise = lines.reduce((s, l) => s + l.discountPaise, 0);
  const taxablePaise = lines.reduce((s, l) => s + l.taxablePaise, 0);
  const totalGstPaise = lines.reduce((s, l) => s + l.gstPaise, 0);
  const intra = sameState(companyState, clientState);
  const gstMode: GstMode =
    totalGstPaise === 0 ? "NONE" : intra ? "CGST_SGST" : "IGST";

  let cgstPaise = 0;
  let sgstPaise = 0;
  let igstPaise = 0;
  if (gstMode === "CGST_SGST") {
    // Split evenly; for odd paise, give remainder to CGST
    cgstPaise = Math.ceil(totalGstPaise / 2);
    sgstPaise = totalGstPaise - cgstPaise;
  } else if (gstMode === "IGST") {
    igstPaise = totalGstPaise;
  }

  return {
    subtotalPaise,
    discountPaise,
    taxablePaise,
    cgstPaise,
    sgstPaise,
    igstPaise,
    totalGstPaise,
    grandTotalPaise: taxablePaise + totalGstPaise,
    gstMode,
  };
}

export function calcAdvancePaise(
  grandTotalPaise: number,
  advancePercent: number,
): { advancePaise: number; balancePaise: number } {
  const pct = Math.min(100, Math.max(0, Number(advancePercent) || 0));
  const advancePaise = Math.round((grandTotalPaise * pct) / 100);
  return {
    advancePaise,
    balancePaise: grandTotalPaise - advancePaise,
  };
}

export const DEFAULT_TERMS = [
  "This quotation is valid until the date specified in the quotation.",
  "Work will commence after receipt of the applicable advance payment and required client inputs.",
  "The standard payment structure is 60% advance and 40% balance unless otherwise specified in the quotation.",
  "Acceptance of the quotation confirms the client's approval of the stated scope, pricing and payment terms.",
  "Any work outside the agreed scope will be treated as additional work and may be charged separately.",
  "Advertising spend, third-party platform fees, domain registration, hosting, software subscriptions, paid plugins, stock assets, influencer fees and other third-party costs are excluded unless specifically mentioned.",
  "The client must provide required content, information, approvals, credentials and access within agreed timelines.",
  "Delays in receiving required materials or approvals may affect project timelines.",
  "Advance payments are generally non-refundable after commencement of work, except where otherwise agreed in writing and subject to applicable law.",
  "Digital marketing, advertising, SEO, social media, lead generation and similar services depend on external platforms and market conditions. Specific business results or lead volumes cannot be guaranteed unless expressly stated in writing.",
  "GST and other applicable statutory taxes will be charged as applicable.",
  "The quotation accepted by the client represents the agreed commercial scope for the stated services.",
  "Recurring subscriptions will be billed according to the selected billing cycle and subscription terms.",
  "Services may be paused in case of overdue payments.",
  "Deliverables, access, source files or other project assets may be subject to completion of applicable outstanding payments.",
  "Any disputes shall be handled under applicable Indian law and the jurisdiction specified in the quotation.",
];
