const FIRST_KEY = "da_growth_first_touch";
const LAST_KEY = "da_growth_last_touch";

export type UtmTouch = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  fbclid: string;
  captured_at: string;
};

function readParams(): UtmTouch {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || "",
    utm_medium: params.get("utm_medium") || "",
    utm_campaign: params.get("utm_campaign") || "",
    utm_content: params.get("utm_content") || "",
    utm_term: params.get("utm_term") || "",
    fbclid: params.get("fbclid") || "",
    captured_at: new Date().toISOString(),
  };
}

function hasAny(touch: UtmTouch) {
  return Boolean(
    touch.utm_source ||
      touch.utm_medium ||
      touch.utm_campaign ||
      touch.utm_content ||
      touch.utm_term ||
      touch.fbclid,
  );
}

function load(key: string): UtmTouch | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as UtmTouch;
  } catch {
    return null;
  }
}

function save(key: string, touch: UtmTouch) {
  try {
    localStorage.setItem(key, JSON.stringify(touch));
  } catch {
    /* ignore */
  }
}

/** Capture first-touch once and always refresh last-touch when UTMs/fbclid present. */
export function captureGrowthAttribution(): { first: UtmTouch; last: UtmTouch } {
  const current = readParams();
  let first = load(FIRST_KEY);
  if (!first) {
    first = hasAny(current)
      ? current
      : {
          utm_source: "",
          utm_medium: "",
          utm_campaign: "",
          utm_content: "",
          utm_term: "",
          fbclid: "",
          captured_at: new Date().toISOString(),
        };
    save(FIRST_KEY, first);
  }
  const last = hasAny(current) ? current : load(LAST_KEY) || first;
  if (hasAny(current)) save(LAST_KEY, current);
  else if (!load(LAST_KEY)) save(LAST_KEY, first);
  return { first, last };
}

export function deviceType(): string {
  const w = window.innerWidth;
  if (w < 768) return "mobile";
  if (w < 1100) return "tablet";
  return "desktop";
}

export function newEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `evt_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}
