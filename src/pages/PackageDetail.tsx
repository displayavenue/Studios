import { Link, useParams } from "react-router-dom";
import { SEO } from "../components/SEO";
import { CTABanner } from "../components/CTABanner";
import { useReveal } from "../hooks/useReveal";
import { useCms } from "../cms/CmsProvider";
import "./Page.css";

export function PackageDetail() {
  const { slug } = useParams();
  const { packageGroups } = useCms();
  const group = packageGroups.find((g) => g.slug === slug);
  const ref = useReveal<HTMLDivElement>();

  if (!group) {
    return (
      <section className="page-hero">
        <div className="container">
          <h1>Package page not found</h1>
          <Link to="/packages" className="btn btn--gold" style={{ marginTop: "1.5rem" }}>
            All Packages
          </Link>
        </div>
      </section>
    );
  }

  return (
    <div ref={ref}>
      <SEO
        title={`${group.title} | DisplayAvenue Studios`}
        description={group.subtitle}
        path={`/packages/${group.slug}`}
      />

      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/packages">Packages</Link>
            <span>/</span>
            <span>{group.title}</span>
          </nav>
          <p className="eyebrow">Package Page</p>
          <h1>{group.title}</h1>
          <p>{group.subtitle}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="packages-grid">
            {group.tiers.map((tier) => (
              <article
                key={tier.id}
                id={tier.id}
                className={`package-card card reveal ${tier.highlighted ? "is-featured" : ""}`}
              >
                {tier.highlighted && (
                  <span className="package-card__badge">Recommended</span>
                )}
                <h2>{tier.name}</h2>
                <p className="package-card__price">{tier.priceLabel}</p>
                <p className="package-card__note">{tier.priceNote}</p>
                <p>{tier.description}</p>
                <ul>
                  {tier.features.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <div className="package-actions">
                  <Link to="/book-now" className="btn btn--gold">
                    Book {tier.name}
                  </Link>
                  <Link to="/contact" className="btn btn--ghost">
                    Customize
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="compare-table reveal" style={{ marginTop: "2.5rem" }}>
            <h3>Compare {group.title}</h3>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Focus</th>
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
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <CTABanner title={`Book ${group.title.toLowerCase()}`} />
    </div>
  );
}
