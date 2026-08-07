import { Link } from "react-router-dom";
import type { DetailPageContent } from "../../data/catalogTypes";
import { FaqBlock, LeadStrip, RelatedBlock } from "./shared";

export function ResourceDetailLayout({ page }: { page: DetailPageContent }) {
  return (
    <div className="detail-page layout-resource">
      <article className="res-article">
        <header className="res-header">
          <div className="container">
            <p className="badge">{page.category}</p>
            <h1>{page.headline}</h1>
            <p className="detail-summary">{page.summary}</p>
          </div>
        </header>

        <div className="container res-body">
          {page.intro &&
            page.intro.split("\n\n").map((para) => (
              <p key={para.slice(0, 40)}>{para}</p>
            ))}

          {(page.sections || []).map((sec) => (
            <section key={sec.title}>
              <h2>{sec.title}</h2>
              <p>{sec.body}</p>
            </section>
          ))}

          <div className="res-cta card">
            <h3>Put this into action</h3>
            <p>We can help you implement this playbook across channels and stack.</p>
            <Link to="/contact" className="btn btn-primary">
              Book a strategy call →
            </Link>
          </div>
        </div>
      </article>

      <FaqBlock page={page} title="Reader questions" />
      <LeadStrip page={page} primary="Get a custom playbook →" />
      <RelatedBlock page={page} />
    </div>
  );
}
