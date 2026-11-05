import { Link } from "react-router-dom";
import { Icon } from "../Icon";
import {
  solutionCategories,
  solutionValues,
  solutionTrustBar,
} from "../../data/solutions";
import { company } from "../../data/company";
import { clientLogos } from "../../data/work";
import "./menus.css";

export function SolutionsMenu({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`mega ${compact ? "mega-compact" : ""}`}>
      <div className="solutions-layout">
        <aside>
          <span className="badge">Smart Solutions for Every Goal</span>
          <h3 className="section-title" style={{ fontSize: "1.15rem", marginTop: "0.75rem" }}>
            End-to-End Digital Solutions to Grow Your Business
          </h3>
          <p className="section-sub" style={{ fontSize: "0.82rem" }}>
            AI-driven strategies across marketing, product, and operations —
            tailored to your goals, size, and industry.
          </p>
          <ul className="value-list">
            {solutionValues.map((item) => (
              <li key={item.title}>
                <span className="icon-box" style={{ background: "#e8f0ff" }}>
                  <Icon name={item.icon} color="#0056ff" size={16} />
                </span>
                <div>
                  <strong>{item.title}</strong>
                </div>
              </li>
            ))}
          </ul>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
            Not sure which solution fits you?{" "}
            <Link to="/contact" className="link-arrow">
              Get Free Solution Consultation
            </Link>
          </p>
        </aside>

        <div className="solutions-grid">
          {solutionCategories.map((cat) => (
            <div key={cat.title} className="mega-col">
              <div className="mega-col-title">
                <span
                  className="icon-box"
                  style={{ background: `${cat.color}18` }}
                >
                  <Icon name={cat.icon} color={cat.color} size={16} />
                </span>
                {cat.title}
              </div>
              <ul className="mega-links">
                {cat.links.map((item) => (
                  <li key={item.href}>
                    <Link to={item.href}>
                      {item.label}
                      <Icon name="chevron" size={12} />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                className="mega-view-all"
                to="/solutions"
                style={{ color: cat.color }}
              >
                {cat.viewAll} →
              </Link>
            </div>
          ))}
        </div>

        <aside>
          <div className="mega-side-card">
            <h4>Need a Custom Solution Just for Your Business?</h4>
            <p>Tell us your goals — we’ll design a roadmap around them.</p>
            <Link to="/contact" className="btn btn-primary btn-sm">
              Request Custom Solution
            </Link>
          </div>
          <ul className="mega-stat-list" style={{ marginTop: "1rem" }}>
            <li>
              <Icon name="briefcase" color="#0056ff" />
              <div>
                <strong>{company.stats.projects}</strong>
                <span>Successful Projects</span>
              </div>
            </li>
            <li>
              <Icon name="users" color="#16a34a" />
              <div>
                <strong>{company.stats.industries}</strong>
                <span>Industries Served</span>
              </div>
            </li>
            <li>
              <Icon name="heart" color="#e11d8c" />
              <div>
                <strong>{company.stats.satisfaction}</strong>
                <span>Client Satisfaction</span>
              </div>
            </li>
            <li>
              <Icon name="globe" color="#7c3aed" />
              <div>
                <strong>{company.stats.countries}</strong>
                <span>Countries Impacted</span>
              </div>
            </li>
          </ul>
          <div style={{ marginTop: "1rem" }}>
            <div className="mega-subhead">Trusted by leading brands</div>
            <div className="partner-row" style={{ border: 0, padding: 0 }}>
              {clientLogos.slice(0, 4).map((logo) => (
                <span key={logo} className="partner-pill">
                  {logo}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {!compact && (
        <div className="mega-trust">
          {solutionTrustBar.map((item) => (
            <div key={item.label} className="mega-trust-item">
              <Icon name={item.icon} size={16} color="#0056ff" />
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
