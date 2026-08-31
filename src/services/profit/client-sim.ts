/** Browser-safe simulation helpers (no Prisma). Marked as simulations only. */
export function simulateBusiness(input: {
  aov: number; orders: number; conversionRate: number; visitors?: number; cac: number;
  adSpend?: number; productMarginPercent: number; shippingPerOrder: number;
  refundRate: number; rtoRate: number; taxRate: number; paymentFeeRate: number;
}) {
  const visitors = input.visitors ?? (input.conversionRate > 0 ? Math.ceil(input.orders / (input.conversionRate / 100)) : 0);
  const revenue = input.aov * input.orders;
  const adSpend = input.adSpend ?? input.cac * input.orders;
  const productCost = revenue * (1 - input.productMarginPercent / 100);
  const shipping = input.shippingPerOrder * input.orders;
  const tax = revenue * input.taxRate;
  const paymentFees = revenue * input.paymentFeeRate;
  const refunds = revenue * input.refundRate;
  const rto = revenue * input.rtoRate * 0.5;
  const contributionBeforeAds = revenue - productCost - shipping - tax - paymentFees;
  const netContribution = contributionBeforeAds - adSpend - refunds - rto;
  return {
    simulation: true as const,
    note: "SIMULATION ONLY — not a forecast or guarantee.",
    visitors, revenue, adSpend, productCost, shipping, tax, paymentFees, refunds, rto,
    contributionBeforeAds: Math.round(contributionBeforeAds),
    netContribution: Math.round(netContribution),
    requiredOrdersFor1Lakh: input.aov > 0 ? Math.ceil(100000 / input.aov) : null,
    requiredOrdersFor10kContribution:
      input.orders > 0 && netContribution !== 0 ? Math.ceil(10000 / (netContribution / input.orders)) : null,
  };
}
