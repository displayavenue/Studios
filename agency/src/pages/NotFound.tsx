import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";

export function NotFound() {
  return (
    <div className="page-shell" style={{ padding: "4rem 0" }}>
      <SEO
        title="Page not found | DisplayAvenue"
        description="The page you requested is not available. Browse DisplayAvenue services or contact us."
        path="/404"
        noindex
      />
      <div className="container" style={{ maxWidth: 640 }}>
        <p className="badge">404</p>
        <h1>Page not found</h1>
        <p style={{ color: "var(--muted)", lineHeight: 1.6 }}>
          This URL is not part of the DisplayAvenue website. Try one of these pages
          instead.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", marginTop: "1.5rem" }}>
          <Link className="btn btn-primary" to="/">
            Home
          </Link>
          <Link className="btn btn-outline" to="/services">
            Services
          </Link>
          <Link className="btn btn-outline" to="/growth">
            Growth Plan
          </Link>
          <Link className="btn btn-outline" to="/contact">
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
