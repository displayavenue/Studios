import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { useReveal } from "../hooks/useReveal";
import { useCms } from "../cms/CmsProvider";
import { sendEnquiry, whatsappEnquiryLink } from "../utils/enquiry";
import "./Page.css";

export function BookNow() {
  const ref = useReveal<HTMLDivElement>();
  const { company, packageGroups, testimonials } = useCms();
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [waLink, setWaLink] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setSending(true);
    setError("");
    const link = whatsappEnquiryLink(company.whatsappHref, form, "Hi DisplayAvenue Studios, I'd like to check availability:");
    const res = await sendEnquiry(form, "booking");
    setSending(false);
    setWaLink(link);
    if (res.ok) setSubmitted(true);
    else setError("We couldn't send your enquiry. Please send it on WhatsApp instead — your details are filled in.");
  };

  return (
    <div ref={ref}>
      <SEO
        title="Book Now | Reserve Your Shoot | DisplayAvenue Studios"
        description="Book a consultation or reserve your photography and videography date with DisplayAvenue Studios. Pan India coverage, Mumbai headquarters."
        path="/book-now"
      />

      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Book Now</span>
          </nav>
          <p className="eyebrow">Book Now</p>
          <h1>Reserve your date or book a consultation</h1>
          <p>
            Share a few details and our team will confirm availability, recommend
            a package and guide you through booking amount payment.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container book-grid">
          <form className="book-form card reveal" onSubmit={onSubmit}>
            {submitted ? (
              <div className="form-success">
                <h2>Request received</h2>
                <p>
                  Thank you — we&apos;ve received your details and will call or
                  WhatsApp you to confirm availability, usually the same day.
                </p>
                <a href={waLink || company.whatsappHref} className="btn btn--gold" target="_blank" rel="noreferrer">
                  Send these details on WhatsApp too
                </a>
                <Link to="/availability" className="btn btn--ghost">
                  View calendar
                </Link>
                <Link to="/client-gallery" className="btn btn--ghost">
                  Client gallery portal
                </Link>
              </div>
            ) : (
              <>
                <h2>Booking enquiry</h2>
                <input type="text" name="company_website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hp-field" />
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="name">Full name</label>
                    <input id="name" name="name" required placeholder="Your name" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="phone">Phone / WhatsApp</label>
                    <input id="phone" name="phone" required placeholder="+91" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" required placeholder="you@email.com" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="city">City</label>
                    <input id="city" name="city" required placeholder="Mumbai" />
                  </div>
                  <div className="form-field">
                    <label htmlFor="date">Preferred date</label>
                    <input id="date" name="date" type="date" required />
                  </div>
                  <div className="form-field">
                    <label htmlFor="package">Package interest</label>
                    <select id="package" name="package" defaultValue="">
                      <option value="" disabled>
                        Select a package
                      </option>
                      {packageGroups.flatMap((g) =>
                        g.tiers.map((t) => (
                          <option key={t.id} value={t.id}>
                            {g.title} — {t.name}
                          </option>
                        )),
                      )}
                      <option value="custom">Custom / Not sure</option>
                    </select>
                  </div>
                  <div className="form-field form-field--full">
                    <label htmlFor="service">Service needed</label>
                    <select id="service" name="service" defaultValue="Wedding Photography + Videography">
                      <option>Wedding Photography + Videography</option>
                      <option>Wedding Photography</option>
                      <option>Wedding Videography</option>
                      <option>Cinematic Wedding Films</option>
                      <option>Candid Wedding Photography</option>
                      <option>Pre-Wedding Photo + Film</option>
                      <option>Engagement Photo + Film</option>
                      <option>Maternity Photo + Film</option>
                      <option>Birthday Photo + Film</option>
                      <option>Event Photo + Film</option>
                      <option>Destination Wedding</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-field form-field--full">
                    <label htmlFor="message">Tell us about your shoot</label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Venue, guest count, deliverables, budget range…"
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn--gold" disabled={sending}>
                  {sending ? "Sending…" : "Submit Booking Request"}
                </button>
                {error && (
                  <p className="form-error">
                    {error} <a href={waLink} target="_blank" rel="noreferrer">Open WhatsApp</a>
                  </p>
                )}
                <p className="form-note">
                  Prefer chatting?{" "}
                  <a href={company.whatsappHref} target="_blank" rel="noreferrer">
                    WhatsApp {company.whatsapp}
                  </a>
                </p>
              </>
            )}
          </form>

          <aside className="book-aside reveal">
            <div className="info-panel card">
              <h3>What happens next</h3>
              <ol className="numbered-list">
                <li>We confirm date availability</li>
                <li>You receive a tailored package recommendation</li>
                <li>Pay booking amount to reserve your crew</li>
                <li>Receive shot plan and coordination details</li>
              </ol>
            </div>
            <div className="info-panel card">
              <h3>Need help choosing?</h3>
              <p>
                Compare packages first, or call us for a quick consult.
              </p>
              <div className="book-aside__actions">
                <a href={company.phoneHref} className="btn btn--gold">
                  Call {company.phone}
                </a>
                <a
                  href={company.whatsappHref}
                  className="btn btn--outline"
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
                <Link to="/packages" className="btn btn--ghost">
                  Compare Packages
                </Link>
              </div>
            </div>
            <div className="info-panel card book-aside__reviews">
              <p className="eyebrow">Client reviews</p>
              {testimonials.slice(0, 2).map((t) => (
                <blockquote key={t.name} className="book-aside__quote">
                  <p>“{t.quote}”</p>
                  <footer>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </footer>
                </blockquote>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
