import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import "./Header.css";

const primaryPaths = new Set([
  "/",
  "/about",
  "/services",
  "/packages",
  "/portfolio",
  "/locations",
  "/blog",
  "/contact",
]);

export function Header() {
  const { company } = useCms();
  const navLinks = company.navLinks;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  const primary = navLinks.filter((l) => primaryPaths.has(l.path) && l.path !== "/");
  const more = navLinks.filter((l) => !primaryPaths.has(l.path));
  const allMobile = [...primary, ...more];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    document.body.classList.toggle("menu-open", open);
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("menu-open");
    };
  }, [open]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const close = () => {
    setOpen(false);
    setMoreOpen(false);
  };

  return (
    <>
      <header className={`site-header ${scrolled || open ? "is-solid" : "is-transparent"} ${open ? "is-menu-open" : ""}`}>
        <div className="container site-header__inner">
          <Link to="/" className="logo" onClick={close}>
            <span className="logo__mark">DA</span>
            <span className="logo__text">
              DisplayAvenue
              <small>Studios</small>
            </span>
          </Link>

          <nav className="site-nav site-nav--desktop" aria-label="Primary">
            <div className="site-nav__links">
              {primary.map((link) => (
                <NavLink key={link.path} to={link.path}>
                  {link.label}
                </NavLink>
              ))}

              <div className={`nav-more ${moreOpen ? "is-open" : ""}`} ref={moreRef}>
                <button
                  type="button"
                  className="nav-more__btn"
                  aria-expanded={moreOpen}
                  aria-haspopup="true"
                  onClick={() => setMoreOpen((v) => !v)}
                >
                  More
                </button>
                <div className="nav-more__menu" role="menu">
                  {more.map((link) => (
                    <NavLink key={link.path} to={link.path} role="menuitem" onClick={() => setMoreOpen(false)}>
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <div className="site-header__actions">
            <a className="header-phone" href={company.phoneHref}>
              {company.phone}
            </a>
            <Link to="/book-now" className="btn btn--gold header-cta">
              Book Now
            </Link>
            <button
              type="button"
              className={`menu-toggle ${open ? "is-open" : ""}`}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {typeof document !== "undefined" &&
        createPortal(
          <div className={`mobile-drawer ${open ? "is-open" : ""}`} aria-hidden={!open}>
            <nav className="mobile-drawer__nav" aria-label="Mobile">
              {allMobile.map((link) => (
                <NavLink key={link.path} to={link.path} onClick={close}>
                  {link.label}
                </NavLink>
              ))}
              <Link to="/book-now" className="btn btn--gold" onClick={close}>
                Book Now
              </Link>
            </nav>
          </div>,
          document.body,
        )}
    </>
  );
}
