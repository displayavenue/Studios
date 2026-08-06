export type TrackingSettings = {
  /** Master switch for all marketing / analytics tags */
  enabled?: boolean;
  googleTagManagerId?: string;
  googleAnalyticsId?: string;
  /** Google Ads tag ID, e.g. AW-123456789 */
  googleAdsId?: string;
  /** Meta (Facebook) Pixel ID */
  metaPixelId?: string;
  googleSiteVerification?: string;
  /** Paste full script tags from Google Ads, LinkedIn, AI ad platforms, etc. */
  headScripts?: string;
  /** Paste noscript / iframe snippets (GTM noscript, Meta fallback, etc.) */
  bodyStartHtml?: string;
};

export type SiteSettings = {
  siteName?: string;
  adminNote?: string;
  updatedAt?: string;
  seoSyncedAt?: string;
  sitemapUrlCount?: number;
  tracking?: TrackingSettings;
};

export const defaultTracking: Required<
  Pick<
    TrackingSettings,
    | "enabled"
    | "googleTagManagerId"
    | "googleAnalyticsId"
    | "googleAdsId"
    | "metaPixelId"
    | "googleSiteVerification"
    | "headScripts"
    | "bodyStartHtml"
  >
> = {
  enabled: true,
  googleTagManagerId: "GTM-WDC2ZZBG",
  googleAnalyticsId: "G-WQD9K577DF",
  googleAdsId: "",
  metaPixelId: "",
  googleSiteVerification: "80ZVa9R1VjKZnfedwtUgfAYvfs1WsncTMsAwiSeSTBM",
  headScripts: "",
  bodyStartHtml: "",
};

export function mergeTracking(
  partial?: TrackingSettings | null,
): typeof defaultTracking {
  return { ...defaultTracking, ...(partial || {}) };
}
