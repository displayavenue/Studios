import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { useCms } from "../cms/CmsProvider";
import "./AwardsCerts.css";

export function Certifications() {
  const { certifications } = useCms();
  const items = certifications.items || [];
  const [filter, setFilter] = useState("All");

  const brands = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => {
      if (i.brand) set.add(i.brand);
    });
    return ["All", ...Array.from(set).sort()];
  }, [items]);

  const visible = useMemo(
    () => (filter === "All" ? items : items.filter((i) => i.brand === filter)),
    [items, filter],
  );

  const seoTitle = certifications.seo?.title || "Certifications | DisplayAvenue";
  const seoDesc =
    certifications.seo?.description ||
    "Professional certifications held by the DisplayAvenue team.";

  return (
    <div className="acred">
      <SEO title={seoTitle} description={seoDesc} path="/certifications" />
      <div className="container">
        <header className="acred__hero">
          <p className="acred__kicker">Team credentials</p>
          <h1>{certifications.title || "Team certifications"}</h1>
          <p>{certifications.sub}</p>
          <div className="acred__meta">
            <span>
              <strong>{items.length}</strong> certificates
            </span>
            <Link to="/awards" className="link-arrow">
              See awards we’ve won →
            </Link>
          </div>
        </header>

        {brands.length > 2 && (
          <div className="acred__filters" role="tablist" aria-label="Filter by brand">
            {brands.map((c) => (
              <button
                key={c}
                type="button"
                className={`acred__chip${filter === c ? " is-active" : ""}`}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {visible.length === 0 ? (
          <p className="acred__empty">No certifications yet. Add them in the CMS.</p>
        ) : (
          <div className="acred__grid acred__grid--certs">
            {visible.map((item) => (
              <article key={item.id} className="acred__card">
                <div className="acred__media">
                  <img src={item.image} alt={item.title} width={1200} height={850} loading="lazy" />
                </div>
                <div className="acred__body">
                  <span className="acred__brand">{item.brand}</span>
                  <h2>{item.title}</h2>
                  <p>{item.credential}</p>
                  <p className="acred__issuer">
                    {item.issuer} · {item.year}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="acred__footer-cta">
          <div>
            <h3>Work with a certified team</h3>
            <p>Google, Meta, HubSpot, and more - applied to your growth plan.</p>
          </div>
          <Link to="/contact" className="btn btn-primary">
            Book a free call
          </Link>
        </div>
      </div>
    </div>
  );
}
