import { Link } from "react-router-dom";
import { AiPlatformMenu } from "../components/menus/AiPlatformMenu";
import { useCms } from "../cms/CmsProvider";
import { SEO } from "../components/SEO";
import { Icon } from "../components/Icon";
import "../styles/pages.css";

export function AiPlatform() {
  const { ai } = useCms();
  return (
    <div className="page-shell">
      <SEO title="AI Platform | DisplayAvenue" description="100+ AI tools for marketing, sales, content, automation, analytics, and development." path="/ai-platform" />
      <div className="container-wide">
        <div className="page-frame" style={{ padding: "1.25rem 1.25rem 0" }}>
          <AiPlatformMenu />
        </div>
        <div className="page-frame" style={{ padding: "1.5rem", marginTop: "1rem" }}>
          <h2 className="section-title" style={{ fontSize: "1.25rem" }}>
            Explore AI suites
          </h2>
          <p className="section-sub">
            Every suite has a dedicated page with deliverables, process, and FAQs.
          </p>
          <div className="category-grid" style={{ marginTop: "1rem" }}>
            {ai.map((item) => (
              <Link key={item.slug} to={`/ai-platform/${item.slug}`} className="category-card">
                <span className="icon-box" style={{ background: `${item.color}18` }}>
                  <Icon name={item.icon} color={item.color} />
                </span>
                <h3>{item.title}</h3>
                <p>{item.summary.slice(0, 90)}…</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
