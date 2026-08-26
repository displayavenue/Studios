import { Link, useParams } from "react-router-dom";
import { SEO, BreadcrumbSchema } from "../components/SEO";
import { CTABanner } from "../components/CTABanner";
import { GoogleReviewsBlock } from "../components/GrowthWidgets";
import { useCms } from "../cms/CmsProvider";
import { serviceWhatsAppMessage, whatsappPrefill } from "../utils/whatsapp";
import "./Page.css";

/** SEO landing pages: /hire/:city/:serviceSlug */
export function HireCityService() {
  const { city = "", serviceSlug = "" } = useParams();
  const { services, company, locations } = useCms();
  const service = services.find((s) => s.slug === serviceSlug);
  const cityName = decodeURIComponent(city)
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  const relatedLocation = locations.find(
    (l) => l.city.toLowerCase() === cityName.toLowerCase(),
  );

  if (!service) {
    return (
      <section className="page-hero">
        <div className="container">
          <h1>Service not found</h1>
          <Link to="/services" className="btn btn--gold">
            Browse services
          </Link>
        </div>
      </section>
    );
  }

  const title = `${service.title} in ${cityName}`;
  const wa = whatsappPrefill(
    company.whatsappHref,
    serviceWhatsAppMessage(service.title, cityName),
  );

  return (
    <div>
      <SEO
        title={`${title} | DisplayAvenue Studios`}
        description={`Book premium ${service.title.toLowerCase()} in ${cityName} with DisplayAvenue Studios. Mumbai HQ, pan-India crew. Starting ${service.priceFrom || "on request"}.`}
        path={`/hire/${city}/${service.slug}`}
        image={service.image}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: title, path: `/hire/${city}/${service.slug}` },
        ]}
      />
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/services">Services</Link>
            <span>/</span>
            <span>
              {service.title} in {cityName}
            </span>
          </nav>
          <p className="eyebrow">
            {cityName} · {service.category}
          </p>
          <h1>
            {service.title} in {cityName}
          </h1>
          <p>
            DisplayAvenue Studios provides {service.title.toLowerCase()} in{" "}
            {cityName} with the same luxury standards as our Mumbai productions —
            planned travel, local coordination and clear deliverables.
          </p>
          {service.priceFrom ? (
            <p className="price-from">
              Starting {service.priceFrom}{" "}
              <small>{service.priceNote || ""}</small>
            </p>
          ) : null}
          <div className="section-cta" style={{ marginTop: "1.25rem" }}>
            <Link to="/book-now" className="btn btn--gold">
              Book {cityName} shoot
            </Link>
            <a href={wa} className="btn btn--outline" target="_blank" rel="noreferrer">
              WhatsApp this enquiry
            </a>
            <Link to={`/services/${service.slug}`} className="btn btn--ghost">
              Service details
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          <div>
            <img src={service.image} alt="" style={{ borderRadius: 16 }} />
          </div>
          <div>
            <h2>Why book us in {cityName}</h2>
            <ul className="check-list">
              <li>Pan-India travel-ready crew from Mumbai HQ</li>
              <li>Local venue familiarity &amp; production planning</li>
              <li>Transparent starting price and written scope</li>
              <li>Private client gallery delivery</li>
              {relatedLocation ? (
                <li>
                  Also see our{" "}
                  <Link to={`/locations/${relatedLocation.slug}`}>
                    {relatedLocation.title}
                  </Link>{" "}
                  page
                </li>
              ) : null}
            </ul>
            <h3 style={{ marginTop: "1.5rem" }}>What you receive</h3>
            <ul className="check-list">
              {(service.deliverables || []).map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <GoogleReviewsBlock compact />
      <CTABanner title={`Book ${service.title} in ${cityName}`} />
    </div>
  );
}

export function HireIndex() {
  const { services, locations } = useCms();
  const cities = [...new Set(locations.map((l) => l.city))].slice(0, 8);
  const topServices = services.slice(0, 12);

  return (
    <div>
      <SEO
        title="Hire Wedding Photographer by City | DisplayAvenue Studios"
        description="Hire a wedding photographer in Mumbai, Delhi, Bangalore, Goa and more — candid photography, cinematic films, pre-wedding, maternity and event coverage."
        path="/hire"
      />
      <section className="page-hero">
        <div className="container">
          <p className="eyebrow">City × service</p>
          <h1>Hire DisplayAvenue in your city</h1>
          <p>Jump into a city-specific service page and enquire with one tap.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          {cities.map((city) => {
            const slug = city.toLowerCase().replace(/\s+/g, "-");
            return (
              <div key={city} style={{ marginBottom: "2rem" }}>
                <h2>{city}</h2>
                <div className="chip-links">
                  {topServices.map((s) => (
                    <Link key={s.slug} to={`/hire/${slug}/${s.slug}`}>
                      {s.title}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
