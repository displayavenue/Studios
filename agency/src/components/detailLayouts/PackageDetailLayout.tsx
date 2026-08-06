import { Link } from "react-router-dom";
import { Icon } from "../Icon";
import type { DetailPageContent } from "../../data/catalogTypes";
import { FaqBlock, LeadStrip, RelatedBlock } from "./shared";

export function PackageDetailLayout({ page }: { page: DetailPageContent }) {
  return (
    <div className="detail-page layout-package">
      <section className="pkg-hero">
        <div className="container pkg-hero-grid">
          <div>
            <p className="badge">Transparent packages</p>
            <h1>{page.headline}</h1>
            <p className="detail-summary">{page.summary}</p>
            <div className="detail-hero-actions">
              <Link to="/contact" className="btn btn-primary">
                Start with this package →
              </Link>
              <Link to="/contact" className="btn btn-outline">
                Ask for custom scope
              </Link>
            </div>
          </div>
          <aside className="pkg-card">
            <h2>{page.title}</h2>
            <ul>
              {page.deliverables.map((d) => (
                <li key={d}>
                  <Icon name="check" size={14} color="#16a34a" />
                  {d}
                </li>
              ))}
            </ul>
            <Link to="/contact" className="btn btn-primary">
              {page.ctaLabel || "Talk to sales"}
            </Link>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="section-title">Why clients pick this package</h2>
          <div className="pkg-benefits">
            {page.benefits.map((b) => (
              <article key={b.title}>
                <h3>{b.title}</h3>
                <p>{b.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section detail-alt">
        <div className="container">
          <h2 className="section-title">Onboarding timeline</h2>
          <div className="pkg-timeline">
            {page.process.map((s) => (
              <div key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqBlock page={page} title="Package FAQs" />
      <LeadStrip
        page={page}
        primary="Get exact pricing →"
        secondary={{ label: "Compare all packages", href: "/packages" }}
      />
      <RelatedBlock page={page} />
    </div>
  );
}
