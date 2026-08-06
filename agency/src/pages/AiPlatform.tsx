import { Link } from "react-router-dom";
import { AiPlatformMenu } from "../components/menus/AiPlatformMenu";
import "../styles/pages.css";

export function AiPlatform() {
  return (
    <div className="page-shell">
      <div className="container-wide">
        <div className="page-frame" style={{ padding: "1.25rem 1.25rem 0" }}>
          <div style={{ marginBottom: "0.75rem" }}>
            <Link to="/" className="link-arrow">
              ← Back to Home
            </Link>
          </div>
          <AiPlatformMenu />
        </div>
      </div>
    </div>
  );
}

export function Solutions() {
  return (
    <div className="page-shell">
      <div className="container-wide">
        <div className="page-frame" style={{ padding: "1.5rem" }}>
          <h1 className="section-title">Smart Solutions for Every Goal</h1>
          <p className="section-sub">
            Explore solutions by goals, business size, platform, technology, and
            more.
          </p>
          <div style={{ marginTop: "1.25rem" }}>
            <Link to="/contact" className="btn btn-primary">
              Get Free Solution Consultation →
            </Link>
          </div>
          <p style={{ marginTop: "1rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Hover <strong>Solutions</strong> in the header to browse the full
            mega menu, or request a custom roadmap.
          </p>
        </div>
      </div>
    </div>
  );
}

export function Services() {
  return (
    <div className="page-shell">
      <div className="container-wide">
        <div className="page-frame" style={{ padding: "1.5rem" }}>
          <h1 className="section-title">What We Do</h1>
          <p className="section-sub">
            End-to-end digital marketing, web development, AI, branding, and
            creative services.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.25rem" }}>
            <Link to="/contact" className="btn btn-primary">
              Request Custom Solution →
            </Link>
            <Link to="/packages" className="btn btn-outline">
              View Packages
            </Link>
          </div>
          <p style={{ marginTop: "1rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Open <strong>What We Do</strong> in the header for the full services
            mega menu.
          </p>
        </div>
      </div>
    </div>
  );
}
