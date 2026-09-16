import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCms } from "../../cms/CmsProvider";
import { SEO } from "../../components/SEO";
import { Icon } from "../../components/Icon";
import { GrowthForm } from "./GrowthForm";
import {
  growthFaqs,
  growthPricing,
  growthServices,
} from "./growthData";
import { captureGrowthAttribution } from "./growthAttribution";
import { trackCtaClick, trackGrowthEvent } from "./growthAnalytics";

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

const problemCards = [
  {
    title: "Wrong Audience",
    text: "Your advertising may reach people who aren’t the right customers.",
  },
  {
    title: "Weak Offer",
    text: "Visitors don’t immediately understand why they should enquire.",
  },
  {
    title: "Poor Website Experience",
    text: "Traffic reaches a website that isn’t designed around conversion.",
  },
  {
    title: "No Lead Qualification",
    text: "You receive enquiries without knowing which prospects are serious.",
  },
  {
    title: "Poor Tracking",
    text: "You cannot clearly see which marketing activities are generating valuable opportunities.",
  },
];

const whyCards = [
  "One Digital Growth Team",
  "Multiple Digital Channels",
  "Conversion-Focused",
  "Tracking & Analytics",
  "Monthly Strategy",
  "Long-Term Partnership",
];

const howSteps = [
  {
    n: "01",
    title: "Understand",
    text: "Understand your business, market and goals.",
  },
  {
    n: "02",
    title: "Plan",
    text: "Build the appropriate digital growth strategy.",
  },
  {
    n: "03",
    title: "Build",
    text: "Develop or improve the website, landing pages and required digital assets.",
  },
  {
    n: "04",
    title: "Market",
    text: "Manage Meta Ads, Google Ads, Google Business Profile and lead-generation activities.",
  },
  {
    n: "05",
    title: "Optimize",
    text: "Measure performance and improve the funnel over time.",
  },
];

const funnelStages = [
  {
    n: "01",
    title: "Attract",
    items: ["Meta Ads", "Google Ads", "Google Business Profile"],
  },
  {
    n: "02",
    title: "Engage",
    items: ["Website", "Landing Pages", "Content"],
  },
  {
    n: "03",
    title: "Capture",
    items: ["Lead Form", "WhatsApp", "Phone"],
  },
  {
    n: "04",
    title: "Qualify",
    items: ["Business", "Budget", "Requirement", "Timeline"],
  },
  {
    n: "05",
    title: "Follow Up",
    items: ["CRM", "WhatsApp", "Sales Team"],
  },
  {
    n: "06",
    title: "Convert",
    items: ["Sales Opportunity", "Proposal", "Customer"],
  },
];

export function Growth() {
  const { company, content, cases, googleReviews } = useCms();
  const [cfg, setCfg] = useState<GrowthConfig>({});
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [planPref, setPlanPref] = useState("");
  const [expertOpen, setExpertOpen] = useState(false);

  useEffect(() => {
    captureGrowthAttribution();
    trackGrowthEvent("page_view", { landing_page: "/growth" });
    trackGrowthEvent("view_content", { content_name: "growth_landing" });
    const base = (import.meta.env.BASE_URL || "/").replace(/\/?$/, "/");
    fetch(`${base}content/growth.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (json && typeof json === "object") setCfg(json as GrowthConfig);
      })
      .catch(() => undefined);

    const faqId = "growth-faq-jsonld";
    const existing = document.getElementById(faqId);
    if (!existing) {
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
    return () => document.getElementById(faqId)?.remove();
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
    return (cases || []).slice(0, 4).map((item) => ({
      slug: item.slug,
      client: item.title?.split(" - ")[0] || item.title,
      industry: item.category || item.eyebrow || "Digital growth",
      challenge: item.summary || item.headline || "",
      services: item.category || "",
      href: `/case-studies/${item.slug}`,
    }));
  }, [cases]);

  const officeLines = cfg.officeAddressLines?.length
    ? cfg.officeAddressLines
    : ["[INSERT VERIFIED DISPLAYAVENUE OFFICE ADDRESS HERE]"];
  const officePlaceholder = officeLines.some((l) =>
    l.includes("[INSERT VERIFIED"),
  );

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
    <div className="growth-page">
      <SEO
        title={seoTitle}
        description={seoDesc}
        path="/growth"
        image="/images/hero-agency-india.jpg"
      />

      {/* HERO */}
      <section className="growth-hero">
        <div className="growth-wrap growth-hero__grid">
          <div className="growth-hero__copy">
            <p className="growth-eyebrow">Digital Lead Generation for Businesses</p>
            <h1>Get More Qualified Leads for Your Business</h1>
            <p className="growth-hero__lead">
              DisplayAvenue builds and manages the digital systems that help
              businesses attract, capture, qualify and convert potential customers.
            </p>
            <p className="growth-hero__sub">
              From your website and Google presence to Meta Ads, Google Ads,
              lead-generation funnels and e-commerce management — one team managing
              your digital growth.
            </p>
            <div className="growth-badge">Monthly Plans Starting at ₹30,000</div>
            <div className="growth-hero__actions">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => scrollToForm("Get My Growth Plan", "hero")}
              >
                Get My Growth Plan
              </button>
              <button
                type="button"
                className="btn btn-outline-light"
                onClick={() => talkToExpert("hero")}
              >
                Talk to an Expert
              </button>
            </div>
            <p className="growth-trust-line">
              Strategy · Execution · Tracking · Optimization
            </p>
          </div>
          <div className="growth-hero__visual" aria-hidden>
            <div className="growth-funnel-mini">
              <div className="growth-funnel-mini__row">
                <span>Meta Ads</span>
                <span>+</span>
                <span>Google Ads</span>
                <span>+</span>
                <span>Website</span>
                <span>+</span>
                <span>Google Business Profile</span>
              </div>
              <div className="growth-funnel-mini__arrow">↓</div>
              <div className="growth-funnel-mini__node">Landing Page</div>
              <div className="growth-funnel-mini__arrow">↓</div>
              <div className="growth-funnel-mini__node is-accent">Qualified Lead</div>
              <div className="growth-funnel-mini__arrow">↓</div>
              <div className="growth-funnel-mini__node">WhatsApp / Call</div>
              <div className="growth-funnel-mini__arrow">↓</div>
              <div className="growth-funnel-mini__node is-strong">Sales Opportunity</div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="growth-section">
        <div className="growth-wrap">
          <h2>Getting Clicks Isn’t the Goal. Getting Qualified Enquiries Is.</h2>
          <p className="growth-lede">
            Businesses often invest in advertising but still struggle to turn traffic
            into genuine sales opportunities. The problem can be targeting, the offer,
            the website, tracking, qualification or follow-up.
          </p>
          <div className="growth-cards-5">
            {problemCards.map((card) => (
              <article key={card.title} className="growth-card">
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
          <p className="growth-bridge">
            DisplayAvenue connects these elements into one measurable digital growth
            system.
          </p>
        </div>
      </section>

      {/* SYSTEM / SERVICES */}
      <section className="growth-section growth-section--soft" id="services">
        <div className="growth-wrap">
          <h2>One System. Multiple Digital Growth Channels.</h2>
          <p className="growth-lede">
            Instead of coordinating multiple agencies and freelancers, work with one
            digital growth team across your website, advertising, Google presence, lead
            generation and e-commerce operations.
          </p>
          <p className="growth-positioning">
            One Digital Growth Partner for Your Website, Marketing, Leads & E-commerce.
          </p>
          <div className="growth-services">
            {growthServices.map((svc) => (
              <article key={svc.id} className="growth-service" style={{ ["--accent" as string]: svc.accent }}>
                <h3>{svc.title}</h3>
                <p className="growth-service__sub">{svc.subtitle}</p>
                <ul>
                  {svc.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                {svc.note && <p className="growth-service__note">{svc.note}</p>}
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => scrollToForm(svc.cta, `service_${svc.id}`)}
                >
                  {svc.cta}
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* VISUAL FUNNEL */}
      <section className="growth-section">
        <div className="growth-wrap">
          <h2>From Ad Click to Sales Opportunity</h2>
          <p className="growth-lede">
            A coordinated path from attention to conversation. We do not guarantee
            conversion — we build the system that makes conversion measurable.
          </p>
          <div className="growth-funnel-stages">
            {funnelStages.map((stage, idx) => (
              <div key={stage.n} className="growth-funnel-stage">
                <div className="growth-funnel-stage__n">{stage.n}</div>
                <h3>{stage.title}</h3>
                <ul>
                  {stage.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
                {idx < funnelStages.length - 1 && (
                  <div className="growth-funnel-stage__down" aria-hidden>
                    ↓
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="growth-section growth-section--navy">
        <div className="growth-wrap">
          <h2>More Than an Agency. Your Digital Growth Team.</h2>
          <p className="growth-lede">
            DisplayAvenue brings multiple digital functions together so your website,
            advertising, lead generation and e-commerce activities can work as part of a
            coordinated strategy.
          </p>
          <div className="growth-why-grid">
            {whyCards.map((title) => (
              <article key={title} className="growth-why-card">
                <Icon name="check" size={18} color="#7dd3fc" />
                <h3>{title}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="growth-section">
        <div className="growth-wrap">
          <h2>Trusted by Businesses. Built for Growth.</h2>
          <p className="growth-lede">
            Built for business owners, founders and decision-makers who want ongoing
            digital growth — not a cheap social package.
          </p>
          <div className="growth-trust-strip">
            <div>
              <strong>Google Reviews</strong>
              <span>Verified profile available</span>
            </div>
            <div>
              <strong>B2B Focus</strong>
              <span>SMEs & decision-makers</span>
            </div>
            <div>
              <strong>₹30k–₹90k</strong>
              <span>Monthly growth plans</span>
            </div>
            <div>
              <strong>7 Channels</strong>
              <span>One coordinated team</span>
            </div>
          </div>
        </div>
      </section>

      {/* GOOGLE REVIEWS — genuine only */}
      <section className="growth-section growth-section--soft" id="reviews">
        <div className="growth-wrap">
          <h2>What Our Customers Say</h2>
          <p className="growth-lede">
            Real feedback from businesses that have worked with DisplayAvenue.
          </p>
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
                sync. Configure <code>GOOGLE_PLACE_ID</code> /{" "}
                <code>googlePlaceId</code> in <code>content/growth.json</code> and run
                Places sync from admin. We do not display invented reviews.
              </p>
              {cfg.googlePlaceId ? (
                <p>
                  Configured place ID: <code>{cfg.googlePlaceId}</code>
                </p>
              ) : (
                <p>
                  Place ID not set yet. Profile link is available below.
                </p>
              )}
            </div>
          )}
          {reviewsUrl && (
            <a
              className="btn btn-outline"
              href={reviewsUrl}
              target="_blank"
              rel="noreferrer"
            >
              View All Google Reviews
            </a>
          )}
        </div>
      </section>

      {/* TESTIMONIALS from existing CMS content only */}
      <section className="growth-section">
        <div className="growth-wrap">
          <h2>Happy Customers. Real Experiences.</h2>
          {testimonials.length > 0 ? (
            <div className="growth-testimonials">
              {testimonials.map((t) => (
                <article key={t.name} className="growth-testimonial">
                  <div className="growth-stars">★★★★★</div>
                  <p>“{t.quote}”</p>
                  <strong>{t.name}</strong>
                  <span>{t.title}</span>
                </article>
              ))}
            </div>
          ) : (
            <div className="growth-placeholder-box">
              <p>
                Testimonials will appear here when verified customer quotes are available
                in CMS content. We do not create fictional testimonials.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CASE STUDIES — qualitative only */}
      <section className="growth-section growth-section--soft">
        <div className="growth-wrap">
          <h2>Real Work. Real Businesses.</h2>
          <p className="growth-lede">
            Selected DisplayAvenue engagements from our case-study library. Results vary
            by market, offer and execution.
          </p>
          <div className="growth-cases">
            {caseCards.map((c) => (
              <article key={c.slug} className="growth-case">
                <p className="growth-case__industry">{c.industry}</p>
                <h3>{c.client}</h3>
                <p>{c.challenge}</p>
                <Link to={c.href}>View case study →</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="growth-section">
        <div className="growth-wrap">
          <h2>How It Works</h2>
          <div className="growth-how">
            {howSteps.map((s) => (
              <article key={s.n} className="growth-how__item">
                <span>{s.n}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="growth-section growth-section--soft" id="pricing">
        <div className="growth-wrap">
          <h2>Digital Growth Plans Starting at ₹30,000/Month</h2>
          <p className="growth-lede">
            Choose the level of digital support your business needs. Advertising spend
            and third-party costs are separate unless specifically included.
          </p>
          <div className="growth-pricing">
            {growthPricing.map((plan) => (
              <article
                key={plan.id}
                className={`growth-price ${plan.featured ? "is-featured" : ""}`}
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
                  className="btn btn-primary"
                  onClick={() => scrollToForm(plan.cta, `pricing_${plan.id}`, plan.id)}
                >
                  {plan.cta}
                </button>
              </article>
            ))}
          </div>
          <p className="growth-price-note">
            These are package examples. Exact deliverables, volume and scope must be
            confirmed in the final proposal. Advertising spend, third-party software,
            hosting, domains, paid plugins and other external costs are billed separately
            unless specifically included in your proposal.
          </p>
        </div>
      </section>

      {/* PRICE QUALIFICATION */}
      <section className="growth-section growth-section--navy growth-qualify">
        <div className="growth-wrap">
          <h2>Looking for a Long-Term Digital Growth Partner?</h2>
          <p>
            Our monthly digital growth plans start at ₹30,000. If you’re looking for a
            team to manage multiple areas of your digital presence and customer
            acquisition, tell us about your business.
          </p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => scrollToForm("Check My Fit", "qualification_banner")}
          >
            Check My Fit
          </button>
        </div>
      </section>

      {/* FORM */}
      <section className="growth-section">
        <div className="growth-wrap growth-wrap--narrow">
          <GrowthForm initialPlanId={planPref} />
        </div>
      </section>

      {/* OFFICE */}
      <section className="growth-section growth-section--soft" id="growth-office">
        <div className="growth-wrap growth-office">
          <div>
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
                Office street address is a configuration placeholder — replace in{" "}
                <code>content/growth.json</code> with the verified DisplayAvenue address.
                Do not invent an address.
              </p>
            )}
            <div className="growth-office__actions">
              <a
                className="btn btn-outline"
                href={company.googleMaps?.shareUrl || reviewsUrl}
                target="_blank"
                rel="noreferrer"
              >
                Get Directions
              </a>
              <a
                className="btn btn-outline"
                href={company.phoneHref}
                onClick={() => trackGrowthEvent("phone_click", { cta_location: "office" })}
              >
                Call Us
              </a>
              <a
                className="btn btn-primary"
                href={company.whatsappHref}
                target="_blank"
                rel="noreferrer"
                onClick={() =>
                  trackGrowthEvent("whatsapp_click", { cta_location: "office" })
                }
              >
                WhatsApp Us
              </a>
            </div>
          </div>
          <div className="growth-office__map">
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

      {/* FAQ */}
      <section className="growth-section">
        <div className="growth-wrap growth-wrap--narrow">
          <h2>Frequently Asked Questions</h2>
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
              className="btn btn-primary"
              href={company.phoneHref}
              onClick={() => trackGrowthEvent("phone_click", { cta_location: "expert_sheet" })}
            >
              Call {company.phone}
            </a>
            <a
              className="btn btn-outline"
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
              className="btn btn-outline"
              onClick={() => {
                setExpertOpen(false);
                scrollToForm("Get My Growth Plan", "expert_sheet");
              }}
            >
              Get My Growth Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
