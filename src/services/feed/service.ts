import { prisma } from "@/lib/prisma";
import { toNumber } from "@/lib/utils";
import { ProductStatus } from "@/generated/prisma/enums";

/**
 * Centralized product feed engine — Google Merchant, Meta Catalog, Sitemap.
 * Never invents GTIN/MPN/brand.
 */
export async function getEligibleFeedProducts(opts?: {
  forGoogle?: boolean;
  forMeta?: boolean;
  forSitemap?: boolean;
}) {
  const where: Record<string, unknown> = {
    status: ProductStatus.PUBLISHED,
    visibleOnStore: true,
    demo: false,
  };

  if (opts?.forGoogle) {
    where.googleEligible = true;
    where.eligibleForGoogle = true;
  }
  if (opts?.forMeta) {
    where.metaEligible = true;
    where.eligibleForMeta = true;
  }
  if (opts?.forSitemap) {
    where.seoIndexable = true;
  }

  return prisma.product.findMany({
    where,
    include: { category: true, images: { orderBy: { sortOrder: "asc" }, take: 5 } },
    orderBy: { updatedAt: "desc" },
    take: 5000,
  });
}

export function toGoogleMerchantRow(
  product: Awaited<ReturnType<typeof getEligibleFeedProducts>>[number],
  siteUrl: string,
) {
  const image =
    product.primaryImageUrl || product.images.find((i) => i.isPrimary)?.url || product.images[0]?.url;

  const availability =
    product.stockQuantity > 0 ? "in_stock" : "out_of_stock";

  const row: Record<string, string> = {
    id: product.sku,
    title: product.title.slice(0, 150),
    description: (product.description || product.shortDescription || product.title).slice(0, 5000),
    link: `${siteUrl}/products/${product.slug}`,
    image_link: image || "",
    availability,
    price: `${toNumber(product.sellingPrice).toFixed(2)} INR`,
    condition: "new",
    brand: product.brand || "VELORA",
  };

  if (product.compareAtPrice && toNumber(product.compareAtPrice) > toNumber(product.sellingPrice)) {
    row.sale_price = `${toNumber(product.sellingPrice).toFixed(2)} INR`;
    row.price = `${toNumber(product.compareAtPrice).toFixed(2)} INR`;
  }

  // Only include GTIN/MPN when legitimately present — never invent
  if (product.gtin) row.gtin = product.gtin;
  if (product.mpn) row.mpn = product.mpn;
  if (product.category) row.product_type = product.category.name;

  return row;
}

export function toMetaCatalogRow(
  product: Awaited<ReturnType<typeof getEligibleFeedProducts>>[number],
  siteUrl: string,
) {
  const image =
    product.primaryImageUrl || product.images.find((i) => i.isPrimary)?.url || product.images[0]?.url;

  return {
    id: product.sku,
    title: product.title.slice(0, 200),
    description: (product.description || product.shortDescription || product.title).slice(0, 9999),
    availability: product.stockQuantity > 0 ? "in stock" : "out of stock",
    condition: "new",
    price: `${toNumber(product.sellingPrice).toFixed(2)} INR`,
    link: `${siteUrl}/products/${product.slug}`,
    image_link: image || "",
    brand: product.brand || "VELORA",
  };
}

export async function buildGoogleFeedTsv(siteUrl: string) {
  const products = await getEligibleFeedProducts({ forGoogle: true });
  const rows = products
    .filter((p) => p.primaryImageUrl || p.images.length)
    .map((p) => toGoogleMerchantRow(p, siteUrl));

  if (!rows.length) {
    return "id\ttitle\tdescription\tlink\timage_link\tavailability\tprice\tcondition\tbrand\n";
  }

  const headers = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
  const lines = [headers.join("\t")];
  for (const row of rows) {
    lines.push(headers.map((h) => (row[h] || "").replace(/[\t\n\r]/g, " ")).join("\t"));
  }
  return lines.join("\n");
}

export async function buildMetaFeedCsv(siteUrl: string) {
  const products = await getEligibleFeedProducts({ forMeta: true });
  const rows = products
    .filter((p) => p.primaryImageUrl || p.images.length)
    .map((p) => toMetaCatalogRow(p, siteUrl));

  const headers = [
    "id",
    "title",
    "description",
    "availability",
    "condition",
    "price",
    "link",
    "image_link",
    "brand",
  ];
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(
      headers
        .map((h) => `"${String((row as Record<string, string>)[h] || "").replace(/"/g, '""')}"`)
        .join(","),
    );
  }
  return lines.join("\n");
}
