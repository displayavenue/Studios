export type ClientHealthInput = {
  status?: string | null;
  type?: string | null;
  healthScore?: number | null;
  openInvoicesOverdue?: number | null;
  pendingApprovals?: number | null;
  activeCampaigns?: number | null;
  campaignsNeedAttention?: number | null;
  avgCampaignHealth?: number | null;
  openCriticalTasks?: number | null;
  daysSinceLastPayment?: number | null;
  onboardingComplete?: boolean | null;
};

export type ClientHealthLabel = "healthy" | "watch" | "at_risk" | "critical" | "churned" | "prospect";

export type ClientHealthResult = {
  score: number;
  label: ClientHealthLabel;
  breakdown: {
    relationship: number;
    delivery: number;
    commercial: number;
    operations: number;
  };
  flags: string[];
};

/**
 * Deterministic client/org health 0–100.
 * Uses measured org signals only — AI must not set healthScore.
 */
export function calculateClientHealth(input: ClientHealthInput): ClientHealthResult {
  const status = (input.status || "PROSPECT").toUpperCase();
  const flags: string[] = [];

  if (status === "CHURNED") {
    return {
      score: 5,
      label: "churned",
      breakdown: { relationship: 5, delivery: 5, commercial: 5, operations: 5 },
      flags: ["Organization churned"],
    };
  }
  if (status === "PROSPECT" || input.type === "PROSPECT") {
    return {
      score: 40,
      label: "prospect",
      breakdown: { relationship: 40, delivery: 30, commercial: 35, operations: 40 },
      flags: ["Prospect — not yet an active client"],
    };
  }

  let relationship = 60;
  if (status === "ACTIVE") relationship = 85;
  else if (status === "ONBOARDING") relationship = 55;
  else if (status === "PAUSED") {
    relationship = 35;
    flags.push("Client paused");
  }
  if (input.onboardingComplete === false) {
    relationship = Math.min(relationship, 50);
    flags.push("Onboarding incomplete");
  }

  const avgCamp = input.avgCampaignHealth;
  let delivery = 50;
  if (typeof avgCamp === "number") delivery = clamp(avgCamp);
  else if ((input.activeCampaigns || 0) > 0) delivery = 60;
  else if (status === "ACTIVE") {
    delivery = 35;
    flags.push("No active campaigns");
  }
  if ((input.campaignsNeedAttention || 0) > 0) {
    delivery = Math.max(15, delivery - input.campaignsNeedAttention! * 8);
    flags.push("Campaigns need attention");
  }

  let commercial = 70;
  const overdue = input.openInvoicesOverdue || 0;
  if (overdue > 0) {
    commercial = Math.max(15, 70 - overdue * 15);
    flags.push("Overdue invoices");
  }
  if (typeof input.daysSinceLastPayment === "number") {
    if (input.daysSinceLastPayment > 60) {
      commercial = Math.min(commercial, 30);
      flags.push("No recent payment (>60d)");
    } else if (input.daysSinceLastPayment > 35) {
      commercial = Math.min(commercial, 50);
      flags.push("Payment aging");
    }
  }

  let operations = 70;
  const approvals = input.pendingApprovals || 0;
  const critical = input.openCriticalTasks || 0;
  if (approvals > 0) {
    operations -= approvals * 8;
    flags.push("Pending approvals");
  }
  if (critical > 0) {
    operations -= critical * 10;
    flags.push("Critical open tasks");
  }
  operations = clamp(operations);

  const score = round(
    relationship * 0.25 + delivery * 0.35 + commercial * 0.25 + operations * 0.15,
  );

  return {
    score,
    label: labelFor(score, status),
    breakdown: {
      relationship: round(relationship),
      delivery: round(delivery),
      commercial: round(commercial),
      operations: round(operations),
    },
    flags: flags.slice(0, 5),
  };
}

function labelFor(score: number, status: string): ClientHealthLabel {
  if (status === "CHURNED") return "churned";
  if (status === "PROSPECT") return "prospect";
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
