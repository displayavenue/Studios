import { ForbiddenError, requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { handleApiError, jsonOk } from "@/lib/api";
import { roleHasPermission } from "@/lib/rbac";

export async function GET(req: Request) {
  try {
    const session = await requireUser(req);
    if (
      !roleHasPermission(session.globalRole, "deal:read") &&
      !roleHasPermission(session.globalRole, "finance:read")
    ) {
      throw new ForbiddenError("Missing permission: deal:read or finance:read");
    }

    const now = new Date();
    const inSevenDays = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [
      allQuotes,
      acceptedAgg,
      unpaidAccepted,
      paidAgg,
      outstandingQuotes,
      activeSubscriptions,
      sentOrBeyond,
      acceptedCount,
      recentQuotations,
      recentPayments,
      expiringQuotations,
    ] = await Promise.all([
      prisma.quotation.aggregate({
        _sum: { grandTotalPaise: true },
        _count: { _all: true },
      }),
      prisma.quotation.aggregate({
        where: {
          status: { in: ["ACCEPTED", "PARTIALLY_PAID", "PAID"] },
        },
        _sum: { grandTotalPaise: true },
        _count: { _all: true },
      }),
      prisma.quotation.aggregate({
        where: {
          status: { in: ["ACCEPTED", "PARTIALLY_PAID", "SENT", "VIEWED"] },
          paymentStatus: { in: ["UNPAID", "INITIATED", "PARTIALLY_PAID", "OVERDUE"] },
        },
        _sum: { advancePaise: true, grandTotalPaise: true, paidPaise: true },
        _count: { _all: true },
      }),
      prisma.quotePayment.aggregate({
        where: { status: "PAID" },
        _sum: { amountPaise: true },
        _count: { _all: true },
      }),
      prisma.quotation.findMany({
        where: {
          status: { in: ["ACCEPTED", "PARTIALLY_PAID"] },
        },
        select: { grandTotalPaise: true, paidPaise: true },
      }),
      prisma.quoteSubscription.count({
        where: { status: { in: ["ACTIVE", "PENDING", "CREATED"] } },
      }),
      prisma.quotation.count({
        where: {
          status: {
            in: ["SENT", "VIEWED", "ACCEPTED", "PARTIALLY_PAID", "PAID", "EXPIRED", "REJECTED"],
          },
        },
      }),
      prisma.quotation.count({
        where: { status: { in: ["ACCEPTED", "PARTIALLY_PAID", "PAID"] } },
      }),
      prisma.quotation.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        include: {
          client: {
            select: { id: true, companyName: true, clientCode: true },
          },
        },
      }),
      prisma.quotePayment.findMany({
        where: { status: "PAID" },
        orderBy: { paidAt: "desc" },
        take: 8,
        include: {
          client: { select: { id: true, companyName: true, clientCode: true } },
          quotation: { select: { id: true, quotationNumber: true } },
        },
      }),
      prisma.quotation.findMany({
        where: {
          status: { in: ["SENT", "VIEWED", "DRAFT"] },
          validUntil: { gte: now, lte: inSevenDays },
        },
        orderBy: { validUntil: "asc" },
        take: 10,
        include: {
          client: { select: { id: true, companyName: true, clientCode: true } },
        },
      }),
    ]);

    const outstandingPaise = outstandingQuotes.reduce(
      (sum, q) => sum + Math.max(0, q.grandTotalPaise - q.paidPaise),
      0,
    );

    const pendingPaymentPaise = Math.max(
      0,
      (unpaidAccepted._sum.grandTotalPaise || 0) - (unpaidAccepted._sum.paidPaise || 0),
    );

    const conversionRate =
      sentOrBeyond > 0 ? Math.round((acceptedCount / sentOrBeyond) * 1000) / 10 : 0;

    return jsonOk({
      metrics: {
        totalQuoteValuePaise: allQuotes._sum.grandTotalPaise || 0,
        totalQuoteCount: allQuotes._count._all,
        acceptedValuePaise: acceptedAgg._sum.grandTotalPaise || 0,
        acceptedCount: acceptedAgg._count._all,
        pendingPaymentPaise,
        pendingPaymentCount: unpaidAccepted._count._all,
        collectedPaise: paidAgg._sum.amountPaise || 0,
        collectedCount: paidAgg._count._all,
        outstandingPaise,
        activeSubscriptions,
        conversionRate,
      },
      // Friendly INR aliases (paise / 100)
      totalQuoteValue: (allQuotes._sum.grandTotalPaise || 0) / 100,
      acceptedValue: (acceptedAgg._sum.grandTotalPaise || 0) / 100,
      pendingPayment: pendingPaymentPaise / 100,
      collected: (paidAgg._sum.amountPaise || 0) / 100,
      outstanding: outstandingPaise / 100,
      activeSubscriptions,
      conversionRate,
      recentQuotations,
      recentPayments,
      expiringQuotations,
      generatedAt: now.toISOString(),
    });
  } catch (err) {
    return handleApiError(err);
  }
}
