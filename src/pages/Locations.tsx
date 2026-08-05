import { Link, useParams } from "react-router-dom";
import { SEO } from "../components/SEO";
import { CTABanner } from "../components/CTABanner";
import { useReveal } from "../hooks/useReveal";
import { useCms } from "../cms/CmsProvider";
import "./Page.css";

export function Locations() {
  const ref = useReveal<HTMLDivElement>();
  const { locations } = useCms();

  return (
    <div ref={ref}>
      <SEO
        title="Locations | Wedding & Commercial Photographers Across India"
        description="DisplayAvenue Studios location pages for Mumbai, Delhi, Bangalore, Pune, Hyderabad, Ahmedabad, Goa, Jaipur and more."
        path="/locations"
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
            Our architecture supports 500+ location pages. Explore featured
            city pages below — each built for local SEO and booking intent.
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

      <CTABanner />
    </div>
  );
}

export function LocationDetail() {
  const { slug } = useParams();
  const { locations } = useCms();
  const loc = locations.find((l) => l.slug === slug);
  const ref = useReveal<HTMLDivElement>();

  if (!loc) {
    return (
      <section className="page-hero">
        <div className="container">
          <h1>Location not found</h1>
          <Link to="/locations" className="btn btn--gold" style={{ marginTop: "1.5rem" }}>
            All Locations
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div ref={ref}>
      <SEO
        title={`${loc.title} | DisplayAvenue Studios`}
        description={loc.intro}
        path={`/locations/${loc.slug}`}
      />

      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/locations">Locations</Link>
            <span>/</span>
            <span>{loc.city}</span>
          </nav>
          <p className="eyebrow">{loc.service}</p>
          <h1>{loc.title}</h1>
          <p>{loc.intro}</p>
          <div className="home-hero__actions" style={{ marginTop: "1.75rem" }}>
            <Link to="/book-now" className="btn btn--gold">
              Book in {loc.city}
            </Link>
            <Link to="/portfolio" className="btn btn--outline">
              View Portfolio
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          <article className="info-panel card reveal">
            <h3>Why clients in {loc.city} choose us</h3>
            <ul className="check-list">
              <li>Luxury visual standard with local coordination</li>
              <li>Transparent packages and written proposals</li>
              <li>Travel-ready crews for destination needs</li>
              <li>Fast social selects and structured delivery</li>
            </ul>
          </article>
          <article className="info-panel card reveal">
            <h3>Popular services in {loc.city}</h3>
            <ul className="check-list">
              <li>{loc.service}</li>
              <li>Wedding Videography</li>
              <li>Pre Wedding Shoot</li>
              <li>Corporate & Product Photography</li>
              <li>Drone Photography & Videography</li>
            </ul>
          </article>
        </div>
      </section>

      <CTABanner title={`Book your ${loc.city} shoot today`} />
    </div>
  );
}
