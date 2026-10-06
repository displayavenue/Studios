import { Link } from "react-router-dom";
import type { Property } from "../data/properties";
import { useCms } from "../cms/CmsProvider";
import { whatsappLink } from "../utils/submitInquiry";
import "./PropertyCard.css";

export function PropertyCard({ property }: { property: Property }) {
  const { company } = useCms();
  const badge =
    property.intent === "rent"
      ? "FOR RENT"
      : property.possession?.toLowerCase().includes("ready")
        ? "READY TO MOVE"
        : "FOR SALE";

  const specs = [
    property.bhk ? `${property.bhk} BHK` : null,
    property.carpetSqft ? `${property.carpetSqft.toLocaleString("en-IN")} sq.ft.` : null,
    property.bathrooms ? `${property.bathrooms} Bath` : null,
  ].filter(Boolean);

  const wa = whatsappLink(
    company.whatsappHref,
    `Hi DisplayAvenue Realty, I am interested in ${property.title} (${property.priceLabel}) in ${property.localityLabel}.`,
  );

  return (
    <article className="property-card">
      <Link to={`/property/${property.slug}`} className="property-card__media">
        <img src={property.images[0]} alt={property.title} loading="lazy" />
        <span className="property-card__badge">{badge}</span>
      </Link>
      <div className="property-card__body">
        <p className="property-card__type">
          {property.bhk ? `${property.bhk} BHK Apartment` : property.title}
        </p>
        <p className="property-card__locality">{property.localityLabel}</p>
        <p className="property-card__price">{property.priceLabel}</p>
        <p className="property-card__meta">{specs.join(" | ")}</p>
        <div className="property-card__actions">
          <Link className="btn btn--outline" to={`/property/${property.slug}`}>
            View Property
          </Link>
          <a className="btn btn--wa" href={wa} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
