import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import "./Footer.css";

export function Footer() {
  const { company, homeServices, services, locations } = useCms();
  const navLinks = company.navLinks;
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
    setEmail("");
  };

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Link to="/" className="logo">
            <span className="logo__mark">DA</span>
            <span className="logo__text">
              DisplayAvenue
              <small>Studios</small>
            </span>
          </Link>
          <p>
            India&apos;s Premium Visual Production Studio — luxury wedding
            photography, cinematic films, commercial productions and visual
            storytelling across India.
          </p>
          <div className="footer-social">
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              Instagram
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer">
              YouTube
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <a href={company.whatsappHref} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
          </div>
        </div>

        <div>
          <h4>Quick Links</h4>
          <ul>
            {navLinks.slice(0, 8).map((l) => (
              <li key={l.path}>
                <Link to={l.path}>{l.label}</Link>
              </li>
            ))}
            <li>
              <Link to="/book-now">Book Now</Link>
            </li>
            <li>
              <Link to="/pages">All Pages</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4>Services</h4>
          <ul>
            {homeServices.map((slug) => {
              const s = services.find((svc) => svc.slug === slug);
              if (!s) return null;
              return (
                <li key={slug}>
                  <Link to={`/services/${slug}`}>{s.title}</Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h4>Locations</h4>
          <ul>
            {locations.slice(0, 6).map((loc) => (
              <li key={loc.slug}>
                <Link to={`/locations/${loc.slug}`}>{loc.city}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-footer__contact">
          <h4>Contact</h4>
          <address>
            {company.address.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
          <p>
            <a href={company.phoneHref}>{company.phone}</a>
          </p>
          <p>
            <a href={company.emailHref}>{company.email}</a>
          </p>
          <form className="newsletter" onSubmit={onSubmit}>
            <label htmlFor="newsletter-email">Newsletter</label>
            <div className="newsletter__row">
              <input
                id="newsletter-email"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn btn--gold">
                Join
              </button>
            </div>
            {done && (
              <p className="newsletter__ok">
                Thank you — you&apos;re on the list.
              </p>
            )}
          </form>
        </div>
      </div>

      <div className="container site-footer__map">
        <iframe
          title="DisplayAvenue Studios location map"
          src={company.address.mapEmbed}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>

      <div className="container site-footer__bottom">
        <p>
          © {new Date().getFullYear()} DisplayAvenue Studios. All rights
          reserved.
        </p>
        <p>Headquartered in Mumbai · Serving Pan India</p>
      </div>
    </footer>
  );
}
