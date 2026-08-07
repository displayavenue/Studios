import { Link } from "react-router-dom";
import { Icon } from "../Icon";
import { aiSuites, aiValues, aiStats, aiPartners } from "../../data/ai";
import { getAiToolUrl } from "../../data/aiToolLinks";
import "./menus.css";

function AiToolLink({
  name,
  suiteHref,
  color,
}: {
  name: string;
  suiteHref: string;
  color: string;
}) {
  const url = getAiToolUrl(name);
  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer">
        {name}
        <Icon name="external" size={12} color={color} />
      </a>
    );
  }
  return (
    <Link to={suiteHref}>
      {name}
      <Icon name="chevron" size={12} />
    </Link>
  );
}

export function AiPlatformMenu({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`mega ${compact ? "mega-compact" : ""}`}>
      <div className="ai-layout">
        <aside>
          <Link to="/ai-platform" className="ai-menu-brand">
            <h3
              className="section-title"
              style={{
                fontSize: "1.2rem",
                background: "linear-gradient(90deg,#0056ff,#7c3aed)",
                WebkitBackgroundClip: "text",
                color: "transparent",
              }}
            >
              DisplayAvenue AI Platform
            </h3>
          </Link>
          <p className="section-sub" style={{ fontSize: "0.82rem" }}>
            Powerful AI tools and automation platforms to transform your
            marketing, sales, operations and customer experience.
          </p>
          <ul className="value-list">
            {aiValues.map((item) => (
              <li key={item.title}>
                <span className="icon-box" style={{ background: "#efe7ff" }}>
                  <Icon name={item.icon} color="#7c3aed" size={16} />
                </span>
                <div>
                  <strong>{item.title}</strong>
                  {item.desc}
                </div>
              </li>
            ))}
          </ul>
          <div className="mega-side-dark">
            <h4>Not sure which AI solution is right for you?</h4>
            <Link to="/contact" className="btn btn-primary btn-sm" style={{ background: "#7c3aed" }}>
              Book Free AI Consultation →
            </Link>
          </div>
        </aside>

        <div className="ai-grid">
          {aiSuites.map((suite) => (
            <div key={suite.title} className="mega-col">
              <Link to={suite.href} className="mega-col-title">
                <span
                  className="icon-box"
                  style={{ background: `${suite.color}18` }}
                >
                  <Icon name={suite.icon} color={suite.color} size={16} />
                </span>
                {suite.title}
              </Link>
              <ul className="mega-links">
                {suite.tools.slice(0, 8).map((tool) => (
                  <li key={tool}>
                    <AiToolLink
                      name={tool}
                      suiteHref={suite.href}
                      color={suite.color}
                    />
                  </li>
                ))}
              </ul>
              <Link
                className="mega-view-all"
                to={suite.href}
                style={{ color: suite.color }}
              >
                View All →
              </Link>
            </div>
          ))}
        </div>

        <aside>
          <div className="mega-side-card" style={{ background: "#f3e8ff" }}>
            <h4>One AI Platform. Endless Possibilities.</h4>
            <p>Explore 100+ tools built for real business workflows.</p>
            <Link
              to="/ai-platform"
              className="btn btn-primary btn-sm"
              style={{ background: "#7c3aed" }}
            >
              Explore AI Platform →
            </Link>
          </div>
          <ul className="mega-stat-list" style={{ marginTop: "1rem" }}>
            {aiStats.map((stat) => (
              <li key={stat.label}>
                <Icon name={stat.icon} color="#7c3aed" />
                <div>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {!compact && (
        <div className="partner-row">
          <span>Works with Your Favorite Tools</span>
          {aiPartners.map((p) => (
            <span key={p} className="partner-pill">
              {p}
            </span>
          ))}
          <span>and 50+ more.</span>
        </div>
      )}
    </div>
  );
}
