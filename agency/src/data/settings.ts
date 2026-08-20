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
  googleTagManagerId: "",
  googleAnalyticsId: "",
  googleAdsId: "",
  metaPixelId: "",
  googleSiteVerification: "",
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
  };
}
