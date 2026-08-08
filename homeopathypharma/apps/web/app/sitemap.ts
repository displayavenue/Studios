import type { MetadataRoute } from "next";
import { computeSitemapShards, buildSitemapIndexEntries } from "@homeopathypharma/seo";
import { getSitemapManifest, getSitemapEntries } from "@/lib/api";

const siteUrl = process.env.WEB_URL ?? process.env.NEXT_PUBLIC_WEB_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const manifest = await getSitemapManifest();

  // Primary index: static URLs from API stub + fallback
  const staticEntries = await Promise.all(
    (manifest.staticUrls.length ? manifest.staticUrls : ["/"]).map(async (path) => {
      const loc = path.startsWith("http") ? path : `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
      return { url: loc, changeFrequency: "weekly" as const, priority: path === "/" ? 1 : 0.7 };
    }),
  );

  // Pull product segment sample from API — full sharding handled server-side later
  const productEntries = await getSitemapEntries("products");
  const productUrls: MetadataRoute.Sitemap = productEntries.map((entry) => ({
    url: entry.loc.startsWith("http") ? entry.loc : `${siteUrl}${entry.loc}`,
    lastModified: entry.lastmod,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Compute shard metadata for observability (used when scaling to 100k+ URLs)
  const productShardMeta = computeSitemapShards("products", productUrls.length);

  if (productShardMeta.length > 1) {
    buildSitemapIndexEntries(siteUrl, productShardMeta);
  }

  return [...staticEntries, ...productUrls];
}
