import { Link } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import { SEO } from "../components/SEO";
import { PropertyCard } from "../components/PropertyCard";
import { PropertySearch } from "../components/PropertySearch";
import { FAQAccordion } from "../components/FAQAccordion";
import { CTABanner } from "../components/CTABanner";
import { useReveal } from "../hooks/useReveal";
import "./Home.css";

export function Home() {
  const { home, company, properties, localities, services, whyChoose, processSteps, testimonials, faqs, blogs } =
    useCms();
  const ref = useReveal<HTMLDivElement>();
  const featured = properties.filter((p) => p.featured).slice(0, 6);

  return (
    <div ref={ref}>
      <SEO title={home.seo.title} description={home.seo.description} path="/" image={home.hero.image} />

      <section className="re-hero">
        <div className="re-hero__media" aria-hidden>
          <img src={home.hero.image} alt="" />
          <div className="re-hero__shade" />
        </div>
        <div className="container re-hero__content">
          <p className="re-hero__brand">{home.hero.brand}</p>
          <h1>{home.hero.headline}</h1>
          <p className="re-hero__support">{home.hero.support}</p>
          <div className="re-hero__ctas">
            <Link className="btn btn--brass" to={home.hero.primaryPath}>
              {home.hero.primaryCta}
            </Link>
            <Link className="btn btn--ghost" to={home.hero.secondaryPath}>
              {home.hero.secondaryCta}
            </Link>
          </div>
          <div className="re-hero__search">
            <PropertySearch />
          </div>
        </div>
      </section>

      <section className="section trust-strip">
        <div className="container trust-strip__grid reveal">
          {company.trustBadges.map((b) => (
            <span key={b}>{b}</span>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">{home.services.eyebrow}</span>
            <h2>{home.services.title}</h2>
            <p>{home.services.text}</p>
          </div>
          <div className="service-rail">
            {services.map((s) => (
              <Link key={s.slug} to={s.ctaPath} className="service-rail__item reveal">
                <img src={s.image} alt="" loading="lazy" />
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.short}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--mist">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">{home.featured.eyebrow}</span>
            <h2>{home.featured.title}</h2>
            <p>{home.featured.text}</p>
          </div>
          <div className="property-grid">
            {featured.map((p) => (
              <div key={p.id} className="reveal">
                <PropertyCard property={p} />
              </div>
            ))}
          </div>
          <div className="section-cta">
            <Link className="btn btn--outline" to="/buy">
              View all for sale
            </Link>
            <Link className="btn btn--outline" to="/rent">
              View all rentals
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">{home.localities.eyebrow}</span>
            <h2>{home.localities.title}</h2>
            <p>{home.localities.text}</p>
          </div>
          <div className="locality-grid">
            {localities.map((l) => (
              <Link key={l.slug} to={`/localities/${l.slug}`} className="locality-card reveal">
                <img src={l.image} alt="" loading="lazy" />
                <div>
                  <h3>{l.name}</h3>
                  <p>{l.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--mist">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">{home.whyChoose.eyebrow}</span>
            <h2>{home.whyChoose.title}</h2>
            <p>{home.whyChoose.text}</p>
          </div>
          <div className="why-grid">
            {whyChoose.map((w) => (
              <article key={w.title} className="why-item reveal">
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">{home.process.eyebrow}</span>
            <h2>{home.process.title}</h2>
            <p>{home.process.text}</p>
          </div>
          <div className="process-grid">
            {processSteps.map((s) => (
              <article key={s.step} className="process-item reveal">
                <span>{s.step}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--mist">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">{home.testimonials.eyebrow}</span>
            <h2>{home.testimonials.title}</h2>
            <p>{home.testimonials.text}</p>
          </div>
          <div className="quote-grid">
            {testimonials.map((t) => (
              <blockquote key={t.name} className="quote-card reveal">
                <p>“{t.quote}”</p>
                <footer>
                  <strong>{t.name}</strong>
                  <span>{t.role}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container split-faq">
          <div className="section-head reveal">
            <span className="eyebrow">{home.faqs.eyebrow}</span>
            <h2>{home.faqs.title}</h2>
            <p>{home.faqs.text}</p>
            <Link className="btn btn--outline" to="/faqs">
              All FAQs
            </Link>
          </div>
          <div className="reveal">
            <FAQAccordion items={faqs.slice(0, 4)} />
          </div>
        </div>
      </section>

      <section className="section section--mist">
        <div className="container">
          <div className="section-head reveal">
            <span className="eyebrow">{home.blogs.eyebrow}</span>
            <h2>{home.blogs.title}</h2>
            <p>{home.blogs.text}</p>
          </div>
          <div className="blog-grid">
            {blogs.map((b) => (
              <Link key={b.slug} to={`/blog/${b.slug}`} className="blog-card reveal">
                <img src={b.image} alt="" loading="lazy" />
                <div>
                  <span>{b.category}</span>
                  <h3>{b.title}</h3>
                  <p>{b.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </div>
  );
}
