import { Link } from "react-router-dom";
import { Icon } from "../Icon";
import type { DetailPageContent } from "../../data/catalogTypes";
import { FaqBlock, LeadStrip, RelatedBlock } from "./shared";

export function SolutionDetailLayout({ page }: { page: DetailPageContent }) {
  return (
    <div className="detail-page layout-solution">
      <section className="sol-hero">
        <div className="container sol-hero-grid">
          <div>
            <p className="badge">Solution · {page.category}</p>
            <h1>{page.headline}</h1>
            <p className="detail-summary">{page.summary}</p>
            <div className="detail-hero-actions">
              <Link to="/contact" className="btn btn-primary">
                Build this solution with us →
              </Link>
              <Link to="/ai-platform" className="btn btn-outline">
                Explore AI Platform
              </Link>
            </div>
          </div>
          <div className="sol-scorecard card">
            <h3>Success scorecard</h3>
            {(page.metrics || []).map((m) => (
              <div key={m.label} className="sol-score-row">
                <strong>{m.value}</strong>
                <span>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">From challenge to operating system</h2>
          <div className="sol-flow">
            {page.process.map((s, i) => (
              <div key={s.title} className="sol-flow-step">
                <span>{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section detail-alt">
        <div className="container">
          <h2 className="section-title">Capabilities inside this solution</h2>
          <div className="detail-benefits">
            {page.benefits.map((b) => (
              <div key={b.title} className="detail-benefit card">
                <Icon name="check" color="#0056ff" />
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqBlock page={page} />
      <LeadStrip
        page={page}
        primary="Request solution blueprint →"
        secondary={{ label: "View packages", href: "/packages" }}
      />
      <RelatedBlock page={page} />
    </div>
  );
}
