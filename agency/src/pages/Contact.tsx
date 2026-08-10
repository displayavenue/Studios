import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { useCms } from "../cms/CmsProvider";
import { SEO } from "../components/SEO";
import "../styles/pages.css";

export function Contact() {
  const { company, services, industries } = useCms();
  return (
    <div className="page-shell">
      <SEO
        title="Get Free Proposal | DisplayAvenue"
        description="Book a free consultation or request a custom proposal from DisplayAvenue."
        path="/contact"
      />
      <div className="container">
        <div className="page-frame" style={{ padding: "2rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2rem",
            }}
            className="contact-grid"
          >
            <div>
              <p className="badge">Get Free Proposal</p>
              <h1 className="section-title" style={{ marginTop: "0.75rem" }}>
                Let’s grow your business
              </h1>
              <p className="section-sub">
                Tell us about your goals. We will reply with a clear plan in
                plain English  -  what to fix first, what it may cost, and what
                results to expect.
              </p>
              <p style={{ color: "var(--text-muted)", marginTop: "0.75rem", lineHeight: 1.55 }}>
                Most Indian business owners come to us for more Google calls,
                better Instagram enquiries, a clearer website, or a simple
                monthly marketing package. Not sure? Start with a free call.
              </p>
              <ul className="feature-list">
                <li>
                  <Icon name="clock" color="#0056ff" />
                  <div>
                    <strong>Response within 24 hours</strong>
                    <span>Weekday business hours IST</span>
                  </div>
                </li>
                <li>
                  <Icon name="phone" color="#0056ff" />
                  <div>
                    <strong>
                      <a href={company.phoneHref}>{company.phone}</a>
                    </strong>
                    <span>Call or WhatsApp</span>
                  </div>
                </li>
                <li>
                  <Icon name="chat" color="#0056ff" />
                  <div>
                    <strong>
                      <a href={company.emailHref}>{company.email}</a>
                    </strong>
                    <span>Email us anytime</span>
                  </div>
                </li>
              </ul>
              <div className="start-points" style={{ marginTop: "1.25rem" }}>
                <h3 style={{ fontSize: "0.95rem", color: "var(--navy)", marginBottom: "0.35rem" }}>
                  Popular starting points
                </h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
                  Not sure what to ask for? These are the pages most Indian business owners open first.
                </p>
                <div className="start-points__grid">
                  {services.slice(0, 6).map((s) => (
                    <Link key={s.slug} to={`/services/${s.slug}`} className="start-point">
                      <strong>{s.title}</strong>
                      <span>{(s.summary || "").slice(0, 72)}…</span>
                    </Link>
                  ))}
                  {industries.slice(0, 4).map((s) => (
                    <Link key={s.slug} to={`/industries/${s.slug}`} className="start-point">
                      <strong>{s.title}</strong>
                      <span>Industry plan for businesses like yours</span>
                    </Link>
                  ))}
                  <Link to="/packages" className="start-point">
                    <strong>Monthly packages</strong>
                    <span>Bundled SEO, ads, and content with clear pricing</span>
                  </Link>
                  <Link to="/free-tools" className="start-point">
                    <strong>Free marketing tools</strong>
                    <span>Quick checks before you hire an agency</span>
                  </Link>
                </div>
              </div>
            </div>

            <form
              className="card"
              style={{ padding: "1.25rem", display: "grid", gap: "0.85rem" }}
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = company.whatsappHref;
              }}
            >
              <label>
                <span style={{ display: "block", fontSize: "0.8rem", marginBottom: 6, fontWeight: 600 }}>
                  Your name
                </span>
                <input required name="name" placeholder="Full name" style={inputStyle} />
              </label>
              <label>
                <span style={{ display: "block", fontSize: "0.8rem", marginBottom: 6, fontWeight: 600 }}>
                  Phone / WhatsApp
                </span>
                <input required name="phone" placeholder="10-digit mobile" style={inputStyle} />
              </label>
              <label>
                <span style={{ display: "block", fontSize: "0.8rem", marginBottom: 6, fontWeight: 600 }}>
                  Business type
                </span>
                <input name="business" placeholder="Clinic, salon, shop, SaaS…" style={inputStyle} />
              </label>
              <label>
                <span style={{ display: "block", fontSize: "0.8rem", marginBottom: 6, fontWeight: 600 }}>
                  What do you need help with?
                </span>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Tell us about your project or goals"
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </label>
              <button type="submit" className="btn btn-primary">
                Get Free Proposal →
              </button>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Prefer WhatsApp?{" "}
                <a href={company.whatsappHref} target="_blank" rel="noreferrer">
                  Message us now
                </a>
                .
              </p>
            </form>
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width: 800px) {
          .contact-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "0.75rem 0.9rem",
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "#fff",
};
