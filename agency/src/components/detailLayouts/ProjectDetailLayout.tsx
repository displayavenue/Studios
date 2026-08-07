import { Link } from "react-router-dom";
import { Icon } from "../Icon";
import type { DetailPageContent } from "../../data/catalogTypes";
import { FaqBlock, LeadStrip, RelatedBlock } from "./shared";

export function ProjectDetailLayout({ page }: { page: DetailPageContent }) {
  return (
    <div className="detail-page layout-project">
      <section className="proj-hero">
        <div className="container">
          <p className="badge">{page.category}</p>
          <h1>{page.headline}</h1>
          <p className="detail-summary">{page.summary}</p>
          <div className="detail-hero-actions">
            <Link to="/contact" className="btn btn-primary">
              Start a similar project →
            </Link>
            <Link to="/portfolio" className="btn btn-outline">
              Full portfolio
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container proj-grid">
          <div>
            <h2 className="section-title">Project highlights</h2>
            <ul className="feature-list">
              {page.deliverables.map((d) => (
                <li key={d}>
                  <Icon name="check" color="#0056ff" />
                  <strong>{d}</strong>
                </li>
              ))}
            </ul>
          </div>
          <aside className="card">
            <h3>Approach</h3>
            {page.process.map((s) => (
              <div key={s.title} style={{ marginBottom: "0.85rem" }}>
                <strong>{s.title}</strong>
                <p style={{ color: "var(--text-muted)", marginTop: "0.25rem" }}>{s.desc}</p>
              </div>
            ))}
          </aside>
        </div>
      </section>

      {page.intro && (
        <section className="section detail-alt">
          <div className="container detail-prose">
            {page.intro.split("\n\n").map((para) => (
              <p key={para.slice(0, 40)}>{para}</p>
            ))}
          </div>
        </section>
      )}

      <FaqBlock page={page} />
      <LeadStrip page={page} primary="Brief us on your project →" />
      <RelatedBlock page={page} />
    </div>
  );
}
