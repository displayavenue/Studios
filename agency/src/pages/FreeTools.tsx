import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { SEO } from "../components/SEO";
import {
  toolCategories,
  popularTools,
  toolStats,
  toolTrustBar,
} from "../data/tools";
import { linkableTools, industryReport } from "../data/linkableTools";
import "../styles/pages.css";
import "./tools/tools.css";

function liveHref(toolName: string, fallback: string) {
  if (toolName === "ROI Calculator") return "/free-tools/roi-calculator";
  if (toolName === "Website SEO Audit") return "/free-tools/seo-checklist";
  if (toolName === "Backlink Checker") return "/free-tools/citation-directory";
  const hit = linkableTools.find(
    (t) => t.shortTitle === toolName || t.title === toolName,
  );
  return hit?.href || fallback;
}

export function FreeTools() {
  return (
    <div className="page-shell">
      <SEO
        title="Free Marketing Tools | DisplayAvenue"
        description="Free ROI calculator, SEO checklist, local SEO scorecard, citation directory, and more. No signup required."
        path="/free-tools"
      />
      <div className="container-wide">
        <div className="page-frame">
          <div className="page-grid-3">
            <aside className="page-left">
              <span className="badge">100% FREE · Easy to Use · No Signup</span>
              <h1 className="section-title" style={{ marginTop: "0.75rem" }}>
                Powerful Free Tools to Grow Your Business
              </h1>
              <p>
                Professional-grade SEO, marketing, content, and developer tools
                - free forever.
              </p>
              <ul className="feature-list">
                {[
                  { icon: "check", title: "Accurate Results" },
                  { icon: "clock", title: "Save Time & Money" },
                  { icon: "users", title: "Built for Marketers" },
                  { icon: "shield", title: "No Signup Required" },
                ].map((item) => (
                  <li key={item.title}>
                    <Icon name={item.icon} color="#0056ff" />
                    <strong>{item.title}</strong>
                  </li>
                ))}
              </ul>
              <div className="cta-box">
                <h4>Want a custom growth strategy?</h4>
                <p>Talk to our experts for a free consultation.</p>
                <Link to="/contact" className="btn btn-primary btn-sm">
                  Book Free Consultation
                </Link>
              </div>
            </aside>

            <div>
              <div className="live-tools-banner">
                <div>
                  <h2>Live linkable tools</h2>
                  <p>
                    Interactive calculators and checklists you can use today - and that other sites
                    can link to. Share the URL freely.
                  </p>
                  <p style={{ marginTop: "0.65rem" }}>
                    <Link to={industryReport.href} className="link-arrow">
                      {industryReport.title} →
                    </Link>
                  </p>
                </div>
                <div className="live-tools-list">
                  {linkableTools.map((tool) => (
                    <Link key={tool.slug} to={tool.href}>
                      {tool.shortTitle}
                      <span>{tool.badge}</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mini-grid-4 tools-grid">
                {toolCategories.map((cat) => (
                  <div key={cat.title} className="tool-card">
                    <h3>
                      <span className="icon-box" style={{ background: `${cat.color}18` }}>
                        <Icon name={cat.icon} color={cat.color} size={16} />
                      </span>
                      {cat.title}
                    </h3>
                    <ul className="mega-links">
                      {cat.tools.map((tool) => (
                        <li key={tool}>
                          <Link to={liveHref(tool, cat.href)}>
                            {tool}
                            <Icon name="chevron" size={12} />
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link to={cat.href} className="link-arrow" style={{ marginTop: "0.55rem" }}>
                      View all {cat.title} →
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <aside>
              <div className="cta-box">
                <h4>All Tools. 100% Free.</h4>
                <p>No credit card. No account. Instant results.</p>
              </div>
              <h3 style={{ fontSize: "0.9rem", color: "var(--navy)", margin: "1rem 0 0.55rem" }}>
                Popular Tools
              </h3>
              <ul className="mega-links">
                {linkableTools.map((tool) => (
                  <li key={tool.slug}>
                    <Link to={tool.href}>
                      {tool.shortTitle}
                      <Icon name="chevron" size={12} />
                    </Link>
                  </li>
                ))}
                {popularTools.slice(0, 4).map((tool) => (
                  <li key={tool}>
                    <Link to={liveHref(tool, "/free-tools")}>
                      {tool}
                      <Icon name="chevron" size={12} />
                    </Link>
                  </li>
                ))}
              </ul>
              <h3 style={{ fontSize: "0.9rem", color: "var(--navy)", margin: "1rem 0 0.55rem" }}>
                By The Numbers
              </h3>
              <ul className="mega-stat-list">
                {toolStats.map((stat) => (
                  <li key={stat.label}>
                    <Icon name={stat.icon} color="#0056ff" />
                    <div>
                      <strong>{stat.value}</strong>
                      <span>{stat.label}</span>
                    </div>
                  </li>
                ))}
              </ul>
              <div style={{ marginTop: "1rem" }}>
                <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "var(--navy)" }}>
                  Loved by Marketers Worldwide
                </p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  ★★★★★ 170+ Reviews on Google
                </p>
                <Link
                  to="/free-tools/citation-directory"
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: "0.65rem" }}
                >
                  Citation & outreach kit
                </Link>
              </div>
            </aside>
          </div>

          <div className="bottom-bar">
            <div className="bottom-bar-items">
              {toolTrustBar.map((item) => (
                <span key={item.label}>
                  <Icon name={item.icon} size={16} color="#0056ff" />
                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .tools-grid { align-content: start; }
        @media (max-width: 1100px) {
          .tools-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 700px) {
          .tools-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
