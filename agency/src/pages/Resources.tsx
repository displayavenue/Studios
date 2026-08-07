import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { SEO } from "../components/SEO";
import {
  resourceTypes,
  resourceCategories,
  featuredResources,
  popularThisWeek,
  resourceTrustBar,
} from "../data/content";
import { submitLead } from "../lib/submitLead";
import "../styles/pages.css";

export function Resources() {
  const [subStatus, setSubStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const [subError, setSubError] = useState("");

  async function onSubscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") || "");
    setSubStatus("sending");
    setSubError("");
    try {
      await submitLead({ email, source: "newsletter" });
      form.reset();
      setSubStatus("ok");
    } catch (err) {
      setSubStatus("err");
      setSubError(err instanceof Error ? err.message : "Could not subscribe");
    }
  }

  return (
    <div className="page-shell">
      <SEO title="Resources & Insights | DisplayAvenue" description="Guides, blogs, templates, and playbooks for digital growth." path="/resources" />
      <div className="container-wide">
        <div className="page-frame">
          <div className="page-grid-3">
            <aside className="page-left">
              <p className="badge">Browse Resources</p>
              <ul className="mega-links" style={{ marginTop: "0.85rem" }}>
                {resourceTypes.map((item, i) => (
                  <li key={item.title}>
                    <Link
                      to={item.href}
                      style={
                        i === 0
                          ? {
                              background: "var(--blue-tint)",
                              color: "var(--blue)",
                              fontWeight: 700,
                            }
                          : undefined
                      }
                    >
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.45rem" }}>
                        <Icon name={item.icon} size={14} />
                        {item.title}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="cta-box" style={{ marginTop: "1rem" }}>
                <h4>Need Something Specific?</h4>
                <Link to="/contact" className="link-arrow">
                  Contact Our Team
                </Link>
              </div>
            </aside>

            <div>
              <div className="mini-grid-4" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
                {resourceCategories.map((cat) => (
                  <div key={cat.title} className="category-card">
                    <span className="icon-box" style={{ background: `${cat.color}18` }}>
                      <Icon name={cat.icon} color={cat.color} />
                    </span>
                    <h3>{cat.title}</h3>
                    <p>{cat.desc}</p>
                    <Link to="/resources" className="link-arrow">
                      {cat.count} Resources →
                    </Link>
                  </div>
                ))}
              </div>

              <h2 style={{ fontSize: "0.85rem", letterSpacing: "0.06em", color: "var(--blue)", margin: "1.5rem 0 0.75rem", fontWeight: 800 }}>
                FEATURED RESOURCES
              </h2>
              <div className="mini-grid-4">
                {featuredResources.map((item) => (
                  <Link key={item.href} to={item.href} className="featured-card">
                    <div className="featured-media" style={{ background: item.gradient }}>
                      <span className="featured-tag">{item.tag}</span>
                    </div>
                    <div className="featured-body">
                      <h3>{item.title}</h3>
                      <p>{item.summary}</p>
                      <span className="link-arrow">{item.cta} →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <aside>
              <h3 style={{ fontSize: "0.95rem", color: "var(--navy)", marginBottom: "0.75rem" }}>
                Popular This Week
              </h3>
              <ul style={{ display: "grid", gap: "0.75rem" }}>
                {popularThisWeek.map((item) => (
                  <li key={item.title} style={{ display: "flex", gap: "0.65rem" }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 8,
                        background: "var(--bg-gray)",
                        flexShrink: 0,
                      }}
                    />
                    <div>
                      <strong style={{ display: "block", fontSize: "0.82rem", color: "var(--navy)" }}>
                        {item.title}
                      </strong>
                      <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                        {item.type} · {item.time}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="cta-box" style={{ marginTop: "1.25rem" }}>
                <h4>Stay Updated</h4>
                <p>Get growth insights and free resources in your inbox.</p>
                <form
                  onSubmit={onSubscribe}
                  style={{ display: "grid", gap: "0.5rem" }}
                >
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    style={{ position: "absolute", left: "-9999px", height: 0, width: 0, opacity: 0 }}
                  />
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="Enter your email"
                    disabled={subStatus === "sending"}
                    style={{
                      padding: "0.7rem 0.85rem",
                      borderRadius: 10,
                      border: "1px solid var(--border)",
                    }}
                  />
                  <button type="submit" className="btn btn-primary btn-sm" disabled={subStatus === "sending"}>
                    {subStatus === "sending" ? "Subscribing…" : "Subscribe Now"}
                  </button>
                  {subStatus === "ok" && (
                    <p style={{ color: "#067647", fontSize: "0.78rem", margin: 0 }}>
                      You’re subscribed — thanks!
                    </p>
                  )}
                  {subStatus === "err" && (
                    <p style={{ color: "#b42318", fontSize: "0.78rem", margin: 0 }}>
                      {subError}
                    </p>
                  )}
                </form>
              </div>
            </aside>
          </div>

          <div className="bottom-bar">
            <div className="bottom-bar-items">
              {resourceTrustBar.map((item) => (
                <span key={item.label}>
                  <Icon name={item.icon} size={16} color="#0056ff" />
                  {item.label}
                </span>
              ))}
            </div>
            <div className="cta-box" style={{ margin: 0, padding: "0.65rem 0.85rem" }}>
              <strong style={{ fontSize: "0.85rem" }}>Can’t Find What You Need?</strong>{" "}
              <Link to="/contact" className="link-arrow">
                Request Now →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
