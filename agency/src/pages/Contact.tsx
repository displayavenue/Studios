import { useState, type CSSProperties, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { useCms } from "../cms/CmsProvider";
import { SEO } from "../components/SEO";
import "../styles/pages.css";

const base = import.meta.env.BASE_URL.replace(/\/?$/, "/");

export function Contact() {
  const { company, services, industries, contact } = useCms();
  const fields = contact.fields;
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [error, setError] = useState("");
  const [successTitle, setSuccessTitle] = useState(contact.successTitle);
  const [successMessage, setSuccessMessage] = useState(contact.successMessage);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || "").trim(),
      phone: String(data.get("phone") || "").trim(),
      email: String(data.get("email") || "").trim(),
      business: String(data.get("business") || "").trim(),
      message: String(data.get("message") || "").trim(),
      website: String(data.get("website") || "").trim(),
      page: "/contact",
    };
    if (!payload.name || !payload.phone) {
      setStatus("err");
      setError("Please add your name and phone number.");
      return;
    }

    setStatus("sending");
    setError("");
    try {
      const res = await fetch(`${base}admin/contact-submit.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        error?: string;
        successTitle?: string;
        successMessage?: string;
      };
      if (!res.ok || !json.ok) {
        throw new Error(json.error || "Could not send. Try WhatsApp.");
      }
      setSuccessTitle(json.successTitle || contact.successTitle);
      setSuccessMessage(json.successMessage || contact.successMessage);
      setStatus("ok");
      form.reset();
    } catch (err) {
      setStatus("err");
      setError(err instanceof Error ? err.message : "Could not send.");
      if (contact.whatsappFallback) {
        // Keep WhatsApp as backup after a short pause if backend fails
        window.setTimeout(() => {
          const text = encodeURIComponent(
            `Hi DisplayAvenue, I'm ${payload.name}. Phone: ${payload.phone}. ${payload.business ? `Business: ${payload.business}. ` : ""}${payload.message}`,
          );
          const wa = company.whatsappHref.includes("?")
            ? `${company.whatsappHref}&text=${text}`
            : `${company.whatsappHref}?text=${text}`;
          window.open(wa, "_blank", "noopener,noreferrer");
        }, 400);
      }
    }
  }

  return (
    <div className="page-shell">
      <SEO
        title={contact.seo?.title || "Get Free Proposal | DisplayAvenue"}
        description={
          contact.seo?.description ||
          "Book a free consultation or request a custom proposal from DisplayAvenue."
        }
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
              <p className="badge">{contact.title || "Get Free Proposal"}</p>
              <h1 className="section-title" style={{ marginTop: "0.75rem" }}>
                {contact.headline || "Let's grow your business"}
              </h1>
              <p className="section-sub">{contact.lead}</p>
              <p
                style={{
                  color: "var(--text-muted)",
                  marginTop: "0.75rem",
                  lineHeight: 1.55,
                }}
              >
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
                <h3
                  style={{
                    fontSize: "0.95rem",
                    color: "var(--navy)",
                    marginBottom: "0.35rem",
                  }}
                >
                  Popular starting points
                </h3>
                <p
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-muted)",
                    marginBottom: "0.75rem",
                  }}
                >
                  Not sure what to ask for? These are the pages most Indian
                  business owners open first.
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
                  <Link to="/awards" className="start-point">
                    <strong>Awards & certifications</strong>
                    <span>See the credentials behind our team</span>
                  </Link>
                </div>
              </div>
            </div>

            {status === "ok" ? (
              <div className="card" style={{ padding: "1.5rem" }}>
                <h2 style={{ margin: "0 0 0.5rem", color: "var(--navy)" }}>{successTitle}</h2>
                <p style={{ color: "var(--text-muted)", lineHeight: 1.55 }}>{successMessage}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.65rem", marginTop: "1rem" }}>
                  <a
                    className="btn btn-primary"
                    href={company.whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    style={{ background: "#25d366" }}
                  >
                    WhatsApp us
                  </a>
                  <button type="button" className="btn btn-outline" onClick={() => setStatus("idle")}>
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
              <form
                className="card"
                style={{ padding: "1.25rem", display: "grid", gap: "0.85rem" }}
                onSubmit={onSubmit}
              >
                <label>
                  <span style={labelStyle}>{fields.nameLabel}</span>
                  <input
                    required
                    name="name"
                    placeholder={fields.namePlaceholder}
                    style={inputStyle}
                    autoComplete="name"
                  />
                </label>
                <label>
                  <span style={labelStyle}>{fields.phoneLabel}</span>
                  <input
                    required
                    name="phone"
                    placeholder={fields.phonePlaceholder}
                    style={inputStyle}
                    autoComplete="tel"
                  />
                </label>
                <label>
                  <span style={labelStyle}>{fields.emailLabel}</span>
                  <input
                    type="email"
                    name="email"
                    placeholder={fields.emailPlaceholder}
                    style={inputStyle}
                    autoComplete="email"
                  />
                </label>
                <label>
                  <span style={labelStyle}>{fields.businessLabel}</span>
                  <input
                    name="business"
                    placeholder={fields.businessPlaceholder}
                    style={inputStyle}
                  />
                </label>
                <label>
                  <span style={labelStyle}>{fields.messageLabel}</span>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder={fields.messagePlaceholder}
                    style={{ ...inputStyle, resize: "vertical" }}
                  />
                </label>
                {/* Honeypot */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                  style={{ position: "absolute", left: "-9999px", height: 0, width: 0, opacity: 0 }}
                />
                {status === "err" && error ? (
                  <p style={{ color: "#b91c1c", fontSize: "0.85rem", margin: 0 }}>{error}</p>
                ) : null}
                <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : `${contact.submitLabel || "Get Free Proposal"} →`}
                </button>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0 }}>
                  Leads are saved in the CMS and emailed to{" "}
                  <strong>{contact.notifyEmail || company.email}</strong>. Prefer WhatsApp?{" "}
                  <a href={company.whatsappHref} target="_blank" rel="noreferrer">
                    Message us now
                  </a>
                  .
                </p>
              </form>
            )}
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

const labelStyle: CSSProperties = {
  display: "block",
  fontSize: "0.8rem",
  marginBottom: 6,
  fontWeight: 600,
};

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "0.75rem 0.9rem",
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "#fff",
};
