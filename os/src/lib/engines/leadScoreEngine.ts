import type { LeadPipelineStatus } from "@prisma/client";

export type LeadScoreInput = {
  budget?: number | null;
  growthScore?: number | null;
  industry?: string | null;
  location?: string | null;
  website?: string | null;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  source?: string | null;
  pipelineStatus?: LeadPipelineStatus | string | null;
  utmSource?: string | null;
  utmCampaign?: string | null;
};

export type LeadGrade = "A" | "B" | "C" | "D";

export type LeadScoreResult = {
  score: number;
  grade: LeadGrade;
  breakdown: {
    budgetFit: number;
    growthReadiness: number;
    profileCompleteness: number;
    intentSignals: number;
    pipelineStage: number;
  };
};

const PIPELINE_POINTS: Record<string, number> = {
  NEW: 10,
  CONTACTED: 20,
  QUALIFIED: 45,
  STRATEGY_CALL: 60,
  PROPOSAL: 75,
  NEGOTIATION: 85,
  WON: 100,
  LOST: 5,
};

/**
 * Deterministic 0–100 lead score with grades A/B/C/D.
 * AI must never override this score.
 */
export function calculateLeadScore(input: LeadScoreInput): LeadScoreResult {
  const budget = input.budget || 0;
  let budgetFit = 10;
  if (budget >= 100000) budgetFit = 95;
  else if (budget >= 50000) budgetFit = 80;
  else if (budget >= 25000) budgetFit = 65;
  else if (budget >= 10000) budgetFit = 45;
  else if (budget > 0) budgetFit = 30;

  const growth = input.growthScore ?? 0;
  const growthReadiness = clamp(growth);

  let profileCompleteness = 0;
  if (input.company) profileCompleteness += 20;
  if (input.industry) profileCompleteness += 15;
  if (input.location) profileCompleteness += 15;
  if (input.email) profileCompleteness += 20;
  if (input.phone) profileCompleteness += 15;
  if (input.website) profileCompleteness += 15;
  profileCompleteness = clamp(profileCompleteness);

  let intentSignals = 15;
  if (input.utmSource || input.utmCampaign) intentSignals += 25;
  if (input.source && /ads|google|meta|referral|inbound/i.test(input.source)) intentSignals += 20;
  if (input.website) intentSignals += 10;
  intentSignals = clamp(intentSignals);

  const pipelineStage = clamp(
    PIPELINE_POINTS[String(input.pipelineStatus || "NEW").toUpperCase()] ?? 10,
  );

  const score = round(
    budgetFit * 0.25 +
      growthReadiness * 0.25 +
      profileCompleteness * 0.2 +
      intentSignals * 0.15 +
      pipelineStage * 0.15,
  );

  return {
    score,
    grade: gradeFor(score),
    breakdown: {
      budgetFit: round(budgetFit),
      growthReadiness: round(growthReadiness),
      profileCompleteness: round(profileCompleteness),
      intentSignals: round(intentSignals),
      pipelineStage: round(pipelineStage),
    },
  };
}

export function gradeFor(score: number): LeadGrade {
  if (score >= 80) return "A";
  if (score >= 65) return "B";
  if (score >= 45) return "C";
  return "D";
}

function clamp(n: number) {
  return Math.max(0, Math.min(100, n));
}

function round(n: number) {
  return Math.round(n * 10) / 10;
}
