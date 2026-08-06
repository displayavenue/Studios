import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { useReveal } from "../hooks/useReveal";
import { useCms } from "../cms/CmsProvider";
import { submitInquiry } from "../utils/submitInquiry";
import "./Page.css";

export function BookNow() {
  const ref = useReveal<HTMLDivElement>();
  const { company, packageGroups } = useCms();
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
      await submitInquiry("book-now", {
        name: String(data.get("name") ?? ""),
        phone: String(data.get("phone") ?? ""),
        email: String(data.get("email") ?? ""),
        city: String(data.get("city") ?? ""),
        date: String(data.get("date") ?? ""),
        package: String(data.get("package") ?? ""),
        service: String(data.get("service") ?? ""),
        message: String(data.get("message") ?? ""),
      });
      setSubmitted(true);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit booking request.");
    } finally {
      setLoading(false);
    }
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
                  Thank you. A DisplayAvenue producer will contact you shortly
                  via phone or WhatsApp to confirm next steps.
                </p>
                <a href={company.whatsappHref} className="btn btn--gold" target="_blank" rel="noreferrer">
                  Continue on WhatsApp
                </a>
              </div>
            ) : (
              <>
                <h2>Booking enquiry</h2>
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="name">Full name</label>
                    <input id="name" name="name" required placeholder="Your name" disabled={loading} />
                  </div>
                  <div className="form-field">
                    <label htmlFor="phone">Phone / WhatsApp</label>
                    <input id="phone" name="phone" required placeholder="+91" disabled={loading} />
                  </div>
                  <div className="form-field">
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" required placeholder="you@email.com" disabled={loading} />
                  </div>
                  <div className="form-field">
                    <label htmlFor="city">City</label>
                    <input id="city" name="city" required placeholder="Mumbai" disabled={loading} />
                  </div>
                  <div className="form-field">
                    <label htmlFor="date">Preferred date</label>
                    <input id="date" name="date" type="date" required disabled={loading} />
                  </div>
                  <div className="form-field">
                    <label htmlFor="package">Package interest</label>
                    <select id="package" name="package" defaultValue="" disabled={loading}>
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
                    <select id="service" name="service" defaultValue="Wedding Photography" disabled={loading}>
                      <option>Wedding Photography</option>
                      <option>Wedding Videography</option>
                      <option>Corporate Photography</option>
                      <option>Product Photography</option>
                      <option>Event Coverage</option>
                      <option>Monthly Content</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-field form-field--full">
                    <label htmlFor="message">Tell us about your shoot</label>
                    <textarea
                      id="message"
                      name="message"
                      placeholder="Venue, guest count, deliverables, budget range…"
                      disabled={loading}
                    />
                  </div>
                </div>
                {error && <p className="form-error" role="alert">{error}</p>}
                <button type="submit" className="btn btn--gold" disabled={loading}>
                  {loading ? "Submitting…" : "Submit Booking Request"}
                </button>
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
              <Link to="/packages" className="btn btn--outline">
                Compare Packages
              </Link>
              <a href={company.phoneHref} className="btn btn--ghost">
                Call {company.phone}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
