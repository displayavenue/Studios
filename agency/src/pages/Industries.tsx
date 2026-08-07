import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { SEO } from "../components/SEO";
import { useCms } from "../cms/CmsProvider";
import {
  industries as fallbackIndustries,
  industryStats,
  popularIndustrySolutions,
} from "../data/industries";
import "../styles/pages.css";

export function Industries() {
  const { industries: cmsIndustries } = useCms();
  const industries =
    cmsIndustries?.length > 0
      ? cmsIndustries.map((item) => ({
          slug: item.slug,
          title: item.title,
          desc: item.summary,
          icon: item.icon,
          image: item.image,
          color: item.color,
        }))
      : fallbackIndustries.map((item) => ({ ...item, image: undefined, color: "#0056ff" }));

  return (
    <div className="page-shell">
      <SEO title="Industries We Serve | DisplayAvenue" description="Industry-specific digital growth strategies for healthcare, real estate, ecommerce, SaaS, and more." path="/industries" />
      <div className="container-wide">
        <div className="page-frame">
          <div className="page-grid-3">
            <aside className="page-left">
              <h1 className="section-title">Industries We Serve</h1>
              <p>
                Tailored digital services for every vertical - from lead
                generation to full digital transformation.
              </p>
              <div className="cta-box">
                <span className="icon-box" style={{ background: "#e8f0ff", marginBottom: "0.5rem" }}>
                  <Icon name="target" color="#0056ff" />
                </span>
                <h4>Not Sure Which Solution Fits Your Industry?</h4>
                <Link to="/contact" className="link-arrow">
                  Get Free Consultation →
                </Link>
              </div>
              <ul className="feature-list">
                <li>
                  <Icon name="shield" color="#0056ff" />
                  <div>
                    <strong>Industry Experts</strong>
                    <span>Specialists who understand your market</span>
                  </div>
                </li>
                <li>
                  <Icon name="chart" color="#0056ff" />
                  <div>
                    <strong>Proven Results</strong>
                    <span>Playbooks refined across 25+ industries</span>
                  </div>
                </li>
                <li>
                  <Icon name="handshake" color="#0056ff" />
                  <div>
                    <strong>ROI Driven Approach</strong>
                    <span>Growth measured against business KPIs</span>
                  </div>
                </li>
              </ul>
            </aside>

            <div>
              <div className="category-grid">
                {industries.map((item) => (
                  <Link
                    key={item.slug}
                    to={`/industries/${item.slug}`}
                    className="category-card"
                  >
                    {item.image ? (
                      <span className="category-card-media">
                        <img src={item.image} alt={item.title} loading="lazy" />
                      </span>
                    ) : (
                      <Icon name={item.icon} color={item.color || "#0056ff"} />
                    )}
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                    <span className="arrow">
                      <Icon name="arrow" size={14} />
                    </span>
                  </Link>
                ))}
              </div>
              <div className="center-footer">
                <Link to="/industries" className="btn btn-outline">
                  View All Industries →
                </Link>
              </div>
            </div>

            <aside>
              <div className="side-stat-card">
                <h3>Industry-Specific Digital Growth Strategies</h3>
                <Link to="/contact" className="btn btn-primary btn-sm" style={{ marginBottom: "1rem" }}>
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
              <strong style={{ color: "var(--navy)" }}>Popular Industry Solutions</strong>
              <div className="pill-row" style={{ marginTop: "0.65rem" }}>
                {popularIndustrySolutions.map((item) => (
                  <Link key={item.href} to={item.href} className="pill">
                    {item.label} →
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
