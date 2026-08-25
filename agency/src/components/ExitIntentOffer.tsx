import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import { cityFromPathAndSearch, whatsappWithText } from "../lib/geoContext";
import "./ExitIntentOffer.css";

const SESSION_KEY = "da_exit_intent_v1";

/**
 * Soft exit / dwell offer: free Strategy Maker + city WhatsApp.
 * Shows once per browser session; skipped on contact and card pages.
 */
export function ExitIntentOffer() {
  const { company } = useCms();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const city = useMemo(
    () => cityFromPathAndSearch(location.pathname, location.search),
    [location.pathname, location.search],
  );

  const skip =
    location.pathname.includes("/contact") ||
    location.pathname.includes("/card") ||
    location.pathname.startsWith("/admin");

  useEffect(() => {
    if (skip) return;
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") return;
    } catch {
      /* ignore */
    }

    let shown = false;
    const show = () => {
      if (shown) return;
      shown = true;
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      setOpen(true);
    };

    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 8) show();
    };
    const timer = window.setTimeout(show, 28000);

    document.addEventListener("mouseout", onLeave);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("mouseout", onLeave);
    };
  }, [skip, location.pathname]);

  if (!open) return null;

  const wa = whatsappWithText(
    company.whatsappHref,
    city
      ? `Hi DisplayAvenue, I was browsing the site — can I get a free plan for ${city}?`
      : "Hi DisplayAvenue, I was browsing the site — can I get a free growth plan?",
  );
  const contactTo = city
    ? `/contact?city=${encodeURIComponent(city)}`
    : "/contact";

  return (
    <div className="exit-offer" role="dialog" aria-modal="true" aria-labelledby="exit-offer-title">
      <button
        type="button"
        className="exit-offer__backdrop"
        aria-label="Close offer"
        onClick={() => setOpen(false)}
      />
      <div className="exit-offer__panel">
        <button type="button" className="exit-offer__close" onClick={() => setOpen(false)}>
          ×
        </button>
        <p className="exit-offer__eyebrow">Before you go</p>
        <h2 id="exit-offer-title" className="exit-offer__title">
          {city ? `Free growth plan for ${city}` : "Free growth plan in 2 minutes"}
        </h2>
        <p className="exit-offer__text">
          Use Strategy Maker, WhatsApp us, or leave your number — we reply in business hours with a
          plain next step.
        </p>
        <div className="exit-offer__actions">
          <a className="btn btn-primary" href="https://displayavenue.com/strategy/">
            Strategy Maker
          </a>
          <a className="btn btn-outline" href={wa} target="_blank" rel="noreferrer">
            WhatsApp{city ? ` · ${city}` : ""}
          </a>
          <Link className="btn btn-outline" to={contactTo} onClick={() => setOpen(false)}>
            Contact form
          </Link>
        </div>
      </div>
    </div>
  );
}
