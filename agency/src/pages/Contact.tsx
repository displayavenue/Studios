import type { CSSProperties } from "react";
import { Icon } from "../components/Icon";
import { useCms } from "../cms/CmsProvider";
import { SEO } from "../components/SEO";
import "../styles/pages.css";

export function Contact() {
  const { company } = useCms();
  return (
    <div className="page-shell">
      <SEO title="Get Free Proposal | DisplayAvenue" description="Book a free consultation or request a custom proposal from DisplayAvenue." path="/contact" />
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
                Let’s Grow Your Business
              </h1>
              <p className="section-sub">
                Tell us about your goals. We’ll reply with a tailored proposal
                and next steps.
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
                    <span>{company.address.city}</span>
                  </div>
                </li>
                {company.googleMaps?.shareUrl && (
                  <li>
                    <Icon name="globe" color="#0056ff" />
                    <div>
                      <strong>
                        <a
                          href={company.googleMaps.shareUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Google Business Profile
                        </a>
                      </strong>
                      <span>Maps, reviews & directions</span>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            <form
              className="card"
              style={{ padding: "1.25rem", display: "grid", gap: "0.75rem" }}
              onSubmit={(e) => {
                e.preventDefault();
                alert("Demo form - connect this to your CRM or email when going live.");
              }}
            >
              <label>
                <span className="sr-only">Name</span>
                <input
                  required
                  name="name"
                  placeholder="Your name"
                  style={inputStyle}
                />
              </label>
              <label>
                <span className="sr-only">Email</span>
                <input
                  required
                  type="email"
                  name="email"
                  placeholder="Work email"
                  style={inputStyle}
                />
              </label>
              <label>
                <span className="sr-only">Phone</span>
                <input
                  name="phone"
                  placeholder="Phone / WhatsApp"
                  style={inputStyle}
                />
              </label>
              <label>
                <span className="sr-only">Message</span>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Tell us about your project or goals"
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </label>
              <button type="submit" className="btn btn-primary">
                Get Free Proposal →
              </button>
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
