import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import { submitInquiry } from "../utils/submitInquiry";
import "./Footer.css";

export function Footer() {
  const { company, localities } = useCms();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");
    setLoading(true);
    try {
      await submitInquiry("newsletter", { email: email.trim() });
      setDone(true);
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not subscribe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Link to="/" className="logo">
            <span className="logo__mark">DA</span>
            <span className="logo__text">
              DisplayAvenue
              <small>Realty</small>
            </span>
          </Link>
          <p>
            Local property advisors for Dahisar, Mira Road and Bhayandar.
            Residential, commercial and redevelopment support with clear
            communication.
          </p>
          <div className="footer-social">
            <a href={company.whatsappHref} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a href={company.phoneHref}>Call</a>
            <a href={company.emailHref}>Email</a>
          </div>
        </div>

        <div>
          <h4>Explore</h4>
          <ul>
            {company.navLinks.map((l) => (
              <li key={l.path}>
                <Link to={l.path}>{l.label}</Link>
              </li>
            ))}
            <li>
              <Link to="/faqs">FAQs</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>Localities</h4>
          <ul>
            {localities.map((l) => (
              <li key={l.slug}>
                <Link to={`/localities/${l.slug}`}>{l.name}</Link>
              </li>
            ))}
            <li>
              <Link to="/buy">Homes for sale</Link>
            </li>
            <li>
              <Link to="/rent">Homes for rent</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>New listing alerts</h4>
          <p className="footer-note">
            Get Mira-Bhayandar & Dahisar updates in your inbox.
          </p>
          {done ? (
            <p className="form-note form-note--ok">You&apos;re on the list.</p>
          ) : (
            <form onSubmit={onSubmit} className="footer-form">
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email for listing alerts"
              />
              <button className="btn btn--brass" type="submit" disabled={loading}>
                {loading ? "…" : "Notify me"}
              </button>
            </form>
          )}
          {error ? <p className="form-note form-note--err">{error}</p> : null}
          <address>
            {company.address.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
        </div>
      </div>

      <div className="container site-footer__bottom">
        <p>© {new Date().getFullYear()} DisplayAvenue Realty</p>
        <div>
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
