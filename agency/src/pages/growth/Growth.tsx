import { useEffect, useMemo, useState, type RefObject } from "react";
import { Link } from "react-router-dom";
import { useCms } from "../../cms/CmsProvider";
import { SEO } from "../../components/SEO";
import { useReveal } from "../../hooks/useReveal";
import { GrowthForm } from "./GrowthForm";
import {
  growthFaqs,
  growthPricing,
  growthServices,
} from "./growthData";
import { captureGrowthAttribution } from "./growthAttribution";
import { trackCtaClick, trackGrowthEvent } from "./growthAnalytics";
import { GrowthHeroSystem, GrowthOrbit, GrowthServiceVisual } from "./GrowthVisuals";

type GrowthConfig = {
  parentBrand?: string;
  googlePlaceId?: string;
  googleReviewsUrl?: string;
  officeAddressLines?: string[];
  officeCity?: string;
  officeHours?: string;
  bookingUrl?: string;
  seo?: { title?: string; description?: string };
};

const problems = [
  {
    title: "Wrong Audience",
    text: "Ads reach people who aren’t ready to buy.",
  },
  {
    title: "Weak Offer",
    text: "People see your business but don’t understand why they should enquire.",
  },
  {
    title: "Poor Website Experience",
    text: "Traffic arrives but visitors don’t convert.",
  },
  {
    title: "No Qualification",
    text: "You receive enquiries that aren’t relevant to your business.",
  },
  {
    title: "Poor Tracking",
    text: "You don’t know which channel is actually generating opportunities.",
  },
];

const howSteps = [
  {
    n: "01",
    title: "Understand",
    text: "We understand your business, market and goals.",
  },
  {
    n: "02",
    title: "Plan",
    text: "We build the digital growth strategy.",
  },
  {
    n: "03",
    title: "Build",
    text: "We create or improve the website and conversion system.",
  },
  {
    n: "04",
    title: "Market",
    text: "We run and manage the relevant acquisition channels.",
  },
  {
    n: "05",
    title: "Optimize",
    text: "We measure, learn and improve.",
  },
];

const funnelStages = [
  {
    n: "01",
    title: "Attract",
    items: ["Meta Ads", "Google Ads", "GBP"],
  },
  {
    n: "02",
    title: "Engage",
    items: ["Website", "Landing Page", "Content"],
  },
  {
    n: "03",
    title: "Capture",
    items: ["Forms", "WhatsApp", "Calls"],
  },
  {
    n: "04",
    title: "Qualify",
    items: ["Business", "Budget", "Requirement", "Timeline"],
  },
  {
    n: "05",
    title: "Follow Up",
    items: ["CRM", "WhatsApp", "Sales"],
  },
  {
    n: "06",
    title: "Convert",
    items: ["Opportunity", "Proposal", "Customer"],
  },
];

const CASE_IMAGES = [
  "/images/hero-agency-india.jpg",
  "/images/hero-agency.jpg",
  "/images/hero-agency-alt.jpg",
  "/images/hero-india.jpg",
];

export function Growth() {
  const { company, content, cases, googleReviews } = useCms();
  const revealRef = useReveal();
  const [cfg, setCfg] = useState<GrowthConfig>({});
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [planPref, setPlanPref] = useState("");
  const [expertOpen, setExpertOpen] = useState(false);
  const [activeService, setActiveService] = useState<string>(growthServices[0].id);
  const [activeProblem, setActiveProblem] = useState(0);
  const [heroIn, setHeroIn] = useState(false);

  useEffect(() => {
    captureGrowthAttribution();
    trackGrowthEvent("page_view", { landing_page: "/growth" });
    trackGrowthEvent("view_content", { content_name: "growth_landing" });
    const t = window.setTimeout(() => setHeroIn(true), 40);
    const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
    fetch(`${base}content/growth.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (json && typeof json === "object") setCfg(json as GrowthConfig);
      })
      .catch(() => undefined);

    const faqId = "growth-faq-jsonld";
    if (!document.getElementById(faqId)) {
      const script = document.createElement("script");
      script.id = faqId;
      script.type = "application/ld+json";
      script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: growthFaqs.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      });
      document.head.appendChild(script);
    }
    return () => {
      window.clearTimeout(t);
      document.getElementById(faqId)?.remove();
    };
  }, []);

  const reviewsUrl =
    cfg.googleReviewsUrl ||
    googleReviews.profileUrl ||
    company.googleMaps?.profileUrl ||
    "";

  const syncedReviews =
    Boolean(googleReviews.lastSyncedAt) &&
    (googleReviews.syncSource === "google" ||
      googleReviews.syncSource === "places" ||
      googleReviews.syncSource === "gmb") &&
    googleReviews.reviews?.length > 0
      ? googleReviews.reviews
      : [];

  const testimonials = content.testimonials || [];

  const caseCards = useMemo(() => {
    return (cases || []).slice(0, 4).map((item, idx) => ({
      slug: item.slug,
      client: item.title?.split(" - ")[0] || item.title,
      industry: item.category || item.eyebrow || "Digital growth",
      challenge: item.summary || item.headline || "",
      href: `/case-studies/${item.slug}`,
      image: CASE_IMAGES[idx % CASE_IMAGES.length],
    }));
  }, [cases]);

  const officeLines = cfg.officeAddressLines?.length
    ? cfg.officeAddressLines
    : ["[INSERT VERIFIED DISPLAYAVENUE OFFICE ADDRESS HERE]"];
  const officePlaceholder = officeLines.some((l) => l.includes("[INSERT VERIFIED"));
  const activeSvc =
    growthServices.find((s) => s.id === activeService) || growthServices[0];

  const scrollToForm = (cta_text: string, cta_location: string, planId = "") => {
    if (planId) setPlanPref(planId);
    const { last } = captureGrowthAttribution();
    trackCtaClick({
      cta_text,
      cta_location,
      utm_source: last.utm_source,
      utm_campaign: last.utm_campaign,
    });
    document.getElementById("growth-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const talkToExpert = (cta_location: string) => {
    const { last } = captureGrowthAttribution();
    trackCtaClick({
      cta_text: "Talk to an Expert",
      cta_location,
      utm_source: last.utm_source,
      utm_campaign: last.utm_campaign,
    });
    if (window.matchMedia("(max-width: 768px)").matches) {
      setExpertOpen(true);
      return;
    }
    document.getElementById("growth-office")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const seoTitle =
    cfg.seo?.title || "Generate More Qualified Leads | DisplayAvenue";
  const seoDesc =
    cfg.seo?.description ||
    "DisplayAvenue helps businesses generate and manage qualified leads through websites, Meta Ads, Google Ads, Google Business Profile and e-commerce solutions.";

  return (
    <div
      className={`growth-page ${heroIn ? "is-hero-in" : ""}`}
      ref={revealRef as RefObject<HTMLDivElement>}
    >
      <SEO
        title={seoTitle}
        description={seoDesc}
        path="/growth"
        image="/images/hero-agency-india.jpg"
      />

      <section className="growth-hero">
        <div className="growth-hero__bg" aria-hidden />
        <div className="growth-wrap growth-hero__grid">
          <div className="growth-hero__copy">
            <p className="growth-eyebrow growth-hero__a1">
              Digital Lead Generation for Businesses
            </p>
            <h1 className="growth-hero__a2">
              Get More Qualified Leads for Your Business
            </h1>
            <p className="growth-hero__lead growth-hero__a3">
              We build and manage the digital system behind your growth — from websites
              and Google Business Profile to Meta Ads, Google Ads, lead generation and
              e-commerce.
            </p>
            <div className="growth-badge growth-hero__a4">
              Growth Plans Starting at ₹30,000/Month
            </div>
            <div className="growth-hero__actions growth-hero__a5">
              <button
                type="button"
                className="growth-btn growth-btn--primary"
                onClick={() => scrollToForm("Get My Growth Plan", "hero")}
              >
                Get My Growth Plan <span className="growth-btn__arrow">→</span>
              </button>
              <button
                type="button"
                className="growth-btn growth-btn--ghost"
                onClick={() => talkToExpert("hero")}
              >
                Talk to an Expert
              </button>
            </div>
            <p className="growth-trust-line growth-hero__a6">
              Strategy · Execution · Tracking · Optimization
            </p>
          </div>
          <div className="growth-hero__visual growth-hero__a7">
            <GrowthHeroSystem />
          </div>
        </div>
      </section>

      <section className="growth-section growth-section--ink">
        <div className="growth-wrap growth-problem">
          <div className="reveal-up">
            <p className="growth-eyebrow light">The real problem</p>
            <h2>More Traffic Doesn’t Always Mean More Business.</h2>
            <p className="growth-lede light">
              Clicks are easy to chase. Qualified enquiries are harder.
            </p>
          </div>
          <div className="growth-problem__stage">
            <div className="growth-problem__list" role="tablist">
              {problems.map((p, idx) => (
                <button
                  key={p.title}
                  type="button"
                  role="tab"
                  aria-selected={activeProblem === idx}
                  className={`growth-problem__item ${activeProblem === idx ? "is-active" : ""}`}
                  onMouseEnter={() => setActiveProblem(idx)}
                  onFocus={() => setActiveProblem(idx)}
                  onClick={() => setActiveProblem(idx)}
                >
                  <span>0{idx + 1}</span>
                  <strong>{p.title}</strong>
                </button>
              ))}
            </div>
            <div className="growth-problem__panel reveal-right" role="tabpanel">
              <p className="growth-problem__title">{problems[activeProblem].title}</p>
              <p>{problems[activeProblem].text}</p>
              <div className="growth-problem__viz" data-idx={activeProblem} />
            </div>
          </div>
          <p className="growth-bridge reveal-up">
            DisplayAvenue connects these elements into one measurable digital growth
            system.
          </p>
        </div>
      </section>

      <section className="growth-section growth-section--soft" id="system">
        <div className="growth-wrap growth-system">
          <div className="reveal-up">
            <p className="growth-eyebrow">Digital growth system</p>
            <h2>One Team. Your Entire Digital Growth System.</h2>
            <p className="growth-lede">
              Instead of coordinating multiple agencies and freelancers, work with one
              digital growth team across your website, advertising, Google presence, lead
              generation and e-commerce operations.
            </p>
          </div>
          <div className="reveal-scale">
            <GrowthOrbit />
          </div>
        </div>
      </section>

      <section className="growth-section" id="services">
        <div className="growth-wrap">
          <div className="reveal-up">
            <p className="growth-eyebrow">Services</p>
            <h2>One System. Multiple Digital Growth Channels.</h2>
            <p className="growth-lede">
              One Digital Growth Partner for Your Website, Marketing, Leads & E-commerce.
            </p>
          </div>
          <div className="growth-showcase">
            <div className="growth-showcase__nav" role="tablist">
              {growthServices.map((svc) => (
                <button
                  key={svc.id}
                  type="button"
                  role="tab"
                  aria-selected={activeService === svc.id}
                  className={activeService === svc.id ? "is-active" : ""}
                  onClick={() => setActiveService(svc.id)}
                >
                  {svc.title}
                </button>
              ))}
            </div>
            <div className="growth-showcase__panel" role="tabpanel">
              <div className="growth-showcase__copy">
                <h3>{activeSvc.title}</h3>
                <p className="growth-showcase__sub">{activeSvc.subtitle}</p>
                <ul>
                  {activeSvc.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {activeSvc.note && <p className="growth-showcase__note">{activeSvc.note}</p>}
                <button
                  type="button"
                  className="growth-btn growth-btn--primary"
                  onClick={() => scrollToForm(activeSvc.cta, `service_${activeSvc.id}`)}
                >
                  {activeSvc.cta} <span className="growth-btn__arrow">→</span>
                </button>
              </div>
              <GrowthServiceVisual serviceId={activeSvc.id} />
            </div>
          </div>
        </div>
      </section>

      <section className="growth-section growth-section--ink" id="funnel">
        <div className="growth-wrap">
          <div className="reveal-up">
            <p className="growth-eyebrow light">Conversion path</p>
            <h2>From Attention to Opportunity.</h2>
            <p className="growth-lede light">
              We connect the pieces of your digital marketing system so your business can
              turn attention into qualified enquiries. We do not guarantee conversion.
            </p>
          </div>
          <div className="growth-cinematic-funnel">
            {funnelStages.map((stage, idx) => (
              <article
                key={stage.n}
                className={`growth-cinematic-funnel__stage reveal-up reveal-delay-${Math.min(idx + 1, 5)}`}
              >
                <span>{stage.n}</span>
                <h3>{stage.title}</h3>
                <p>{stage.items.join(" · ")}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="growth-section growth-section--soft" id="how-it-works">
        <div className="growth-wrap">
          <div className="reveal-up">
            <p className="growth-eyebrow">Process</p>
            <h2>How It Works</h2>
          </div>
          <ol className="growth-timeline">
            {howSteps.map((s, idx) => (
              <li
                key={s.n}
                className={`reveal-up reveal-delay-${Math.min(idx + 1, 5)}`}
              >
                <span>{s.n}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="growth-section growth-section--dark-cases" id="cases">
        <div className="growth-wrap">
          <div className="reveal-up">
            <p className="growth-eyebrow light">Case studies</p>
            <h2>Real Work. Real Businesses.</h2>
            <p className="growth-lede light">
              Selected DisplayAvenue engagements. Results vary by market, offer and
              execution — we only show qualitative descriptions from our existing
              library.
            </p>
          </div>
          <div className="growth-editorial">
            {caseCards.map((c, idx) => (
              <article
                key={c.slug}
                className={`growth-editorial__row ${idx % 2 ? "is-flip" : ""} reveal-up`}
              >
                <Link to={c.href} className="growth-editorial__media">
                  <img src={c.image} alt="" loading="lazy" />
                </Link>
                <div className="growth-editorial__copy">
                  <p className="growth-editorial__tag">{c.industry}</p>
                  <h3>{c.client}</h3>
                  <p>{c.challenge}</p>
                  <Link to={c.href}>View case study →</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="growth-section" id="testimonials">
        <div className="growth-wrap">
          <div className="reveal-up">
            <p className="growth-eyebrow">Customers</p>
            <h2>Happy Customers. Real Experiences.</h2>
          </div>
          {testimonials.length > 0 ? (
            <div className="growth-quote-rail" tabIndex={0}>
              {testimonials.map((t) => (
                <article key={t.name} className="growth-quote">
                  <p className="growth-quote__mark">“</p>
                  <p className="growth-quote__text">{t.quote}</p>
                  <strong>{t.name}</strong>
                  <span>{t.title}</span>
                </article>
              ))}
            </div>
          ) : (
            <div className="growth-placeholder-box">
              <p>
                Testimonials will appear here when verified customer quotes are available
                in CMS content.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="growth-section growth-section--soft" id="reviews">
        <div className="growth-wrap">
          <div className="reveal-up">
            <p className="growth-eyebrow">Google</p>
            <h2>What Our Customers Say</h2>
            <p className="growth-lede">
              Real feedback from businesses that have worked with DisplayAvenue.
            </p>
          </div>
          {syncedReviews.length > 0 ? (
            <div className="growth-reviews">
              {syncedReviews.slice(0, 6).map((r) => (
                <article key={`${r.author}-${r.relativeTime}`} className="growth-review">
                  <div className="growth-review__top">
                    <span className="growth-review__g">G</span>
                    <div>
                      <strong>{r.author}</strong>
                      <div className="growth-stars">
                        {"★".repeat(Math.max(0, Math.min(5, r.rating || 5)))}
                      </div>
                      <small>{r.relativeTime}</small>
                    </div>
                  </div>
                  <p>{r.text}</p>
                  <span className="growth-review__tag">Google Review</span>
                </article>
              ))}
            </div>
          ) : (
            <div className="growth-placeholder-box">
              <p>
                Google reviews will appear here after a verified Google Business Profile
                sync. Configure <code>googlePlaceId</code> in <code>content/growth.json</code>{" "}
                and run Places sync from admin. We do not display invented reviews.
              </p>
            </div>
          )}
          {reviewsUrl && (
            <a
              className="growth-btn growth-btn--outline"
              href={reviewsUrl}
              target="_blank"
              rel="noreferrer"
            >
              View All Google Reviews →
            </a>
          )}
        </div>
      </section>

      <section className="growth-section growth-section--pricing" id="pricing">
        <div className="growth-wrap">
          <div className="reveal-up">
            <p className="growth-eyebrow">Investment</p>
            <h2>Digital Growth Plans Starting at ₹30,000/Month</h2>
            <p className="growth-lede">
              Choose the level of digital support your business needs. Advertising spend
              and third-party costs are separate unless specifically included.
            </p>
          </div>
          <div className="growth-pricing">
            {growthPricing.map((plan) => (
              <article
                key={plan.id}
                className={`growth-price ${plan.featured ? "is-featured" : ""} reveal-up`}
              >
                <h3>{plan.name}</h3>
                <div className="growth-price__amount">
                  <strong>{plan.price}</strong>
                  <span>{plan.period}</span>
                </div>
                <p>{plan.position}</p>
                <ul>
                  {plan.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="growth-btn growth-btn--primary"
                  onClick={() => scrollToForm(plan.cta, `pricing_${plan.id}`, plan.id)}
                >
                  {plan.cta} <span className="growth-btn__arrow">→</span>
                </button>
              </article>
            ))}
          </div>
          <p className="growth-price-note">
            Ad spend is separate. Final scope and deliverables are confirmed before
            onboarding. These are package examples — not unlimited work.
          </p>
        </div>
      </section>

      <section className="growth-section growth-section--cta-band">
        <div className="growth-wrap reveal-up">
          <h2>Serious About Growing Your Business?</h2>
          <p>
            Our digital growth engagements start at ₹30,000/month. Tell us about your
            business and we’ll understand what you need.
          </p>
          <button
            type="button"
            className="growth-btn growth-btn--primary"
            onClick={() => scrollToForm("Check My Fit", "qualification_banner")}
          >
            Check My Fit <span className="growth-btn__arrow">→</span>
          </button>
        </div>
      </section>

      <section className="growth-section growth-section--form">
        <div className="growth-wrap growth-wrap--form">
          <GrowthForm initialPlanId={planPref} />
        </div>
      </section>

      <section className="growth-section growth-section--soft" id="growth-office">
        <div className="growth-wrap growth-office">
          <div className="reveal-up">
            <p className="growth-eyebrow">Visit</p>
            <h2>Meet Your Digital Growth Partner</h2>
            <p>
              Have questions about your digital growth strategy? Speak with our team or
              visit our office.
            </p>
            <p>
              <strong>DisplayAvenue</strong>
              <br />
              {cfg.parentBrand || "Mediashouter Group"}
            </p>
            <address>
              {officeLines.map((line) => (
                <div key={line}>{line}</div>
              ))}
              <div>{cfg.officeCity || company.address?.city || "Mumbai, Maharashtra, India"}</div>
              <div>{cfg.officeHours || company.address?.hours}</div>
            </address>
            {officePlaceholder && (
              <p className="growth-config-note">
                Office street address is a configuration placeholder in{" "}
                <code>content/growth.json</code>.
              </p>
            )}
            <div className="growth-office__actions">
              <a
                className="growth-btn growth-btn--outline"
                href={company.googleMaps?.shareUrl || reviewsUrl}
                target="_blank"
                rel="noreferrer"
              >
                Get Directions
              </a>
              <a
                className="growth-btn growth-btn--outline"
                href={company.phoneHref}
                onClick={() => trackGrowthEvent("phone_click", { cta_location: "office" })}
              >
                Call Us
              </a>
              <a
                className="growth-btn growth-btn--primary"
                href={company.whatsappHref}
                target="_blank"
                rel="noreferrer"
                onClick={() =>
                  trackGrowthEvent("whatsapp_click", { cta_location: "office" })
                }
              >
                WhatsApp Us →
              </a>
            </div>
          </div>
          <div className="growth-office__map reveal-right">
            <iframe
              title="DisplayAvenue location"
              src={
                company.googleMaps?.embedUrl ||
                "https://maps.google.com/maps?q=Display+Avenue+Mumbai&hl=en&z=15&output=embed"
              }
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      <section className="growth-section">
        <div className="growth-wrap growth-wrap--narrow">
          <h2 className="reveal-up">Frequently Asked Questions</h2>
          <div className="growth-faq">
            {growthFaqs.map((item, idx) => {
              const open = openFaq === idx;
              return (
                <div key={item.q} className={`growth-faq__item ${open ? "is-open" : ""}`}>
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenFaq(open ? null : idx)}
                  >
                    {item.q}
                    <span aria-hidden>{open ? "−" : "+"}</span>
                  </button>
                  {open && <p>{item.a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {expertOpen && (
        <div className="growth-sheet" role="dialog" aria-modal="true" aria-label="Talk to an expert">
          <div className="growth-sheet__panel">
            <button
              type="button"
              className="growth-sheet__close"
              onClick={() => setExpertOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h3>Talk to an Expert</h3>
            <p>Choose how you’d like to connect.</p>
            <a
              className="growth-btn growth-btn--primary"
              href={company.phoneHref}
              onClick={() => trackGrowthEvent("phone_click", { cta_location: "expert_sheet" })}
            >
              Call {company.phone}
            </a>
            <a
              className="growth-btn growth-btn--outline"
              href={company.whatsappHref}
              target="_blank"
              rel="noreferrer"
              onClick={() =>
                trackGrowthEvent("whatsapp_click", { cta_location: "expert_sheet" })
              }
            >
              WhatsApp
            </a>
            <button
              type="button"
              className="growth-btn growth-btn--outline"
              onClick={() => {
                setExpertOpen(false);
                scrollToForm("Get My Growth Plan", "expert_sheet");
              }}
            >
              Get My Growth Plan →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
