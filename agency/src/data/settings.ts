export type TrackingSettings = {
  /** Master switch for all marketing / analytics tags */
  enabled?: boolean;
  googleTagManagerId?: string;
  googleAnalyticsId?: string;
  /** Google Ads tag ID, e.g. AW-123456789 */
  googleAdsId?: string;
  /** Meta (Facebook) Pixel ID — one ID, or comma-separated for multiple */
  metaPixelId?: string;
  /** Optional extra Meta Pixel IDs (merged with metaPixelId) */
  metaPixelIds?: string[];
  googleSiteVerification?: string;
  /** Paste full script tags from Google Ads, LinkedIn, AI ad platforms, etc. */
  headScripts?: string;
  /** Paste noscript / iframe snippets (GTM noscript, Meta fallback, etc.) */
  bodyStartHtml?: string;
};

export const defaultTracking: Required<
  Pick<
    TrackingSettings,
    | "enabled"
    | "googleTagManagerId"
    | "googleAnalyticsId"
    | "googleAdsId"
    | "metaPixelId"
    | "metaPixelIds"
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
  metaPixelIds: [],
  googleSiteVerification: "80ZVa9R1VjKZnfedwtUgfAYvfs1WsncTMsAwiSeSTBM",
  headScripts: "",
  bodyStartHtml: "",
};

export function mergeTracking(
  partial?: TrackingSettings | null,
): typeof defaultTracking {
  const p = partial || {};
  // Migrate older agency field names if present
  const legacy = p as TrackingSettings & { gtmId?: string; gaId?: string };
  return {
    ...defaultTracking,
    ...p,
    googleTagManagerId:
      p.googleTagManagerId || legacy.gtmId || defaultTracking.googleTagManagerId,
    googleAnalyticsId:
      p.googleAnalyticsId || legacy.gaId || defaultTracking.googleAnalyticsId,
    metaPixelIds: Array.isArray(p.metaPixelIds)
      ? p.metaPixelIds.map(String).filter(Boolean)
      : defaultTracking.metaPixelIds,
  };
}
