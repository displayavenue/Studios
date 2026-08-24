import { Link } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import { Logo } from "./Logo";
import { Icon } from "./Icon";
import "./Footer.css";

export function Footer() {
  const { company, content, services, industries, packages, solutions, cases } = useCms();

  const serviceLinks = services.slice(0, 10).map((s) => ({
    label: s.title,
    href: `/services/${s.slug}`,
  }));
  const industryLinks = industries.slice(0, 10).map((s) => ({
    label: s.title,
    href: `/industries/${s.slug}`,
  }));
  const packageLinks = packages.map((s) => ({
    label: s.title,
    href: `/packages/${s.slug}`,
  }));
  const solutionLinks = solutions.slice(0, 6).map((s) => ({
    label: s.title,
    href: `/solutions/${s.slug}`,
  }));
  const caseLinks = cases.slice(0, 4).map((s) => ({
    label: s.title,
    href: `/case-studies/${s.slug}`,
  }));

  const footerCols = [
    {
      title: "Popular services",
      links: [...serviceLinks, { label: "All services →", href: "/services" }],
    },
    {
      title: "Industries",
      links: [
        ...industryLinks,
        { label: "All industries →", href: "/industries" },
        { label: "Industry solutions →", href: "/industry-solutions" },
      ],
    },
    {
      title: "Packages & solutions",
      links: [
        ...packageLinks,
        ...solutionLinks,
        { label: "All solutions →", href: "/solutions" },
      ],
    },
    {
      title: "Free growth tools",
      links: [
        { label: "Strategy Maker", href: "https://displayavenue.com/strategy/" },
        { label: "Data Lead Extractor", href: "https://displayavenue.com/data/" },
        { label: "ROI Calculator", href: "/free-tools/roi-calculator" },
        { label: "SEO Checklist", href: "/free-tools/seo-checklist" },
        { label: "Local SEO Score", href: "/free-tools/local-seo-score" },
        { label: "Citation Directory", href: "/free-tools/citation-directory" },
        { label: "All free tools →", href: "/free-tools" },
        { label: "City SEO pages →", href: "/locations" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Why DisplayAvenue", href: "/why-displayavenue" },
        { label: "Case studies", href: "/case-studies" },
        ...caseLinks,
        { label: "Awards", href: "/awards" },
        { label: "Certifications", href: "/certifications" },
        { label: "AI Platform", href: "/ai-platform" },
        { label: "Portfolio", href: "/portfolio" },
        { label: "Locations", href: "/locations" },
        { label: "Digital business card", href: "/card" },
        { label: "Blog", href: "/blog" },
        { label: "Videos", href: "/videos" },
        { label: "Talent Branding", href: "/talent-branding" },
        { label: "Contact", href: "/contact" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms & Conditions", href: "/terms" },
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
            <Link to="/services" className="btn btn-ghost">
              Browse services →
            </Link>
            <a href={company.phoneHref} className="footer-phone">
              Call Us Now {company.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="footer-main">
        <div className="container footer-grid footer-grid--lean">
          <div className="footer-brand">
            <Logo light />
            <p>
              DisplayAvenue helps Indian business owners get found on Google and
              Instagram, turn website visitors into enquiries, and grow with clear
              marketing plans - in plain English.
            </p>
            <div className="footer-socials">
              <a href={company.socials.facebook} aria-label="Facebook" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M14 8h2.5V5.5H14c-1.9 0-3.5 1.6-3.5 3.5v1.5H8.5V13H10.5v7h3v-7H16l.5-2.5H13.5V9c0-.6.4-1 1-1z"
                  />
                </svg>
              </a>
              <a href={company.socials.instagram} aria-label="Instagram" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H7zm11 1.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"
                  />
                </svg>
              </a>
              <a href={company.socials.linkedin} aria-label="LinkedIn" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M6.5 9.5H4V20h2.5V9.5zM5.25 4A1.75 1.75 0 1 0 5.26 7.5 1.75 1.75 0 0 0 5.25 4zM20 20h-2.5v-5.4c0-1.5-.5-2.5-1.85-2.5-1 0-1.55.7-1.8 1.35-.1.25-.1.6-.1.95V20H11.3s.05-8.7 0-9.6H13.8v1.35c.35-.55 1-1.5 2.55-1.5 1.85 0 3.25 1.2 3.25 3.85V20z"
                  />
                </svg>
              </a>
              <a href={company.socials.youtube} aria-label="YouTube" target="_blank" rel="noreferrer">
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M23 12.2s0-3.1-.4-4.5c-.2-.9-.9-1.6-1.8-1.8C19.4 5.5 12 5.5 12 5.5s-7.4 0-8.8.4c-.9.2-1.6.9-1.8 1.8C1 9.1 1 12.2 1 12.2s0 3.1.4 4.5c.2.9.9 1.6 1.8 1.8 1.4.4 8.8.4 8.8.4s7.4 0 8.8-.4c.9-.2 1.6-.9 1.8-1.8.4-1.4.4-4.5.4-4.5zM9.8 15.5v-6.6l6.3 3.3-6.3 3.3z"
                  />
                </svg>
              </a>
              <a
                href={company.whatsappHref}
                aria-label="WhatsApp"
                target="_blank"
                rel="noreferrer"
                className="footer-socials__wa"
              >
                <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                  <path
                    fill="currentColor"
                    d="M12.04 2C6.58 2 2.15 6.4 2.15 11.84c0 1.99.58 3.85 1.6 5.43L2 22l4.89-1.6a9.86 9.86 0 0 0 5.15 1.42h.01c5.46 0 9.89-4.4 9.89-9.84C21.94 6.4 17.5 2 12.04 2zm5.76 13.99c-.24.67-1.18 1.22-1.93 1.38-.51.11-1.18.2-3.43-.74-2.88-1.2-4.74-4.14-4.88-4.33-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.09.99-2.38.26-.29.57-.36.76-.36h.55c.17 0 .4-.06.62.48.24.58.81 2 .88 2.14.07.15.12.32.02.51-.1.2-.15.32-.29.5-.15.17-.3.38-.43.51-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.03 1.12 1 2.07 1.32 2.36 1.47.3.15.47.12.64-.07.17-.2.74-.86.94-1.15.2-.3.4-.24.67-.14.27.1 1.72.81 2.01.96.3.15.49.22.56.34.08.13.08.74-.16 1.41z"
                  />
                </svg>
              </a>
            </div>
          </div>

          {footerCols.map((col) => (
            <div key={col.title}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={col.title + link.label}>
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
            <Link to="/contact">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
