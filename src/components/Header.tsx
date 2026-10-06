import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import "./Header.css";

export function Header() {
  const { company } = useCms();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const lockRef = { current: 0 };

  const primary = company.navLinks.filter((l) =>
    ["/buy", "/rent", "/commercial", "/redevelopment", "/sell"].includes(l.path),
  );
  const more = company.navLinks.filter(
    (l) => !["/buy", "/rent", "/commercial", "/redevelopment", "/sell"].includes(l.path),
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
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

  return (
    <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
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
          <div className="nav-more">
            <span>More</span>
            <div className="nav-more__panel">
              {more.map((l) => (
                <NavLink key={l.path} to={l.path}>
                  {l.label}
                </NavLink>
              ))}
              <NavLink to="/faqs">FAQs</NavLink>
            </div>
          </div>
        </nav>

        <div className="site-header__actions">
          <a className="header-phone desktop-only" href={company.phoneHref}>
            {company.phone}
          </a>
          <a className="btn btn--brass header-cta" href={company.whatsappHref} target="_blank" rel="noreferrer">
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
          {company.navLinks.map((l) => (
            <NavLink key={l.path} to={l.path} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
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
