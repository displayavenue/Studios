import { Link } from "react-router-dom";
import { Icon } from "../Icon";
import type { DetailPageContent } from "../../data/catalogTypes";
import { toolCategories } from "../../data/tools";
import { getExternalToolUrl } from "../../data/toolLinks";
import { FaqBlock, LeadStrip, RelatedBlock } from "./shared";

export function ToolDetailLayout({ page }: { page: DetailPageContent }) {
  const cat = toolCategories.find(
    (c) => c.href.endsWith(`/${page.slug}`) || c.title === page.title,
  );
  return (
    <div className="detail-page layout-tool">
      <section className="tool-hero">
        <div className="container">
          <p className="badge">100% free · No signup required</p>
          <h1>{page.headline}</h1>
          <p className="detail-summary">{page.summary}</p>
        </div>
      </section>

      {cat && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">Open a free tool now</h2>
            <ul className="mega-links detail-tool-links">
              {cat.tools.map((tool) => {
                const url = getExternalToolUrl(tool);
                return (
                  <li key={tool}>
                    {url ? (
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        {tool}
                        <Icon name="external" size={14} />
                      </a>
                    ) : (
                      <span>{tool}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      <section className="section detail-alt">
        <div className="container tool-upsell card">
          <h2 className="section-title">Need this done for you?</h2>
          <p>
            Free tools are great for quick checks. If you want a managed growth
            system, our team can run strategy, execution, and reporting end-to-end.
          </p>
          <div className="detail-hero-actions">
            <Link to="/contact" className="btn btn-primary">
              Book free consultation →
            </Link>
            <Link to="/services" className="btn btn-outline">
              Browse services
            </Link>
          </div>
        </div>
      </section>

      <FaqBlock page={page} />
      <LeadStrip page={page} primary="Talk to a strategist →" />
      <RelatedBlock page={page} />
    </div>
  );
}
