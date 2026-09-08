import { prisma } from "@/lib/prisma";
import { toNumber } from "@/lib/utils";
import { DEFAULT_TARGETS } from "@/config/site";
import { startOfDay, endOfDay } from "date-fns";

export type DashboardSnapshot = {
  revenue: number;
  revenueTarget: number;
  revenueProgress: number;
  revenueRemaining: number;
  netContribution: number;
  contributionTarget: number;
  contributionProgress: number;
  contributionRemaining: number;
  contributionStatus: "GREEN" | "YELLOW" | "RED";
  orders: number;
  aov: number;
  adSpend: number;
  cac: number | null;
  roas: number | null;
  refunds: number;
  rto: number;
  conversionRate: number | null;
  visitors: number;
  requiredOrders: number | null;
  requiredAov: number | null;
  dataNote: string;
};

export async function getTodayDashboard(): Promise<DashboardSnapshot> {
  const target = await prisma.target.findFirst({ where: { isActive: true } });
  const revenueTarget = toNumber(target?.dailyRevenueTarget ?? DEFAULT_TARGETS.dailyRevenue);
  const contributionTarget = toNumber(
    target?.dailyContributionTarget ?? DEFAULT_TARGETS.dailyContribution,
  );

  const today = new Date();
  const from = startOfDay(today);
  const to = endOfDay(today);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: from, lte: to },
      status: {
        in: [
          "PAID",
          "PROCESSING",
          "SUPPLIER_ORDER_PENDING",
          "SUPPLIER_CONFIRMED",
          "PACKED",
          "SHIPPED",
          "OUT_FOR_DELIVERY",
          "DELIVERED",
        ],
      },
    },
  });

  const revenue = orders.reduce((s, o) => s + toNumber(o.total), 0);
  const netContribution = orders.reduce(
    (s, o) => s + toNumber(o.netContribution ?? o.total) * 0, // use actual when present
    0,
  );
  // Prefer stored net contribution; if unset, contribution is unknown (do not invent)
  const hasActualContribution = orders.some((o) => o.netContribution != null);
  const contribution = hasActualContribution
    ? orders.reduce((s, o) => s + toNumber(o.netContribution ?? 0), 0)
    : 0;

  const adSpendRows = await prisma.adSpend.findMany({
    where: { date: { gte: from, lte: to } },
  });
  const adSpend = adSpendRows.reduce((s, r) => s + toNumber(r.amount), 0);

  const orderCount = orders.length;
  const aov = orderCount ? revenue / orderCount : 0;
  const cac = orderCount && adSpend ? adSpend / orderCount : null;
  const roas = adSpend > 0 ? revenue / adSpend : null;

  const refunds = orders.reduce((s, o) => s + toNumber(o.actualRefundCost ?? 0), 0);
  const rto = orders.filter((o) => o.isRto).length;

  const visitorsEvent = await prisma.analyticsEvent.count({
    where: {
      eventName: "page_view",
      createdAt: { gte: from, lte: to },
    },
  });

  const conversionRate = visitorsEvent > 0 ? (orderCount / visitorsEvent) * 100 : null;

  let contributionStatus: "GREEN" | "YELLOW" | "RED" = "RED";
  if (contribution >= 10000) contributionStatus = "GREEN";
  else if (contribution >= 5000) contributionStatus = "YELLOW";

  const revenueRemaining = Math.max(0, revenueTarget - revenue);
  const contributionRemaining = Math.max(0, contributionTarget - contribution);
  const requiredOrders = aov > 0 ? Math.ceil(revenueRemaining / aov) : null;

  return {
    revenue,
    revenueTarget,
    revenueProgress: revenueTarget ? Math.round((revenue / revenueTarget) * 1000) / 10 : 0,
    revenueRemaining,
    netContribution: contribution,
    contributionTarget,
    contributionProgress: contributionTarget
      ? Math.round((contribution / contributionTarget) * 1000) / 10
      : 0,
    contributionRemaining,
    contributionStatus,
    orders: orderCount,
    aov: Math.round(aov),
    adSpend,
    cac,
    roas,
    refunds,
    rto,
    conversionRate,
    visitors: visitorsEvent,
    requiredOrders,
    requiredAov: orderCount > 0 ? null : revenueTarget > 0 ? null : null,
    dataNote: hasActualContribution
      ? "Net contribution uses actual order costs where recorded."
      : orderCount === 0
        ? "INSUFFICIENT DATA — no paid orders today yet. Targets are objectives, not guarantees."
        : "Orders exist but actual net contribution not yet calculated for all orders.",
  };
}

export function simulateBusiness(input: {
  aov: number;
  orders: number;
  conversionRate: number;
  visitors?: number;
  cac: number;
  adSpend?: number;
  productMarginPercent: number;
  shippingPerOrder: number;
  refundRate: number;
  rtoRate: number;
  taxRate: number;
  paymentFeeRate: number;
}) {
  const visitors =
    input.visitors ??
    (input.conversionRate > 0
      ? Math.ceil(input.orders / (input.conversionRate / 100))
      : 0);
  const revenue = input.aov * input.orders;
  const adSpend = input.adSpend ?? input.cac * input.orders;
  const productCost = revenue * (1 - input.productMarginPercent / 100);
  const shipping = input.shippingPerOrder * input.orders;
  const tax = revenue * input.taxRate;
  const paymentFees = revenue * input.paymentFeeRate;
  const refunds = revenue * input.refundRate;
  const rto = revenue * input.rtoRate * 0.5; // partial cost model — marked as estimate

  const contributionBeforeAds = revenue - productCost - shipping - tax - paymentFees;
  const netContribution = contributionBeforeAds - adSpend - refunds - rto;

  return {
    simulation: true as const,
    note: "SIMULATION ONLY — not a forecast or guarantee.",
    visitors,
    revenue,
    adSpend,
    productCost,
    shipping,
    tax,
    paymentFees,
    refunds,
    rto,
    contributionBeforeAds: Math.round(contributionBeforeAds),
    netContribution: Math.round(netContribution),
    requiredOrdersFor1Lakh: input.aov > 0 ? Math.ceil(100000 / input.aov) : null,
    requiredOrdersFor10kContribution:
      input.orders > 0 && netContribution !== 0
        ? Math.ceil(10000 / (netContribution / input.orders))
        : null,
  };
}

export function planTargets(input: {
  revenueTarget: number;
  contributionTarget: number;
  aov: number;
  conversionRate: number;
  marginPercent: number;
  cac?: number;
  returnRate?: number;
  rtoRate?: number;
}) {
  const requiredOrders = input.aov > 0 ? Math.ceil(input.revenueTarget / input.aov) : 0;
  const requiredVisitors =
    input.conversionRate > 0
      ? Math.ceil(requiredOrders / (input.conversionRate / 100))
      : null;
  const contributionPerOrder =
    requiredOrders > 0 ? input.contributionTarget / requiredOrders : 0;
  const maxCac = contributionPerOrder;
  const estimatedAdSpend = (input.cac ?? maxCac * 0.5) * requiredOrders;

  return {
    simulation: true as const,
    note: "SIMULATION — planning helper only. Not a guaranteed outcome.",
    requiredOrders,
    requiredVisitors,
    contributionPerOrder: Math.round(contributionPerOrder),
    maximumCac: Math.round(maxCac),
    targetCac: Math.round(maxCac * 0.5),
    warningCac: Math.round(maxCac * 0.75),
    estimatedAdSpend: Math.round(estimatedAdSpend),
    expectedRevenue: requiredOrders * input.aov,
    expectedContribution: Math.round(contributionPerOrder * requiredOrders),
  };
}
