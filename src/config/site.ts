export const BRAND = {
  name: "VELORA",
  tagline: "Smart Products. Better Living.",
  domain: "jyotishkundali.com",
  currency: "INR",
  timezone: "Asia/Kolkata",
} as const;

export const DEFAULT_TARGETS = {
  dailyRevenue: 100_000,
  dailyContribution: 10_000,
  minSellingPrice: 1_500,
  maxSellingPrice: 10_000,
  minContribution: 500,
  preferredContribution: 1_000,
  minMarginPercent: 35,
  paymentFeeRate: 0.02,
  defaultReturnRiskRate: 0.05,
  defaultTaxRate: 0.18,
} as const;

export const PRODUCT_SCORE_WEIGHTS = {
  contributionPotential: 20,
  supplierReliability: 15,
  shipping: 10,
  inventory: 10,
  returnRisk: 10,
  completeness: 10,
  adSuitability: 10,
  demandPerformance: 10,
  priceCompetitiveness: 5,
} as const;

export const CATEGORY_SEEDS = [
  { name: "Smart Gadgets", slug: "smart-gadgets", targetCount: 600 },
  { name: "Home & Kitchen", slug: "home-kitchen", targetCount: 900 },
  { name: "Beauty & Personal Care", slug: "beauty-personal-care", targetCount: 700 },
  { name: "Fitness & Wellness", slug: "fitness-wellness", targetCount: 400 },
  { name: "Travel Accessories", slug: "travel-accessories", targetCount: 350 },
  { name: "Automotive", slug: "automotive", targetCount: 450 },
  { name: "Pet Products", slug: "pet-products", targetCount: 300 },
  { name: "Lifestyle", slug: "lifestyle", targetCount: 500 },
  { name: "Office & Work Accessories", slug: "office-work", targetCount: 300 },
  { name: "Fashion Accessories", slug: "fashion-accessories", targetCount: 300 },
  { name: "Electronics Accessories", slug: "electronics-accessories", targetCount: 500 },
  { name: "Home Organization", slug: "home-organization", targetCount: 200 },
  { name: "Personal Accessories", slug: "personal-accessories", targetCount: 200 },
  { name: "Other Trending Products", slug: "other-trending", targetCount: 200 },
] as const;

export const SAMPLE_THRESHOLDS = {
  minVisitors: 100,
  minAddToCarts: 20,
  minPurchases: 5,
} as const;

export function useMockProviders() {
  return (
    process.env.USE_MOCK_PROVIDERS === "true" ||
    process.env.VELORA_MODE === "development"
  );
}
