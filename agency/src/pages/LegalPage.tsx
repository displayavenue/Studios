import { SEO } from "../components/SEO";
import { Link } from "react-router-dom";
import "../styles/pages.css";

export function LegalPage({ type }: { type: "privacy" | "terms" }) {
  const isPrivacy = type === "privacy";
  return (
    <div className="page-shell">
      <SEO
        title={isPrivacy ? "Privacy Policy | DisplayAvenue" : "Terms & Conditions | DisplayAvenue"}
        description={isPrivacy ? "Privacy policy for DisplayAvenue digital agency services and website." : "Terms and conditions for using DisplayAvenue websites and services."}
        path={isPrivacy ? "/privacy" : "/terms"}
      />
      <div className="container">
        <div className="page-frame" style={{ padding: "2rem", maxWidth: 840, margin: "0 auto" }}>
          <p className="badge">Legal</p>
          <h1 className="section-title" style={{ marginTop: "0.65rem" }}>
            {isPrivacy ? "Privacy Policy" : "Terms & Conditions"}
          </h1>
          <p className="section-sub">
            {isPrivacy
              ? "This demo privacy policy summarizes how DisplayAvenue may collect and use information on displayavenue.com. Final legal copy will be confirmed before WordPress cutover."
              : "These demo terms outline the use of DisplayAvenue websites and services. Final legal copy will be confirmed before WordPress cutover."}
          </p>
          <div style={{ marginTop: "1.25rem", display: "grid", gap: "0.85rem", color: "var(--text-muted)", fontSize: "0.95rem" }}>
            {isPrivacy ? (
              <>
                <p>We may collect contact details you submit via forms, usage analytics, and communications metadata to respond to inquiries and improve services.</p>
                <p>We do not sell personal data. Data may be processed with trusted providers (hosting, analytics, CRM) under appropriate safeguards.</p>
                <p>Contact info@displayavenue.com for privacy requests.</p>
              </>
            ) : (
              <>
                <p>By using this website you agree to use content for lawful purposes and not to misuse forms, tools, or intellectual property.</p>
                <p>Service engagements are governed by separate proposals, SOWs, and invoices agreed with DisplayAvenue.</p>
                <p>Contact info@displayavenue.com for questions about these terms.</p>
              </>
            )}
          </div>
          <Link to="/contact" className="btn btn-primary" style={{ marginTop: "1.5rem" }}>
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
