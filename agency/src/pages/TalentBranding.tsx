import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import "./TalentBranding.css";

const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");

type Plan = {
  id: string;
  name: string;
  price: string;
  period: string;
  badge?: string;
  summary: string;
  includes: string[];
  bestFor: string;
};

type CaseStudy = {
  id: string;
  name: string;
  role: string;
  from: string;
  to: string;
  focus: string;
  story: string;
  metrics: { label: string; value: string }[];
};

type TalentCms = {
  enabled?: boolean;
  seo?: { title?: string; description?: string };
  hero: {
    badge: string;
    title: string;
    lead: string;
    primaryCta: string;
    primaryHref: string;
    secondaryCta: string;
    secondaryHref: string;
  };
  whoFor: { title: string; text: string }[];
  howWeWork: { step: string; title: string; text: string }[];
  resultsPromise: { label: string; text: string }[];
  plans: Plan[];
  caseStudies: CaseStudy[];
  examples: { title: string; points: string[] }[];
  faq: { q: string; a: string }[];
  closing: { title: string; text: string; cta: string; ctaHref: string };
};

const fallback: TalentCms = {
  hero: {
    badge: "For models · actresses · female creators",
    title: "Personal branding that gets you castings and brand deals",
    lead: "Social growth systems for Indian talent.",
    primaryCta: "Book a call",
    primaryHref: "/contact",
    secondaryCta: "WhatsApp",
    secondaryHref: "https://wa.me/919222122333",
  },
  whoFor: [],
  howWeWork: [],
  resultsPromise: [],
  plans: [],
  caseStudies: [],
  examples: [],
  faq: [],
  closing: {
    title: "Let’s build your brand",
    text: "",
    cta: "WhatsApp",
    ctaHref: "https://wa.me/919222122333",
  },
};

function CtaLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  if (href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a className={className} href={href} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link className={className} to={href}>
      {children}
    </Link>
  );
}

export function TalentBranding() {
  const [data, setData] = useState<TalentCms>(fallback);

  useEffect(() => {
    let cancelled = false;
    fetch(`${base}content/talent-branding.json`, { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => {
        if (!cancelled && json) setData({ ...fallback, ...json });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  const d = data;

  return (
    <div className="tb-page">
      <SEO
        title={d.seo?.title || "Personal Branding for Models & Actresses | DisplayAvenue"}
        description={
          d.seo?.description ||
          "Social media plans for models and actresses — Organic ₹18,000, Ads ₹35,000, Ads + PR ₹50,000."
        }
        path="/talent-branding"
      />

      <section className="tb-hero">
        <div className="tb-wrap">
          <p className="tb-eyebrow">{d.hero.badge}</p>
          <h1>{d.hero.title}</h1>
          <p className="tb-lead">{d.hero.lead}</p>
          <div className="tb-actions">
            <CtaLink href={d.hero.primaryHref} className="tb-btn tb-btn--solid">
              {d.hero.primaryCta}
            </CtaLink>
            <CtaLink href={d.hero.secondaryHref} className="tb-btn tb-btn--ghost">
              {d.hero.secondaryCta}
            </CtaLink>
          </div>
        </div>
      </section>

      <section className="tb-section">
        <div className="tb-wrap">
          <h2>Who this is for</h2>
          <div className="tb-grid-3">
            {d.whoFor.map((item) => (
              <article key={item.title} className="tb-panel">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="tb-section tb-section--tint">
        <div className="tb-wrap">
          <h2>How DisplayAvenue works with talent</h2>
          <p className="tb-sub">Show this to your client — this is the operating system behind the results.</p>
          <ol className="tb-steps">
            {d.howWeWork.map((s) => (
              <li key={s.step}>
                <span>{s.step}</span>
                <div>
                  <strong>{s.title}</strong>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="tb-section">
        <div className="tb-wrap">
          <h2>What you get</h2>
          <div className="tb-grid-2">
            {d.resultsPromise.map((r) => (
              <article key={r.label} className="tb-panel">
                <h3>{r.label}</h3>
                <p>{r.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="tb-section tb-section--dark" id="plans">
        <div className="tb-wrap">
          <h2>Social media plans</h2>
          <p className="tb-sub">Monthly retainers for personal branding. Ad/PR media budgets are separate where noted.</p>
          <div className="tb-plans">
            {d.plans.map((plan) => (
              <article key={plan.id} className={`tb-plan ${plan.id === "ads" ? "is-featured" : ""}`}>
                {plan.badge && <p className="tb-plan__badge">{plan.badge}</p>}
                <h3>{plan.name}</h3>
                <p className="tb-plan__price">
                  {plan.price}
                  <small>{plan.period}</small>
                </p>
                <p className="tb-plan__summary">{plan.summary}</p>
                <ul>
                  {plan.includes.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className="tb-plan__best">
                  <strong>Best for:</strong> {plan.bestFor}
                </p>
                <CtaLink
                  href={`https://wa.me/919222122333?text=${encodeURIComponent(`Hi DisplayAvenue, I'm interested in the ${plan.name} plan (${plan.price}/month) for talent branding.`)}`}
                  className="tb-btn tb-btn--solid tb-btn--block"
                >
                  Choose {plan.price}
                </CtaLink>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="tb-section" id="case-studies">
        <div className="tb-wrap">
          <h2>Indian growth stories (0 → good)</h2>
          <p className="tb-sub">
            Composite client-style examples based on typical DisplayAvenue talent journeys in India — use these to explain outcomes.
          </p>
          <div className="tb-cases">
            {d.caseStudies.map((cs) => (
              <article key={cs.id} className="tb-case">
                <header>
                  <div>
                    <h3>{cs.name}</h3>
                    <p>{cs.role}</p>
                  </div>
                  <span>{cs.focus}</span>
                </header>
                <div className="tb-case__path">
                  <div>
                    <strong>From</strong>
                    <p>{cs.from}</p>
                  </div>
                  <div>
                    <strong>To</strong>
                    <p>{cs.to}</p>
                  </div>
                </div>
                <p className="tb-case__story">{cs.story}</p>
                <div className="tb-metrics">
                  {cs.metrics.map((m) => (
                    <div key={m.label}>
                      <strong>{m.value}</strong>
                      <span>{m.label}</span>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="tb-section tb-section--tint">
        <div className="tb-wrap">
          <h2>Live examples · how growth works</h2>
          <div className="tb-grid-2">
            {d.examples.map((ex) => (
              <article key={ex.title} className="tb-panel">
                <h3>{ex.title}</h3>
                <ul className="tb-bullets">
                  {ex.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="tb-section">
        <div className="tb-wrap">
          <h2>FAQ</h2>
          <div className="tb-faq">
            {d.faq.map((item) => (
              <details key={item.q}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="tb-closing">
        <div className="tb-wrap">
          <h2>{d.closing.title}</h2>
          <p>{d.closing.text}</p>
          <CtaLink href={d.closing.ctaHref} className="tb-btn tb-btn--solid">
            {d.closing.cta}
          </CtaLink>
        </div>
      </section>
    </div>
  );
}
