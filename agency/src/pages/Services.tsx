import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { servicePages, serviceCategories } from "../data/serviceCatalog";
import "../styles/pages.css";

export function Services() {
  return (
    <div className="page-shell">
      <div className="container">
        <div className="page-frame" style={{ padding: "1.75rem" }}>
          <p className="badge">What We Do</p>
          <h1 className="section-title" style={{ marginTop: "0.65rem" }}>
            70+ Services Across Marketing, Product, AI & Creative
          </h1>
          <p className="section-sub">
            Explore every DisplayAvenue service. Open any card for a full page
            with deliverables, process, FAQs, and next steps.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1rem" }}>
            <Link to="/contact" className="btn btn-primary">
              Request Custom Solution →
            </Link>
            <Link to="/packages" className="btn btn-outline">
              View Packages
            </Link>
          </div>

          {serviceCategories.map((category) => {
            const items = servicePages.filter((p) => p.category === category);
            return (
              <section key={category} style={{ marginTop: "2rem" }}>
                <h2 style={{ fontSize: "1.05rem", color: "var(--navy)", marginBottom: "0.75rem" }}>
                  {category}
                </h2>
                <div className="category-grid">
                  {items.map((item) => (
                    <Link
                      key={item.slug}
                      to={`/services/${item.slug}`}
                      className="category-card"
                    >
                      <span
                        className="icon-box"
                        style={{ background: `${item.color}18` }}
                      >
                        <Icon name={item.icon} color={item.color} />
                      </span>
                      <h3>{item.title}</h3>
                      <p>{item.summary.slice(0, 90)}…</p>
                      <span className="arrow">
                        <Icon name="arrow" size={14} />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
