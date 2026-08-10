import { prisma } from "./db";
import { JobStatus, Prisma } from "@prisma/client";
import { calculateClientHealth } from "./engines/clientHealthEngine";
import { calculateCampaignHealth } from "./engines/campaignHealthEngine";

export async function enqueueJob(params: {
  type: string;
  organizationId?: string | null;
  payload?: Prisma.InputJsonValue;
  runAfter?: Date;
  maxAttempts?: number;
}) {
  return prisma.job.create({
    data: {
      type: params.type,
      organizationId: params.organizationId || null,
      payload: params.payload,
      runAfter: params.runAfter || new Date(),
      maxAttempts: params.maxAttempts ?? 5,
      status: JobStatus.PENDING,
    },
  });
}

/** Simple DB-backed worker tick — V1; replace with Redis/BullMQ under load. */
export async function processNextJobs(limit = 5) {
  const now = new Date();
  const jobs = await prisma.job.findMany({
    where: {
      status: JobStatus.PENDING,
      runAfter: { lte: now },
    },
    orderBy: { createdAt: "asc" },
    take: limit,
  });

  const results = [];
  for (const job of jobs) {
    const locked = await prisma.job.updateMany({
      where: { id: job.id, status: JobStatus.PENDING },
      data: { status: JobStatus.RUNNING, lockedAt: now, attempts: { increment: 1 } },
    });
    if (locked.count === 0) continue;

    try {
      const result = await dispatchJob(job.type, job.payload, job.organizationId);
      const updated = await prisma.job.update({
        where: { id: job.id },
        data: {
          status: JobStatus.SUCCEEDED,
          result: result as Prisma.InputJsonValue,
          lockedAt: null,
        },
      });
      results.push(updated);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Job failed";
      const attempts = job.attempts + 1;
      const failed = attempts >= job.maxAttempts;
      const updated = await prisma.job.update({
        where: { id: job.id },
        data: {
          status: failed ? JobStatus.FAILED : JobStatus.PENDING,
          lastError: message.slice(0, 1000),
          lockedAt: null,
          runAfter: failed ? now : new Date(Date.now() + Math.min(60_000 * 2 ** attempts, 3600_000)),
        },
      });
      results.push(updated);
    }
  }
  return results;
}

async function dispatchJob(type: string, payload: unknown, organizationId?: string | null) {
  const data =
    payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};

  switch (type) {
    case "ping":
      return { pong: true, at: new Date().toISOString(), payload };

    case "audit.cleanup_noop":
      return { ok: true };

    case "lead.followup_notify": {
      const leadId = typeof data.entityId === "string" ? data.entityId : null;
      const orgId = organizationId || (typeof data.organizationId === "string" ? data.organizationId : null);
      if (orgId && leadId) {
        const sales = await prisma.membership.findMany({
          where: {
            organizationId: orgId,
            status: "ACTIVE",
            role: { in: ["SALES", "ADMIN", "SUPER_ADMIN", "ACCOUNT_MANAGER"] },
          },
          take: 10,
        });
        for (const m of sales) {
          await prisma.notification.create({
            data: {
              userId: m.userId,
              title: "Lead follow-up due",
              body: `Follow up on lead ${leadId}`,
              priority: "high",
              href: `/app/crm/leads/${leadId}`,
            },
          });
        }
      }
      return { notified: true, leadId, at: new Date().toISOString() };
    }

    case "payment.reminder": {
      const orgId = organizationId || (typeof data.organizationId === "string" ? data.organizationId : null);
      if (!orgId) return { reminded: false, reason: "no_org" };
      const unpaid = await prisma.invoice.findMany({
        where: {
          organizationId: orgId,
          status: { in: ["sent", "overdue", "pending"] },
        },
        take: 20,
      });
      const finance = await prisma.membership.findMany({
        where: {
          organizationId: orgId,
          status: "ACTIVE",
          role: { in: ["FINANCE", "ADMIN", "SUPER_ADMIN", "ACCOUNT_MANAGER"] },
        },
        take: 10,
      });
      for (const m of finance) {
        await prisma.notification.create({
          data: {
            userId: m.userId,
            title: "Payment reminder",
            body: `${unpaid.length} open invoice(s) need attention`,
            priority: unpaid.some((i) => i.status === "overdue") ? "critical" : "medium",
            href: `/app/billing`,
          },
        });
      }
      return { reminded: true, openInvoices: unpaid.length };
    }

    case "health.recalculate": {
      const orgId = organizationId || (typeof data.organizationId === "string" ? data.organizationId : null);
      if (!orgId) throw new Error("health.recalculate requires organizationId");
      const org = await prisma.organization.findUniqueOrThrow({ where: { id: orgId } });
      const [campaigns, overdueInvoices, approvals, tasks] = await Promise.all([
        prisma.campaign.findMany({ where: { organizationId: orgId } }),
        prisma.invoice.count({ where: { organizationId: orgId, status: "overdue" } }),
        prisma.approval.count({ where: { organizationId: orgId, status: "pending" } }),
        prisma.task.count({
          where: { organizationId: orgId, status: "open", priority: { in: ["critical", "high"] } },
        }),
      ]);

      const campaignHealthRows = campaigns.map((c) => {
        const meta =
          c.meta && typeof c.meta === "object" ? (c.meta as Record<string, unknown>) : {};
        return calculateCampaignHealth({
          status: c.status,
          dailyBudgetInr: c.dailyBudgetInr,
          healthScore: c.healthScore,
          meta: {
            ctr: num(meta.ctr),
            cpc: num(meta.cpc),
            cpl: num(meta.cpl),
            spendInr: num(meta.spendInr),
            leads: num(meta.leads),
            roas: num(meta.roas),
            frequency: num(meta.frequency),
            deliveryIssues: Boolean(meta.deliveryIssues),
          },
        });
      });

      const avgCampaignHealth =
        campaignHealthRows.length > 0
          ? campaignHealthRows.reduce((s, r) => s + r.score, 0) / campaignHealthRows.length
          : null;

      const clientHealth = calculateClientHealth({
        status: org.status,
        type: org.type,
        openInvoicesOverdue: overdueInvoices,
        pendingApprovals: approvals,
        activeCampaigns: campaigns.filter((c) => /active|live|enabled/i.test(c.status)).length,
        campaignsNeedAttention: campaignHealthRows.filter((r) =>
          ["watch", "at_risk", "critical"].includes(r.label),
        ).length,
        avgCampaignHealth,
        openCriticalTasks: tasks,
        onboardingComplete: org.status !== "ONBOARDING",
      });

      await prisma.organization.update({
        where: { id: orgId },
        data: { healthScore: clientHealth.score, healthLabel: clientHealth.label },
      });

      for (let i = 0; i < campaigns.length; i++) {
        await prisma.campaign.update({
          where: { id: campaigns[i].id },
          data: { healthScore: campaignHealthRows[i].score },
        });
      }

      return { health: clientHealth, campaignsUpdated: campaigns.length };
    }

    case "meta.sync_noop":
      // Explicit no-op until Meta credentials/approval exist — never fabricate metrics.
      return {
        synced: false,
        reason: "Meta approval / credentials required",
        at: new Date().toISOString(),
        payload: data,
      };

    default:
      // Unknown jobs fail loudly so they are visible in admin — never silently invent success
      throw new Error(`No handler registered for job type: ${type}`);
  }
}

function num(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}
