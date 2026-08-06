import { Link } from "react-router-dom";
import { Icon } from "../Icon";
import type { DetailPageContent } from "../../data/catalogTypes";
import { FaqBlock, LeadStrip, RelatedBlock } from "./shared";

/** Default service layout for creative, web, ecommerce, design, etc. */
export function ServiceDetailLayout({ page }: { page: DetailPageContent }) {
  return (
    <div className="detail-page layout-service">
      <section className="svc-hero" style={{ ["--accent" as string]: page.color }}>
        <div className="container svc-hero-grid">
          <div>
            <p className="badge">{page.eyebrow || page.category}</p>
            <h1>{page.headline}</h1>
            <p className="detail-summary">{page.summary}</p>
            <div className="detail-hero-actions">
              <Link to="/contact" className="btn btn-primary">
                {page.ctaLabel || "Get Free Proposal"} →
              </Link>
              <Link to="/portfolio" className="btn btn-outline">
                View work
              </Link>
            </div>
          </div>
          <div className="svc-side card">
            <span className="icon-box" style={{ background: `${page.color}18` }}>
              <Icon name={page.icon} color={page.color} size={28} />
            </span>
            <h2>{page.title}</h2>
            <ul>
              {page.deliverables.slice(0, 6).map((d) => (
                <li key={d}>
                  <Icon name="check" size={14} color={page.color} />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {page.intro && (
        <section className="section">
          <div className="container detail-prose">
            <h2 className="section-title">About our {page.title}</h2>
            {page.intro.split("\n\n").map((para) => (
              <p key={para.slice(0, 40)}>{para}</p>
            ))}
          </div>
        </section>
      )}

      <section className="section detail-alt">
        <div className="container">
          <h2 className="section-title">Why brands hire us for {page.title}</h2>
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

      <section className="section">
        <div className="container">
          <h2 className="section-title">Delivery process</h2>
          <div className="svc-process">
            {page.process.map((s, i) => (
              <article key={s.title}>
                <span>{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {page.sections && page.sections.length > 0 && (
        <section className="section detail-alt">
          <div className="container detail-sections">
            {page.sections.slice(0, 3).map((sec) => (
              <article key={sec.title} className="detail-section-block">
                <h2 className="section-title">{sec.title}</h2>
                <p>{sec.body}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <FaqBlock page={page} />
      <LeadStrip
        page={page}
        primary={`${page.ctaLabel || "Get Free Proposal"} →`}
        secondary={{ label: "See packages", href: "/packages" }}
      />
      <RelatedBlock page={page} />
    </div>
  );
}
