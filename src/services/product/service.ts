import { prisma } from "@/lib/prisma";
import { normalizeTitle, generateSku, slugify, toNumber } from "@/lib/utils";
import { calculatePricing, scoreFromPricing } from "@/services/pricing/engine";
import type { SupplierProductResult } from "@/providers/suppliers/types";
import { ProductStatus, ProductTier, StockStatus } from "@/generated/prisma/enums";
import { SAMPLE_THRESHOLDS } from "@/config/site";

export type DuplicateMatch = {
  productId: string;
  reason: "SUPPLIER_PRODUCT_ID" | "SKU" | "GTIN" | "MPN" | "NORMALIZED_TITLE";
};

export async function findDuplicates(input: {
  supplierId?: string;
  supplierProductId?: string;
  sku?: string;
  gtin?: string;
  mpn?: string;
  title: string;
}): Promise<DuplicateMatch[]> {
  const matches: DuplicateMatch[] = [];

  if (input.supplierId && input.supplierProductId) {
    const bySupplier = await prisma.product.findFirst({
      where: {
        supplierId: input.supplierId,
        supplierProductId: input.supplierProductId,
      },
      select: { id: true },
    });
    if (bySupplier) matches.push({ productId: bySupplier.id, reason: "SUPPLIER_PRODUCT_ID" });
  }

  if (input.sku) {
    const bySku = await prisma.product.findUnique({
      where: { sku: input.sku },
      select: { id: true },
    });
    if (bySku) matches.push({ productId: bySku.id, reason: "SKU" });
  }

  if (input.gtin) {
    const byGtin = await prisma.product.findFirst({
      where: { gtin: input.gtin },
      select: { id: true },
    });
    if (byGtin) matches.push({ productId: byGtin.id, reason: "GTIN" });
  }

  if (input.mpn) {
    const byMpn = await prisma.product.findFirst({
      where: { mpn: input.mpn },
      select: { id: true },
    });
    if (byMpn) matches.push({ productId: byMpn.id, reason: "MPN" });
  }

  const normalized = normalizeTitle(input.title);
  if (normalized) {
    const byTitle = await prisma.product.findFirst({
      where: { normalizedTitle: normalized },
      select: { id: true },
    });
    if (byTitle && !matches.some((m) => m.productId === byTitle.id)) {
      matches.push({ productId: byTitle.id, reason: "NORMALIZED_TITLE" });
    }
  }

  return matches;
}

export async function importSupplierProduct(opts: {
  supplierId: string;
  raw: SupplierProductResult;
  categoryId?: string;
  skipDuplicates?: boolean;
  demo?: boolean;
  autoApprove?: boolean;
}) {
  const { supplierId, raw } = opts;
  const duplicates = await findDuplicates({
    supplierId,
    supplierProductId: raw.supplierProductId,
    gtin: raw.gtin,
    mpn: raw.mpn,
    title: raw.title,
  });

  if (duplicates.length && opts.skipDuplicates !== false) {
    // Multi-supplier: attach offer to existing customer-facing product
    const existingId = duplicates[0].productId;
    const pricing = calculatePricing({
      costPrice: raw.costPrice,
      shippingCost: raw.shippingCost,
    });

    await prisma.supplierOffer.upsert({
      where: { id: `${existingId}-${supplierId}` },
      create: {
        id: `${existingId}-${supplierId}`,
        productId: existingId,
        supplierId,
        costPrice: raw.costPrice,
        shippingCost: raw.shippingCost,
        landedCost: pricing.landedCost,
        inventory: raw.stockQuantity,
        isRecommended: false,
      },
      update: {
        costPrice: raw.costPrice,
        shippingCost: raw.shippingCost,
        landedCost: pricing.landedCost,
        inventory: raw.stockQuantity,
      },
    }).catch(async () => {
      await prisma.supplierOffer.create({
        data: {
          productId: existingId,
          supplierId,
          costPrice: raw.costPrice,
          shippingCost: raw.shippingCost,
          landedCost: pricing.landedCost,
          inventory: raw.stockQuantity,
        },
      });
    });

    return { status: "duplicate" as const, productId: existingId, duplicates };
  }

  const pricing = calculatePricing({
    costPrice: raw.costPrice,
    shippingCost: raw.shippingCost,
  });

  const inventoryScore = Math.min(100, (raw.stockQuantity / 50) * 100);
  const completeness =
    (raw.description ? 25 : 0) +
    (raw.brand ? 15 : 0) +
    (raw.images?.length ? 30 : 0) +
    (raw.weight ? 15 : 0) +
    (raw.attributes ? 15 : 0);

  const scored = scoreFromPricing(pricing, {
    inventory: inventoryScore,
    completeness,
    supplierReliability: 70,
  });

  let tier: ProductTier = ProductTier.TIER_3_CATALOG;
  if (scored.classification === "HIGH_POTENTIAL") tier = ProductTier.TIER_1_HERO;
  else if (scored.classification === "TEST") tier = ProductTier.TIER_2_GROWTH;
  else if (scored.classification === "LOW_PRIORITY") tier = ProductTier.TIER_4_LOW_PRIORITY;

  const sku = generateSku();
  let slug = slugify(raw.title);
  const slugExists = await prisma.product.findUnique({ where: { slug } });
  if (slugExists) slug = `${slug}-${sku.toLowerCase()}`;

  const status = opts.autoApprove
    ? ProductStatus.APPROVED
    : ProductStatus.DRAFT;

  const product = await prisma.product.create({
    data: {
      supplierId,
      supplierProductId: raw.supplierProductId,
      sku,
      slug,
      title: raw.title,
      brand: raw.brand,
      shortDescription: raw.description?.slice(0, 200),
      description: raw.description,
      categoryId: opts.categoryId,
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
      stockStatus:
        raw.stockQuantity <= 0
          ? StockStatus.OUT_OF_STOCK
          : raw.stockQuantity <= 5
            ? StockStatus.LOW_STOCK
            : StockStatus.IN_STOCK,
      weight: raw.weight,
      status,
      tier,
      productScore: scored.score,
      supplierScore: 70,
      shippingScore: 70,
      returnRiskScore: 30,
      adSuitabilityScore: 65,
      gtin: raw.gtin,
      mpn: raw.mpn,
      normalizedTitle: normalizeTitle(raw.title),
      primaryImageUrl: raw.images?.[0],
      demo: opts.demo ?? false,
      newProduct: true,
      visibleOnStore: false,
      inventory: {
        create: {
          quantity: raw.stockQuantity,
          lastSyncedAt: new Date(),
        },
      },
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
          supplierId,
          costPrice: raw.costPrice,
          shippingCost: raw.shippingCost,
          landedCost: pricing.landedCost,
          inventory: raw.stockQuantity,
          isRecommended: true,
        },
      },
    },
  });

  return { status: "imported" as const, productId: product.id, duplicates: [] };
}

export async function publishProduct(productId: string) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new Error("PRODUCT_NOT_FOUND");
  if (
    product.status !== ProductStatus.APPROVED &&
    product.status !== ProductStatus.UNPUBLISHED
  ) {
    throw new Error("PRODUCT_NOT_APPROVED");
  }

  return prisma.product.update({
    where: { id: productId },
    data: {
      status: ProductStatus.PUBLISHED,
      visibleOnStore: true,
      visibleInSearch: true,
      visibleInCategory: true,
      seoIndexable: Boolean(product.description && product.primaryImageUrl),
      metaEligible: product.productScore >= 65,
      googleEligible: Boolean(
        product.description && product.primaryImageUrl && toNumber(product.sellingPrice) > 0,
      ),
      eligibleForMeta: product.productScore >= 65,
      eligibleForGoogle: Boolean(product.description && product.primaryImageUrl),
    },
  });
}

export function evaluateTestStatus(analytics: {
  visitors: number;
  addToCarts: number;
  orders: number;
  cac: number | null;
  netContribution: number;
  contribution: number;
}) {
  const { minVisitors, minAddToCarts, minPurchases } = SAMPLE_THRESHOLDS;
  const hasSample =
    analytics.visitors >= minVisitors ||
    analytics.addToCarts >= minAddToCarts ||
    analytics.orders >= minPurchases;

  if (!hasSample) return "INSUFFICIENT_DATA" as const;

  if (analytics.orders === 0 && analytics.visitors >= minVisitors) {
    return "UNDERPERFORMING" as const;
  }

  if (toNumber(analytics.netContribution) < 0) return "UNPROFITABLE" as const;

  if (
    analytics.orders >= minPurchases &&
    toNumber(analytics.netContribution) > 0 &&
    (analytics.cac === null || analytics.cac <= toNumber(analytics.contribution) * 0.75)
  ) {
    return analytics.orders >= minPurchases * 3 ? ("WINNER" as const) : ("PROMISING" as const);
  }

  return "TESTING" as const;
}

export async function searchProducts(params: {
  q?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
  status?: ProductStatus;
  storefront?: boolean;
}) {
  const page = params.page ?? 1;
  const pageSize = Math.min(params.pageSize ?? 24, 48);
  const skip = (page - 1) * pageSize;

  const where: Record<string, unknown> = {};

  if (params.storefront) {
    where.status = ProductStatus.PUBLISHED;
    where.visibleOnStore = true;
  } else if (params.status) {
    where.status = params.status;
  }

  if (params.q) {
    where.OR = [
      { title: { contains: params.q, mode: "insensitive" } },
      { brand: { contains: params.q, mode: "insensitive" } },
      { sku: { contains: params.q, mode: "insensitive" } },
    ];
  }

  if (params.categorySlug) {
    where.category = { slug: params.categorySlug };
  }

  if (params.brand) {
    where.brand = { equals: params.brand, mode: "insensitive" };
  }

  if (params.minPrice != null || params.maxPrice != null) {
    where.sellingPrice = {
      ...(params.minPrice != null ? { gte: params.minPrice } : {}),
      ...(params.maxPrice != null ? { lte: params.maxPrice } : {}),
    };
  }

  if (params.storefront) {
    where.visibleInSearch = true;
  }

  let orderBy: Record<string, string> = { createdAt: "desc" };
  switch (params.sort) {
    case "price_asc":
      orderBy = { sellingPrice: "asc" };
      break;
    case "price_desc":
      orderBy = { sellingPrice: "desc" };
      break;
    case "newest":
      orderBy = { createdAt: "desc" };
      break;
    case "best_selling":
      orderBy = { bestSeller: "desc" };
      break;
    case "contribution":
      orderBy = { contributionBeforeAds: "desc" };
      break;
    case "score":
      orderBy = { productScore: "desc" };
      break;
    default:
      orderBy = { productScore: "desc" };
  }

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
      include: {
        category: true,
        images: { where: { isPrimary: true }, take: 1 },
        reviews: {
          where: { moderationStatus: "APPROVED" },
          select: { rating: true },
        },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}
