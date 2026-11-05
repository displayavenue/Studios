import { prisma } from "../db";
import type { AssessmentProfile } from "./scoreEngine";
import { slugify } from "./slugify";

export type PricingResult = {
  adSpendInr: number;
  managementFeePct: number;
  managementFeeInr: number;
  setupFeeInr: number;
  gstPct: number;
  gstInr: number;
  totalInvestmentInr: number;
  currency: "INR";
  ruleApplied: string;
};

/** Deterministic pricing from PricingRule / Setting — AI must not invent fees. */
export async function calculatePricing(profile: AssessmentProfile): Promise<PricingResult> {
  const budget = profile.marketingBudget || 25000;
  const industrySlug = slugify(profile.industry || "");

  const rules = await prisma.pricingRule.findMany({
    where: { isActive: true },
    orderBy: { priority: "desc" },
  });

  const rule =
    rules.find(
      (r) =>
        (!r.industrySlug || r.industrySlug === industrySlug) &&
        (r.budgetMin == null || budget >= r.budgetMin) &&
        (r.budgetMax == null || budget <= r.budgetMax),
    ) || rules[0];

  const settings = await prisma.setting.findMany({
    where: { key: { in: ["gst_percent", "default_mgmt_fee_pct", "default_setup_fee"] } },
  });
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  const adSpendPct = rule?.adSpendPct ?? 1;
  let adSpend = Math.round(budget * adSpendPct);
  if (rule?.minAdSpend != null) adSpend = Math.max(adSpend, rule.minAdSpend);
  if (rule?.maxAdSpend != null) adSpend = Math.min(adSpend, rule.maxAdSpend);
  if (!rule) adSpend = Math.round(Math.max(15000, Math.min(budget, 100000)));

  const mgmtFeePct =
    rule?.mgmtFeePct ?? Number(settingsMap.default_mgmt_fee_pct ?? 0.35);
  const setupFeeInr = rule?.setupFeeInr ?? Number(settingsMap.default_setup_fee ?? 15000);
  const managementFeeInr = Math.round(adSpend * mgmtFeePct);
  const gstPct = Number(settingsMap.gst_percent ?? process.env.GST_PERCENT ?? 18);
  const subtotal = adSpend + managementFeeInr + setupFeeInr;
  const gstInr = Math.round((subtotal * gstPct) / 100);

  return {
    adSpendInr: adSpend,
    managementFeePct: mgmtFeePct,
    managementFeeInr,
    setupFeeInr,
    gstPct,
    gstInr,
    totalInvestmentInr: subtotal + gstInr,
    currency: "INR",
    ruleApplied: rule?.name || "default",
  };
}
