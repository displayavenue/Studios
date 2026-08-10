import { Link } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import { Logo } from "./Logo";
import { Icon } from "./Icon";
import "./Footer.css";

export function Footer() {
  const { company, content, services, industries, packages, tools, resources, solutions, cases } =
    useCms();

  const serviceLinks = services.slice(0, 24).map((s) => ({
    label: s.title,
    href: `/services/${s.slug}`,
  }));
  const industryLinks = industries.map((s) => ({
    label: s.title,
    href: `/industries/${s.slug}`,
  }));
  const packageLinks = packages.map((s) => ({
    label: s.title,
    href: `/packages/${s.slug}`,
  }));
  const toolLinks = tools.map((s) => ({
    label: s.title,
    href: `/free-tools/${s.slug}`,
  }));
  const resourceLinks = resources.slice(0, 12).map((s) => ({
    label: s.title,
    href: `/resources/${s.slug}`,
  }));
  const solutionLinks = solutions.slice(0, 12).map((s) => ({
    label: s.title,
    href: `/solutions/${s.slug}`,
  }));
  const caseLinks = cases.map((s) => ({
    label: s.title,
    href: `/case-studies/${s.slug}`,
  }));

  const footerCols = [
    {
      title: "Popular services",
      links: [
        ...serviceLinks.slice(0, 10),
        { label: "All services →", href: "/services" },
      ],
    },
    {
      title: "Industries",
      links: [
        ...industryLinks.slice(0, 10),
        { label: "All industries →", href: "/industries" },
      ],
    },
    {
      title: "Packages & solutions",
      links: [
        ...packageLinks,
        ...solutionLinks.slice(0, 6),
        { label: "All solutions →", href: "/solutions" },
      ],
    },
    {
      title: "Tools & resources",
      links: [
        ...toolLinks.slice(0, 8),
        ...resourceLinks.slice(0, 6),
        { label: "Free tools →", href: "/free-tools" },
        { label: "All resources →", href: "/resources" },
        { label: "Case studies →", href: "/case-studies" },
        ...caseLinks,
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Why DisplayAvenue", href: "/why-displayavenue" },
        { label: "Awards", href: "/awards" },
        { label: "Certifications", href: "/certifications" },
        { label: "AI Platform", href: "/ai-platform" },
        { label: "Portfolio", href: "/portfolio" },
        { label: "Contact", href: "/contact" },
        { label: "Get Free Proposal", href: "/contact" },
        { label: "Client Login", href: company.clientLogin },
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
        <div className="container footer-grid footer-grid--dense">
          <div className="footer-brand">
            <Logo light />
            <p>
              DisplayAvenue helps Indian business owners get found on Google and
              Instagram, turn website visitors into enquiries, and grow with clear
              marketing plans  -  in plain English.
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

        <div className="container footer-guide">
          <div className="footer-guide__copy">
            <h4>Need a page, not a phone call?</h4>
            <p>
              Use Services for what we do, Industries for your business type, Packages
              for monthly plans, and Free tools for a quick check  -  all explained in
              plain English on each page.
            </p>
          </div>
          <div className="footer-guide__links">
            <Link to="/services">Services</Link>
            <Link to="/industries">Industries</Link>
            <Link to="/packages">Packages</Link>
            <Link to="/free-tools">Free tools</Link>
            <Link to="/case-studies">Case studies</Link>
            <Link to="/resources">Guides</Link>
            <Link to="/contact">Contact</Link>
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
