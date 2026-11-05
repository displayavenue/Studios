export type AssessmentProfile = {
  company?: string | null;
  industry?: string | null;
  businessType?: string | null;
  product?: string | null;
  location?: string | null;
  targetCustomer?: string | null;
  avgCustomerValue?: number | null;
  marketingBudget?: number | null;
  currentChannels?: string[];
  growthGoal?: string | null;
};

export type ScoreBreakdown = {
  digitalMaturity: number;
  budgetReadiness: number;
  marketClarity: number;
  growthAmbition: number;
  channelDiversity: number;
  total: number;
};

const CHANNEL_WEIGHT: Record<string, number> = {
  "google-ads": 18,
  "meta-ads": 16,
  seo: 14,
  "landing-page": 12,
  crm: 10,
  "cold-calling": 10,
  whatsapp: 8,
  email: 6,
  offline: 4,
};

/** Deterministic Growth Score — AI must never mutate these numbers. */
export function calculateGrowthScore(profile: AssessmentProfile): ScoreBreakdown {
  const channels = profile.currentChannels || [];
  const budget = profile.marketingBudget || 0;
  const acv = profile.avgCustomerValue || 0;

  let digitalMaturity = 25;
  if (channels.length === 0) digitalMaturity = 15;
  else if (channels.length <= 2) digitalMaturity = 35;
  else if (channels.length <= 4) digitalMaturity = 55;
  else digitalMaturity = 70;

  let budgetReadiness = 20;
  if (budget >= 100000) budgetReadiness = 90;
  else if (budget >= 50000) budgetReadiness = 75;
  else if (budget >= 25000) budgetReadiness = 60;
  else if (budget >= 10000) budgetReadiness = 45;
  else if (budget > 0) budgetReadiness = 30;

  let marketClarity = 30;
  if (profile.industry && profile.location && profile.targetCustomer) marketClarity = 80;
  else if (profile.industry && profile.location) marketClarity = 60;
  else if (profile.industry) marketClarity = 45;

  let growthAmbition = 40;
  switch (profile.growthGoal) {
    case "more-leads":
      growthAmbition = 70;
      break;
    case "more-sales":
      growthAmbition = 85;
      break;
    case "new-markets":
      growthAmbition = 80;
      break;
    case "brand-growth":
      growthAmbition = 65;
      break;
    default:
      growthAmbition = 50;
  }

  let channelDiversity = Math.min(
    90,
    channels.reduce((sum, c) => sum + (CHANNEL_WEIGHT[c] || 5), 0),
  );
  if (channels.length === 0) channelDiversity = 15;

  if (acv >= 50000) digitalMaturity = Math.min(95, digitalMaturity + 8);
  if (acv >= 100000) budgetReadiness = Math.min(95, budgetReadiness + 5);

  const dims = {
    digitalMaturity: round(digitalMaturity),
    budgetReadiness: round(budgetReadiness),
    marketClarity: round(marketClarity),
    growthAmbition: round(growthAmbition),
    channelDiversity: round(channelDiversity),
  };

  const total = round(
    dims.digitalMaturity * 0.25 +
      dims.budgetReadiness * 0.2 +
      dims.marketClarity * 0.2 +
      dims.growthAmbition * 0.2 +
      dims.channelDiversity * 0.15,
  );

  return { ...dims, total };
}

function round(n: number) {
  return Math.round(n * 10) / 10;
}

export function biggestOpportunity(breakdown: ScoreBreakdown, profile: AssessmentProfile): string {
  const entries: [string, number, string][] = [
    ["digitalMaturity", breakdown.digitalMaturity, "Strengthen digital presence and online discoverability"],
    ["budgetReadiness", breakdown.budgetReadiness, "Align ad spend with growth targets for predictable pipeline"],
    ["marketClarity", breakdown.marketClarity, "Sharpen ideal customer profile and market positioning"],
    ["channelDiversity", breakdown.channelDiversity, "Diversify channels beyond current marketing mix"],
    ["growthAmbition", breakdown.growthAmbition, "Translate growth goals into an execution system"],
  ];
  entries.sort((a, b) => a[1] - b[1]);
  const lowest = entries[0];
  if (profile.growthGoal === "more-leads" && breakdown.channelDiversity < 50) {
    return "Build a multi-channel lead engine focused on high-intent demand";
  }
  return lowest[2];
}

/** Pull AssessmentProfile from OS Assessment.answers JSON (+ optional flat fields). */
export function profileFromAnswers(
  answers: unknown,
  extras?: Partial<AssessmentProfile>,
): AssessmentProfile {
  const a = (answers && typeof answers === "object" ? answers : {}) as Record<string, unknown>;
  const num = (v: unknown) => {
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() !== "" && !Number.isNaN(Number(v))) return Number(v);
    return null;
  };
  const str = (v: unknown) => (typeof v === "string" ? v : null);
  const channels = Array.isArray(a.currentChannels)
    ? a.currentChannels.filter((c): c is string => typeof c === "string" && c !== "none")
    : extras?.currentChannels || [];

  return {
    company: str(a.company) ?? extras?.company ?? null,
    industry: str(a.industry) ?? extras?.industry ?? null,
    businessType: str(a.businessType) ?? extras?.businessType ?? null,
    product: str(a.product) ?? extras?.product ?? null,
    location: str(a.location) ?? extras?.location ?? null,
    targetCustomer: str(a.targetCustomer) ?? extras?.targetCustomer ?? null,
    avgCustomerValue: num(a.avgCustomerValue) ?? extras?.avgCustomerValue ?? null,
    marketingBudget: num(a.marketingBudget) ?? extras?.marketingBudget ?? null,
    currentChannels: channels,
    growthGoal: str(a.growthGoal) ?? extras?.growthGoal ?? null,
  };
}
