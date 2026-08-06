import { Link } from "react-router-dom";
import { Icon } from "../Icon";
import type { DetailPageContent } from "../../data/catalogTypes";
import { aiSuites } from "../../data/ai";
import { getAiToolUrl } from "../../data/aiToolLinks";
import { FaqBlock, LeadStrip, RelatedBlock } from "./shared";

export function AiDetailLayout({ page }: { page: DetailPageContent }) {
  const suite = aiSuites.find(
    (s) => s.href.endsWith(`/${page.slug}`) || s.title === page.title,
  );
  return (
    <div className="detail-page layout-ai">
      <section className="ai-detail-hero">
        <div className="container">
          <p className="badge">AI Platform suite</p>
          <h1>{page.headline}</h1>
          <p className="detail-summary">{page.summary}</p>
          <div className="detail-hero-actions">
            <Link to="/contact" className="btn btn-primary" style={{ background: "#7c3aed" }}>
              Book free AI consultation →
            </Link>
            <Link to="/ai-platform" className="btn btn-outline">
              All AI suites
            </Link>
          </div>
        </div>
      </section>

      {suite && (
        <section className="section">
          <div className="container">
            <h2 className="section-title">Free tools in this suite</h2>
            <p className="section-sub">Click any tool to open a free utility in a new tab.</p>
            <ul className="mega-links detail-tool-links ai-tool-grid">
              {suite.tools.map((tool) => {
                const url = getAiToolUrl(tool);
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
        <div className="container">
          <h2 className="section-title">What teams use this suite for</h2>
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

      <FaqBlock page={page} />
      <LeadStrip
        page={page}
        primary="Get AI workflow demo →"
        secondary={{ label: "Explore free tools", href: "/free-tools" }}
      />
      <RelatedBlock page={page} />
    </div>
  );
}
