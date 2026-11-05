import { prisma } from "../db";
import type { AssessmentProfile } from "./scoreEngine";
import type { PricingResult } from "./pricingEngine";

export type RoiScenario = {
  name: string;
  leads: number;
  customers: number;
  revenueInr: number;
  investmentInr: number;
  roiMultiple: number;
  netProfitInr: number;
};

export type RoiResult = {
  cplInr: number;
  conversionRate: number;
  avgCustomerValue: number;
  scenarios: RoiScenario[];
  assumptions: Record<string, number>;
};

/** Deterministic ROI scenarios from RoiAssumption table — AI must not change multiples. */
export async function calculateRoi(
  profile: AssessmentProfile,
  pricing: PricingResult,
): Promise<RoiResult> {
  const assumptions = await prisma.roiAssumption.findMany({ where: { isActive: true } });
  const map = Object.fromEntries(assumptions.map((a) => [a.key, a.value]));

  const cpl = map.default_cpl ?? 450;
  const conv = map.lead_to_customer_rate ?? 0.12;
  const acv = profile.avgCustomerValue || map.default_acv || 25000;
  const investment = pricing.adSpendInr + pricing.managementFeeInr;

  const scenarios: RoiScenario[] = [
    buildScenario("Conservative", investment, cpl * 1.25, conv * 0.75, acv * 0.9),
    buildScenario("Expected", investment, cpl, conv, acv),
    buildScenario("Optimistic", investment, cpl * 0.8, conv * 1.25, acv * 1.1),
  ];

  return {
    cplInr: cpl,
    conversionRate: conv,
    avgCustomerValue: acv,
    scenarios,
    assumptions: map,
  };
}

function buildScenario(
  name: string,
  investment: number,
  cpl: number,
  conversionRate: number,
  acv: number,
): RoiScenario {
  const leads = Math.max(1, Math.round(investment / cpl));
  const customers = Math.max(0, Math.round(leads * conversionRate));
  const revenueInr = Math.round(customers * acv);
  const netProfitInr = revenueInr - investment;
  const roiMultiple = investment > 0 ? Math.round((revenueInr / investment) * 100) / 100 : 0;
  return { name, leads, customers, revenueInr, investmentInr: investment, roiMultiple, netProfitInr };
}
