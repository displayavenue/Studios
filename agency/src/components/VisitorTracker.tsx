import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const STORAGE_KEY = "da_vid";
const UTM_KEY = "da_utm";
const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");

function ensureVisitorId(): string {
  try {
    let id = localStorage.getItem(STORAGE_KEY) || "";
    if (!id) {
      id =
        typeof crypto !== "undefined" && "randomUUID" in crypto
          ? `v_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`
          : `v_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    return `v_${Date.now().toString(36)}`;
  }
}

function captureUtm(search: string): Record<string, string> {
  const params = new URLSearchParams(search);
  const utm: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
    const val = params.get(key);
    if (val) utm[key] = val;
  }
  if (Object.keys(utm).length) {
    try {
      localStorage.setItem(UTM_KEY, JSON.stringify(utm));
    } catch {
      /* ignore */
    }
    return utm;
  }
  try {
    const raw = localStorage.getItem(UTM_KEY);
    if (raw) return JSON.parse(raw) as Record<string, string>;
  } catch {
    /* ignore */
  }
  return {};
}

export function getVisitorId(): string {
  return ensureVisitorId();
}

export function getStoredUtm(): Record<string, string> {
  try {
    const raw = localStorage.getItem(UTM_KEY);
    if (raw) return JSON.parse(raw) as Record<string, string>;
  } catch {
    /* ignore */
  }
  return {};
}

/** Tracks SPA pageviews into admin/.visits and ties contact/chat leads to the journey. */
export function VisitorTracker() {
  const location = useLocation();

  useEffect(() => {
    const visitorId = ensureVisitorId();
    const utm = captureUtm(location.search);
    const path = `${location.pathname}${location.search || ""}` || "/";
    const payload = {
      visitorId,
      path,
      title: typeof document !== "undefined" ? document.title : "",
      referrer: typeof document !== "undefined" ? document.referrer : "",
      utm,
    };
    const ctrl = new AbortController();
    const t = window.setTimeout(() => {
      fetch(`${base}admin/track-api.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
        keepalive: true,
      }).catch(() => {
        /* non-blocking */
      });
    }, 120);
    return () => {
      window.clearTimeout(t);
      ctrl.abort();
    };
  }, [location.pathname, location.search]);

  return null;
}
