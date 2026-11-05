import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { SEO } from "../components/SEO";
import {
  packageCategories,
  packageBenefits,
  packageIncludes,
} from "../data/packages";
import { clientLogos } from "../data/work";
import "../styles/pages.css";

export function Packages() {
  return (
    <div className="page-shell">
      <SEO title="Packages & Pricing | DisplayAvenue" description="Transparent digital marketing, SEO, ads, website, ecommerce, and branding packages." path="/packages" />
      <div className="container-wide">
        <div className="page-frame">
          <div className="page-grid-3">
            <aside className="page-left">
              <h1 className="section-title">
                Choose the Perfect Package For Your Growth
              </h1>
              <p>
                Transparent pricing and scalable packages designed for startups,
                SMBs, and enterprises.
              </p>
              <h3 style={{ marginTop: "1.25rem", fontSize: "0.95rem", color: "var(--navy)" }}>
                Why Choose Our Packages?
              </h3>
              <ul className="feature-list">
                {packageBenefits.map((item) => (
                  <li key={item.title}>
                    <span className="icon-box" style={{ background: `${item.color}18` }}>
                      <Icon name={item.icon} color={item.color} />
                    </span>
                    <div>
                      <strong>{item.title}</strong>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="cta-box dark">
                <h4>Not sure which package is right for you?</h4>
                <p>We’ll recommend the best plan for your goals and budget.</p>
                <Link to="/contact" className="btn btn-outline btn-sm" style={{ background: "#fff" }}>
                  Book Free Consultation
                </Link>
              </div>
            </aside>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }} className="packages-grid">
              {packageCategories.map((cat) => (
                <div key={cat.title} className="package-col">
                  <span className="icon-box" style={{ background: `${cat.color}18` }}>
                    <Icon name={cat.icon} color={cat.color} />
                  </span>
                  <h3>{cat.title}</h3>
                  <p>{cat.desc}</p>
                  <ul className="plan-list">
                    {cat.plans.map((plan) => (
                      <li key={plan.name}>
                        <span>{plan.name}</span>
                        <strong>{plan.price}</strong>
                      </li>
                    ))}
                  </ul>
                  <Link to={cat.href} className="link-arrow" style={{ marginTop: "0.55rem" }}>
                    View All →
                  </Link>
                </div>
              ))}
            </div>

            <aside>
              <h3 style={{ fontSize: "0.95rem", color: "var(--navy)", marginBottom: "0.75rem" }}>
                All Packages Include
              </h3>
              <ul className="feature-list">
                {packageIncludes.map((item) => (
                  <li key={item}>
                    <Icon name="check" color="#16a34a" size={16} />
                    <strong>{item}</strong>
                  </li>
                ))}
              </ul>
              <div className="cta-box">
                <h4>Need a Custom Package?</h4>
                <Link to="/contact" className="btn btn-primary btn-sm">
                  Request Custom Proposal
                </Link>
              </div>
              <div style={{ marginTop: "1rem" }}>
                <p style={{ fontWeight: 700, color: "var(--navy)", fontSize: "0.85rem" }}>
                  Trusted by 1200+ Businesses
                </p>
                <div className="logo-strip" style={{ justifyContent: "flex-start", marginTop: "0.55rem" }}>
                  {clientLogos.slice(0, 4).map((logo) => (
                    <span key={logo} className="logo-chip">
                      {logo}
                    </span>
                  ))}
                </div>
                <p style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  ★★★★★ 170+ Reviews on Google · Clutch · GoodFirms
                </p>
              </div>
            </aside>
          </div>

          <div className="bottom-bar">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Icon name="tag" color="#0056ff" />
              <strong style={{ color: "var(--navy)" }}>Save More with Annual Plans!</strong>
            </div>
            <div className="bottom-bar-items">
              <span>20% OFF</span>
              <span>Priority Support</span>
              <span>Free Strategy Session</span>
              <span>Flexible Upgrades</span>
            </div>
            <Link to="/contact" className="btn btn-primary btn-sm">
              Get Annual Plan Benefits →
            </Link>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 1100px) {
          .packages-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 700px) {
          .packages-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
