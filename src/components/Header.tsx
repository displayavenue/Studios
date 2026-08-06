import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import "./Header.css";

const serviceCategories = [
  "Wedding",
  "Corporate",
  "Product",
  "Events",
  "Aerial",
  "Post",
] as const;

type OpenMenu = "services" | "packages" | "more" | null;

export function Header() {
  const { company, services, packageGroups, homeServices } = useCms();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<OpenMenu>(null);
  const [mobileSection, setMobileSection] = useState<string | null>("services");
  const navRef = useRef<HTMLElement>(null);
  const servicesId = useId();
  const packagesId = useId();
  const moreId = useId();

  const featuredServices = homeServices
    .map((slug) => services.find((s) => s.slug === slug))
    .filter(Boolean)
    .slice(0, 8);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMenu(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    document.body.classList.toggle("menu-open", open);
    return () => {
      document.body.style.overflow = "";
      document.body.classList.remove("menu-open");
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenu(null);
        setOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenu(null);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  const close = () => {
    setOpen(false);
    setMenu(null);
  };

  const toggleMenu = (key: OpenMenu) => {
    setMenu((current) => (current === key ? null : key));
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header
        className={`site-header ${scrolled || open || menu ? "is-solid" : "is-transparent"} ${open ? "is-menu-open" : ""}`}
      >
        <div className="container site-header__inner">
          <Link to="/" className="logo" onClick={close} aria-label="DisplayAvenue Studios home">
            <span className="logo__mark">DA</span>
            <span className="logo__text">
              DisplayAvenue
              <small>Studios</small>
            </span>
          </Link>

          <nav className="site-nav site-nav--desktop" aria-label="Primary" ref={navRef}>
            <NavLink to="/about" className="nav-link" onClick={() => setMenu(null)}>
              About
            </NavLink>

            <div
              className={`nav-dropdown ${menu === "services" ? "is-open" : ""}`}
              onMouseEnter={() => setMenu("services")}
              onMouseLeave={() => setMenu(null)}
            >
              <button
                type="button"
                className={`nav-link nav-link--btn ${pathname.startsWith("/services") ? "active" : ""}`}
                aria-expanded={menu === "services"}
                aria-controls={servicesId}
                onClick={() => toggleMenu("services")}
              >
                Services
                <span className="nav-caret" aria-hidden />
              </button>
              <div id={servicesId} className="nav-panel nav-panel--mega" role="region" aria-label="Services menu">
                <div className="nav-panel__intro">
                  <p className="eyebrow">Services</p>
                  <strong>Photography, film &amp; post</strong>
                  <p>Browse by category or jump into popular briefs.</p>
                  <Link to="/services" className="btn btn--dark btn--sm" onClick={close}>
                    All services
                  </Link>
                </div>
                <div className="nav-panel__cols">
                  {serviceCategories.map((category) => {
                    const items = services
                      .filter((s) => s.category === category)
                      .slice(0, 4);
                    if (!items.length) return null;
                    return (
                      <div key={category} className="nav-col">
                        <p className="nav-col__title">{category}</p>
                        {items.map((s) => (
                          <Link key={s.slug} to={`/services/${s.slug}`} onClick={close}>
                            {s.title}
                          </Link>
                        ))}
                      </div>
                    );
                  })}
                </div>
                <div className="nav-panel__featured">
                  <p className="nav-col__title">Popular now</p>
                  <div className="nav-featured-grid">
                    {featuredServices.slice(0, 4).map(
                      (s) =>
                        s && (
                          <Link
                            key={s.slug}
                            to={`/services/${s.slug}`}
                            className="nav-featured-card"
                            onClick={close}
                          >
                            <img src={s.image} alt="" loading="lazy" />
                            <span>{s.title}</span>
                          </Link>
                        ),
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div
              className={`nav-dropdown ${menu === "packages" ? "is-open" : ""}`}
              onMouseEnter={() => setMenu("packages")}
              onMouseLeave={() => setMenu(null)}
            >
              <button
                type="button"
                className={`nav-link nav-link--btn ${pathname.startsWith("/packages") || pathname === "/pricing" ? "active" : ""}`}
                aria-expanded={menu === "packages"}
                aria-controls={packagesId}
                onClick={() => toggleMenu("packages")}
              >
                Packages
                <span className="nav-caret" aria-hidden />
              </button>
              <div id={packagesId} className="nav-panel nav-panel--sm" role="region" aria-label="Packages menu">
                <Link to="/packages" onClick={close}>
                  All packages
                </Link>
                {packageGroups.map((g) => (
                  <Link key={g.slug} to={`/packages/${g.slug}`} onClick={close}>
                    {g.title}
                  </Link>
                ))}
                <Link to="/pricing" className="nav-panel__accent" onClick={close}>
                  Pricing guide →
                </Link>
              </div>
            </div>

            <NavLink to="/portfolio" className="nav-link" onClick={() => setMenu(null)}>
              Portfolio
            </NavLink>

            <NavLink to="/industries" className="nav-link" onClick={() => setMenu(null)}>
              Industries
            </NavLink>

            <NavLink to="/locations" className="nav-link" onClick={() => setMenu(null)}>
              Locations
            </NavLink>

            <div
              className={`nav-dropdown ${menu === "more" ? "is-open" : ""}`}
              onMouseEnter={() => setMenu("more")}
              onMouseLeave={() => setMenu(null)}
            >
              <button
                type="button"
                className={`nav-link nav-link--btn ${["/blog", "/faqs", "/pricing", "/pages"].some((p) => pathname.startsWith(p)) ? "active" : ""}`}
                aria-expanded={menu === "more"}
                aria-controls={moreId}
                onClick={() => toggleMenu("more")}
              >
                More
                <span className="nav-caret" aria-hidden />
              </button>
              <div id={moreId} className="nav-panel nav-panel--sm" role="region" aria-label="More pages">
                <Link to="/pricing" onClick={close}>
                  Pricing guide
                </Link>
                <Link to="/blog" onClick={close}>
                  Blog
                </Link>
                <Link to="/faqs" onClick={close}>
                  FAQs
                </Link>
                <Link to="/pages" onClick={close}>
                  Site map
                </Link>
              </div>
            </div>

            <NavLink to="/contact" className="nav-link" onClick={() => setMenu(null)}>
              Contact
            </NavLink>
          </nav>

          <div className="site-header__actions">
            <a
              className="header-wa"
              href={company.whatsappHref}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp DisplayAvenue Studios"
            >
              WhatsApp
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
            <div className="mobile-drawer__inner">
              <p className="mobile-drawer__label">Menu</p>

              <div className="mobile-acc">
                <button
                  type="button"
                  className={`mobile-acc__btn ${mobileSection === "services" ? "is-open" : ""}`}
                  onClick={() =>
                    setMobileSection((s) => (s === "services" ? null : "services"))
                  }
                >
                  Services
                </button>
                {mobileSection === "services" && (
                  <div className="mobile-acc__body">
                    <Link to="/services" onClick={close}>
                      All services
                    </Link>
                    {featuredServices.map(
                      (s) =>
                        s && (
                          <Link key={s.slug} to={`/services/${s.slug}`} onClick={close}>
                            {s.title}
                          </Link>
                        ),
                    )}
                  </div>
                )}
              </div>

              <div className="mobile-acc">
                <button
                  type="button"
                  className={`mobile-acc__btn ${mobileSection === "packages" ? "is-open" : ""}`}
                  onClick={() =>
                    setMobileSection((s) => (s === "packages" ? null : "packages"))
                  }
                >
                  Packages
                </button>
                {mobileSection === "packages" && (
                  <div className="mobile-acc__body">
                    <Link to="/packages" onClick={close}>
                      All packages
                    </Link>
                    {packageGroups.map((g) => (
                      <Link key={g.slug} to={`/packages/${g.slug}`} onClick={close}>
                        {g.title}
                      </Link>
                    ))}
                    <Link to="/pricing" onClick={close}>
                      Pricing
                    </Link>
                  </div>
                )}
              </div>

              <nav className="mobile-drawer__links" aria-label="Mobile">
                <NavLink to="/about" onClick={close}>
                  About
                </NavLink>
                <NavLink to="/portfolio" onClick={close}>
                  Portfolio
                </NavLink>
                <NavLink to="/industries" onClick={close}>
                  Industries
                </NavLink>
                <NavLink to="/locations" onClick={close}>
                  Locations
                </NavLink>
                <NavLink to="/pricing" onClick={close}>
                  Pricing
                </NavLink>
                <NavLink to="/blog" onClick={close}>
                  Blog
                </NavLink>
                <NavLink to="/faqs" onClick={close}>
                  FAQs
                </NavLink>
                <NavLink to="/contact" onClick={close}>
                  Contact
                </NavLink>
              </nav>

              <div className="mobile-drawer__actions">
                <Link to="/book-now" className="btn btn--gold" onClick={close}>
                  Book Now
                </Link>
                <a
                  href={company.whatsappHref}
                  className="btn btn--dark"
                  target="_blank"
                  rel="noreferrer"
                  onClick={close}
                >
                  WhatsApp us
                </a>
                <a href={company.phoneHref} className="mobile-drawer__phone">
                  {company.phone}
                </a>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
