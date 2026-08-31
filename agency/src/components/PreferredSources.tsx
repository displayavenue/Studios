import { useEffect, useRef } from "react";
import "./PreferredSources.css";

const SCRIPT_ID = "google-preferred-sources-publisher";
const SCRIPT_SRC = "https://news.google.com/swg/js/v1/publisher.js";
const DEEPLINK = "https://www.google.com/preferences/source?q=displayavenue.com";

function ensurePublisherScript() {
  if (typeof document === "undefined") return;
  if (document.getElementById(SCRIPT_ID)) return;
  if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;
  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.async = true;
  script.src = SCRIPT_SRC;
  document.head.appendChild(script);
}

type PreferredSourcesProps = {
  theme?: "light" | "dark";
  className?: string;
  /** Compact row for footer / sidebars */
  compact?: boolean;
};

/**
 * Google Preferred Sources button (Search Central).
 * Official embed + deeplink fallback: https://developers.google.com/search/docs/appearance/preferred-sources
 */
export function PreferredSources({
  theme = "light",
  className = "",
  compact = false,
}: PreferredSourcesProps) {
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = btnRef.current;
    if (el) {
      el.setAttribute("google-add-preferred-source-btn", "");
      el.setAttribute("data-theme", theme);
      el.setAttribute("data-lang", "en");
    }
    ensurePublisherScript();
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
