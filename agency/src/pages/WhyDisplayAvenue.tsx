import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { SEO } from "../components/SEO";
import {
  whyPillars,
  whyTrustCards,
  coreStrengths,
  differentiators,
  whyImpact,
  whyFooterStats,
} from "../data/content";
import { clientLogos } from "../data/work";
import "../styles/pages.css";

export function WhyDisplayAvenue() {
  return (
    <div className="page-shell">
      <SEO title="Why DisplayAvenue | DisplayAvenue" description="Why brands choose DisplayAvenue for measurable ROI, AI delivery, and transparent growth." path="/why-displayavenue" />
      <div className="container-wide">
        <div className="page-frame">
          <div className="page-grid-3">
            <aside className="page-left">
              <h1 className="section-title" style={{ color: "var(--blue)" }}>
                Why Choose DisplayAvenue?
              </h1>
              <p>
                Measurable ROI and sustainable growth are our mission - not just
                deliverables.
              </p>
              <ul className="feature-list">
                {whyPillars.map((item) => (
                  <li key={item.title}>
                    <span className="icon-box" style={{ background: `${item.color}18` }}>
                      <Icon name={item.icon} color={item.color} />
                    </span>
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="cta-box dark">
                <h4>Let’s Build Your Success Story</h4>
                <Link to="/contact" className="btn btn-outline btn-sm" style={{ background: "#fff" }}>
                  Book Free Consultation →
                </Link>
              </div>
            </aside>

            <div>
              <h2 style={{ fontSize: "0.95rem", color: "var(--navy)", marginBottom: "0.75rem" }}>
                Why Businesses Trust Us
              </h2>
              <div className="category-grid" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
                {whyTrustCards.map((item) => (
                  <div key={item.title} className="category-card">
                    <span className="icon-box" style={{ background: `${item.color}18` }}>
                      <Icon name={item.icon} color={item.color} />
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                ))}
              </div>

              <h2 style={{ fontSize: "0.95rem", color: "var(--navy)", margin: "1.5rem 0 0.75rem" }}>
                Our Core Strengths
              </h2>
              <div className="category-grid">
                {coreStrengths.map((item) => (
                  <div key={item.title} className="category-card">
                    <span className="icon-box" style={{ background: `${item.color}18` }}>
                      <Icon name={item.icon} color={item.color} />
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.desc}</p>
                  </div>
                ))}
              </div>

              <h2 style={{ fontSize: "0.95rem", color: "var(--navy)", margin: "1.5rem 0 0.75rem" }}>
                What Makes Us Different
              </h2>
              <div className="category-grid" style={{ gridTemplateColumns: "repeat(5, 1fr)" }}>
                {differentiators.map((item) => (
                  <div
                    key={item.title}
                    className="category-card"
                    style={{ background: "var(--blue-tint)", border: 0 }}
                  >
                    <Icon name={item.icon} color="#0056ff" />
                    <h3>{item.title}</h3>
                  </div>
                ))}
              </div>
            </div>

            <aside>
              <h3 style={{ fontSize: "0.95rem", color: "var(--navy)", marginBottom: "0.75rem" }}>
                Our Impact So Far
              </h3>
              <ul className="mega-stat-list">
                {whyImpact.map((stat) => (
                  <li key={stat.label}>
                    <Icon name={stat.icon} color={stat.color} />
                    <div>
                      <strong>{stat.value}</strong>
                      <span>{stat.label}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: "1.25rem" }}>
                <h4 style={{ fontSize: "0.9rem", color: "var(--navy)" }}>Loved by Our Clients</h4>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: "0.35rem 0" }}>
                  ★★★★★ 4.9/5 from 150+ reviews
                </p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Google · Clutch · GoodFirms
                </p>
                <Link to="/resources" className="link-arrow">
                  View All Reviews →
                </Link>
              </div>
              <div className="cta-box" style={{ marginTop: "1rem" }}>
                <h4>Ready to Grow Your Business?</h4>
                <Link to="/contact" className="btn btn-primary btn-sm">
                  Get Free Proposal →
                </Link>
              </div>
            </aside>
          </div>

          <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid var(--border-soft)" }}>
            <h3 style={{ fontSize: "0.95rem", color: "var(--navy)", marginBottom: "0.75rem" }}>
              Trusted by 500+ Brands
            </h3>
            <div className="logo-strip" style={{ justifyContent: "flex-start" }}>
              {clientLogos.map((logo) => (
                <span key={logo} className="logo-chip">
                  {logo}
                </span>
              ))}
              <span className="logo-chip">and many more...</span>
            </div>
          </div>

          <div className="bottom-bar" style={{ background: "var(--navy)", color: "#fff" }}>
            <div className="bottom-bar-items">
              {whyFooterStats.map((item) => (
                <span key={item.label} style={{ color: "rgba(255,255,255,0.85)" }}>
                  <Icon name={item.icon} size={16} color="#7dd3fc" />
                  <strong style={{ marginRight: 4 }}>{item.value}</strong> {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
