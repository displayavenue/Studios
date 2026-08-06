import { Link, useParams } from "react-router-dom";
import { SEO, BreadcrumbSchema, FAQPageSchema } from "../components/SEO";
import { CTABanner } from "../components/CTABanner";
import { TestimonialsSection } from "../components/TestimonialsSection";
import { FAQAccordion } from "../components/FAQAccordion";
import { useReveal } from "../hooks/useReveal";
import { useCms } from "../cms/CmsProvider";
import "./Page.css";

function locationFaqs(city: string, service: string) {
  return [
    {
      question: `How much does ${service.toLowerCase()} cost in ${city}?`,
      answer: `Pricing depends on coverage hours, crew size and deliverables. DisplayAvenue Studios publishes transparent starting packages and provides a custom quote for ${city} shoots after a short consultation.`,
    },
    {
      question: `Do you travel to ${city} for weddings and commercial shoots?`,
      answer: `Yes. Our Mumbai-based team travels pan India, including ${city}. Travel and stay are scoped clearly in your proposal before booking.`,
    },
    {
      question: `How far in advance should I book in ${city}?`,
      answer: `Peak wedding and event dates in ${city} often book 2–6 months ahead. Corporate and product shoots can sometimes be scheduled sooner — WhatsApp us to check availability.`,
    },
    {
      question: `What is included in a ${city} photography package?`,
      answer: `Typical packages include lead creatives, edited galleries or films, online delivery and usage guidance. Albums, drone, reels and rush delivery are available as add-ons.`,
    },
  ];
}

export function Locations() {
  const ref = useReveal<HTMLDivElement>();
  const { locations } = useCms();

  return (
    <div ref={ref}>
      <SEO
        title="Wedding & Commercial Photographers Across India | Locations"
        description="DisplayAvenue Studios location pages for Mumbai, Delhi, Bangalore, Pune, Hyderabad, Ahmedabad, Goa, Jaipur and more — book luxury photography & film pan India."
        path="/locations"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Locations", path: "/locations" },
        ]}
      />

      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Locations</span>
          </nav>
          <p className="eyebrow">Locations</p>
          <h1>Pan India coverage with Mumbai as home base</h1>
          <p>
            Local SEO pages for cities we shoot often — each built to help you
            find the right crew, package and booking path for your celebration
            or brand.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container locations-grid">
          {locations.map((loc) => (
            <Link
              key={loc.slug}
              to={`/locations/${loc.slug}`}
              className="location-card card reveal"
            >
              <span className="eyebrow">{loc.city}</span>
              <h2>{loc.title}</h2>
              <p>{loc.intro}</p>
              <span className="text-link">Open location page →</span>
            </Link>
          ))}
        </div>
      </section>

      <TestimonialsSection compact limit={3} />

      <CTABanner />
    </div>
  );
}

export function LocationDetail() {
  const { slug } = useParams();
  const { locations, services, portfolio } = useCms();
  const loc = locations.find((l) => l.slug === slug);
  const ref = useReveal<HTMLDivElement>();

  if (!loc) {
    return (
      <section className="page-hero">
        <div className="container">
          <h1>Location page not found</h1>
          <Link to="/locations" className="btn btn--gold" style={{ marginTop: "1.5rem" }}>
            All Locations
          </Link>
        </div>
      </section>
    );
  }

  const faqs = locationFaqs(loc.city, loc.service);
  const relatedServices = services
    .filter((s) => {
      const svc = loc.service.toLowerCase();
      if (svc.includes("wedding")) return s.category === "Wedding";
      if (svc.includes("corporate")) return s.category === "Corporate";
      if (svc.includes("product")) return s.category === "Product";
      if (svc.includes("hotel") || svc.includes("restaurant"))
        return ["hotel-photography", "restaurant-photography", "food-photography", "drone-photography"].includes(s.slug);
      return s.category === "Wedding" || s.category === "Corporate";
    })
    .slice(0, 6);

  const relatedWork = portfolio
    .filter((p) => p.location?.toLowerCase().includes(loc.city.toLowerCase()) || true)
    .slice(0, 3);

  const metaDescription = `${loc.intro} Book ${loc.service.toLowerCase()} in ${loc.city} with DisplayAvenue Studios. Transparent packages, pan-India crews. Call +91 7400303493.`;

  return (
    <div ref={ref}>
      <SEO
        title={`${loc.title} | DisplayAvenue Studios`}
        description={metaDescription}
        path={`/locations/${loc.slug}`}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Locations", path: "/locations" },
          { name: loc.title, path: `/locations/${loc.slug}` },
        ]}
      />
      <FAQPageSchema faqs={faqs} />

      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/locations">Locations</Link>
            <span>/</span>
            <span>{loc.city}</span>
          </nav>
          <p className="eyebrow">{loc.service} · {loc.city}</p>
          <h1>{loc.title}</h1>
          <p>{loc.intro}</p>
          <div className="home-hero__actions" style={{ marginTop: "1.75rem" }}>
            <Link to="/book-now" className="btn btn--gold">
              Book in {loc.city}
            </Link>
            <Link to="/pricing" className="btn btn--outline">
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          <article className="info-panel card reveal">
            <h2>Why clients in {loc.city} choose DisplayAvenue</h2>
            <ul className="check-list">
              <li>Luxury visual standard with local coordination in {loc.city}</li>
              <li>Transparent packages and written proposals before booking</li>
              <li>Travel-ready crews from our Mumbai headquarters</li>
              <li>Fast social selects and structured gallery / film delivery</li>
              <li>Experience across weddings, brands, hotels and events</li>
            </ul>
          </article>
          <article className="info-panel card reveal">
            <h2>Popular services in {loc.city}</h2>
            <ul className="check-list">
              <li>{loc.service}</li>
              <li>Wedding Videography</li>
              <li>Pre Wedding Shoot</li>
              <li>Corporate & Product Photography</li>
              <li>Drone Photography & Videography</li>
            </ul>
            <div style={{ marginTop: "1.25rem" }}>
              <Link to="/services" className="text-link">
                Browse all services →
              </Link>
            </div>
          </article>
        </div>
      </section>

      {relatedServices.length > 0 && (
        <section className="section section--light">
          <div className="container">
            <div className="section-head reveal">
              <p className="eyebrow">Bookable Services</p>
              <h2>{loc.city} photography & film services</h2>
              <p>
                Open a service page to see benefits, packages and booking options
                for your {loc.city} project.
              </p>
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
      )}

      <section className="section">
        <div className="container">
          <div className="section-head reveal">
            <p className="eyebrow">Selected Work</p>
            <h2>Portfolio inspiration for {loc.city}</h2>
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

      <section className="section section--light">
        <div className="container narrow">
          <div className="section-head reveal">
            <p className="eyebrow">FAQs</p>
            <h2>{loc.city} booking questions</h2>
          </div>
          <div className="reveal">
            <FAQAccordion items={faqs} />
          </div>
        </div>
      </section>

      <TestimonialsSection compact limit={3} />

      <CTABanner
        title={`Book your ${loc.city} shoot today`}
        text={`Talk to DisplayAvenue Studios about ${loc.service.toLowerCase()} in ${loc.city} — WhatsApp or book a consultation online.`}
      />
    </div>
  );
}
