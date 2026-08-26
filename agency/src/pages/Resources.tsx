import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { SEO } from "../components/SEO";
import { staticPageSeo } from "../data/pageSeo";
import {
  resourceTypes,
  resourceCategories,
  featuredResources,
  popularThisWeek,
  resourceTrustBar,
} from "../data/content";
import "../styles/pages.css";
import "./tools/tools.css";

export function Resources() {
  return (
    <div className="page-shell">
      <SEO
        title={staticPageSeo["/resources"].title}
        description={staticPageSeo["/resources"].description}
        path="/resources"
        keywords={staticPageSeo["/resources"].keywords}
      />
      <div className="container-wide">
        <div className="page-frame">
          <div className="page-grid-3">
            <aside className="page-left">
              <p className="badge">Browse Resources</p>
              <ul className="mega-links" style={{ marginTop: "0.85rem" }}>
                {resourceTypes.map((item, i) => (
                  <li key={item.title}>
                    <Link
                      to={item.href}
                      style={
                        i === 0
                          ? {
                              background: "var(--blue-tint)",
                              color: "var(--blue)",
                              fontWeight: 700,
                            }
                          : undefined
                      }
                    >
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}>
                        <Icon name={item.icon} size={14} />
                        {item.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="cta-box" style={{ marginTop: "1rem" }}>
                <h4>Need Something Specific?</h4>
                <Link to="/contact" className="link-arrow">
                  Contact Our Team
                </Link>
              </div>
            </aside>

            <div>
              <div className="live-tools-banner" style={{ marginBottom: "1.25rem" }}>
                <div>
                  <h2>Featured linkable report</h2>
                  <p>
                    Cite our India SME Digital Growth Report 2026 - benchmarks and a 90-day plan
                    other sites can link to.
                  </p>
                  <p style={{ marginTop: "0.65rem" }}>
                    <Link to="/resources/india-sme-digital-growth-report" className="link-arrow">
                      Read the report →
                    </Link>
                  </p>
                </div>
                <div className="live-tools-list">
                  <Link to="/free-tools/roi-calculator">
                    ROI Calculator
                    <span>Tool</span>
                  </Link>
                  <Link to="/free-tools/seo-checklist">
                    SEO Checklist
                    <span>Tool</span>
                  </Link>
                  <Link to="/free-tools/citation-directory">
                    Citation kit
                    <span>Outreach</span>
                  </Link>
                </div>
              </div>
              <div className="category-grid category-grid--4">
                {resourceCategories.map((cat) => (
                  <div key={cat.title} className="category-card">
                    <span className="icon-box" style={{ background: `${cat.color}18` }}>
                      <Icon name={cat.icon} color={cat.color} />
                    </span>
                    <h3>{cat.title}</h3>
                    <p>{cat.desc}</p>
                    <Link to="/resources" className="link-arrow">
                      {cat.count} Resources →
                    </Link>
                  </div>
                ))}
              </div>

              <h2 style={{ fontSize: "0.85rem", letterSpacing: "0.06em", color: "var(--blue)", margin: "1.5rem 0 0.75rem", fontWeight: 800 }}>
                FEATURED RESOURCES
              </h2>
              <div className="mini-grid-4">
                {featuredResources.map((item) => (
                  <Link key={item.href} to={item.href} className="featured-card">
                    <div className="featured-media" style={{ background: item.gradient }}>
                      <span className="featured-tag">{item.tag}</span>
                    </div>
                    <div className="featured-body">
                      <h3>{item.title}</h3>
                      <p>{item.summary}</p>
                      <span className="link-arrow">{item.cta} →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <aside>
              <h3 style={{ fontSize: "0.95rem", color: "var(--navy)", marginBottom: "0.75rem" }}>
                Popular This Week
              </h3>
              <ul style={{ display: "grid", gap: "0.75rem" }}>
                {popularThisWeek.map((item) => (
                  <li key={item.title} style={{ display: "flex", gap: "0.65rem" }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 8,
                        background: "var(--bg-gray)",
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <strong style={{ display: "block", fontSize: "0.82rem", color: "var(--navy)" }}>
                        {item.title}
                      </strong>
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                        {item.type} · {item.time}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="cta-box" style={{ marginTop: "1.25rem" }}>
                <h4>Stay Updated</h4>
                <p>Get growth insights and free resources in your inbox.</p>
                <form
                  onSubmit={(e) => e.preventDefault()}
                  style={{ display: "grid", gap: "0.5rem" }}
                >
                  <input
                    type="email"
                    placeholder="Enter your email"
                    style={{
                      padding: "0.7rem 0.85rem",
                      borderRadius: 10,
                      border: "1px solid var(--border)",
                    }}
                  />
                  <button type="submit" className="btn btn-primary btn-sm">
                    Subscribe Now
                  </button>
                </form>
              </div>
            </aside>
          </div>

          <div className="bottom-bar">
            <div className="bottom-bar-items">
              {resourceTrustBar.map((item) => (
                <span key={item.label}>
                  <Icon name={item.icon} size={16} color="#0056ff" />
                  {item.label}
                </span>
              ))}
            </div>
            <div className="cta-box" style={{ margin: 0, padding: "0.65rem 0.85rem" }}>
              <strong style={{ fontSize: "0.85rem" }}>Can’t Find What You Need?</strong>{" "}
              <Link to="/contact" className="link-arrow">
                Request Now →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
