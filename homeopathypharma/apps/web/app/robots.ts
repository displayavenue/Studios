import type { MetadataRoute } from "next";
import { DEFAULT_ROBOTS_TXT_RULES, renderRobotsTxt } from "@homeopathypharma/seo";
import { getSitemapManifest } from "@/lib/api";

const siteUrl = process.env.WEB_URL ?? process.env.NEXT_PUBLIC_WEB_URL ?? "http://localhost:3000";

export default async function robots(): Promise<MetadataRoute.Robots> {
  // Stub: future manifest may drive disallow rules per environment
  await getSitemapManifest();

  return {
    rules: DEFAULT_ROBOTS_TXT_RULES.map((rule) => ({
      userAgent: rule.userAgent,
      allow: rule.allow,
      disallow: rule.disallow,
      crawlDelay: rule.crawlDelay,
    })),
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}

/** Optional plain-text robots.txt body via route handler pattern — metadata route above is canonical for Next 15. */
export function generateRobotsTxtBody(): string {
  return renderRobotsTxt(`${siteUrl}/sitemap.xml`, DEFAULT_ROBOTS_TXT_RULES);
}
