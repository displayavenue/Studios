export type CampaignHealthInput = {
  status?: string | null;
  dailyBudgetInr?: number | null;
  healthScore?: number | null;
  /** Optional metrics from Campaign.meta JSON — never invent if missing. */
  meta?: {
    ctr?: number | null;
    cpc?: number | null;
    cpl?: number | null;
    spendInr?: number | null;
    leads?: number | null;
    roas?: number | null;
    frequency?: number | null;
    deliveryIssues?: boolean | null;
  } | null;
};

export type CampaignHealthLabel = "healthy" | "watch" | "at_risk" | "critical" | "inactive";

export type CampaignHealthResult = {
  score: number;
  label: CampaignHealthLabel;
  breakdown: {
    delivery: number;
    efficiency: number;
    volume: number;
    budgetDiscipline: number;
  };
  flags: string[];
};

/**
 * Deterministic campaign health 0–100 from status + optional measured meta.
 * Missing metrics do not invent performance — they reduce confidence via neutral defaults.
 */
export function calculateCampaignHealth(input: CampaignHealthInput): CampaignHealthResult {
  const status = (input.status || "draft").toLowerCase();
  const flags: string[] = [];

  if (["paused", "PAUSED"].includes(input.status || "") || status === "paused") {
    flags.push("Campaign paused");
  }
  if (["error", "with_issues", "WITH_ISSUES"].includes(input.status || "") || status === "error") {
    flags.push("Delivery issues reported");
  }
  if (input.meta?.deliveryIssues) flags.push("Platform delivery issues");

  let delivery = 55;
  if (["active", "enabled", "live"].includes(status)) delivery = 80;
  else if (["paused"].includes(status)) delivery = 40;
  else if (["draft", "pending"].includes(status)) delivery = 30;
  else if (["error", "with_issues", "archived", "deleted"].includes(status)) delivery = 15;
  if (input.meta?.deliveryIssues) delivery = Math.min(delivery, 25);

  const m = input.meta || {};
  let efficiency = 50;
  if (typeof m.ctr === "number") {
    if (m.ctr >= 2) efficiency += 20;
    else if (m.ctr >= 1) efficiency += 10;
    else if (m.ctr < 0.5) {
      efficiency -= 15;
      flags.push("Low CTR");
    }
  }
  if (typeof m.cpc === "number") {
    if (m.cpc <= 20) efficiency += 15;
    else if (m.cpc <= 40) efficiency += 5;
    else if (m.cpc > 80) {
      efficiency -= 15;
      flags.push("High CPC");
    }
  }
  if (typeof m.cpl === "number") {
    if (m.cpl <= 400) efficiency += 15;
    else if (m.cpl <= 700) efficiency += 5;
    else if (m.cpl > 1200) {
      efficiency -= 20;
      flags.push("High CPL");
    }
  }
  if (typeof m.roas === "number") {
    if (m.roas >= 3) efficiency += 15;
    else if (m.roas >= 1.5) efficiency += 5;
    else if (m.roas < 1) {
      efficiency -= 20;
      flags.push("ROAS below 1x");
    }
  }
  if (typeof m.frequency === "number" && m.frequency > 4) {
    efficiency -= 10;
    flags.push("High frequency");
  }
  efficiency = clamp(efficiency);

  let volume = 45;
  if (typeof m.leads === "number") {
    if (m.leads >= 40) volume = 90;
    else if (m.leads >= 15) volume = 75;
    else if (m.leads >= 5) volume = 60;
    else if (m.leads >= 1) volume = 45;
    else {
      volume = 25;
      flags.push("No leads in period");
    }
  } else if (typeof m.spendInr === "number" && m.spendInr > 0) {
    volume = 50;
  }

  const budget = input.dailyBudgetInr || 0;
  let budgetDiscipline = 50;
  if (budget >= 5000) budgetDiscipline = 85;
  else if (budget >= 2000) budgetDiscipline = 70;
  else if (budget >= 500) budgetDiscipline = 55;
  else if (budget > 0) budgetDiscipline = 40;
  else {
    budgetDiscipline = 25;
    if (["active", "enabled", "live"].includes(status)) flags.push("No daily budget set");
  }
  if (typeof m.spendInr === "number" && budget > 0) {
    const expected = budget * 30;
    if (m.spendInr > expected * 1.4) {
      budgetDiscipline = Math.min(budgetDiscipline, 35);
      flags.push("Overspend vs daily budget pace");
    }
  }

  const score = round(
    delivery * 0.3 + efficiency * 0.35 + volume * 0.2 + budgetDiscipline * 0.15,
  );

  return {
    score,
    label: labelFor(score, status),
    breakdown: {
      delivery: round(delivery),
      efficiency: round(efficiency),
      volume: round(volume),
      budgetDiscipline: round(budgetDiscipline),
    },
    flags: flags.slice(0, 5),
  };
}

function labelFor(score: number, status: string): CampaignHealthLabel {
  if (["draft", "archived", "deleted"].includes(status)) return "inactive";
  if (score >= 75) return "healthy";
  if (score >= 55) return "watch";
  if (score >= 35) return "at_risk";
  return "critical";
}

function clamp(n: number) {
  return Math.max(0, Math.min(100, n));
}

function round(n: number) {
  return Math.round(n * 10) / 10;
}
