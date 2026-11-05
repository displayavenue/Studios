import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { SEO } from "../components/SEO";
import { useCms } from "../cms/CmsProvider";
import "../styles/pages.css";

function comboPath(industrySlug?: string, serviceSlug?: string) {
  if (!industrySlug || !serviceSlug) return "/industry-solutions";
  return `/industries/${industrySlug}/${serviceSlug}`;
}

export function IndustrySolutions() {
  const { combos, industries } = useCms();
  const byIndustry = industries
    .map((ind) => ({
      industry: ind,
      items: combos.filter((c) => c.industrySlug === ind.slug),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <div className="page-shell">
      <SEO
        title="Industry Solutions | DisplayAvenue"
        description="Industry × service landing pages for real estate, manufacturing, healthcare, education, ecommerce and more - each with its own search intent and conversion path."
        path="/industry-solutions"
      />
      <div className="container-wide">
        <div className="page-frame">
          <div className="page-grid-3">
            <aside className="page-left">
              <p className="badge">Industry category</p>
              <h1 className="section-title" style={{ marginTop: "0.75rem" }}>
                Industry solutions
              </h1>
              <p>
                Dedicated landing pages for an industry plus a service - not a
                generic template with the name swapped. Each page targets a
                different buyer journey, channel mix and CTA.
              </p>
              <div className="cta-box" style={{ marginTop: "1rem" }}>
                <h4>Prefer the industry overview?</h4>
                <p>Start from the full industries list, then open a solution page.</p>
                <Link to="/industries" className="link-arrow">
                  Browse industries →
                </Link>
              </div>
              <div className="cta-box" style={{ marginTop: "0.75rem" }}>
                <h4>Need a custom mix?</h4>
                <Link to="/contact" className="link-arrow">
                  Get a growth plan →
                </Link>
              </div>
            </aside>

            <div style={{ gridColumn: "span 2" }}>
              {byIndustry.length === 0 ? (
                <p className="section-sub">Industry solution pages will appear here.</p>
              ) : (
                byIndustry.map(({ industry, items }) => (
                  <section key={industry.slug} style={{ marginBottom: "2rem" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: "1rem",
                        alignItems: "baseline",
                        marginBottom: "0.85rem",
                        flexWrap: "wrap",
                      }}
                    >
                      <div>
                        <h2
                          style={{
                            margin: 0,
                            fontSize: "1.15rem",
                            color: "var(--navy)",
                          }}
                        >
                          {industry.title}
                        </h2>
                        <p
                          style={{
                            margin: "0.25rem 0 0",
                            fontSize: "0.88rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          {items.length} solution page{items.length === 1 ? "" : "s"}
                        </p>
                      </div>
                      <Link to={`/industries/${industry.slug}`} className="link-arrow">
                        {industry.title} overview →
                      </Link>
                    </div>
                    <div className="category-grid">
                      {items.map((item) => (
                        <Link
                          key={item.slug}
                          to={comboPath(item.industrySlug, item.serviceSlug)}
                          className="category-card"
                        >
                          <Icon name={item.icon || "target"} color={item.color || "#0056ff"} />
                          <h3>{item.title}</h3>
                          <p>{(item.summary || "").slice(0, 110)}…</p>
                          <span className="arrow">
                            <Icon name="arrow" size={14} />
                          </span>
                        </Link>
                      ))}
                    </div>
                  </section>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
