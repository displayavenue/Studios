import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { CATEGORY_SEEDS, DEFAULT_TARGETS } from "../src/config/site";
import { MOCK_CATALOG } from "../src/providers/suppliers/mock-supplier";
import { calculatePricing, scoreFromPricing } from "../src/services/pricing/engine";
import { normalizeTitle, generateSku, slugify } from "../src/lib/utils";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding VELORA...");

  // Categories
  for (const c of CATEGORY_SEEDS) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      create: {
        name: c.name,
        slug: c.slug,
        targetCount: c.targetCount,
        description: `${c.name} curated for everyday usefulness.`,
      },
      update: { targetCount: c.targetCount },
    });
  }

  // Mock supplier
  const supplier = await prisma.supplier.upsert({
    where: { slug: "mock-supplier" },
    create: {
      name: "Mock Supplier (Development)",
      slug: "mock-supplier",
      providerType: "MOCK",
      status: "CONNECTED",
      reliabilityScore: 75,
      shippingScore: 70,
      inventoryScore: 80,
      returnScore: 65,
      priceStabilityScore: 70,
      defaultMargin: 40,
      lastSyncAt: new Date(),
      notes: "Clearly labeled mock provider for development. Not a live supplier API.",
    },
    update: { status: "CONNECTED", lastSyncAt: new Date() },
  });

  const categories = await prisma.category.findMany();
  const catBySlug = Object.fromEntries(categories.map((c) => [c.slug, c]));

  // Demo products (~20) marked demo=true
  let imported = 0;
  for (const raw of MOCK_CATALOG) {
    const existing = await prisma.product.findFirst({
      where: { supplierId: supplier.id, supplierProductId: raw.supplierProductId },
    });
    if (existing) continue;

    const pricing = calculatePricing({
      costPrice: raw.costPrice,
      shippingCost: raw.shippingCost,
    });
    const scored = scoreFromPricing(pricing, {
      inventory: Math.min(100, raw.stockQuantity),
      completeness: 80,
    });

    const sku = generateSku();
    let slug = slugify(raw.title);
    if (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${slug}-${sku.toLowerCase()}`;
    }

    const category = raw.categoryHint ? catBySlug[raw.categoryHint] : undefined;

    await prisma.product.create({
      data: {
        supplierId: supplier.id,
        supplierProductId: raw.supplierProductId,
        sku,
        slug,
        title: raw.title,
        brand: raw.brand,
        shortDescription: raw.description?.slice(0, 200),
        description: raw.description,
        categoryId: category?.id,
        costPrice: raw.costPrice,
        shippingCost: raw.shippingCost,
        tax: pricing.taxEstimate,
        paymentFeeEstimate: pricing.paymentFeeEstimate,
        returnCostEstimate: pricing.returnCostEstimate,
        landedCost: pricing.landedCost,
        sellingPrice: pricing.sellingPrice,
        compareAtPrice: pricing.compareAtPrice,
        profitBeforeAds: pricing.contributionBeforeAds,
        contributionBeforeAds: pricing.contributionBeforeAds,
        profitMargin: pricing.profitMargin,
        stockQuantity: raw.stockQuantity,
        stockStatus: raw.stockQuantity > 5 ? "IN_STOCK" : "LOW_STOCK",
        weight: raw.weight,
        status: "PUBLISHED",
        tier:
          scored.classification === "HIGH_POTENTIAL"
            ? "TIER_1_HERO"
            : scored.classification === "TEST"
              ? "TIER_2_GROWTH"
              : "TIER_3_CATALOG",
        productScore: scored.score,
        supplierScore: 75,
        shippingScore: 70,
        returnRiskScore: 30,
        adSuitabilityScore: 70,
        featured: imported < 4,
        trending: imported < 6,
        bestSeller: imported < 3,
        newProduct: true,
        metaEligible: scored.score >= 65,
        googleEligible: true,
        seoIndexable: true,
        visibleOnStore: true,
        visibleInSearch: true,
        visibleInCategory: true,
        visibleOnHomepage: imported < 8,
        eligibleForMeta: scored.score >= 65,
        eligibleForGoogle: true,
        eligibleForRecommendations: true,
        demo: true,
        normalizedTitle: normalizeTitle(raw.title),
        primaryImageUrl: raw.images?.[0],
        seoTitle: `${raw.title} | VELORA`,
        seoDescription: raw.description?.slice(0, 155),
        inventory: { create: { quantity: raw.stockQuantity, lastSyncedAt: new Date() } },
        analytics: { create: {} },
        images: raw.images?.length
          ? {
              create: raw.images.map((url, i) => ({
                url,
                alt: raw.title,
                sortOrder: i,
                isPrimary: i === 0,
                kind: i === 0 ? "primary" : "gallery",
              })),
            }
          : undefined,
        offers: {
          create: {
            supplierId: supplier.id,
            costPrice: raw.costPrice,
            shippingCost: raw.shippingCost,
            landedCost: pricing.landedCost,
            inventory: raw.stockQuantity,
            isRecommended: true,
          },
        },
      },
    });
    imported++;
  }

  await prisma.supplier.update({
    where: { id: supplier.id },
    data: { productCount: imported },
  });

  // Targets
  await prisma.target.deleteMany({});
  await prisma.target.create({
    data: {
      dailyRevenueTarget: DEFAULT_TARGETS.dailyRevenue,
      dailyContributionTarget: DEFAULT_TARGETS.dailyContribution,
      minSellingPrice: DEFAULT_TARGETS.minSellingPrice,
      maxSellingPrice: DEFAULT_TARGETS.maxSellingPrice,
      minContribution: DEFAULT_TARGETS.minContribution,
      preferredContribution: DEFAULT_TARGETS.preferredContribution,
      minMarginPercent: DEFAULT_TARGETS.minMarginPercent,
    },
  });

  // Admin user
  const passwordHash = await bcrypt.hash("VeloraAdmin!234", 12);
  await prisma.user.upsert({
    where: { email: "admin@jyotishkundali.com" },
    create: {
      email: "admin@jyotishkundali.com",
      passwordHash,
      role: "SUPER_ADMIN",
      emailVerified: true,
      profile: { create: { firstName: "Velora", lastName: "Admin" } },
    },
    update: { passwordHash, role: "SUPER_ADMIN" },
  });

  // Demo customer
  const custHash = await bcrypt.hash("Customer!234", 12);
  await prisma.user.upsert({
    where: { email: "customer@example.com" },
    create: {
      email: "customer@example.com",
      passwordHash: custHash,
      role: "CUSTOMER",
      emailVerified: true,
      profile: { create: { firstName: "Demo", lastName: "Customer" } },
    },
    update: {},
  });

  // Business settings
  const settings: Array<[string, unknown]> = [
    ["business.name", "VELORA"],
    ["business.domain", "jyotishkundali.com"],
    ["business.email", "support@jyotishkundali.com"],
    ["business.phone", "+91 00000 00000"],
    ["business.currency", "INR"],
    ["business.timezone", "Asia/Kolkata"],
    ["cod.enabled", true],
    ["cod.fee", 40],
    ["cod.minAmount", 500],
    ["cod.maxAmount", 10000],
    ["automation.mode", "MANUAL"],
    ["onboarding.completed", false],
  ];
  for (const [key, value] of settings) {
    await prisma.setting.upsert({
      where: { key },
      create: { key, value: value as object },
      update: { value: value as object },
    });
  }

  // Store health baselines
  const checks = [
    { component: "Payment", status: "WARNING" as const, problem: "Razorpay credentials not set", impact: "Live payments unavailable", action: "Add RAZORPAY_* env vars" },
    { component: "Shipping", status: "WARNING" as const, problem: "Shiprocket credentials not set", impact: "Using mock shipping", action: "Add SHIPROCKET_* env vars" },
    { component: "Supplier", status: "HEALTHY" as const, problem: null, impact: null, action: null },
    { component: "Inventory", status: "HEALTHY" as const, problem: null, impact: null, action: null },
    { component: "Products", status: "HEALTHY" as const, problem: null, impact: null, action: null },
    { component: "SEO", status: "HEALTHY" as const, problem: null, impact: null, action: null },
    { component: "Google", status: "WARNING" as const, problem: "Merchant ID not configured", impact: "Feed ready but not submitted", action: "Configure GOOGLE_MERCHANT_ID" },
    { component: "Meta", status: "WARNING" as const, problem: "Pixel/catalog not configured", impact: "Tracking architecture ready", action: "Add META_* env vars" },
    { component: "Analytics", status: "WARNING" as const, problem: "GA4/GTM not configured", impact: "Internal analytics only", action: "Add NEXT_PUBLIC_GA_ID / GTM" },
    { component: "Checkout", status: "HEALTHY" as const, problem: null, impact: null, action: null },
    { component: "Email", status: "WARNING" as const, problem: "EMAIL_API_KEY not set", impact: "Transactional email mocked", action: "Configure email provider" },
    { component: "Webhooks", status: "HEALTHY" as const, problem: null, impact: null, action: null },
  ];
  await prisma.storeHealthCheck.deleteMany({});
  for (const c of checks) {
    await prisma.storeHealthCheck.create({ data: c });
  }

  console.log(`Seeded ${imported} demo products, categories, admin, targets.`);
  console.log("Admin: admin@jyotishkundali.com / VeloraAdmin!234");
  console.log("Customer: customer@example.com / Customer!234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
