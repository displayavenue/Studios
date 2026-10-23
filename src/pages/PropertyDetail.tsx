import { Link, Navigate, useParams } from "react-router-dom";
import { useCms, useProperty } from "../cms/CmsProvider";
import { SEO, BreadcrumbSchema, RealEstateListingSchema } from "../components/SEO";
import { InquiryForm } from "../components/InquiryForm";
import { PropertyCard } from "../components/PropertyCard";
import { whatsappLink } from "../utils/submitInquiry";
import "./PropertyDetail.css";

export function PropertyDetail() {
  const { slug = "" } = useParams();
  const property = useProperty(slug);
  const { company, properties } = useCms();

  if (!property) return <Navigate to="/buy" replace />;

  const similar = properties
    .filter(
      (p) =>
        p.id !== property.id &&
        p.locality === property.locality &&
        p.intent === property.intent,
    )
    .slice(0, 3);

  const wa = whatsappLink(
    company.whatsappHref,
    `Hi, I'm interested in: ${property.title} (${property.priceLabel}). Please share visit options.`,
  );

  return (
    <div>
      <SEO
        title={`${property.title} | ${property.priceLabel}`}
        description={property.description}
        path={`/property/${property.slug}`}
        image={property.images[0]}
        type="article"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          {
            name: property.intent === "sale" ? "Buy" : "Rent",
            path: property.category === "commercial" ? "/commercial" : property.intent === "sale" ? "/buy" : "/rent",
          },
          { name: property.title, path: `/property/${property.slug}` },
        ]}
      />
      <RealEstateListingSchema
        name={property.title}
        description={property.description}
        image={property.images[0]}
        path={`/property/${property.slug}`}
        price={property.price}
        locality={property.localityLabel}
      />

      <section className="prop-hero">
        <div className="container prop-hero__grid">
          <div className="prop-gallery">
            <img src={property.images[0]} alt={property.title} className="prop-gallery__main" />
            <div className="prop-gallery__thumbs">
              {property.images.slice(1, 5).map((src) => (
                <img key={src} src={src} alt="" loading="lazy" />
              ))}
            </div>
          </div>

          <aside className="prop-summary">
            <span className="eyebrow">
              {property.intent === "sale" ? "For sale" : "For rent"} · {property.localityLabel}
            </span>
            <h1>{property.title}</h1>
            <p className="prop-summary__price">{property.priceLabel}</p>
            <ul className="prop-facts">
              {property.bhk ? <li>{property.bhk} BHK</li> : null}
              <li>{property.carpetSqft} sq.ft carpet</li>
              {property.floor ? <li>Floor: {property.floor}</li> : null}
              {property.parking ? <li>{property.parking}</li> : null}
              {property.furnishing ? (
                <li style={{ textTransform: "capitalize" }}>
                  {property.furnishing.replace("-", " ")}
                </li>
              ) : null}
              <li>{property.possession}</li>
            </ul>
            <div className="prop-summary__actions">
              <a className="btn btn--brass" href={wa} target="_blank" rel="noreferrer">
                WhatsApp for visit
              </a>
              <a className="btn btn--outline" href={company.phoneHref}>
                Call now
              </a>
            </div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container prop-detail-grid">
          <div>
            <h2>About this property</h2>
            <p>{property.description}</p>

            <h3>Highlights</h3>
            <ul className="check-list">
              {property.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>

            <h3>Amenities</h3>
            <ul className="chip-list">
              {property.amenities.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>

            <h3>Nearby</h3>
            <ul className="check-list">
              {property.nearby.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </div>

          <div className="prop-enquire">
            <InquiryForm
              type="property"
              title="Enquire about this property"
              submitLabel="Request callback"
              hidden={{
                property: property.title,
                slug: property.slug,
                price: property.priceLabel,
              }}
              fields={[
                { name: "name", label: "Name", required: true },
                { name: "phone", label: "Phone", type: "tel", required: true },
                {
                  name: "interest",
                  label: "I want to",
                  required: true,
                  options: [
                    { value: "visit", label: "Book a site visit" },
                    { value: "details", label: "Get more details" },
                    { value: "negotiate", label: "Discuss price" },
                  ],
                },
                {
                  name: "message",
                  label: "Message",
                  type: "textarea",
                  placeholder: "Preferred visit day / budget notes",
                },
              ]}
            />
          </div>
        </div>
      </section>

      {similar.length ? (
        <section className="section section--mist">
          <div className="container">
            <div className="section-head">
              <span className="eyebrow">Similar</span>
              <h2>More in {property.localityLabel}</h2>
            </div>
            <div className="property-grid">
              {similar.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
            <div className="section-cta">
              <Link className="btn btn--outline" to={property.intent === "rent" ? "/rent" : "/buy"}>
                Browse more listings
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
