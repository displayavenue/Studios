import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { CTABanner } from "../components/CTABanner";
import { useReveal } from "../hooks/useReveal";
import { useCms } from "../cms/CmsProvider";
import "./Page.css";

const categories = ["Wedding", "Corporate", "Product", "Events", "Aerial", "Post"] as const;

export function Services() {
  const ref = useReveal<HTMLDivElement>();
  const { services } = useCms();

  return (
    <div ref={ref}>
      <SEO
        title="Photography & Videography Services | DisplayAvenue Studios"
        description="Explore wedding, corporate, product, drone, event and post-production services from DisplayAvenue Studios across India."
        path="/services"
      />

      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Services</span>
          </nav>
          <p className="eyebrow">Services</p>
          <h1>Photography, videography and post production for every brief</h1>
          <p>
            SEO-ready service pages for weddings, brands, hospitality, events
            and commercial content - each designed to help you book with
            clarity.
          </p>
        </div>
      </section>

      {categories.map((category) => {
        const items = services.filter((s) => s.category === category);
        const anchor = category.toLowerCase();
        return (
          <section key={category} id={anchor} className="section">
            <div className="container">
              <div className="section-head reveal">
                <p className="eyebrow">{category}</p>
                <h2>{category} Services</h2>
              </div>
              <div className="services-list-grid">
                {items.map((service) => (
                  <Link
                    key={service.slug}
                    to={`/services/${service.slug}`}
                    className="service-list-card card reveal"
                  >
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      width={480}
                      height={320}
                    />
                    <div>
                      <h3>{service.title}</h3>
                      <p>{service.short}</p>
                      <span className="text-link">View details →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <CTABanner />
    </div>
  );
}
