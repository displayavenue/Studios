import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { GoogleReviews } from "../components/GoogleReviews";
import { SEO } from "../components/SEO";
import { useReveal } from "../hooks/useReveal";
import { useCms } from "../cms/CmsProvider";
import { submitInquiry } from "../utils/submitInquiry";
import "./Page.css";

export function Contact() {
  const ref = useReveal<HTMLDivElement>();
  const { company } = useCms();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    setLoading(true);
    try {
      await submitInquiry("contact", {
        name: String(data.get("name") ?? ""),
        phone: String(data.get("phone") ?? ""),
        email: String(data.get("email") ?? ""),
        message: String(data.get("message") ?? ""),
      });
      setSubmitted(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={ref}>
      <SEO
        title={`Contact ${company.name} | ${company.primaryFocus} Head Office`}
        description={`Contact ${company.name} in ${company.address.addressLocality || "Mumbai"}. Call ${company.phone} or email ${company.email}.`}
        path="/contact"
      />

      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Contact</span>
          </nav>
          <p className="eyebrow">Contact</p>
          <h1>Let&apos;s talk about your next production</h1>
          <p>
            Reach our Mumbai head office by phone, WhatsApp or email - or send
            a message and we&apos;ll respond within one business day.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container contact-grid">
          <div className="contact-details reveal">
            <article className="info-panel card">
              <h3>Head Office</h3>
              <address>
                {company.address.lines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
            </article>
            <article className="info-panel card">
              <h3>Reach us</h3>
              <p>
                Phone: <a href={company.phoneHref}>{company.phone}</a>
              </p>
              <p>
                WhatsApp:{" "}
                <a href={company.whatsappHref} target="_blank" rel="noreferrer">
                  {company.whatsapp}
                </a>
              </p>
              <p>
                Email: <a href={company.emailHref}>{company.email}</a>
              </p>
              <p>Coverage: {company.coverage}</p>
              <p>Primary focus: {company.primaryFocus}</p>
            </article>
            <div className="contact-map card">
              <iframe
                title="DisplayAvenue Studios Google Map"
                src={company.address.mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>

          <form className="book-form card reveal" onSubmit={onSubmit}>
            {submitted ? (
              <div className="form-success">
                <h2>Message sent</h2>
                <p>
                  Thank you for contacting DisplayAvenue Studios. We&apos;ll get
                  back to you within one business day.
                </p>
                <a href={company.whatsappHref} className="btn btn--outline" target="_blank" rel="noreferrer">
                  Chat on WhatsApp
                </a>
              </div>
            ) : (
              <>
                <h2>Send a message</h2>
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="cname">Name</label>
                    <input id="cname" name="name" required disabled={loading} />
                  </div>
                  <div className="form-field">
                    <label htmlFor="cphone">Phone</label>
                    <input id="cphone" name="phone" required disabled={loading} />
                  </div>
                  <div className="form-field form-field--full">
                    <label htmlFor="cemail">Email</label>
                    <input id="cemail" name="email" type="email" required disabled={loading} />
                  </div>
                  <div className="form-field form-field--full">
                    <label htmlFor="cmsg">Message</label>
                    <textarea
                      id="cmsg"
                      name="message"
                      required
                      placeholder="How can we help?"
                      disabled={loading}
                    />
                  </div>
                </div>
                {error && <p className="form-error" role="alert">{error}</p>}
                <button type="submit" className="btn btn--gold" disabled={loading}>
                  {loading ? "Sending…" : "Send Message"}
                </button>
                <p className="form-note">
                  Prefer a call?{" "}
                  <a href={company.phoneHref}>{company.phone}</a>
                </p>
              </>
            )}
          </form>
        </div>
      </section>

      <GoogleReviews title="What clients say" />
    </div>
  );
}
