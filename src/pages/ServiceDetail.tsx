import { Link, useParams } from "react-router-dom";
import { SEO } from "../components/SEO";
import { CTABanner } from "../components/CTABanner";
import { FAQAccordion } from "../components/FAQAccordion";
import { useReveal } from "../hooks/useReveal";
import { useCms, useService } from "../cms/CmsProvider";
import "./Page.css";

export function ServiceDetail() {
  const { slug } = useParams();
  const service = useService(slug || "");
  const { services, faqs, testimonials, packageGroups, portfolio } = useCms();
  const ref = useReveal<HTMLDivElement>();

  if (!service) {
    return (
      <section className="page-hero">
        <div className="container">
          <h1>Service not found</h1>
          <Link to="/services" className="btn btn--gold" style={{ marginTop: "1.5rem" }}>
            Browse Services
          </Link>
        </div>
      </section>
    );
  }

  const related = service.related
    .map((s) => services.find((svc) => svc.slug === s))
    .filter(Boolean);
  const relatedWork = portfolio
    .filter((p) => {
      if (service.category === "Wedding") return p.category === "Wedding";
      if (service.category === "Product") return p.category === "Products";
      if (service.category === "Corporate") return p.category === "Corporate";
      if (service.category === "Events") return p.category === "Events";
      if (service.category === "Aerial") return p.category === "Drone";
      return p.category.toLowerCase().includes(service.category.toLowerCase().slice(0, 5));
    })
    .slice(0, 3);

  const pricing =
    service.category === "Wedding"
      ? packageGroups[0]
      : service.category === "Corporate" || service.category === "Events"
        ? packageGroups[1]
        : service.category === "Product"
          ? packageGroups[2]
          : packageGroups[3];

  return (
    <div ref={ref}>
      <SEO
        title={`${service.title} | DisplayAvenue Studios`}
        description={service.description}
        path={`/services/${service.slug}`}
      />

      <section className="page-hero service-hero">
        <div className="container service-hero__grid">
          <div>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/services">Services</Link>
              <span>/</span>
              <span>{service.title}</span>
            </nav>
            <p className="eyebrow">{service.category}</p>
            <h1>{service.title}</h1>
            <p>{service.description}</p>
            <div className="home-hero__actions" style={{ marginTop: "1.75rem" }}>
              <Link to="/book-now" className="btn btn--gold">
                Book This Service
              </Link>
              <Link to="/pricing" className="btn btn--outline">
                View Pricing
              </Link>
            </div>
          </div>
          <div className="service-hero__img">
            <img src={service.image} alt={service.title} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">Benefits</p>
            <h2>What you receive with {service.title}</h2>
          </div>
          <ul className="benefit-grid">
            {service.benefits.map((b) => (
              <li key={b} className="card reveal">
                {b}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {relatedWork.length > 0 && (
        <section className="section section--light">
          <div className="container">
            <div className="section-head reveal">
              <p className="eyebrow">Portfolio</p>
              <h2>Related work</h2>
            </div>
            <div className="blog-grid">
              {relatedWork.map((item) => (
                <Link
                  key={item.slug}
                  to={`/portfolio/${item.slug}`}
                  className="blog-card card reveal"
                >
                  <div className="blog-card__img">
                    <img src={item.image} alt={item.title} loading="lazy" />
                  </div>
                  <div className="blog-card__body">
                    <span>{item.category}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">Pricing</p>
            <h2>Starting packages</h2>
            <p>
              Final quotes depend on scope, city and deliverables. Start with
              these packages or request a custom proposal.
            </p>
          </div>
          <div className="packages-grid">
            {pricing.tiers.map((tier) => (
              <article
                key={tier.id}
                className={`package-card card reveal ${tier.highlighted ? "is-featured" : ""}`}
              >
                <h3>{tier.name}</h3>
                <p className="package-card__price">{tier.priceLabel}</p>
                <p className="package-card__note">{tier.priceNote}</p>
                <ul>
                  {tier.features.slice(0, 5).map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <Link to={`/packages/${pricing.slug}`} className="btn btn--gold">
                  View Package
                </Link>
              </article>
            ))}
          </div>
          <div className="section-cta reveal" style={{ marginTop: "1.5rem" }}>
            <Link to={`/packages/${pricing.slug}`} className="text-link">
              Open {pricing.title} page →
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="container grid-2" style={{ alignItems: "start" }}>
          <div className="reveal">
            <p className="eyebrow">FAQs</p>
            <h2>Common questions</h2>
            <FAQAccordion items={faqs.slice(0, 4)} />
          </div>
          <div className="reveal">
            <p className="eyebrow">Testimonials</p>
            <h2>Client voices</h2>
            <div className="stack-gap">
              {testimonials.slice(0, 2).map((t) => (
                <article key={t.name} className="testimonial-card card">
                  <p className="testimonial-card__quote">“{t.quote}”</p>
                  <strong>{t.name}</strong>
                  <span style={{ display: "block", color: "#666", fontSize: "0.85rem" }}>
                    {t.role}
                  </span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">Related Services</p>
            <h2>Pairs well with</h2>
          </div>
          <div className="chip-links reveal">
            {related.map((s) =>
              s ? (
                <Link key={s.slug} to={`/services/${s.slug}`}>
                  {s.title}
                </Link>
              ) : null,
            )}
            {services
              .filter((s) => s.category === service.category && s.slug !== service.slug)
              .slice(0, 4)
              .map((s) => (
                <Link key={s.slug} to={`/services/${s.slug}`}>
                  {s.title}
                </Link>
              ))}
          </div>
        </div>
      </section>

      <CTABanner title={`Book ${service.title} with DisplayAvenue`} />
    </div>
  );
}
