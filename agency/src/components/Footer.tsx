import { Link } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import { Logo } from "./Logo";
import { Icon } from "./Icon";
import "./Footer.css";

export function Footer() {
  const { company, content } = useCms();
  const footerCols = [
    {
      title: "Services",
      links: [
        { label: "Digital Marketing", href: "/services/digital-marketing" },
        { label: "Web Development", href: "/services/web-development" },
        { label: "AI Solutions", href: "/ai-platform" },
        { label: "Branding", href: "/services/branding" },
        { label: "E-commerce", href: "/services/ecommerce" },
      ],
    },
    {
      title: "Industries",
      links: [
        { label: "Healthcare", href: "/industries/healthcare" },
        { label: "Real Estate", href: "/industries/real-estate" },
        { label: "E-commerce", href: "/industries/ecommerce" },
        { label: "SaaS", href: "/industries/saas" },
        { label: "Education", href: "/industries/education" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Blog", href: "/resources/blog" },
        { label: "Case Studies", href: "/case-studies" },
        { label: "Free Tools", href: "/free-tools" },
        { label: "Packages", href: "/packages" },
        { label: "Portfolio", href: "/portfolio" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Why DisplayAvenue", href: "/why-displayavenue" },
        { label: "Contact", href: "/contact" },
        { label: "Get Free Proposal", href: "/contact" },
        { label: "Client Login", href: company.clientLogin },
      ],
    },
  ];

  return (
    <footer className="site-footer">
      <div className="footer-cta">
        <div className="container footer-cta-inner">
          <div>
            <h2>{content.footerCta.title}</h2>
            <p>{content.footerCta.sub}</p>
          </div>
          <div className="footer-cta-actions">
            <Link to="/contact" className="btn btn-primary">
              Book Free Consultation →
            </Link>
            <Link to="/contact" className="btn btn-ghost">
              Get Free Proposal →
            </Link>
            <a href={company.phoneHref} className="footer-phone">
              Call Us Now {company.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="container footer-grid">
          <div className="footer-brand">
            <Logo light />
            <p>
              AI-powered digital growth partner helping brands generate leads,
              build brands, and scale with measurable ROI.
            </p>
            <div className="footer-socials">
              <a href={company.socials.facebook} aria-label="Facebook">
                FB
              </a>
              <a href={company.socials.instagram} aria-label="Instagram">
                IG
              </a>
              <a href={company.socials.linkedin} aria-label="LinkedIn">
                in
              </a>
              <a href={company.socials.youtube} aria-label="YouTube">
                YT
              </a>
            </div>
          </div>

          {footerCols.map((col) => (
            <div key={col.title}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("http") ? (
                      <a href={link.href}>{link.label}</a>
                    ) : (
                      <Link to={link.href}>{link.label}</Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4>Get In Touch</h4>
            <ul className="footer-contact">
              <li>
                <Icon name="building" size={16} color="#7dd3fc" />
                {company.address.city}
              </li>
              <li>
                <Icon name="clock" size={16} color="#7dd3fc" />
                {company.address.hours}
              </li>
              <li>
                <a href={company.emailHref}>{company.email}</a>
              </li>
              <li>
                <a href={company.phoneHref}>{company.phone}</a>
              </li>
              {company.googleMaps?.shareUrl && (
                <li>
                  <a
                    href={company.googleMaps.shareUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Business Profile / Maps
                  </a>
                </li>
              )}
            </ul>
            <a
              className="btn btn-primary btn-sm"
              href={company.whatsappHref}
              target="_blank"
              rel="noreferrer"
              style={{ background: "#25d366", marginTop: "0.75rem" }}
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </span>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
