import { Link, useParams } from "react-router-dom";
import { SEO } from "../components/SEO";
import { CTABanner } from "../components/CTABanner";
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
          <h1>Industry page not found</h1>
          <Link to="/industries" className="btn btn--gold" style={{ marginTop: "1.5rem" }}>
            All Industries
          </Link>
        </div>
      </section>
    );
  }

  const relatedServices = services
    .filter((s) => {
      const t = industry.title.toLowerCase();
      if (t.includes("hotel") || t.includes("restaurant"))
        return ["hotel-photography", "restaurant-photography", "food-photography", "drone-photography"].includes(s.slug);
      if (t.includes("fashion"))
        return ["fashion-photography", "model-portfolio", "product-photography"].includes(s.slug);
      if (t.includes("manufactur") || t.includes("construction") || t.includes("automobile"))
        return ["industrial-photography", "factory-photography", "corporate-videography", "drone-videography"].includes(s.slug);
      if (t.includes("real estate"))
        return ["real-estate-photography", "architecture-photography", "interior-photography", "drone-photography"].includes(s.slug);
      if (t.includes("education") || t.includes("government") || t.includes("ngo"))
        return ["event-photography", "event-videography", "corporate-photography"].includes(s.slug);
      if (t.includes("health"))
        return ["corporate-photography", "corporate-videography", "brand-story-videos"].includes(s.slug);
      return s.category === "Corporate" || s.category === "Product";
    })
    .slice(0, 6);

  const relatedWork = portfolio.slice(0, 3);

  return (
    <div ref={ref}>
      <SEO
        title={`${industry.title} Photography & Videography | DisplayAvenue Studios`}
        description={industry.text}
        path={`/industries/${industry.slug}`}
      />

      <section className="page-hero service-hero">
        <div className="container service-hero__grid">
          <div>
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span>/</span>
              <Link to="/industries">Industries</Link>
              <span>/</span>
              <span>{industry.title}</span>
            </nav>
            <p className="eyebrow">Industry</p>
            <h1>{industry.title} visual production</h1>
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
            <img src={industry.image} alt={`${industry.title} photography by DisplayAvenue Studios`} />
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

      <CTABanner title={`Ready to create ${industry.title.toLowerCase()} visuals?`} />
    </div>
  );
}
