import { useEffect, useRef } from "react";
import "./PreferredSources.css";

const SCRIPT_ID = "google-preferred-sources-publisher";
const SCRIPT_SRC = "https://news.google.com/swg/js/v1/publisher.js";
const DEEPLINK = "https://www.google.com/preferences/source?q=displayavenue.com";

type PreferredSourceApi = {
  init: (opts?: { lang?: string; theme?: string }) => void;
  addPreferredSource?: (opts?: { language?: string; theme?: string }) => void;
};

type PreferredSourceGlobal = {
  api?: PreferredSourceApi;
  ready?: () => Promise<PreferredSourceApi>;
  push?: (...fns: Array<(api: PreferredSourceApi) => void>) => void;
};

declare global {
  interface Window {
    PREFERRED_SOURCE?: PreferredSourceGlobal;
  }
}

function ensurePublisherScript(): Promise<void> {
  if (typeof document === "undefined") return Promise.resolve();
  if (window.PREFERRED_SOURCE?.api?.init) return Promise.resolve();

  const existing = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;
  if (existing) {
    return new Promise((resolve) => {
      if (window.PREFERRED_SOURCE?.api?.init) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      // Already-loaded script may not fire load again
      window.setTimeout(() => resolve(), 400);
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = SCRIPT_SRC;
    script.setAttribute("preferred-sources-control", "manual");
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Preferred Sources script"));
    document.head.appendChild(script);
  });
}

function initPreferredButtons(theme: "light" | "dark") {
  const api = window.PREFERRED_SOURCE;
  const run = (client: PreferredSourceApi) => {
    try {
      client.init({ theme, lang: "en" });
    } catch {
      /* ignore */
    }
  };

  if (api?.api?.init) {
    run(api.api);
    return;
  }
  if (api?.ready) {
    api.ready().then(run).catch(() => undefined);
    return;
  }
  if (api?.push) {
    api.push(run);
  }
}

type PreferredSourcesProps = {
  theme?: "light" | "dark";
  className?: string;
  /** Compact row for footer / sidebars */
  compact?: boolean;
};

/**
 * Google Preferred Sources button (Search Central).
 * Official embed + deeplink fallback:
 * https://developers.google.com/search/docs/appearance/preferred-sources
 */
export function PreferredSources({
  theme = "light",
  className = "",
  compact = false,
}: PreferredSourcesProps) {
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;

    el.setAttribute("google-add-preferred-source-btn", "");
    el.setAttribute("data-theme", theme);
    el.setAttribute("data-lang", "en");
    // Allow re-init after SPA remounts
    el.removeAttribute("data-initialized");

    let cancelled = false;
    ensurePublisherScript()
      .then(() => {
        if (cancelled) return;
        initPreferredButtons(theme);
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [theme]);

  return (
    <div className={`preferred-sources${compact ? " preferred-sources--compact" : ""} ${className}`.trim()}>
      {!compact ? (
        <div className="preferred-sources__copy">
          <p className="preferred-sources__kicker">Google Preferred Sources</p>
          <p className="preferred-sources__text">
            Prefer DisplayAvenue in Google Search, Top Stories, and AI results — one tap to add us
            as a preferred source.
          </p>
        </div>
      ) : (
        <p className="preferred-sources__compact-label">Prefer us on Google</p>
      )}
      <div ref={btnRef} className="preferred-sources__btn-wrap" />
      <a className="preferred-sources__fallback" href={DEEPLINK} target="_blank" rel="noreferrer">
        Add DisplayAvenue as a Preferred Source on Google
      </a>
    </div>
  );
}
