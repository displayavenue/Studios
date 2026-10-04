import { Link, Navigate, useParams } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import { SEO, BreadcrumbSchema } from "../components/SEO";
import { PropertyCard } from "../components/PropertyCard";
import { getLocality } from "../data/localities";
import "./Page.css";

export function Localities() {
  const { localities } = useCms();

  return (
    <div>
      <SEO
        title="Localities | Dahisar, Mira Road & Bhayandar property guides"
        description="Hyperlocal guides for buying, renting and investing in Dahisar, Mira Road and Bhayandar with DisplayAvenue Real Estate."
        path="/localities"
      />
      <section className="page-hero">
        <div className="container page-hero__inner">
          <span className="eyebrow">Coverage</span>
          <h1>Our three core localities</h1>
          <p>Deep focus beats shallow pan-city listings.</p>
        </div>
      </section>
      <section className="section">
        <div className="container locality-grid">
          {localities.map((l) => (
            <Link key={l.slug} to={`/localities/${l.slug}`} className="locality-card">
              <img src={l.image} alt="" loading="lazy" />
              <div>
                <h3>{l.name}</h3>
                <p>{l.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export function LocalityDetail() {
  const { slug = "" } = useParams();
  const locality = getLocality(slug);
  const { properties } = useCms();

  if (!locality) return <Navigate to="/localities" replace />;

  const localListings = properties
    .filter((p) => p.locality === locality.slug)
    .slice(0, 6);

  return (
    <div>
      <SEO
        title={locality.seoTitle}
        description={locality.seoDescription}
        path={`/localities/${locality.slug}`}
        image={locality.image}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Localities", path: "/localities" },
          { name: locality.name, path: `/localities/${locality.slug}` },
        ]}
      />

      <section className="page-hero locality-hero">
        <div className="container locality-hero__grid">
          <div>
            <span className="eyebrow">Locality guide</span>
            <h1>{locality.name}</h1>
            <p>{locality.summary}</p>
          </div>
          <img src={locality.image} alt={locality.name} />
        </div>
      </section>

      <section className="section">
        <div className="container grid-2">
          <div>
            <h2>Highlights</h2>
            <ul className="check-list">
              {locality.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2>Best fit for</h2>
            <ul className="check-list">
              {locality.buyerFit.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            <p className="price-hint">
              <strong>Sale hint:</strong> {locality.avgSaleHint}
            </p>
            <p className="price-hint">
              <strong>Rent hint:</strong> {locality.avgRentHint}
            </p>
          </div>
        </div>
      </section>

      <section className="section section--mist">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">Listings</span>
            <h2>Available in {locality.name}</h2>
          </div>
          <div className="property-grid">
            {localListings.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
          <div className="section-cta">
            <Link className="btn btn--outline" to={`/buy?locality=${locality.slug}`}>
              Buy in {locality.shortName}
            </Link>
            <Link className="btn btn--outline" to={`/rent?locality=${locality.slug}`}>
              Rent in {locality.shortName}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
