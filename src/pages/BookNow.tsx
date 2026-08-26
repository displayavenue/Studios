import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { SEO } from "../components/SEO";
import { useReveal } from "../hooks/useReveal";
import { useCms } from "../cms/CmsProvider";
import "./Page.css";

export function BookNow() {
  const ref = useReveal<HTMLDivElement>();
  const { company, packageGroups, testimonials } = useCms();
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
                <div className="pay-token card">
                  <p className="eyebrow">Secure your date</p>
                  <h3>Pay booking token</h3>
                  <p>
                    After we confirm availability, reserve your crew with a
                    refundable-against-invoice token. Demo checkout below
                    (UPI / card).
                  </p>
                  <div className="pay-token__row">
                    <div>
                      <strong>₹15,000</strong>
                      <span>Booking token</span>
                    </div>
                    <button
                      type="button"
                      className="btn btn--gold"
                      onClick={() =>
                        alert(
                          "Demo payment — connect Razorpay/UPI keys in production to collect real tokens.",
                        )
                      }
                    >
                      Pay with UPI / Card
                    </button>
                  </div>
                  <p className="form-note">
                    Or pay later on WhatsApp after we share the payment link.
                  </p>
                </div>
                <a href={company.whatsappHref} className="btn btn--outline" target="_blank" rel="noreferrer">
                  Continue on WhatsApp
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
                    <select id="service" name="service" defaultValue="Wedding Photography">
                      <option>Wedding Photography</option>
                      <option>Candid Wedding Photography</option>
                      <option>Cinematic Wedding Films</option>
                      <option>Pre Wedding Shoot</option>
                      <option>Engagement Photography</option>
                      <option>Maternity Photography</option>
                      <option>Birthday Photography</option>
                      <option>Event Coverage</option>
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
              <p className="book-aside__score">★★★★★ 4.9/5</p>
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
