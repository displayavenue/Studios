import { Link, useLocation } from "react-router-dom";
import { SEO } from "../components/SEO";
import "../styles/pages.css";

export function NotFoundPage() {
  const location = useLocation();
  const path = location.pathname || "/404";
  return (
    <div className="page-shell">
      <SEO
        title="Page not found | DisplayAvenue"
        description="The page you requested does not exist on DisplayAvenue."
        path={path}
        noindex
      />
      <div className="container">
        <div className="page-frame" style={{ padding: "3rem 1.75rem", textAlign: "center" }}>
          <p className="badge">404</p>
          <h1 className="section-title" style={{ marginTop: "0.65rem" }}>
            Page not found
          </h1>
          <p className="section-sub">
            This URL is not a published page. Try the homepage, services, or contact us.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap", marginTop: "1.25rem" }}>
            <Link to="/" className="btn btn-primary">
              Go homepage
            </Link>
            <Link to="/services" className="btn btn-outline">
              Browse services
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
