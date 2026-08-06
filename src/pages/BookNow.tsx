import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { useReveal } from "../hooks/useReveal";
import { useCms } from "../cms/CmsProvider";
import "./Page.css";

export function BookNow() {
  const ref = useReveal<HTMLDivElement>();
  const { company, packageGroups } = useCms();
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
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
                            {g.title} - {t.name}
                          </option>
                        )),
                      )}
                      <option value="custom">Custom / Not sure</option>
                    </select>
                  </div>
                  <div className="form-field form-field--full">
                    <label htmlFor="service">Service needed</label>
                    <select id="service" name="service" defaultValue="Wedding Photography">
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
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn--gold">
                  Submit Booking Request
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
