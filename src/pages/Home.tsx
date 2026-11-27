import { Link } from "react-router-dom";
import { SEO, FAQPageSchema } from "../components/SEO";
import { CTABanner } from "../components/CTABanner";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { ShowreelBlock } from "../components/GrowthWidgets";
import { useReveal } from "../hooks/useReveal";
import { useCms } from "../cms/CmsProvider";
import "./Home.css";

/** Ceremonies we cover — one arch per tradition. */
const faiths = [
  {
    name: "Hindu weddings",
    rituals: "Haldi, mehendi, sangeet, pheras and vidaai",
  },
  {
    name: "Muslim weddings",
    rituals: "Manjha, mehendi, nikah, rukhsati and walima",
  },
  {
    name: "Christian weddings",
    rituals: "Roce, church vows, first dance and reception",
  },
  {
    name: "Sikh weddings",
    rituals: "Kurmai, chooda, Anand Karaj, laavan and doli",
  },
  {
    name: "Parsi weddings",
    rituals: "Madhavsaro, adarni, lagan and the reception feast",
  },
  {
    name: "Jain, Buddhist & interfaith",
    rituals: "Court marriages, intimate ceremonies and two traditions in one day",
  },
];

/** Pointed mandap / mehrab arch, in 0–1 units so it scales to any box. */
const ARCH_PATH =
  "M0,1 V0.36 C0,0.17 0.2,0.07 0.44,0.04 Q0.5,0.02 0.5,0 Q0.5,0.02 0.56,0.04 C0.8,0.07 1,0.17 1,0.36 V1 Z";

function ArchDefs() {
  return (
    <svg width="0" height="0" aria-hidden focusable="false" style={{ position: "absolute" }}>
      <defs>
        <clipPath id="arch-clip" clipPathUnits="objectBoundingBox">
          <path d={ARCH_PATH} />
        </clipPath>
      </defs>
    </svg>
  );
}

/** Thin gold arch outline drawn around an arch-shaped photo. */
function ArchOutline({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`arch-outline ${className}`}
      viewBox="0 0 1 1"
      preserveAspectRatio="none"
      aria-hidden
      focusable="false"
    >
      <path d={ARCH_PATH} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export function Home() {
  const ref = useReveal<HTMLDivElement>();
  const { home, homeServices, services, packageGroups, portfolio, faqs } =
    useCms();
  const weddingPackages = packageGroups[0];
  const { hero } = home;
  const featuredServices = homeServices
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s))
    .slice(0, 4);
  const work = portfolio.slice(0, 6);
  // Never show the same photo twice in the service windows
  const spare = portfolio
    .slice(6)
    .filter((p) => /wedding|sangeet|reception/i.test(`${p.category} ${p.title}`))
    .map((p) => p.image);
  const usedImages = new Set<string>();
  const serviceImage = (img: string) => {
    let chosen = img;
    if (usedImages.has(chosen)) chosen = spare.shift() || img;
    usedImages.add(chosen);
    return chosen;
  };

  return (
    <div ref={ref} className="home">
      <SEO title={home.seo.title} description={home.seo.description} path="/" />
      <FAQPageSchema
        faqs={faqs.slice(0, 5).map((f) => ({
          question: f.question,
          answer: f.answer,
        }))}
      />
      <ArchDefs />

      {/* Hero: the couple framed inside a mandap arch */}
      <section className="mandap-hero">
        <div className="container mandap-hero__grid">
          <div className="mandap-hero__copy">
            <p className="mandap-hero__kicker">{hero.eyebrow}</p>
            <h1>{hero.headline}</h1>
            <p className="mandap-hero__desc">{hero.description}</p>
            <div className="mandap-hero__actions">
              <Link to={hero.primaryCtaPath} className="btn btn--gold">
                {hero.primaryCtaLabel}
              </Link>
              <Link to={hero.secondaryCtaPath} className="btn btn--outline-light">
                {hero.secondaryCtaLabel}
              </Link>
            </div>
          </div>

          <div className="mandap-hero__arch">
            <ArchOutline className="mandap-hero__outline" />
            <div className="mandap-hero__photo">
              <img
                src={hero.image}
                alt={hero.imageAlt}
                width={900}
                height={1200}
                fetchPriority="high"
              />
            </div>
            <span className="mandap-hero__step" aria-hidden />
          </div>
        </div>
        <div className="toran" aria-hidden />
      </section>

      {/* Every faith */}
      <section className="section faiths">
        <div className="container">
          <div className="faiths__head reveal">
            <h2>One studio for every ceremony</h2>
            <p>
              Tell us your traditions and we plan coverage around each ritual —
              so the moments that matter most to your families are never missed.
            </p>
          </div>
          <ul className="faiths__row">
            {faiths.map((f) => (
              <li key={f.name} className="faith reveal">
                <ArchOutline className="faith__outline" />
                <div className="faith__body">
                  <span className="faith__mark" aria-hidden />
                  <h3>{f.name}</h3>
                  <p>{f.rituals}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Selected work */}
      <section className="section work">
        <div className="container">
          <div className="home-head reveal">
            <h2>{home.portfolio.title}</h2>
            <Link to={home.portfolio.ctaPath || "/portfolio"} className="quiet-link">
              {home.portfolio.ctaLabel || "View full portfolio"}
            </Link>
          </div>
        </div>
        <div className="work__grid">
          {work.map((item, i) => (
            <Link
              key={item.slug}
              to={`/portfolio/${item.slug}`}
              className={`work__item work__item--${i + 1}`}
            >
              <img
                src={item.image}
                alt={`${item.title} — ${item.category} photography in ${item.location} by DisplayAvenue Studios`}
                loading="lazy"
                width={900}
                height={1100}
              />
              <span className="work__caption">
                <strong>{item.title}</strong>
                <em>{item.location}</em>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <ShowreelBlock />

      {/* Services as haveli windows */}
      <section className="section windows">
        <div className="container">
          <div className="home-head reveal">
            <h2>{home.services.title}</h2>
            <Link to={home.services.ctaPath || "/services"} className="quiet-link">
              {home.services.ctaLabel || "All services"}
            </Link>
          </div>
          <div className="windows__row">
            {featuredServices.map((service) => (
              <Link
                key={service.slug}
                to={`/services/${service.slug}`}
                className="window reveal"
              >
                <span className="window__frame">
                  <img
                    src={serviceImage(service.image)}
                    alt={`${service.title} in Mumbai by DisplayAvenue Studios`}
                    loading="lazy"
                    width={700}
                    height={900}
                  />
                </span>
                <ArchOutline className="window__outline" />
                <span className="window__label">{service.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Packages as invitation cards */}
      <section className="section invites">
        <div className="container">
          <div className="invites__head reveal">
            <h2>{home.packages.title}</h2>
            <p>{home.packages.text}</p>
          </div>
          <div className="invites__row">
            {weddingPackages.tiers.map((tier) => (
              <article
                key={tier.id}
                className={`invite reveal ${tier.highlighted ? "invite--featured" : ""}`}
              >
                {tier.highlighted && (
                  <p className="invite__flag">
                    {home.packages.featuredBadge || "Most booked"}
                  </p>
                )}
                <h3>{tier.name}</h3>
                <p className="invite__price">{tier.priceLabel}</p>
                <p className="invite__note">{tier.priceNote}</p>
                <span className="invite__rule" aria-hidden />
                <ul>
                  {tier.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Link
                  to={`/packages/${weddingPackages.slug}`}
                  className={`btn ${tier.highlighted ? "btn--gold" : "btn--ghost"}`}
                >
                  Enquire about {tier.name}
                </Link>
              </article>
            ))}
          </div>
          <p className="invites__more reveal">
            <Link to={home.packages.secondaryCtaPath || "/packages"} className="quiet-link">
              Compare all packages and add-ons
            </Link>
          </p>
        </div>
      </section>

      <TestimonialsSection limit={3} className="home-words" />

      <CTABanner />
    </div>
  );
}
