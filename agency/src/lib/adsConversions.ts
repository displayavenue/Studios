/**
 * Google Ads website conversion helpers.
 * Labels come from CMS tracking.json (googleAdsConversions.*) as either
 * the label only ("AbC-D_efG") or full send_to ("AW-…/AbC-D_efG").
 */

export type AdsConversionKind = "form" | "phone" | "whatsapp";

type AdsConfig = {
  adsId: string;
  conversions: Partial<Record<AdsConversionKind, string>>;
};

type TrackOpts = {
  url?: string;
  value?: number;
  currency?: string;
  transaction_id?: string;
  /** When true, delay navigation via event_callback (phone / same-tab links). */
  waitForCallback?: boolean;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    __daAdsConfigured?: boolean;
    __daAdsClickTracking?: boolean;
  }
}

let config: AdsConfig = { adsId: "", conversions: {} };
const recent: Partial<Record<AdsConversionKind, number>> = {};

export function configureAdsConversions(next: AdsConfig) {
  config = {
    adsId: String(next.adsId || "").trim(),
    conversions: {
      form: String(next.conversions?.form || "").trim(),
      phone: String(next.conversions?.phone || "").trim(),
      whatsapp: String(next.conversions?.whatsapp || "").trim(),
    },
  };
  window.__daAdsConfigured = Boolean(config.adsId);
}

function resolveSendTo(kind: AdsConversionKind): string | null {
  const raw = (config.conversions[kind] || "").trim();
  if (!raw) return null;
  if (raw.includes("/")) return raw;
  const id = config.adsId.trim();
  if (!id) return null;
  return `${id}/${raw}`;
}

function dedupe(kind: AdsConversionKind, ms = 2500): boolean {
  const now = Date.now();
  const last = recent[kind] || 0;
  if (now - last < ms) return false;
  recent[kind] = now;
  return true;
}

/** Fire a Google Ads conversion. Returns false when navigation should wait for callback. */
export function trackAdsConversion(kind: AdsConversionKind, opts: TrackOpts = {}): boolean {
  const send_to = resolveSendTo(kind);
  if (!send_to) return true;
  if (!dedupe(kind)) return true;
  if (typeof window.gtag !== "function") return true;

  const payload: Record<string, unknown> = {
    send_to,
    value: opts.value ?? 1.0,
    currency: opts.currency || "INR",
  };
  if (opts.transaction_id) payload.transaction_id = opts.transaction_id;

  if (opts.waitForCallback && opts.url) {
    const url = opts.url;
    payload.event_callback = () => {
      window.location.href = url;
    };
    window.gtag("event", "conversion", payload);
    // Fallback if callback never fires
    window.setTimeout(() => {
      if (window.location.href !== url) window.location.href = url;
    }, 2000);
    return false;
  }

  window.gtag("event", "conversion", payload);
  return true;
}

/** Capture tel: / WhatsApp link clicks site-wide. */
export function installAdsClickTracking() {
  if (window.__daAdsClickTracking) return;
  window.__daAdsClickTracking = true;

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target as Element | null;
      const anchor = target?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";
      if (!href) return;

      if (href.startsWith("tel:")) {
        const openInPlace = !anchor.getAttribute("target") || anchor.getAttribute("target") === "_self";
        if (openInPlace && resolveSendTo("phone")) {
          event.preventDefault();
          trackAdsConversion("phone", { url: href, waitForCallback: true });
        } else {
          trackAdsConversion("phone");
        }
        return;
      }

      if (/wa\.me\/|api\.whatsapp\.com|whatsapp\.com\/send/i.test(href)) {
        trackAdsConversion("whatsapp");
      }
    },
    true,
  );
}

export function adsConversionConfigured(kind: AdsConversionKind): boolean {
  return Boolean(resolveSendTo(kind));
}
