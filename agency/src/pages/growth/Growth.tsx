import { useEffect, useMemo, useState, type RefObject } from "react";
import { Link } from "react-router-dom";
import { useCms } from "../../cms/CmsProvider";
import { SEO } from "../../components/SEO";
import { useReveal } from "../../hooks/useReveal";
import { GrowthForm } from "./GrowthForm";
import { growthFaqs, growthPricing, growthServices } from "./growthData";
import { captureGrowthAttribution } from "./growthAttribution";
import { trackCtaClick, trackGrowthEvent } from "./growthAnalytics";
import { GrowthHeroSystem, GrowthServiceVisual } from "./GrowthVisuals";

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

const howSteps = [
  {
    n: "01",
    title: "Tell us your goal",
    text: "Share industry, budget and what enquiries you want — calls, WhatsApp or visits.",
  },
  {
    n: "02",
    title: "Get a clear plan",
    text: "We map website, ads and Google Business Profile to that goal — in plain English.",
  },
  {
    n: "03",
    title: "Launch & improve",
    text: "We run the channels, track real enquiries and optimise weekly.",
  },
];

const fitFor = [
  "You want more qualified enquiries, not just traffic",
  "You can invest from ₹30,000/month in management (ad spend separate)",
  "You’re ready to start within 30 days",
  "You reply to leads on WhatsApp or phone",
];

const fitNot = [
  "Looking for the cheapest freelancers only",
  "Want guaranteed #1 rankings or overnight leads",
  "No offer, product or sales follow-up in place",
  "Just browsing with no timeline",
];

const CASE_IMAGES: Record<string, string> = {
  "vaidraj-seo": "/images/cases/vaidraj-seo.jpg",
  "bpg-ads": "/images/cases/bpg-ads.jpg",
  "royal-ecom": "/images/cases/royal-ecom.jpg",
  island360: "/images/cases/island360.jpg",
};

const CASE_IMAGE_FALLBACKS = [
  "/images/cases/vaidraj-seo.jpg",
  "/images/cases/bpg-ads.jpg",
  "/images/cases/royal-ecom.jpg",
  "/images/cases/island360.jpg",
];

/** Prefer reviews with distinct surnames so the social proof doesn’t look fake. */
function pickDiverseReviews<T extends { author: string; rating?: number; text: string }>(
  reviews: T[],
  limit = 6,
): T[] {
  const surname = (author: string) => {
    const parts = author.trim().split(/\s+/);
    return (parts[parts.length - 1] || author).toLowerCase();
  };
  const picked: T[] = [];
  const used = new Set<string>();
  for (const r of reviews) {
    const key = surname(r.author);
    if (used.has(key) && partsCount(r.author) > 1) continue;
    used.add(key);
    picked.push(r);
    if (picked.length >= limit) return picked;
  }
  for (const r of reviews) {
    if (picked.includes(r)) continue;
    picked.push(r);
    if (picked.length >= limit) break;
  }
  return picked;
}

function partsCount(author: string) {
  return author.trim().split(/\s+/).length;
}

export function Growth() {
  const { company, cases, googleReviews } = useCms();
  const revealRef = useReveal();
  const [cfg, setCfg] = useState<GrowthConfig>({});
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [planPref, setPlanPref] = useState("");
  const [expertOpen, setExpertOpen] = useState(false);
  const [activeService, setActiveService] = useState<string>(growthServices[0].id);
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
      googleReviews.syncSource === "places-api" ||
      googleReviews.syncSource === "gmb" ||
      googleReviews.syncSource === "manual-google" ||
      googleReviews.syncSource === "manual") &&
    googleReviews.reviews?.length > 0
      ? googleReviews.reviews
      : [];

  const displayReviews = useMemo(
    () => pickDiverseReviews(syncedReviews, 6),
    [syncedReviews],
  );

  const caseCards = useMemo(() => {
    return (cases || []).slice(0, 4).map((item, idx) => ({
      slug: item.slug,
      client: item.title?.split(" - ")[0] || item.title,
      industry: item.category || item.eyebrow || "Digital growth",
      challenge: item.summary || item.headline || "",
      href: `/case-studies/${item.slug}`,
      image:
        CASE_IMAGES[item.slug] ||
        CASE_IMAGE_FALLBACKS[idx % CASE_IMAGE_FALLBACKS.length],
    }));
  }, [cases]);

  const officeLines = cfg.officeAddressLines?.length
    ? cfg.officeAddressLines
    : ["Office No. 44, Shree Sharanam Chs, Kanakia Fire Station, D wing"];
  const activeSvc =
    growthServices.find((s) => s.id === activeService) || growthServices[0];
  const rating = googleReviews.rating || 4.9;
  const reviewCount = googleReviews.reviewCount || 172;

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
    cfg.seo?.title || "Get More Qualified Leads | DisplayAvenue Growth Plan";
  const seoDesc =
    cfg.seo?.description ||
    "Free growth plan for Indian businesses. Focused on WhatsApp enquiries and calls — not vanity clicks.";

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
              Paid traffic landing · Mumbai-based growth team
            </p>
            <h1 className="growth-hero__a2">
              Get more qualified leads — not empty clicks
            </h1>
            <p className="growth-hero__lead growth-hero__a3">
              DisplayAvenue builds the system behind enquiries: website + Meta/Google ads
              + Google Business Profile, tracked to WhatsApp and calls.
            </p>
            <ul className="growth-hero__proof growth-hero__a4">
              <li>
                <strong>{rating}★</strong> Google · {reviewCount} reviews
              </li>
              <li>
                <strong>₹30,000+</strong>/mo growth plans
              </li>
              <li>
                <strong>Free</strong> plan call
              </li>
            </ul>
            <div className="growth-hero__actions growth-hero__a5">
              <button
                type="button"
                className="growth-btn growth-btn--primary"
                onClick={() => scrollToForm("Get My Growth Plan", "hero")}
              >
                Get My Growth Plan <span className="growth-btn__arrow">→</span>
              </button>
              <a
                className="growth-btn growth-btn--ghost"
                href={company.whatsappHref}
                target="_blank"
                rel="noreferrer"
                onClick={() =>
                  trackGrowthEvent("whatsapp_click", { cta_location: "hero" })
                }
              >
                WhatsApp Us
              </a>
            </div>
            <p className="growth-trust-line growth-hero__a6">
              Reply in plain English · No hard sell · Ad spend billed separately
            </p>
          </div>
          <div className="growth-hero__visual growth-hero__a7">
            <GrowthHeroSystem />
          </div>
        </div>
      </section>

      <section className="growth-proofbar" aria-label="Trust signals">
        <div className="growth-wrap growth-proofbar__inner">
          <p>
            <strong>{rating} / 5</strong> on Google
          </p>
          <p>
            <strong>{reviewCount}+</strong> client reviews
          </p>
          <p>
            <strong>Website · Ads · GBP</strong> in one team
          </p>
          <p>
            <strong>Mira Road, Mumbai</strong> office
          </p>
        </div>
      </section>

      <section className="growth-section growth-section--soft" id="fit">
        <div className="growth-wrap growth-fit">
          <div className="reveal-up">
            <p className="growth-eyebrow">Qualify yourself</p>
            <h2>This page is for serious growth — not tyre-kickers</h2>
          </div>
          <div className="growth-fit__grid">
            <article className="growth-fit__card reveal-up">
              <h3>Best fit if</h3>
              <ul>
                {fitFor.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
            <article className="growth-fit__card growth-fit__card--muted reveal-up">
              <h3>Not a fit if</h3>
              <ul>
                {fitNot.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          </div>
          <div className="growth-fit__cta reveal-up">
            <button
              type="button"
              className="growth-btn growth-btn--primary"
              onClick={() => scrollToForm("I’m a Fit — Get Plan", "fit")}
            >
              I’m a Fit — Get Plan <span className="growth-btn__arrow">→</span>
            </button>
            <button
              type="button"
              className="growth-btn growth-btn--outline"
              onClick={() => talkToExpert("fit")}
            >
              Talk to an Expert
            </button>
          </div>
        </div>
      </section>

      <section className="growth-section growth-section--form">
        <div className="growth-wrap growth-wrap--form">
          <GrowthForm initialPlanId={planPref} />
        </div>
      </section>

      <section className="growth-section" id="how-it-works">
        <div className="growth-wrap">
          <div className="reveal-up">
            <p className="growth-eyebrow">Process</p>
            <h2>How it works</h2>
          </div>
          <ol className="growth-timeline growth-timeline--three">
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

      <section className="growth-section growth-section--soft" id="services">
        <div className="growth-wrap">
          <div className="reveal-up">
            <p className="growth-eyebrow">Services</p>
            <h2>One team for the channels that bring enquiries</h2>
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
                  {activeSvc.items.slice(0, 6).map((item) => (
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

      <section className="growth-section growth-section--dark-cases" id="cases">
        <div className="growth-wrap">
          <div className="reveal-up">
            <p className="growth-eyebrow light">Proof</p>
            <h2>Real businesses. Real engagements.</h2>
            <p className="growth-lede light">
              Results vary by offer and market. We show work from our library — not invented
              screenshots.
            </p>
          </div>
          <div className="growth-editorial">
            {caseCards.map((c, idx) => (
              <article
                key={c.slug}
                className={`growth-editorial__row ${idx % 2 ? "is-flip" : ""} reveal-up`}
              >
                <Link to={c.href} className="growth-editorial__media">
                  <img src={c.image} alt={`${c.client} case study`} loading="lazy" />
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

      <section className="growth-section growth-section--soft" id="reviews">
        <div className="growth-wrap">
          <div className="reveal-up">
            <p className="growth-eyebrow">Google reviews</p>
            <h2>What customers say</h2>
            <p className="growth-lede">
              {rating}★ average from {reviewCount}+ Google reviews for Display Avenue.
            </p>
          </div>
          {displayReviews.length > 0 ? (
            <div className="growth-reviews">
              {displayReviews.map((r) => (
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
              <p>Google reviews load from our Business Profile sync.</p>
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
            <h2>Plans from ₹30,000/month</h2>
            <p className="growth-lede">
              Management fees below. Advertising spend and tools are separate unless we
              say otherwise.
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
            Final scope is confirmed before onboarding. These are package examples — not
            unlimited work.
          </p>
        </div>
      </section>

      <section className="growth-section growth-section--cta-band">
        <div className="growth-wrap reveal-up">
          <h2>Ready for more qualified enquiries?</h2>
          <p>
            Share your business details. We’ll reply with a clear next step on WhatsApp.
          </p>
          <button
            type="button"
            className="growth-btn growth-btn--primary"
            onClick={() => scrollToForm("Get My Growth Plan", "mid_cta")}
          >
            Get My Growth Plan <span className="growth-btn__arrow">→</span>
          </button>
        </div>
      </section>

      <section className="growth-section growth-section--soft" id="growth-office">
        <div className="growth-wrap growth-office">
          <div className="reveal-up">
            <p className="growth-eyebrow">Visit / call</p>
            <h2>Talk to DisplayAvenue</h2>
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
            <div className="growth-office__actions">
              <a
                className="growth-btn growth-btn--outline"
                href={company.phoneHref}
                onClick={() => trackGrowthEvent("phone_click", { cta_location: "office" })}
              >
                Call {company.phone}
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
          <h2 className="reveal-up">Frequently asked questions</h2>
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
        <div
          className="growth-sheet"
          role="dialog"
          aria-modal="true"
          aria-label="Talk to an expert"
        >
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
