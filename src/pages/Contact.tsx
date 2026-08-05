import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { useReveal } from "../hooks/useReveal";
import { useCms } from "../cms/CmsProvider";
import "./Page.css";

export function Contact() {
  const ref = useReveal<HTMLDivElement>();
  const { company } = useCms();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
            Reach our Mumbai head office by phone, WhatsApp or email — or send
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
                  back to you soon.
                </p>
              </div>
            ) : (
              <>
                <h2>Send a message</h2>
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="cname">Name</label>
                    <input id="cname" required />
                  </div>
                  <div className="form-field">
                    <label htmlFor="cphone">Phone</label>
                    <input id="cphone" required />
                  </div>
                  <div className="form-field form-field--full">
                    <label htmlFor="cemail">Email</label>
                    <input id="cemail" type="email" required />
                  </div>
                  <div className="form-field form-field--full">
                    <label htmlFor="cmsg">Message</label>
                    <textarea id="cmsg" required placeholder="How can we help?" />
                  </div>
                </div>
                <button type="submit" className="btn btn--gold">
                  Send Message
                </button>
              </>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
