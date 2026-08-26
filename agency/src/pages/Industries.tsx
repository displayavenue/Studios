import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { SEO } from "../components/SEO";
import { staticPageSeo } from "../data/pageSeo";
import { useCms } from "../cms/CmsProvider";
import { industryStats } from "../data/industries";
import "../styles/pages.css";

function comboPath(industrySlug?: string, serviceSlug?: string) {
  if (!industrySlug || !serviceSlug) return "/industry-solutions";
  return `/industries/${industrySlug}/${serviceSlug}`;
}

export function Industries() {
  const { industries, services, combos } = useCms();
  const featuredCombos = (combos || []).slice(0, 12);

  return (
    <div className="page-shell">
      <SEO
        title={staticPageSeo["/industries"].title}
        description={staticPageSeo["/industries"].description}
        path="/industries"
        keywords={staticPageSeo["/industries"].keywords}
      />
      <div className="container-wide">
        <div className="page-frame">
          <div className="page-grid-3">
            <aside className="page-left">
              <h1 className="section-title">Industries we help grow</h1>
              <p>
                Practical Google, ads, website, and social plans for businesses
                like yours - explained in plain English for owners across India.
              </p>
              <div className="cta-box">
                <span
                  className="icon-box"
                  style={{ background: "#e8f0ff", marginBottom: "0.5rem" }}
                >
                  <Icon name="target" color="#0056ff" />
                </span>
                <h4>Not sure where to start?</h4>
                <Link to="/contact" className="link-arrow">
                  Get Free Consultation →
                </Link>
              </div>
              <ul className="feature-list">
                <li>
                  <Icon name="shield" color="#0056ff" />
                  <div>
                    <strong>Industry experts</strong>
                    <span>Plans that fit how your customers search and buy</span>
                  </div>
                </li>
                <li>
                  <Icon name="chart" color="#0056ff" />
                  <div>
                    <strong>Proven results</strong>
                    <span>Playbooks refined across 25+ industries</span>
                  </div>
                </li>
                <li>
                  <Icon name="handshake" color="#0056ff" />
                  <div>
                    <strong>ROI-first</strong>
                    <span>We focus on calls, leads, and sales - not vanity metrics</span>
                  </div>
                </li>
              </ul>
              <div className="start-points" style={{ marginTop: "1.25rem" }}>
                <h4 style={{ color: "var(--navy)", marginBottom: "0.35rem" }}>
                  Popular services
                </h4>
                <p
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--text-muted)",
                    marginBottom: "0.65rem",
                  }}
                >
                  Pair your industry with the work that usually brings the fastest results.
                </p>
                <div className="start-points__grid start-points__grid--stack">
                  {services.slice(0, 8).map((s) => (
                    <Link key={s.slug} to={`/services/${s.slug}`} className="start-point">
                      <strong>{s.title}</strong>
                      <span>{(s.summary || "").slice(0, 70)}…</span>
                    </Link>
                  ))}
                  <Link to="/services" className="start-point">
                    <strong>All services</strong>
                    <span>Browse the full list of marketing, web, and creative help</span>
                  </Link>
                </div>
              </div>
            </aside>

            <div>
              <div className="category-block">
                <div className="category-block__head">
                  <h2>Industries</h2>
                  <p>Overview pages for each vertical we serve.</p>
                </div>
                <div className="category-grid">
                  {industries.map((item) => (
                    <Link
                      key={item.slug}
                      to={`/industries/${item.slug}`}
                      className="category-card"
                    >
                      <Icon name={item.icon} color={item.color || "#0056ff"} />
                      <h3>{item.title}</h3>
                      <p>{item.summary.slice(0, 100)}…</p>
                      <span className="arrow">
                        <Icon name="arrow" size={14} />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {featuredCombos.length > 0 && (
                <div className="category-block category-block--solutions">
                  <div className="category-block__head">
                    <div>
                      <p className="badge">Separate category</p>
                      <h2>Industry solutions</h2>
                      <p>
                        Industry × service landing pages with unique intent, funnels and CTAs.
                      </p>
                    </div>
                    <Link to="/industry-solutions" className="btn btn-outline btn-sm">
                      View all solutions →
                    </Link>
                  </div>
                  <div className="category-grid">
                    {featuredCombos.map((item) => (
                      <Link
                        key={item.slug}
                        to={comboPath(item.industrySlug, item.serviceSlug)}
                        className="category-card"
                      >
                        <Icon
                          name={item.icon || "target"}
                          color={item.color || "#0d9488"}
                        />
                        <h3>{item.title}</h3>
                        <p>{(item.summary || "").slice(0, 100)}…</p>
                        <span className="arrow">
                          <Icon name="arrow" size={14} />
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside>
              <div className="side-stat-card">
                <h3>Industry-specific digital growth</h3>
                <p
                  style={{
                    fontSize: "0.88rem",
                    color: "rgba(255,255,255,0.75)",
                    marginBottom: "0.85rem",
                  }}
                >
                  Tell us your city and offer. We will show a simple plan for Google,
                  Maps, ads, and your website.
                </p>
                <Link
                  to="/contact"
                  className="btn btn-primary btn-sm"
                  style={{ marginBottom: "1rem" }}
                >
                  Get Free Industry Analysis →
                </Link>
                <ul className="side-stats">
                  {industryStats.map((stat) => (
                    <li key={stat.label}>
                      <Icon name={stat.icon} color="#7dd3fc" />
                      <div>
                        <strong>{stat.value}</strong>
                        <span>{stat.label}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>

          <div className="bottom-bar">
            <div>
              <strong style={{ color: "var(--navy)" }}>Popular industry solutions</strong>
              <div className="pill-row" style={{ marginTop: "0.65rem" }}>
                {featuredCombos.slice(0, 8).map((item) => (
                  <Link
                    key={item.slug}
                    to={comboPath(item.industrySlug, item.serviceSlug)}
                    className="pill"
                  >
                    {item.title} →
                  </Link>
                ))}
                <Link to="/industry-solutions" className="pill">
                  All industry solutions →
                </Link>
                <Link to="/packages" className="pill">
                  Packages →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
