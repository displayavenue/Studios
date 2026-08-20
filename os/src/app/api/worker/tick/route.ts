import { processNextJobs } from "@/lib/jobs";
import { handleApiError, jsonError, jsonOk } from "@/lib/api";
import { prisma } from "@/lib/db";
import { calculateCampaignHealth } from "@/lib/engines/campaignHealthEngine";
import { calculateClientHealth } from "@/lib/engines/clientHealthEngine";

/**
 * Background worker tick. Protect with WORKER_SECRET in production.
 */
export async function POST(req: Request) {
  try {
    const secret = process.env.WORKER_SECRET;
    if (secret) {
      const header = req.headers.get("x-worker-secret");
      if (header !== secret) return jsonError("Unauthorized", 401);
    }

    const processed = await processNextJobs(20);

    const orgs = await prisma.organization.findMany({
      where: { type: "CLIENT", status: { in: ["ACTIVE", "ONBOARDING", "PAUSED"] } },
      take: 50,
      include: {
        campaigns: true,
        invoices: { where: { status: { in: ["overdue", "sent"] } }, take: 50 },
        approvals: { where: { status: "pending" }, take: 50 },
        tasks: { where: { status: "open", priority: { in: ["critical", "high"] } }, take: 50 },
      },
    });

    let healthUpdated = 0;
    for (const org of orgs) {
      for (const campaign of org.campaigns) {
        const ch = calculateCampaignHealth({
          status: campaign.status,
          dailyBudgetInr: campaign.dailyBudgetInr,
          meta: (campaign.meta as CampaignHealthInputMeta) || null,
        });
        await prisma.campaign.update({
          where: { id: campaign.id },
          data: { healthScore: ch.score },
        });
      }

      const refreshed = await prisma.campaign.findMany({
        where: { organizationId: org.id },
        select: { healthScore: true, status: true },
      });
      const avg =
        refreshed.length > 0
          ? refreshed.reduce((s, c) => s + (c.healthScore || 0), 0) / refreshed.length
          : undefined;
      const client = calculateClientHealth({
        status: org.status,
        type: org.type,
        avgCampaignHealth: avg,
        openInvoicesOverdue: org.invoices.filter((i) => i.status === "overdue").length,
        pendingApprovals: org.approvals.length,
        activeCampaigns: refreshed.filter((c) => ["active", "ACTIVE", "live"].includes(c.status)).length,
        campaignsNeedAttention: refreshed.filter((c) => (c.healthScore || 100) < 70).length,
        openCriticalTasks: org.tasks.length,
        onboardingComplete: org.status === "ACTIVE",
      });
      await prisma.organization.update({
        where: { id: org.id },
        data: { healthScore: client.score, healthLabel: client.label },
      });
      healthUpdated++;
    }

    return jsonOk({
      jobsProcessed: processed.length,
      healthUpdated,
      at: new Date().toISOString(),
    });
  } catch (err) {
    return handleApiError(err);
  }
}

type CampaignHealthInputMeta = {
  ctr?: number | null;
  cpc?: number | null;
  cpl?: number | null;
  spendInr?: number | null;
  leads?: number | null;
};
