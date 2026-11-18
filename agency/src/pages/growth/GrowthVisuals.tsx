import { useEffect, useMemo, useState } from "react";

const HERO_NODES = [
  "Qualified Lead",
  "AI Platform Ads",
  "Meta Ads",
  "Google Ads",
  "Website",
  "Google Business Profile",
  "Landing Page",
  "WhatsApp / Call",
  "Sales Opportunity",
] as const;

/** Cinematic Digital Growth System — tappable steps on mobile. */
export function GrowthHeroSystem() {
  const [pulse, setPulse] = useState(0);
  const [pausedUntil, setPausedUntil] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = window.setInterval(() => {
      if (Date.now() < pausedUntil) return;
      setPulse((p) => (p + 1) % HERO_NODES.length);
    }, 1400);
    return () => window.clearInterval(id);
  }, [pausedUntil]);

  const selectStep = (index: number) => {
    setPulse(index);
    setPausedUntil(Date.now() + 8000);
  };

  const showToast =
    HERO_NODES[pulse] === "Qualified Lead" ||
    HERO_NODES[pulse] === "WhatsApp / Call" ||
    HERO_NODES[pulse] === "Sales Opportunity";

  return (
    <div className="ghs" aria-label="Digital growth system steps">
      <div className="ghs__glow ghs__glow--a" />
      <div className="ghs__glow ghs__glow--b" />
      <div className="ghs__rail" role="list">
        {HERO_NODES.map((label, i) => (
          <button
            key={label}
            type="button"
            role="listitem"
            className={`ghs__node ${i === pulse ? "is-active" : ""} ${
              label === "Qualified Lead" ? "is-accent" : ""
            } ${label === "Sales Opportunity" ? "is-final" : ""}`}
            aria-pressed={i === pulse}
            onClick={() => selectStep(i)}
          >
            <span className="ghs__dot" aria-hidden />
            <span>{label}</span>
          </button>
        ))}
        <div className="ghs__particle" style={{ ["--p" as string]: pulse }} aria-hidden />
      </div>
      <aside className={`ghs__toast ${showToast ? "is-in" : ""}`} aria-hidden>
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

/** Services shown in the DisplayAvenue hub diagram (matches growth offer). */
const ORBIT_SERVICES = [
  "Website",
  "Website Management",
  "Meta Ads",
  "Google Ads",
  "Google Business Profile",
  "Lead Generation",
  "Landing Pages",
  "E-commerce",
  "WhatsApp",
  "CRM & Follow-up",
  "SEO & Analytics",
  "Retargeting",
] as const;

type OrbitNode = {
  label: string;
  x: number;
  y: number;
  angle: number;
};

function buildOrbitNodes(labels: readonly string[]): OrbitNode[] {
  const cx = 50;
  const cy = 50;
  const rx = 36;
  const ry = 34;
  const n = labels.length;
  return labels.map((label, i) => {
    // Start at top, evenly spaced clockwise
    const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
    return {
      label,
      angle,
      x: cx + rx * Math.cos(angle),
      y: cy + ry * Math.sin(angle),
    };
  });
}

export function GrowthOrbit() {
  const nodes = useMemo(() => buildOrbitNodes(ORBIT_SERVICES), []);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const id = window.setInterval(
      () => setActive((i) => (i + 1) % ORBIT_SERVICES.length),
      1600,
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="g-orbit" aria-hidden>
      <div className="g-orbit__ring" />
      <div className="g-orbit__ring g-orbit__ring--inner" />
      <svg className="g-orbit__lines" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
        {nodes.map((n) => (
          <path
            key={`line-${n.label}`}
            className={n.label === ORBIT_SERVICES[active] ? "is-active" : ""}
            d={`M50 50 L${n.x.toFixed(2)} ${n.y.toFixed(2)}`}
          />
        ))}
        <circle cx="50" cy="50" r="1.2" fill="rgba(0,86,255,0.35)" />
      </svg>
      <div className="g-orbit__core">
        <span className="g-orbit__core-label">DisplayAvenue</span>
        <span className="g-orbit__core-sub">Growth System</span>
      </div>
      {nodes.map((n, i) => (
        <div
          key={n.label}
          className={`g-orbit__node${i === active ? " is-active" : ""}`}
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
        >
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
