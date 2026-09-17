import { useEffect, useState } from "react";

const HERO_NODES = [
  "Meta Ads",
  "Google Ads",
  "Website",
  "Google Business Profile",
  "Landing Page",
  "Qualified Lead",
  "WhatsApp / Call",
  "Sales Opportunity",
] as const;

/** Cinematic Digital Growth System — CSS-only, no fake metrics. */
export function GrowthHeroSystem() {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = window.setInterval(() => setPulse((p) => (p + 1) % HERO_NODES.length), 1400);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="ghs" aria-hidden>
      <div className="ghs__glow ghs__glow--a" />
      <div className="ghs__glow ghs__glow--b" />
      <div className="ghs__rail">
        {HERO_NODES.map((label, i) => (
          <div
            key={label}
            className={`ghs__node ${i === pulse ? "is-active" : ""} ${
              label === "Qualified Lead" ? "is-accent" : ""
            } ${label === "Sales Opportunity" ? "is-final" : ""}`}
          >
            <span className="ghs__dot" />
            <span>{label}</span>
          </div>
        ))}
        <div className="ghs__particle" style={{ ["--p" as string]: pulse }} />
      </div>
      <aside className={`ghs__toast ${pulse >= 5 ? "is-in" : ""}`}>
        <div className="ghs__toast-top">
          <span className="ghs__live" />
          New Qualified Lead
        </div>
        <p>
          <strong>Business:</strong> ABC Industries
        </p>
        <p>
          <strong>Requirement:</strong> Website + Google Ads
        </p>
        <p>
          <strong>Budget:</strong> ₹50K–₹1L
        </p>
        <small>Illustrative enquiry preview — not a live result.</small>
      </aside>
      <div className="ghs__panels">
        <div className="ghs__panel ghs__panel--ad">
          <span>Meta · Lead campaign</span>
          <div className="ghs__bars">
            <i />
            <i />
            <i />
          </div>
        </div>
        <div className="ghs__panel ghs__panel--web">
          <span className="ghs__browser">
            <b />
            <b />
            <b />
          </span>
          <div className="ghs__site">
            <em />
            <em />
            <em />
          </div>
        </div>
      </div>
    </div>
  );
}

export function GrowthOrbit() {
  const nodes = [
    { label: "Website", x: "12%", y: "22%" },
    { label: "Meta Ads", x: "72%", y: "18%" },
    { label: "Google Ads", x: "8%", y: "58%" },
    { label: "GBP", x: "78%", y: "55%" },
    { label: "Lead Generation", x: "38%", y: "78%" },
    { label: "E-commerce", x: "62%", y: "78%" },
    { label: "Management", x: "50%", y: "42%" },
  ];
  return (
    <div className="g-orbit" aria-hidden>
      <div className="g-orbit__core">DisplayAvenue</div>
      <svg className="g-orbit__lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M50 50 L18 28" />
        <path d="M50 50 L78 24" />
        <path d="M50 50 L14 62" />
        <path d="M50 50 L82 58" />
        <path d="M50 50 L42 82" />
        <path d="M50 50 L64 82" />
      </svg>
      {nodes.map((n) => (
        <div key={n.label} className="g-orbit__node" style={{ left: n.x, top: n.y }}>
          {n.label}
        </div>
      ))}
    </div>
  );
}

type ServiceId = string;

export function GrowthServiceVisual({ serviceId }: { serviceId: ServiceId }) {
  if (serviceId === "website-dev" || serviceId === "website-mgmt") {
    return (
      <div className="gsv gsv--browser" aria-hidden>
        <div className="gsv__chrome">
          <span />
          <span />
          <span />
          <em>displayavenue.com</em>
        </div>
        <div className="gsv__viewport">
          <div className="gsv__hero-block" />
          <div className="gsv__cols">
            <i />
            <i />
            <i />
          </div>
          <div className="gsv__cta-bar" />
          <div className="gsv__form-mock">
            <b />
            <b />
            <b />
          </div>
        </div>
        <div className="gsv__devices">
          <span className="is-d">Desktop</span>
          <span className="is-t">Tablet</span>
          <span className="is-m">Mobile</span>
        </div>
      </div>
    );
  }
  if (serviceId === "meta-ads") {
    return (
      <div className="gsv gsv--meta" aria-hidden>
        <div className="gsv__flow">
          {["Campaign", "Audience", "Creative", "Landing Page", "Lead"].map((s) => (
            <div key={s} className="gsv__flow-step">
              {s}
            </div>
          ))}
        </div>
        <div className="gsv__lead-pop">
          <strong>New enquiry</strong>
          <span>Illustrative lead notification</span>
        </div>
      </div>
    );
  }
  if (serviceId === "google-ads") {
    return (
      <div className="gsv gsv--search" aria-hidden>
        <div className="gsv__searchbox">digital marketing for manufacturers</div>
        <div className="gsv__serp">
          <span className="gsv__adtag">Sponsored</span>
          <strong>Your Business · Growth partner</strong>
          <p>Website · Google Ads · Lead systems managed in one place.</p>
        </div>
        <div className="gsv__click">Click → site → enquiry</div>
      </div>
    );
  }
  if (serviceId === "gbp") {
    return (
      <div className="gsv gsv--maps" aria-hidden>
        <div className="gsv__map">
          <span className="gsv__pin" />
        </div>
        <div className="gsv__profile">
          <strong>Your Google Business Profile</strong>
          <div className="gsv__actions">
            <em>Directions</em>
            <em>Call</em>
            <em>Website</em>
          </div>
          <p>Reviews area · Business info · Local presence</p>
          <small>Illustrative layout — no fabricated ratings.</small>
        </div>
      </div>
    );
  }
  if (serviceId === "ecommerce") {
    return (
      <div className="gsv gsv--ecom" aria-hidden>
        <div className="gsv__ecom-steps">
          {["Product", "Cart", "Checkout", "Order"].map((s) => (
            <div key={s}>{s}</div>
          ))}
        </div>
        <div className="gsv__products">
          <i />
          <i />
          <i />
        </div>
      </div>
    );
  }
  return (
    <div className="gsv gsv--funnel" aria-hidden>
      {["Traffic", "Visitors", "Landing Page", "Enquiry", "Qualification", "WhatsApp / Call", "Sales Opportunity"].map(
        (s) => (
          <div key={s} className="gsv__funnel-row">
            {s}
          </div>
        ),
      )}
    </div>
  );
}
