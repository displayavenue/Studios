import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export async function trackEvent(input: {
  eventName: string;
  userId?: string | null;
  sessionId?: string | null;
  properties?: Record<string, unknown>;
  pageUrl?: string | null;
  referrer?: string | null;
  userAgent?: string | null;
}) {
  try {
    await prisma.analyticsEvent.create({
      data: {
        eventName: input.eventName,
        userId: input.userId || undefined,
        sessionId: input.sessionId || undefined,
        properties: (input.properties || undefined) as Prisma.InputJsonValue | undefined,
        pageUrl: input.pageUrl || undefined,
        referrer: input.referrer || undefined,
        userAgent: input.userAgent || undefined,
      },
    });
  } catch (e) {
    console.error("[analytics]", e);
  }
}

export async function getAnalyticsSummary(days = 7) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const [
    events,
    users,
    ordersPaid,
    mallPaid,
    walletCredits,
    expertsOnline,
    topEvents,
  ] = await Promise.all([
    prisma.analyticsEvent.count({ where: { createdAt: { gte: since } } }),
    prisma.user.count({ where: { createdAt: { gte: since } } }),
    prisma.order.aggregate({
      where: { status: { in: ["PAID", "REPORT_READY", "REPORT_GENERATING"] }, createdAt: { gte: since } },
      _sum: { total: true },
      _count: true,
    }),
    prisma.mallOrder.aggregate({
      where: { status: "PAID", createdAt: { gte: since } },
      _sum: { amountInr: true },
      _count: true,
    }),
    prisma.walletTransaction.aggregate({
      where: { type: "CREDIT", createdAt: { gte: since } },
      _sum: { amountInr: true },
      _count: true,
    }),
    prisma.expert.count({ where: { isOnline: true, isActive: true } }),
    prisma.analyticsEvent.groupBy({
      by: ["eventName"],
      where: { createdAt: { gte: since } },
      _count: { eventName: true },
      orderBy: { _count: { eventName: "desc" } },
      take: 12,
    }),
  ]);

  return {
    days,
    since: since.toISOString(),
    totals: {
      events,
      newUsers: users,
      reportOrders: ordersPaid._count,
      reportRevenue: Number(ordersPaid._sum.total ?? 0),
      mallOrders: mallPaid._count,
      mallRevenue: Number(mallPaid._sum.amountInr ?? 0),
      walletCredits: walletCredits._count,
      walletCreditInr: Number(walletCredits._sum.amountInr ?? 0),
      expertsOnline,
    },
    topEvents: topEvents.map((e) => ({ name: e.eventName, count: e._count.eventName })),
  };
}
