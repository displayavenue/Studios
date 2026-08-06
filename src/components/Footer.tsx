import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import "./Footer.css";

function socialMeta(url: string) {
  const u = url.toLowerCase();
  if (u.includes("instagram")) return { label: "Instagram", network: "instagram" as const };
  if (u.includes("youtube") || u.includes("youtu.be"))
    return { label: "YouTube", network: "youtube" as const };
  if (u.includes("linkedin")) return { label: "LinkedIn", network: "linkedin" as const };
  if (u.includes("facebook") || u.includes("fb.com"))
    return { label: "Facebook", network: "facebook" as const };
  if (u.includes("twitter") || u.includes("x.com"))
    return { label: "X", network: "x" as const };
  return { label: "Social", network: "link" as const };
}

function SocialIcon({ network }: { network: string }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    "aria-hidden": true as const,
  };

  switch (network) {
    case "instagram":
      return (
        <svg {...common}>
          <path d="M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9A5.5 5.5 0 0 1 16.5 22h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9zm9.75 1.25a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common}>
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.75 15.5v-7l6.5 3.5-6.5 3.5z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V23h-4V8.5zM8.5 8.5h3.8v2h.1c.5-1 1.8-2.1 3.8-2.1 4 0 4.8 2.7 4.8 6.1V23h-4v-5.8c0-1.4 0-3.2-2-3.2s-2.3 1.5-2.3 3.1V23h-4V8.5z" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common}>
          <path d="M14 8h3V5h-3c-2.2 0-4 1.8-4 4v2H7v3h3v7h3v-7h3l1-3h-4V9c0-.6.4-1 1-1z" />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <path d="M18.2 2H21l-6.6 7.5L22 22h-6.2l-4.3-6.3L6 22H3.2l7-8L2 2h6.3l3.9 5.7L18.2 2zm-1.1 18h1.7L7 3.9H5.2L17.1 20z" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...common}>
          <path d="M20.5 3.5A10.5 10.5 0 0 0 3.4 17.8L2 22l4.3-1.3A10.5 10.5 0 1 0 20.5 3.5zM12 20a8 8 0 0 1-4.3-1.2l-.3-.2-2.6.8.8-2.5-.2-.3A8 8 0 1 1 12 20zm4.4-5.7c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.7.9-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.6-1.3.1-.1 0-.3 0-.4s-.5-1.2-.7-1.6-.4-.3-.5-.3h-.4c-.1 0-.4.1-.6.3s-.8.8-.8 1.9.8 2.2.9 2.3a8.6 8.6 0 0 0 3.5 2.8c1.3.6 1.8.6 2.4.5.4-.1 1.4-.6 1.6-1.1s.2-1 .1-1.1-.2-.2-.4-.3z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M14 3h7v7h-2V6.4l-9.3 9.3-1.4-1.4L17.6 5H14V3zM5 5h6v2H7v10h10v-4h2v6H5V5z" />
        </svg>
      );
  }
}

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
            {(company.socials || []).map((url) => {
              const { label, network } = socialMeta(url);
              return (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="footer-social__btn"
                  aria-label={label}
                  title={label}
                >
                  <SocialIcon network={network} />
                </a>
              );
            })}
            <a
              href={company.whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="footer-social__btn footer-social__btn--wa"
              aria-label="WhatsApp"
              title="WhatsApp"
            >
              <SocialIcon network="whatsapp" />
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
