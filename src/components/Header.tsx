import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { company, navLinks } from "../data/company";
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
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  const primary = navLinks.filter((l) => primaryPaths.has(l.path));
  const more = navLinks.filter((l) => !primaryPaths.has(l.path));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
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

  return (
    <header className={`site-header ${scrolled || open ? "is-solid" : "is-transparent"}`}>
      <div className="container site-header__inner">
        <Link to="/" className="logo" onClick={() => setOpen(false)}>
          <span className="logo__mark">DA</span>
          <span className="logo__text">
            DisplayAvenue
            <small>Studios</small>
          </span>
        </Link>

        <nav className={`site-nav ${open ? "is-open" : ""}`} aria-label="Primary">
          {primary
            .filter((l) => l.path !== "/")
            .map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
              >
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
                <NavLink
                  key={link.path}
                  to={link.path}
                  role="menuitem"
                  onClick={() => {
                    setMoreOpen(false);
                    setOpen(false);
                  }}
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          <Link
            to="/book-now"
            className="btn btn--gold site-nav__cta"
            onClick={() => setOpen(false)}
          >
            Book Now
          </Link>
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
  );
}
