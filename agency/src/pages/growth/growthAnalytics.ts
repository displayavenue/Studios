type GrowthEventParams = Record<string, string | number | boolean | undefined | null>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

function cleanParams(params: GrowthEventParams = {}) {
  const out: Record<string, string | number | boolean> = {};
  Object.entries(params).forEach(([k, v]) => {
    if (v === undefined || v === null || v === "") return;
    out[k] = v;
  });
  return out;
}

/** Push marketing events to GTM dataLayer + GA4 + Meta Pixel when available. */
export function trackGrowthEvent(event: string, params: GrowthEventParams = {}) {
  const payload = {
    event,
    page: typeof window !== "undefined" ? window.location.pathname : "/growth",
    ...cleanParams(params),
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);

  if (typeof window.gtag === "function") {
    window.gtag("event", event, cleanParams(params));
  }

  if (typeof window.fbq === "function") {
    const metaMap: Record<string, string> = {
      page_view: "PageView",
      view_content: "ViewContent",
      lead: "Lead",
      form_submit: "Lead",
    };
    const standard = metaMap[event];
    const cleaned = cleanParams(params);
    const eventID =
      cleaned.event_id !== undefined ? String(cleaned.event_id) : undefined;
    const { event_id: _omit, ...metaParams } = cleaned;
    if (standard) {
      if (eventID) {
        window.fbq("track", standard, metaParams, { eventID });
      } else {
        window.fbq("track", standard, metaParams);
      }
    } else if (eventID) {
      window.fbq("trackCustom", event, metaParams, { eventID });
    } else {
      window.fbq("trackCustom", event, metaParams);
    }
  }
}

export function trackCtaClick(input: {
  cta_text: string;
  cta_location: string;
  utm_source?: string;
  utm_campaign?: string;
}) {
  trackGrowthEvent("cta_click", {
    cta_text: input.cta_text,
    cta_location: input.cta_location,
    utm_source: input.utm_source,
    utm_campaign: input.utm_campaign,
  });
}
