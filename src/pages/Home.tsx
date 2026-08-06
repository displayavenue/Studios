import { Link } from "react-router-dom";
import { SEO, FAQPageSchema } from "../components/SEO";
import { CTABanner } from "../components/CTABanner";
import { FAQAccordion } from "../components/FAQAccordion";
import { useReveal } from "../hooks/useReveal";
import { useCms } from "../cms/CmsProvider";
import "./Home.css";

export function Home() {
  const ref = useReveal<HTMLDivElement>();
  const {
    company: { trustBadges, brandLogos },
    home,
    homeServices,
    services,
    packageGroups,
    portfolio,
    blogs,
    faqs,
    processSteps,
    testimonials,
    whyChoose,
  } = useCms();
  const weddingPackages = packageGroups[0];
  const { hero } = home;

  return (
    <div ref={ref}>
      <SEO
        title={home.seo.title}
        description={home.seo.description}
        path="/"
      />
      <FAQPageSchema
        faqs={faqs.slice(0, 5).map((f) => ({
          question: f.question,
          answer: f.answer,
        }))}
      />

      <section className="home-hero">
        <div className="container home-hero__grid">
          <div className="home-hero__copy">
            <p className="home-hero__brand">{hero.brand}</p>
            <p className="eyebrow home-hero__label">{hero.eyebrow}</p>
            <h1>{hero.headline}</h1>
            <p className="home-hero__desc">{hero.description}</p>
            <div className="home-hero__actions">
              <Link to={hero.primaryCtaPath} className="btn btn--gold">
                {hero.primaryCtaLabel}
              </Link>
              <Link to={hero.secondaryCtaPath} className="btn btn--outline">
                {hero.secondaryCtaLabel}
              </Link>
            </div>
            <ul className="trust-badges">
              {trustBadges.map((badge) => (
                <li key={badge}>{badge}</li>
              ))}
            </ul>
          </div>
          <div className="home-hero__media">
            <img
              src={hero.image}
              alt={hero.imageAlt}
              width={800}
              height={1000}
              fetchPriority="high"
            />
          </div>
        </div>
      </section>

      <section className="brands-strip section">
        <div className="container">
          <p className="brands-strip__label reveal">{home.brands.label}</p>
          <div className="brands-strip__row reveal">
            {brandLogos.map((brand) => (
              <span key={brand}>{brand}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <div className="section-head section-head--center reveal">
            <p className="eyebrow">{home.services.eyebrow}</p>
            <h2>{home.services.title}</h2>
            <p>{home.services.text}</p>
          </div>
          <div className="services-grid">
            {homeServices.map((slug, i) => {
              const service = services.find((s) => s.slug === slug);
              if (!service) return null;
              return (
                <Link
                  key={slug}
                  to={`/services/${slug}`}
                  className="service-card card reveal"
                  style={{ transitionDelay: `${i * 40}ms` }}
                >
                  <div className="service-card__img">
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      width={600}
                      height={400}
                    />
                  </div>
                  <div className="service-card__body">
                    <h3>{service.title}</h3>
                    <p>{service.short}</p>
                    <span className="text-link">Explore service →</span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="section-cta reveal">
            <Link to={home.services.ctaPath || "/services"} className="btn btn--dark">
              {home.services.ctaLabel || "View All Services"}
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">{home.portfolio.eyebrow}</p>
            <h2>{home.portfolio.title}</h2>
            <p>{home.portfolio.text}</p>
          </div>
          <div className="masonry">
            {portfolio.slice(0, 8).map((item, i) => (
              <Link
                key={item.slug}
                to={`/portfolio/${item.slug}`}
                className={`masonry__item reveal ${i % 5 === 0 ? "is-tall" : ""}`}
              >
                <img
                  src={item.image}
                  alt={`${item.title} - ${item.category} project in ${item.location}`}
                  loading="lazy"
                  width={800}
                  height={1000}
                />
                <div className="masonry__overlay">
                  <span>{item.category}</span>
                  <strong>{item.title}</strong>
                  <em>{item.location}</em>
                </div>
              </Link>
            ))}
          </div>
          <div className="section-cta reveal">
            <Link to={home.portfolio.ctaPath || "/portfolio"} className="btn btn--gold">
              {home.portfolio.ctaLabel || "Explore Portfolio"}
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--light">
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
                    {home.packages.featuredBadge || "Most Popular"}
                  </span>
                )}
                <h3>{tier.name}</h3>
                <p className="package-card__price">{tier.priceLabel}</p>
                <p className="package-card__note">{tier.priceNote}</p>
                <p>{tier.description}</p>
                <ul>
                  {tier.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Link to="/book-now" className="btn btn--gold">
                  Book Now
                </Link>
              </article>
            ))}
          </div>
          <div className="section-cta reveal">
            <Link
              to={home.packages.ctaPath || `/packages/${weddingPackages.slug}`}
              className="btn btn--gold"
            >
              {home.packages.ctaLabel || "Wedding Package Page"}
            </Link>
            <Link
              to={home.packages.secondaryCtaPath || "/packages"}
              className="btn btn--outline"
            >
              {home.packages.secondaryCtaLabel || "All Packages"}
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head section-head--center reveal">
            <p className="eyebrow">{home.whyChoose.eyebrow}</p>
            <h2>{home.whyChoose.title}</h2>
            <p>{home.whyChoose.text}</p>
          </div>
          <div className="why-grid">
            {whyChoose.map((item) => (
              <article key={item.title} className="why-card card reveal">
                <div className="why-card__icon" aria-hidden>
                  ◆
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <div className="section-head section-head--center reveal">
            <p className="eyebrow">{home.process.eyebrow}</p>
            <h2>{home.process.title}</h2>
            {home.process.text ? <p>{home.process.text}</p> : null}
          </div>
          <div className="process-grid">
            {processSteps.map((step) => (
              <article key={step.step} className="process-card reveal">
                <span>{step.step}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head section-head--center reveal">
            <p className="eyebrow">{home.testimonials.eyebrow}</p>
            <h2>{home.testimonials.title}</h2>
            <p>{home.testimonials.text}</p>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <article key={t.name} className="testimonial-card card reveal">
                <div className="testimonial-card__stars" aria-label="5 star review">
                  ★★★★★
                </div>
                <p className="testimonial-card__quote">“{t.quote}”</p>
                <div className="testimonial-card__person">
                  <img src={t.image} alt={t.name} loading="lazy" width={56} height={56} />
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="container faq-home">
          <div className="section-head reveal">
            <p className="eyebrow">{home.faqs.eyebrow}</p>
            <h2>{home.faqs.title}</h2>
            <p>{home.faqs.text}</p>
            <Link
              to={home.faqs.ctaPath || "/faqs"}
              className="btn btn--ghost"
              style={{ marginTop: "1.25rem" }}
            >
              {home.faqs.ctaLabel || "View All FAQs"}
            </Link>
          </div>
          <div className="reveal">
            <FAQAccordion items={faqs.slice(0, 5)} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">{home.blogs.eyebrow}</p>
            <h2>{home.blogs.title}</h2>
            {home.blogs.text ? <p>{home.blogs.text}</p> : null}
          </div>
          <div className="blog-grid">
            {blogs.slice(0, 3).map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="blog-card card reveal"
              >
                <div className="blog-card__img">
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    width={640}
                    height={420}
                  />
                </div>
                <div className="blog-card__body">
                  <span>
                    {post.category} · {post.readTime}
                  </span>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="section-cta reveal">
            <Link to={home.blogs.ctaPath || "/blog"} className="btn btn--outline">
              {home.blogs.ctaLabel || "Read the Blog"}
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </div>
  );
}
