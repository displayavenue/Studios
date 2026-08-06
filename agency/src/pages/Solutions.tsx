import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { useCms } from "../cms/CmsProvider";
import { SEO } from "../components/SEO";
import { solutionCategories } from "../data/solutions";
import "../styles/pages.css";

export function Solutions() {
  const { solutions } = useCms();
  return (
    <div className="page-shell">
      <SEO title="Digital Solutions | DisplayAvenue" description="Solutions by goals, business size, platform, technology, channel, and industry." path="/solutions" />
      <div className="container">
        <div className="page-frame" style={{ padding: "1.75rem" }}>
          <p className="badge">Smart Solutions for Every Goal</p>
          <h1 className="section-title" style={{ marginTop: "0.65rem" }}>
            End-to-End Digital Solutions to Grow Your Business
          </h1>
          <p className="section-sub">
            Browse solutions by goals, size, platform, technology, channel,
            industry, journey, and service type - each with a dedicated page.
          </p>
          <div style={{ marginTop: "1rem" }}>
            <Link to="/contact" className="btn btn-primary">
              Get Free Solution Consultation →
            </Link>
          </div>

          <div className="category-grid" style={{ marginTop: "1.75rem" }}>
            {solutions.map((item) => (
              <Link
                key={item.slug}
                to={`/solutions/${item.slug}`}
                className="category-card"
              >
                <span className="icon-box" style={{ background: "#e8f0ff" }}>
                  <Icon name={item.icon} color="#0056ff" />
                </span>
                <h3>{item.title}</h3>
                <p>{item.summary.slice(0, 80)}…</p>
              </Link>
            ))}
          </div>

          <h2 className="section-title" style={{ marginTop: "2rem", fontSize: "1.2rem" }}>
            Explore by category
          </h2>
          <div className="category-grid" style={{ marginTop: "0.85rem" }}>
            {solutionCategories.map((cat) => (
              <div key={cat.title} className="tool-card">
                <h3>
                  <span className="icon-box" style={{ background: `${cat.color}18` }}>
                    <Icon name={cat.icon} color={cat.color} size={16} />
                  </span>
                  {cat.title}
                </h3>
                <ul className="mega-links">
                  {cat.links.map((link) => (
                    <li key={link.href}>
                      <Link to={link.href}>
                        {link.label}
                        <Icon name="chevron" size={12} />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
