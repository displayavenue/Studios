import { Link } from "react-router-dom";
import { Icon } from "../Icon";
import type { DetailPageContent } from "../../data/catalogTypes";
import { FaqBlock, LeadStrip, RelatedBlock } from "./shared";

export function IndustryDetailLayout({ page }: { page: DetailPageContent }) {
  return (
    <div className="detail-page layout-industry">
      <section className="ind-hero">
        <div className="container">
          <p className="badge">Industry playbook</p>
          <h1>{page.headline}</h1>
          <p className="detail-summary">{page.summary}</p>
          <div className="detail-hero-actions">
            <Link to="/contact" className="btn btn-primary">
              Get industry growth plan →
            </Link>
            <Link to="/services" className="btn btn-outline">
              Browse services
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Challenges we solve in {page.title}</h2>
          <div className="ind-pain-grid">
            {page.benefits.map((b) => (
              <article key={b.title} className="ind-pain-card">
                <Icon name="target" color="#0056ff" />
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section detail-alt">
        <div className="container ind-split">
          <div>
            <h2 className="section-title">Engagement blueprint</h2>
            <ol className="ind-steps">
              {page.process.map((s, i) => (
                <li key={s.title}>
                  <strong>{i + 1}. {s.title}</strong>
                  <span>{s.desc}</span>
                </li>
              ))}
            </ol>
          </div>
          <aside className="card">
            <h3>Deliverables for {page.title}</h3>
            <ul className="feature-list">
              {page.deliverables.map((d) => (
                <li key={d}>
                  <Icon name="check" color="#0056ff" />
                  <strong>{d}</strong>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {page.sections && page.sections.length > 0 && (
        <section className="section">
          <div className="container detail-sections">
            {page.sections.slice(0, 4).map((sec) => (
              <article key={sec.title} className="detail-section-block">
                <h2 className="section-title">{sec.title}</h2>
                <p>{sec.body}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <FaqBlock page={page} title={`${page.title} marketing FAQs`} />
      <LeadStrip
        page={page}
        primary="Talk to an industry specialist →"
        secondary={{ label: "See related solutions", href: "/solutions" }}
      />
      <RelatedBlock page={page} />
    </div>
  );
}
