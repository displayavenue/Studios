import { Link, useParams } from "react-router-dom";
import { SEO } from "../components/SEO";
import { CTABanner } from "../components/CTABanner";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { useReveal } from "../hooks/useReveal";
import { useCms } from "../cms/CmsProvider";
import "./Page.css";

export function IndustryDetail() {
  const { slug } = useParams();
  const { industries, services, portfolio } = useCms();
  const industry = industries.find((i) => i.slug === slug);
  const ref = useReveal<HTMLDivElement>();

  if (!industry) {
    return (
      <section className="page-hero">
        <div className="container">
          <h1>Wedding style not found</h1>
          <Link to="/industries" className="btn btn--gold" style={{ marginTop: "1.5rem" }}>
            All wedding styles
          </Link>
        </div>
      </section>
    );
  }

  const relatedServices = services
    .filter((s) => {
      const t = industry.title.toLowerCase();
      if (t.includes("destination"))
        return [
          "destination-wedding-photography",
          "wedding-films",
          "wedding-photography",
          "wedding-drone-coverage",
          "pre-wedding-shoot",
        ].includes(s.slug);
      if (t.includes("intimate"))
        return [
          "wedding-photography",
          "candid-wedding-photography",
          "wedding-films",
          "engagement-photography",
        ].includes(s.slug);
      return (
        s.category === "Wedding" ||
        s.category === "Pre-Wedding" ||
        s.slug === "wedding-films"
      );
    })
    .slice(0, 6);

  const relatedWork = portfolio.slice(0, 3);

  return (
    <div ref={ref}>
      <SEO
        title={`${industry.title} Photography & Films | DisplayAvenue Studios`}
        description={industry.text}
        path={`/industries/${industry.slug}`}
      />

      <section className="page-hero service-hero">
        <div className="container service-hero__grid">
          <div>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/industries">Wedding Styles</Link>
              <span>/</span>
              <span>{industry.title}</span>
            </nav>
            <p className="eyebrow">Wedding style</p>
            <h1>{industry.title}</h1>
            <p>{industry.text}</p>
            <div className="home-hero__actions" style={{ marginTop: "1.75rem" }}>
              <Link to="/book-now" className="btn btn--gold">
                Book a Consultation
              </Link>
              <Link to="/services" className="btn btn--outline">
                Browse Services
              </Link>
            </div>
          </div>
          <div className="service-hero__img">
            <img src={industry.image} alt={`${industry.title} photography by DisplayAvenue Studios Mumbai`} />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">Recommended Services</p>
            <h2>Services for {industry.title}</h2>
          </div>
          <div className="services-list-grid">
            {relatedServices.map((service) => (
              <Link
                key={service.slug}
                to={`/services/${service.slug}`}
                className="service-list-card card reveal"
              >
                <img src={service.image} alt={service.title} loading="lazy" />
                <div>
                  <h3>{service.title}</h3>
                  <p>{service.short}</p>
                  <span className="text-link">Open service page →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">Selected Work</p>
            <h2>Related portfolio</h2>
          </div>
          <div className="blog-grid">
            {relatedWork.map((item) => (
              <Link key={item.slug} to={`/portfolio/${item.slug}`} className="blog-card card reveal">
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

      <TestimonialsSection compact limit={3} />

      <CTABanner title={`Ready to create ${industry.title.toLowerCase()} visuals?`} />
    </div>
  );
}
