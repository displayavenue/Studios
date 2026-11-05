import { prisma } from "./db";

/** Real aggregates only — zeros are legitimate empty state, never fabricated KPIs. */
export async function getCommandCenterMetrics() {
  const [
    revenuePaid,
    activeClients,
    managedSpend,
    newLeads,
    qualifiedLeads,
    clientsWon,
    pendingPayments,
    healthyOrgs,
    atRiskOrgs,
    healthyCampaigns,
    attentionCampaigns,
    pendingApprovals,
    aiCost,
    openTasksCritical,
  ] = await Promise.all([
    prisma.payment.aggregate({
      where: { status: "PAID", purpose: { not: "ad_spend_passthrough" } },
      _sum: { amountInr: true },
    }),
    prisma.organization.count({ where: { type: "CLIENT", status: "ACTIVE" } }),
    prisma.campaign.aggregate({
      where: { status: { in: ["ACTIVE", "active", "PAUSED", "paused"] } },
      _sum: { dailyBudgetInr: true },
    }),
    prisma.lead.count({
      where: { createdAt: { gte: startOfMonth() } },
    }),
    prisma.lead.count({
      where: { pipelineStatus: { in: ["QUALIFIED", "STRATEGY_CALL", "PROPOSAL", "NEGOTIATION", "WON"] } },
    }),
    prisma.lead.count({ where: { pipelineStatus: "WON" } }),
    prisma.invoice.aggregate({
      where: { status: { in: ["sent", "overdue", "pending"] } },
      _sum: { amountInr: true },
    }),
    prisma.organization.count({ where: { healthLabel: "healthy" } }),
    prisma.organization.count({ where: { healthLabel: { in: ["watch", "at_risk"] } } }),
    prisma.campaign.count({ where: { healthScore: { gte: 70 } } }),
    prisma.campaign.count({
      where: { OR: [{ healthScore: { lt: 70 } }, { status: { in: ["ERROR", "WITH_ISSUES"] } }] },
    }),
    prisma.approval.count({ where: { status: "pending" } }),
    prisma.aiGeneration.aggregate({
      where: { status: "success" },
      _sum: { estimatedCostUsd: true },
    }),
    prisma.task.count({ where: { status: "open", priority: { in: ["critical", "high"] } } }),
  ]);

  const attention = {
    paymentIssues: await prisma.invoice.count({ where: { status: "overdue" } }),
    campaignsNeedReview: attentionCampaigns,
    clientApprovals: pendingApprovals,
    clientHealthDeclining: atRiskOrgs,
    highPriorityTasks: openTasksCritical,
  };

  return {
    revenueInr: revenuePaid._sum.amountInr || 0,
    activeClients,
    managedAdSpendDailyInr: managedSpend._sum.dailyBudgetInr || 0,
    newLeads,
    qualifiedLeads,
    clientsWon,
    pendingPaymentsInr: pendingPayments._sum.amountInr || 0,
    clientHealth: { healthy: healthyOrgs, atRisk: atRiskOrgs },
    campaigns: { healthy: healthyCampaigns, needAttention: attentionCampaigns },
    aiCostUsd: aiCost._sum.estimatedCostUsd || 0,
    attention,
    dataSource: "database" as const,
    generatedAt: new Date().toISOString(),
  };
}

function startOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
