import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jyotishkundali.com";
  const entries: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/services`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/membership`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteUrl}/signup`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${siteUrl}/dashboard`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.5 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${siteUrl}/experts`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
  ];

  try {
    const { prisma } = await import("@/lib/prisma");
    const products = await prisma.product.findMany({
      where: { status: "PUBLISHED", isActive: true, isMembership: false },
      select: { slug: true, updatedAt: true },
    });

    entries.push(
      ...products.map((p) => ({
        url: `${siteUrl}/services/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    );
  } catch {
    // Build without DATABASE_URL still succeeds.
  }

  return entries;
}

export const dynamic = "force-dynamic";
