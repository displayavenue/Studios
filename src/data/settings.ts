export type TrackingSettings = {
  enabled?: boolean;
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  googleAdsId?: string;
  facebookPixelId?: string;
  metaPixelId?: string;
  googleSiteVerification?: string;
  headScripts?: string;
  bodyStartHtml?: string;
};

export type SiteSettings = {
  siteName?: string;
  tracking?: TrackingSettings;
};

export const defaultTracking: TrackingSettings = {
  enabled: true,
  googleAnalyticsId: "",
  googleTagManagerId: "",
  googleAdsId: "",
  facebookPixelId: "",
  metaPixelId: "",
  googleSiteVerification: "",
  headScripts: "",
  bodyStartHtml: "",
};

export function mergeTracking(
  partial?: TrackingSettings | null,
): TrackingSettings {
  return { ...defaultTracking, ...(partial || {}) };
}
