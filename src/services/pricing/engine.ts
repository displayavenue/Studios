import { DEFAULT_TARGETS } from "@/config/site";
import { clamp } from "@/lib/utils";

export type LandedCostInput = {
  costPrice: number;
  shippingCost?: number;
  taxRate?: number;
  paymentFeeRate?: number;
  returnRiskRate?: number;
  sellingPriceHint?: number;
};

export type LandedCostResult = {
  productCost: number;
  supplierShipping: number;
  taxEstimate: number;
  paymentFeeEstimate: number;
  returnCostEstimate: number;
  estimatedOperationalCost: number;
  landedCost: number;
};

export type PricingInput = LandedCostInput & {
  targetMarginPercent?: number;
  minContribution?: number;
  preferredContribution?: number;
  minSellingPrice?: number;
  maxSellingPrice?: number;
  compareAtMultiplier?: number;
};

export type PricingResult = LandedCostResult & {
  sellingPrice: number;
  compareAtPrice: number;
  contributionBeforeAds: number;
  profitMargin: number;
  maxTheoreticalCac: number;
  targetCac: number;
  warningCac: number;
  maximumCac: number;
  withinPriceBounds: boolean;
  meetsMinContribution: boolean;
};

/**
 * Landed cost engine:
 * product cost + supplier shipping + tax/fees + payment fee + expected return/RTO
 * = ESTIMATED OPERATIONAL COST
 */
export function calculateLandedCost(input: LandedCostInput): LandedCostResult {
  const productCost = Math.max(0, input.costPrice);
  const supplierShipping = Math.max(0, input.shippingCost ?? 0);
  const taxRate = input.taxRate ?? DEFAULT_TARGETS.defaultTaxRate;
  const paymentFeeRate = input.paymentFeeRate ?? DEFAULT_TARGETS.paymentFeeRate;
  const returnRiskRate = input.returnRiskRate ?? DEFAULT_TARGETS.defaultReturnRiskRate;

  // Tax estimate on cost+shipping (configurable; not a hard-coded GST assumption for all goods)
  const taxBase = productCost + supplierShipping;
  const taxEstimate = Math.round(taxBase * taxRate * 100) / 100;

  const provisionalPrice =
    input.sellingPriceHint ??
    (productCost + supplierShipping) / (1 - DEFAULT_TARGETS.minMarginPercent / 100);

  const paymentFeeEstimate = Math.round(provisionalPrice * paymentFeeRate * 100) / 100;
  const returnCostEstimate =
    Math.round((productCost + supplierShipping) * returnRiskRate * 100) / 100;

  const estimatedOperationalCost =
    Math.round(
      (productCost + supplierShipping + taxEstimate + paymentFeeEstimate + returnCostEstimate) *
        100,
    ) / 100;

  return {
    productCost,
    supplierShipping,
    taxEstimate,
    paymentFeeEstimate,
    returnCostEstimate,
    estimatedOperationalCost,
    landedCost: estimatedOperationalCost,
  };
}

/**
 * Pricing + contribution before ads.
 * Selling Price − Estimated Operational Cost = CONTRIBUTION BEFORE ADS
 */
export function calculatePricing(input: PricingInput): PricingResult {
  const minMargin = input.targetMarginPercent ?? DEFAULT_TARGETS.minMarginPercent;
  const minContribution = input.minContribution ?? DEFAULT_TARGETS.minContribution;
  const preferredContribution =
    input.preferredContribution ?? DEFAULT_TARGETS.preferredContribution;
  const minPrice = input.minSellingPrice ?? DEFAULT_TARGETS.minSellingPrice;
  const maxPrice = input.maxSellingPrice ?? DEFAULT_TARGETS.maxSellingPrice;

  const firstPass = calculateLandedCost(input);

  // Price to hit preferred contribution, then enforce margin floor
  let sellingPrice = firstPass.estimatedOperationalCost + preferredContribution;
  const marginFloorPrice = firstPass.estimatedOperationalCost / (1 - minMargin / 100);
  sellingPrice = Math.max(sellingPrice, marginFloorPrice, minPrice);
  sellingPrice = Math.min(sellingPrice, maxPrice);
  sellingPrice = Math.ceil(sellingPrice / 10) * 10 - 1; // psychological .99-style INR ending via x9

  // Recalculate fees with final selling price
  const landed = calculateLandedCost({ ...input, sellingPriceHint: sellingPrice });
  const contributionBeforeAds =
    Math.round((sellingPrice - landed.estimatedOperationalCost) * 100) / 100;
  const profitMargin =
    sellingPrice > 0
      ? Math.round((contributionBeforeAds / sellingPrice) * 1000) / 10
      : 0;

  const maxTheoreticalCac = Math.max(0, contributionBeforeAds);
  const targetCac = Math.round(maxTheoreticalCac * 0.5);
  const warningCac = Math.round(maxTheoreticalCac * 0.75);
  const maximumCac = maxTheoreticalCac;

  return {
    ...landed,
    sellingPrice,
    compareAtPrice: Math.round(sellingPrice * (input.compareAtMultiplier ?? 1.25)),
    contributionBeforeAds,
    profitMargin,
    maxTheoreticalCac,
    targetCac,
    warningCac,
    maximumCac,
    withinPriceBounds: sellingPrice >= minPrice && sellingPrice <= maxPrice,
    meetsMinContribution: contributionBeforeAds >= minContribution,
  };
}

export type ActualProfitInput = {
  revenue: number;
  productCost: number;
  actualShipping: number;
  paymentFees: number;
  discounts: number;
  refunds: number;
  rtoCosts: number;
  advertisingCost: number;
};

/**
 * Actual profit engine for completed orders.
 * Never call gross revenue “profit.”
 */
export function calculateNetContribution(input: ActualProfitInput) {
  const net =
    input.revenue -
    input.productCost -
    input.actualShipping -
    input.paymentFees -
    input.discounts -
    input.refunds -
    input.rtoCosts -
    input.advertisingCost;

  return {
    revenue: input.revenue,
    totalCosts:
      input.productCost +
      input.actualShipping +
      input.paymentFees +
      input.discounts +
      input.refunds +
      input.rtoCosts +
      input.advertisingCost,
    netContribution: Math.round(net * 100) / 100,
  };
}

export type ProductScoreInput = {
  contributionPotential: number; // 0-100
  supplierReliability: number;
  shipping: number;
  inventory: number;
  returnRisk: number; // higher = better (lower risk)
  completeness: number;
  adSuitability: number;
  demandPerformance: number;
  priceCompetitiveness: number;
};

export function calculateProductScore(input: ProductScoreInput) {
  const score =
    (clamp(input.contributionPotential, 0, 100) * 20 +
      clamp(input.supplierReliability, 0, 100) * 15 +
      clamp(input.shipping, 0, 100) * 10 +
      clamp(input.inventory, 0, 100) * 10 +
      clamp(input.returnRisk, 0, 100) * 10 +
      clamp(input.completeness, 0, 100) * 10 +
      clamp(input.adSuitability, 0, 100) * 10 +
      clamp(input.demandPerformance, 0, 100) * 10 +
      clamp(input.priceCompetitiveness, 0, 100) * 5) /
    100;

  const rounded = Math.round(score * 10) / 10;

  let classification: "HIGH_POTENTIAL" | "TEST" | "WATCH" | "LOW_PRIORITY";
  if (rounded >= 80) classification = "HIGH_POTENTIAL";
  else if (rounded >= 65) classification = "TEST";
  else if (rounded >= 50) classification = "WATCH";
  else classification = "LOW_PRIORITY";

  return { score: rounded, classification };
}

export function scoreFromPricing(pricing: PricingResult, extras?: Partial<ProductScoreInput>) {
  const contributionScore = clamp((pricing.contributionBeforeAds / 1500) * 100, 0, 100);
  const marginScore = clamp(pricing.profitMargin * 2, 0, 100);

  return calculateProductScore({
    contributionPotential: (contributionScore + marginScore) / 2,
    supplierReliability: extras?.supplierReliability ?? 70,
    shipping: extras?.shipping ?? 70,
    inventory: extras?.inventory ?? 70,
    returnRisk: extras?.returnRisk ?? 70,
    completeness: extras?.completeness ?? 60,
    adSuitability: extras?.adSuitability ?? 65,
    demandPerformance: extras?.demandPerformance ?? 40,
    priceCompetitiveness: extras?.priceCompetitiveness ?? 60,
  });
}
