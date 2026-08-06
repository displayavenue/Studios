import { Link } from "react-router-dom";
import type { DetailPageContent } from "../../data/catalogTypes";
import { FaqBlock, LeadStrip, RelatedBlock } from "./shared";

export function CaseDetailLayout({ page }: { page: DetailPageContent }) {
  return (
    <div className="detail-page layout-case">
      <section className="case-hero">
        <div className="container">
          {(page.coverImage || page.image) && (
            <div className="case-hero-media">
              <img src={page.coverImage || page.image} alt="" loading="eager" />
            </div>
          )}
          <p className="badge">{page.category}</p>
          <h1>{page.headline}</h1>
          <p className="detail-summary">{page.summary}</p>
          <div className="case-metrics">
            {(page.metrics || []).map((m) => (
              <div key={m.label}>
                <strong>{m.value}</strong>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {page.intro && (
        <section className="section">
          <div className="container detail-prose case-story">
            <h2 className="section-title">The story</h2>
            {page.intro.split("\n\n").map((para) => (
              <p key={para.slice(0, 40)}>{para}</p>
            ))}
          </div>
        </section>
      )}

      <section className="section detail-alt">
        <div className="container">
          <h2 className="section-title">What we did</h2>
          <div className="case-actions">
            {page.process.map((s) => (
              <article key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Results & takeaways</h2>
          <ul className="case-results">
            {page.deliverables.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
          <Link to="/contact" className="btn btn-primary" style={{ marginTop: "1.25rem" }}>
            Want similar results? →
          </Link>
        </div>
      </section>

      <FaqBlock page={page} />
      <LeadStrip page={page} primary="Request a similar growth plan →" />
      <RelatedBlock page={page} />
    </div>
  );
}
