import { Link } from "react-router-dom";
import type { Property } from "../data/properties";
import "./PropertyCard.css";

export function PropertyCard({ property }: { property: Property }) {
  const meta = [
    property.bhk ? `${property.bhk} BHK` : null,
    `${property.carpetSqft} sq.ft`,
    property.furnishing?.replace("-", " "),
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="property-card">
      <Link to={`/property/${property.slug}`} className="property-card__media">
        <img src={property.images[0]} alt={property.title} loading="lazy" />
        <span className="property-card__badge">
          {property.intent === "sale" ? "For sale" : "For rent"}
        </span>
        <span className="property-card__locality">{property.localityLabel}</span>
      </Link>
      <div className="property-card__body">
        <p className="property-card__price">{property.priceLabel}</p>
        <h3>
          <Link to={`/property/${property.slug}`}>{property.title}</Link>
        </h3>
        <p className="property-card__meta">{meta}</p>
        <div className="property-card__actions">
          <Link className="btn btn--outline" to={`/property/${property.slug}`}>
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}
