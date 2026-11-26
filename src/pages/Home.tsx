import { Link } from "react-router-dom";
import { SEO, FAQPageSchema } from "../components/SEO";
import { CTABanner } from "../components/CTABanner";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { ShowreelBlock } from "../components/GrowthWidgets";
import { useReveal } from "../hooks/useReveal";
import { useCms } from "../cms/CmsProvider";
import "./Home.css";

/*
 * Premium homepage — seven calm sections:
 * hero → selected work → showreel (only when a real film is set) →
 * services → packages → client words → booking.
 * Case studies, blog, FAQs, awards and Instagram live on their own pages.
 */
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

  return (
    <div ref={ref}>
      <SEO title={home.seo.title} description={home.seo.description} path="/" />
      <FAQPageSchema
        faqs={faqs.slice(0, 5).map((f) => ({
          question: f.question,
          answer: f.answer,
        }))}
      />

      <section className="home-hero">
        <img
          className="home-hero__bg"
          src={hero.image}
          alt={hero.imageAlt}
          width={1920}
          height={1280}
          fetchPriority="high"
        />
        <div className="home-hero__shade" aria-hidden />
        <div className="container home-hero__copy">
          <p className="home-hero__label">{hero.eyebrow}</p>
          <h1>{hero.headline}</h1>
          <p className="home-hero__desc">{hero.description}</p>
          <div className="home-hero__actions">
            <Link to={hero.primaryCtaPath} className="btn btn--gold">
              {hero.primaryCtaLabel}
            </Link>
            <Link to={hero.secondaryCtaPath} className="btn btn--outline-light">
              {hero.secondaryCtaLabel}
            </Link>
          </div>
        </div>
        <span className="home-hero__scroll" aria-hidden>
          Scroll
        </span>
      </section>

      <section className="section home-work">
        <div className="container">
          <div className="home-head reveal">
            <div>
              <p className="eyebrow">{home.portfolio.eyebrow}</p>
              <h2>{home.portfolio.title}</h2>
            </div>
            <Link to={home.portfolio.ctaPath || "/portfolio"} className="text-link">
              {home.portfolio.ctaLabel || "View full portfolio"} →
            </Link>
          </div>
        </div>
        <div className="home-work__grid">
          {work.map((item, i) => (
            <Link
              key={item.slug}
              to={`/portfolio/${item.slug}`}
              className={`home-work__item reveal home-work__item--${i + 1}`}
            >
              <img
                src={item.image}
                alt={`${item.title} — ${item.category} photography in ${item.location} by DisplayAvenue Studios`}
                loading="lazy"
                width={900}
                height={1100}
              />
              <span className="home-work__caption">
                <strong>{item.title}</strong>
                <em>{item.location}</em>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <ShowreelBlock />

      <section className="section section--light">
        <div className="container">
          <div className="home-head reveal">
            <div>
              <p className="eyebrow">{home.services.eyebrow}</p>
              <h2>{home.services.title}</h2>
            </div>
            <Link to={home.services.ctaPath || "/services"} className="text-link">
              {home.services.ctaLabel || "All services"} →
            </Link>
          </div>
          <div className="home-services">
            {featuredServices.map((service) => (
              <Link
                key={service.slug}
                to={`/services/${service.slug}`}
                className="home-service reveal"
              >
                <img
                  src={service.image}
                  alt={`${service.title} in Mumbai by DisplayAvenue Studios`}
                  loading="lazy"
                  width={700}
                  height={900}
                />
                <span className="home-service__label">
                  <strong>{service.title}</strong>
                  <em>Explore →</em>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head section-head--center reveal">
            <p className="eyebrow">{home.packages.eyebrow}</p>
            <h2>{home.packages.title}</h2>
            <p>{home.packages.text}</p>
          </div>
          <div className="packages-grid">
            {weddingPackages.tiers.map((tier) => (
              <article
                key={tier.id}
                className={`package-card card reveal ${tier.highlighted ? "is-featured" : ""}`}
              >
                {tier.highlighted && (
                  <span className="package-card__badge">
                    {home.packages.featuredBadge || "Most booked"}
                  </span>
                )}
                <h3>{tier.name}</h3>
                <p className="package-card__price">{tier.priceLabel}</p>
                <p className="package-card__note">{tier.priceNote}</p>
                <ul>
                  {tier.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Link
                  to={`/packages/${weddingPackages.slug}`}
                  className={`btn ${tier.highlighted ? "btn--dark" : "btn--ghost"}`}
                >
                  Enquire
                </Link>
              </article>
            ))}
          </div>
          <div className="section-cta section-cta--center reveal">
            <Link to={home.packages.secondaryCtaPath || "/packages"} className="text-link">
              Compare all packages &amp; add-ons →
            </Link>
          </div>
        </div>
      </section>

      <TestimonialsSection limit={3} className="section--light" />

      <CTABanner />
    </div>
  );
}
