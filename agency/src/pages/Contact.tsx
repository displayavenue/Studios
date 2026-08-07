import { useState, type CSSProperties, type FormEvent } from "react";
import { Icon } from "../components/Icon";
import { useCms } from "../cms/CmsProvider";
import { SEO } from "../components/SEO";
import { submitLead } from "../lib/submitLead";
import "../styles/pages.css";

export function Contact() {
  const { company } = useCms();
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("sending");
    setError("");
    try {
      await submitLead({
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        phone: String(data.get("phone") || ""),
        message: String(data.get("message") || ""),
        source: "contact",
      });
      form.reset();
      setStatus("ok");
    } catch (err) {
      setStatus("err");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

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
              onSubmit={onSubmit}
            >
              {/* honeypot */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", height: 0, width: 0, opacity: 0 }}
              />
              <label>
                <span className="sr-only">Name</span>
                <input
                  required
                  name="name"
                  placeholder="Your name"
                  style={inputStyle}
                  disabled={status === "sending"}
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
                  disabled={status === "sending"}
                />
              </label>
              <label>
                <span className="sr-only">Phone</span>
                <input
                  name="phone"
                  placeholder="Phone / WhatsApp"
                  style={inputStyle}
                  disabled={status === "sending"}
                />
              </label>
              <label>
                <span className="sr-only">Message</span>
                <textarea
                  name="message"
                  rows={5}
                  placeholder="Tell us about your project or goals"
                  style={{ ...inputStyle, resize: "vertical" }}
                  disabled={status === "sending"}
                />
              </label>
              <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Get Free Proposal →"}
              </button>
              {status === "ok" && (
                <p style={{ color: "#067647", fontSize: "0.9rem", margin: 0 }}>
                  Thanks — we received your request and emailed the team at info@displayavenue.com. We’ll reply within 24 hours.
                </p>
              )}
              {status === "err" && (
                <p style={{ color: "#b42318", fontSize: "0.9rem", margin: 0 }}>
                  {error || "Could not send. Please email info@displayavenue.com"}
                </p>
              )}
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
