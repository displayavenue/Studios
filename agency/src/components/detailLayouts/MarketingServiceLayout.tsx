import { Link } from "react-router-dom";
import { Icon } from "../Icon";
import type { DetailPageContent } from "../../data/catalogTypes";
import { FaqBlock, LeadStrip, RelatedBlock } from "./shared";

export function MarketingServiceLayout({ page }: { page: DetailPageContent }) {
  return (
    <div className="detail-page layout-marketing">
      <section className="mkt-hero">
        <div className="container mkt-hero-grid">
          <div>
            <p className="badge">{page.category}</p>
            <h1>{page.headline}</h1>
            <p className="detail-summary">{page.summary}</p>
            <div className="detail-hero-actions">
              <Link to="/contact" className="btn btn-primary">
                {page.ctaLabel || "Get Free Growth Plan"} →
              </Link>
              <Link to="/packages" className="btn btn-outline">
                Compare packages
              </Link>
            </div>
          </div>
          <div className="mkt-metrics">
            {(page.metrics || []).map((m) => (
              <div key={m.label}>
                <strong>{m.value}</strong>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Outcomes we optimize for</h2>
          <div className="mkt-split">
            <div className="mkt-outcomes">
              {page.benefits.map((b) => (
                <div key={b.title} className="detail-benefit card">
                  <h3>{b.title}</h3>
                  <p>{b.desc}</p>
                </div>
              ))}
            </div>
            <aside className="mkt-deliverables card">
              <h3>What you receive</h3>
              <ul>
                {page.deliverables.map((d) => (
                  <li key={d}>
                    <Icon name="check" size={14} color="#16a34a" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {page.intro && (
        <section className="section detail-alt">
          <div className="container detail-prose">
            <h2 className="section-title">How we run {page.title}</h2>
            {page.intro.split("\n\n").map((para) => (
              <p key={para.slice(0, 40)}>{para}</p>
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <div className="container">
          <h2 className="section-title">Weekly operating cadence</h2>
          <div className="mkt-process">
            {page.process.map((s) => (
              <article key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {page.reviews && page.reviews[0] && (
        <section className="section detail-alt">
          <div className="container">
            <blockquote className="mkt-quote">
              <p>“{page.reviews[0].quote}”</p>
              <footer>
                {page.reviews[0].name} · {page.reviews[0].role}
              </footer>
            </blockquote>
          </div>
        </section>
      )}

      <FaqBlock page={page} />
      <LeadStrip
        page={page}
        primary="Book free marketing audit →"
        secondary={{ label: "View case studies", href: "/case-studies" }}
      />
      <RelatedBlock page={page} />
    </div>
  );
}
