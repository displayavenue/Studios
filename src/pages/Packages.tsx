import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { CTABanner } from "../components/CTABanner";
import { useReveal } from "../hooks/useReveal";
import { useCms } from "../cms/CmsProvider";
import "./Page.css";

export function Packages() {
  const ref = useReveal<HTMLDivElement>();
  const { packageGroups } = useCms();

  return (
    <div ref={ref}>
      <SEO
        title="Photography & Film Packages | DisplayAvenue Studios"
        description="Compare Essential, Signature and Luxury packages for weddings, corporate, product photography and monthly content retainers."
        path="/packages"
      />

      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Packages</span>
          </nav>
          <p className="eyebrow">Packages</p>
          <h1>Premium packages with transparent starting prices</h1>
          <p>
            Choose Essential, Signature or Luxury — then customise with add-ons
            like drone, albums, live streaming and rush delivery.
          </p>
        </div>
      </section>

      {packageGroups.map((group) => (
        <section key={group.slug} className="section" id={group.slug}>
          <div className="container">
            <div className="section-head reveal">
              <p className="eyebrow">{group.title}</p>
              <h2>
                <Link to={`/packages/${group.slug}`} className="inline-title-link">
                  {group.title}
                </Link>
              </h2>
              <p>{group.subtitle}</p>
              <Link to={`/packages/${group.slug}`} className="text-link">
                Open full package page →
              </Link>
            </div>
            <div className="packages-grid">
              {group.tiers.map((tier) => (
                <article
                  key={tier.id}
                  className={`package-card card reveal ${tier.highlighted ? "is-featured" : ""}`}
                >
                  {tier.highlighted && (
                    <span className="package-card__badge">Recommended</span>
                  )}
                  <h3>{tier.name}</h3>
                  <p className="package-card__price">{tier.priceLabel}</p>
                  <p className="package-card__note">{tier.priceNote}</p>
                  <p>{tier.description}</p>
                  <ul>
                    {tier.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <div className="package-actions">
                    <Link to={`/packages/${group.slug}`} className="btn btn--gold">
                      View Package
                    </Link>
                    <Link to="/book-now" className="btn btn--ghost">
                      Book Now
                    </Link>
                  </div>
                </article>
              ))}
            </div>

            <div className="compare-table reveal">
              <h3>Quick comparison</h3>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Feature focus</th>
                      {group.tiers.map((t) => (
                        <th key={t.id}>{t.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Best for</td>
                      {group.tiers.map((t) => (
                        <td key={t.id}>{t.description}</td>
                      ))}
                    </tr>
                    <tr>
                      <td>Starting at</td>
                      {group.tiers.map((t) => (
                        <td key={t.id}>
                          <strong>{t.priceLabel}</strong>
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td>Included highlights</td>
                      {group.tiers.map((t) => (
                        <td key={t.id}>{t.features[0]}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      ))}

      <CTABanner title="Need a custom package?" text="Tell us your date, city and deliverables — we’ll build a tailored proposal within one business day." />
    </div>
  );
}
