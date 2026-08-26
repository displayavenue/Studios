import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { CTABanner } from "../components/CTABanner";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { useReveal } from "../hooks/useReveal";
import { useCms } from "../cms/CmsProvider";
import "./Page.css";

const categories = [
  "Wedding",
  "Pre-Wedding",
  "Engagement",
  "Maternity",
  "Birthday",
  "Events",
] as const;

export function Services() {
  const ref = useReveal<HTMLDivElement>();
  const { services } = useCms();

  return (
    <div ref={ref}>
      <SEO
        title="Wedding Photography Services in Mumbai | Pre-Wedding, Maternity & Events"
        description="Premium wedding photographer in Mumbai for candid & traditional photography, cinematic wedding films, pre-wedding shoots, engagement, maternity, birthday and all event coverage."
        path="/services"
      />

      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Services</span>
          </nav>
          <p className="eyebrow">Wedding & celebration services</p>
          <h1>Wedding photography, films & life’s celebrations</h1>
          <p>
            Only what couples search for — wedding, pre-wedding, engagement,
            maternity, birthday and complete personal event coverage. Candid
            emotion, traditional heirlooms and cinematic films.
          </p>
        </div>
      </section>

      {categories.map((category) => {
        const items = services.filter((s) => s.category === category);
        return (
          <section key={category} className="section">
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
                      {service.priceFrom ? (
                        <p className="price-from price-from--sm">
                          From <strong>{service.priceFrom}</strong>
                        </p>
                      ) : null}
                      <span className="text-link">View details →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <TestimonialsSection compact limit={3} />

      <CTABanner />
    </div>
  );
}
