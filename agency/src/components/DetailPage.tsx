import { Link } from "react-router-dom";
import { Icon } from "./Icon";
import type { DetailPageContent } from "../data/catalogTypes";
import "./DetailPage.css";

export function DetailPage({ page }: { page: DetailPageContent }) {
  return (
    <div className="detail-page">
      <section className="detail-hero" style={{ ["--accent" as string]: page.color }}>
        <div className="container detail-hero-grid">
          <div>
            <p className="badge">{page.eyebrow || page.category}</p>
            <h1>{page.headline}</h1>
            <p className="detail-summary">{page.summary}</p>
            <div className="detail-hero-actions">
              <Link to="/contact" className="btn btn-primary">
                {page.ctaLabel ?? "Get Free Proposal"} →
              </Link>
              <Link to="/packages" className="btn btn-outline">
                View Packages
              </Link>
            </div>
            {page.metrics && (
              <div className="detail-metrics">
                {page.metrics.map((m) => (
                  <div key={m.label}>
                    <strong>{m.value}</strong>
                    <span>{m.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="detail-hero-card">
            <span className="icon-box" style={{ background: `${page.color}22` }}>
              <Icon name={page.icon} color={page.color} size={28} />
            </span>
            <h2>{page.title}</h2>
            <p>{page.category}</p>
            <ul>
              {page.deliverables.slice(0, 5).map((item) => (
                <li key={item}>
                  <Icon name="check" size={14} color={page.color} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Why DisplayAvenue for {page.title}</h2>
          <div className="detail-benefits">
            {page.benefits.map((b) => (
              <div key={b.title} className="detail-benefit card">
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section detail-alt">
        <div className="container detail-two">
          <div>
            <h2 className="section-title">What you get</h2>
            <ul className="detail-list">
              {page.deliverables.map((item) => (
                <li key={item}>
                  <Icon name="check" color="#16a34a" size={16} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="section-title">How we deliver</h2>
            <ol className="detail-process">
              {page.process.map((step, i) => (
                <li key={step.title}>
                  <span>{i + 1}</span>
                  <div>
                    <strong>{step.title}</strong>
                    <p>{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">FAQs</h2>
          <div className="detail-faqs">
            {page.faqs.map((faq) => (
              <details key={faq.q} className="card">
                <summary>{faq.q}</summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section detail-alt">
        <div className="container detail-related">
          <h2 className="section-title">Next steps</h2>
          <div className="detail-related-grid">
            {page.related.map((item) => (
              <Link key={item.href + item.label} to={item.href} className="category-card">
                <h3>{item.label}</h3>
                <span className="link-arrow">Continue →</span>
              </Link>
            ))}
          </div>
          <div className="detail-bottom-cta">
            <div>
              <h3>Ready to get started with {page.title}?</h3>
              <p>Talk to our team for a free consultation and custom proposal.</p>
            </div>
            <Link to="/contact" className="btn btn-primary">
              Book Free Consultation →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export function NotFoundDetail({ kind, slug }: { kind: string; slug?: string }) {
  return (
    <div className="container" style={{ padding: "4rem 0" }}>
      <p className="badge">Not found</p>
      <h1 className="section-title" style={{ marginTop: "0.75rem" }}>
        {kind} page not found
      </h1>
      <p className="section-sub">
        We couldn’t find {slug ? `"${slug}"` : "this page"}. Browse services from the menu or contact us.
      </p>
      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
        <Link to="/services" className="btn btn-primary">
          Browse Services
        </Link>
        <Link to="/contact" className="btn btn-outline">
          Contact Us
        </Link>
      </div>
    </div>
  );
}
