import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import "./Header.css";

export function Header() {
  const { company } = useCms();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const lockRef = { current: 0 };

  const primary = [
    { label: "Buy", path: "/buy" },
    { label: "Rent", path: "/rent" },
    { label: "Commercial", path: "/commercial" },
    { label: "Redevelopment", path: "/redevelopment" },
    { label: "Sell", path: "/sell" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMoreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    lockRef.current = window.scrollY;
    document.body.classList.add("menu-open");
    document.body.style.position = "fixed";
    document.body.style.top = `-${lockRef.current}px`;
    document.body.style.width = "100%";
    return () => {
      document.body.classList.remove("menu-open");
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, lockRef.current);
    };
  }, [open]);

  const onHero = pathname === "/";
  const translucent = onHero && !scrolled && !open;

  return (
    <header
      className={`site-header ${scrolled || open ? "is-scrolled" : ""} ${translucent ? "is-over-hero" : ""}`}
    >
      <div className="container site-header__bar">
        <Link to="/" className="logo" aria-label="DisplayAvenue Realty home">
          <span className="logo__mark">DA</span>
          <span className="logo__text">
            DisplayAvenue
            <small>Realty</small>
          </span>
        </Link>

        <nav className="site-nav desktop-nav" aria-label="Primary">
          {primary.map((l) => (
            <NavLink key={l.path} to={l.path} className={({ isActive }) => (isActive ? "is-active" : "")}>
              {l.label}
            </NavLink>
          ))}
          <div
            className={`nav-more ${moreOpen ? "is-open" : ""}`}
            onMouseEnter={() => setMoreOpen(true)}
            onMouseLeave={() => setMoreOpen(false)}
          >
            <button type="button" className="nav-more__trigger" aria-expanded={moreOpen} onClick={() => setMoreOpen((v) => !v)}>
              More <span aria-hidden>▾</span>
            </button>
            <div className="nav-more__panel" role="menu">
              <div className="nav-more__cols">
                <div>
                  <p className="nav-more__label">Explore</p>
                  <NavLink to="/localities">Localities</NavLink>
                  <NavLink to="/societies">Societies</NavLink>
                </div>
                <div>
                  <p className="nav-more__label">Resources</p>
                  <NavLink to="/guides">Guides</NavLink>
                  <NavLink to="/blog">Insights</NavLink>
                  <NavLink to="/faqs">FAQs</NavLink>
                </div>
                <div>
                  <p className="nav-more__label">Company</p>
                  <NavLink to="/about">About</NavLink>
                  <NavLink to="/contact">Contact</NavLink>
                </div>
                <div className="nav-more__cta">
                  <p className="nav-more__label">Looking for something specific?</p>
                  <p>WhatsApp our property desk</p>
                  <a className="btn btn--wa" href={company.whatsappHref} target="_blank" rel="noreferrer">
                    WhatsApp {company.phone}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <div className="site-header__actions">
          <a className="header-phone desktop-only" href={company.phoneHref}>
            {company.phone}
          </a>
          <a className="btn btn--wa header-cta" href={company.whatsappHref} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
          <button
            type="button"
            className={`menu-toggle ${open ? "is-open" : ""}`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`mobile-drawer ${open ? "is-open" : ""}`}>
        <nav aria-label="Mobile">
          {primary.map((l) => (
            <NavLink key={l.path} to={l.path} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          <NavLink to="/localities" onClick={() => setOpen(false)}>
            Localities
          </NavLink>
          <NavLink to="/societies" onClick={() => setOpen(false)}>
            Societies
          </NavLink>
          <NavLink to="/guides" onClick={() => setOpen(false)}>
            Guides
          </NavLink>
          <NavLink to="/blog" onClick={() => setOpen(false)}>
            Insights
          </NavLink>
          <NavLink to="/about" onClick={() => setOpen(false)}>
            About
          </NavLink>
          <NavLink to="/contact" onClick={() => setOpen(false)}>
            Contact
          </NavLink>
          <NavLink to="/faqs" onClick={() => setOpen(false)}>
            FAQs
          </NavLink>
          <a href={company.phoneHref}>Call {company.phone}</a>
          <a href={company.whatsappHref} target="_blank" rel="noreferrer">
            WhatsApp enquiry
          </a>
        </nav>
      </div>
    </header>
  );
}
