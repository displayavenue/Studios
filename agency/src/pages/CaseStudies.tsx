import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { SEO } from "../components/SEO";
import { staticPageSeo } from "../data/pageSeo";
import { industries } from "../data/industries";
import {
  caseStudyServices,
  featuredCaseStudies,
  caseStudyImpact,
  caseStudyTrustBar,
  clientLogos,
} from "../data/work";
import "../styles/pages.css";

export function CaseStudies() {
  return (
    <div className="page-shell">
      <SEO
        title={staticPageSeo["/case-studies"].title}
        description={staticPageSeo["/case-studies"].description}
        path="/case-studies"
        keywords={staticPageSeo["/case-studies"].keywords}
      />
      <div className="container-wide">
        <div className="page-frame">
          <div className="page-grid-3">
            <aside className="page-left">
              <h1 className="section-title">Real Results. Proven Impact.</h1>
              <p>
                Data-driven strategies that turn campaigns into measurable
                business growth.
              </p>
              <h3 style={{ marginTop: "1.25rem", fontSize: "0.9rem", color: "var(--navy)" }}>
                Browse Case Studies by Industry
              </h3>
              <ul className="mega-links" style={{ marginTop: "0.55rem" }}>
                {industries.slice(0, 12).map((item) => (
                  <li key={item.slug}>
                    <Link to={`/industries/${item.slug}`}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                        <Icon name={item.icon} size={14} color="#8a92a6" />
                        {item.title}
                      </span>
                      <Icon name="chevron" size={12} />
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="cta-box" style={{ marginTop: "1rem" }}>
                <h4>Have a similar challenge?</h4>
                <p>Let’s create a success story together.</p>
                <Link to="/contact" className="link-arrow">
                  Talk to Our Experts →
                </Link>
              </div>
            </aside>

            <div>
              <h2 style={{ fontSize: "0.95rem", color: "var(--navy)", marginBottom: "0.75rem" }}>
                Explore Case Studies by Service
              </h2>
              <div className="category-grid category-grid--5">
                {caseStudyServices.map((item) => (
                  <Link
                    key={item.title}
                    to="/case-studies"
                    className="category-card"
                    style={{ minHeight: "110px" }}
                  >
                    <span className="icon-box" style={{ background: `${item.color}18` }}>
                      <Icon name={item.icon} color={item.color} size={16} />
                    </span>
                    <h3>{item.title}</h3>
                    <p className="meta">{item.count} Cases</p>
                  </Link>
                ))}
              </div>
              <Link to="/case-studies" className="link-arrow" style={{ marginTop: "0.85rem" }}>
                View All Services Case Studies →
              </Link>

              <h2 style={{ fontSize: "0.95rem", color: "var(--navy)", margin: "1.5rem 0 0.75rem" }}>
                Featured Case Studies
              </h2>
              <div className="mini-grid-4 mini-grid-4--2">
                {featuredCaseStudies.map((item) => (
                  <Link key={item.href} to={item.href} className="featured-card">
                    <div className="featured-media" style={{ background: item.gradient, height: "140px" }}>
                      <span className="featured-tag" style={{ color: item.tagColor }}>
                        {item.tag}
                      </span>
                    </div>
                    <div className="featured-body">
                      <p>{item.client}</p>
                      <h3>{item.title}</h3>
                      <div className="metric-row">
                        {item.metrics.map((m) => (
                          <span key={m} className="metric-chip">
                            {m}
                          </span>
                        ))}
                      </div>
                      <span className="link-arrow">View Case Study →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <aside>
              <div className="side-stat-card">
                <h3>Our Impact in Numbers</h3>
                <ul className="side-stats">
                  {caseStudyImpact.map((stat) => (
                    <li key={stat.label}>
                      <Icon name={stat.icon} color={stat.color} />
                      <div>
                        <strong>{stat.value}</strong>
                        <span>{stat.label}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="cta-box" style={{ marginTop: "1rem" }}>
                <h4>Want similar results for your business?</h4>
                <Link to="/contact" className="btn btn-primary btn-sm">
                  Get Free Strategy Session →
                </Link>
              </div>
              <div style={{ marginTop: "1rem" }}>
                <p style={{ fontWeight: 700, color: "var(--navy)", fontSize: "0.85rem" }}>
                  Trusted by 500+ Brands
                </p>
                <div className="logo-strip" style={{ justifyContent: "flex-start", marginTop: "0.55rem" }}>
                  {clientLogos.map((logo) => (
                    <span key={logo} className="logo-chip">
                      {logo}
                    </span>
                  ))}
                </div>
              </div>
            </aside>
          </div>

          <div className="bottom-bar">
            <div className="bottom-bar-items">
              {caseStudyTrustBar.map((item) => (
                <span key={item.label}>
                  <Icon name={item.icon} size={16} color="#0056ff" />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
