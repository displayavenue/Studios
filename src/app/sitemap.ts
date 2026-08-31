import type { MetadataRoute } from "next";

/**
 * Sitemap is generated without requiring DATABASE_URL at build time.
 * Product/category URLs are added at request time when the DB is available.
 */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jyotishkundali.com";
  const entries: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/cart`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  try {
    const { prisma } = await import("@/lib/prisma");
    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: { status: "PUBLISHED", seoIndexable: true, visibleOnStore: true },
        select: { slug: true, updatedAt: true },
        take: 5000,
      }),
      prisma.category.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true },
      }),
    ]);

    entries.push(
      ...categories.map((c) => ({
        url: `${siteUrl}/categories/${c.slug}`,
        lastModified: c.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
      ...products.map((p) => ({
        url: `${siteUrl}/products/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      })),
    );
  } catch {
    // Build/preview environments without DATABASE_URL still succeed.
  }

  return entries;
}
