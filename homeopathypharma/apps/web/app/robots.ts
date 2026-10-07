import type { MetadataRoute } from "next";
import { DEFAULT_ROBOTS_TXT_RULES } from "@homeopathypharma/seo";

export const dynamic = "force-static";

const siteUrl = process.env.WEB_URL ?? process.env.NEXT_PUBLIC_WEB_URL ?? "https://homeopathypharma.com";

export default function robots(): MetadataRoute.Robots {
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
