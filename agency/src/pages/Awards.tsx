import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { CredentialImage } from "../components/CredentialImage";
import { useCms } from "../cms/CmsProvider";
import "./AwardsCerts.css";

export function Awards() {
  const { awards } = useCms();
  const items = awards.items || [];
  const [filter, setFilter] = useState("All");

  const categories = useMemo(() => {
    const set = new Set<string>();
    items.forEach((i) => {
      if (i.category) set.add(i.category);
    });
    return ["All", ...Array.from(set).sort()];
  }, [items]);

  const visible = useMemo(
    () => (filter === "All" ? items : items.filter((i) => i.category === filter)),
    [items, filter],
  );

  const seoTitle = awards.seo?.title || "Awards | DisplayAvenue";
  const seoDesc =
    awards.seo?.description ||
    "Awards won by the DisplayAvenue team for digital marketing excellence.";

  return (
    <div className="acred">
      <SEO title={seoTitle} description={seoDesc} path="/awards" />
      <div className="container">
        <header className="acred__hero">
          <p className="acred__kicker">DisplayAvenue recognition</p>
          <h1>{awards.title || "Awards we've won"}</h1>
          <p>{awards.sub}</p>
          <div className="acred__meta">
            <span>
              <strong>{items.length}</strong> awards
            </span>
            <Link to="/certifications" className="link-arrow">
              See team certifications →
            </Link>
          </div>
        </header>

        {categories.length > 2 && (
          <div className="acred__filters" role="tablist" aria-label="Filter awards">
            {categories.map((c) => (
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
          <p className="acred__empty">No awards yet. Add them in the CMS.</p>
        ) : (
          <div className="acred__grid">
            {visible.map((item) => (
              <article key={item.id} className="acred__card">
                <div className="acred__media">
                  <CredentialImage
                    src={item.image}
                    alt={item.title}
                    width={560}
                    height={392}
                    loading="lazy"
                  />
                </div>
                <div className="acred__body">
                  <span className="acred__year">{item.year}</span>
                  <h2>{item.title}</h2>
                  <p>{item.summary}</p>
                  <p className="acred__issuer">
                    {item.issuer}
                    {item.category ? ` · ${item.category}` : ""}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="acred__footer-cta">
          <div>
            <h3>Want results like these?</h3>
            <p>Book a free call. We’ll map a clear plan for your business.</p>
          </div>
          <Link to="/contact" className="btn btn-primary">
            Book a free call
          </Link>
        </div>
      </div>
    </div>
  );
}
