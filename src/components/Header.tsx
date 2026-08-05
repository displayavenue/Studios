import { useEffect, useRef, useState } from "react";
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

type OpenMenu = "services" | "packages" | "explore" | null;

export function Header() {
  const { company, services, packageGroups, locations, homeServices } =
    useCms();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<OpenMenu>(null);
  const [mobileSection, setMobileSection] = useState<string | null>("services");
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | null>(null);

  const featuredServices = (
    homeServices.length
      ? homeServices
          .map((slug) => services.find((s) => s.slug === slug))
          .filter(Boolean)
      : services.slice(0, 6)
  ).slice(0, 6);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openMenu = (key: OpenMenu) => {
    clearCloseTimer();
    setMenu(key);
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => setMenu(null), 160);
  };

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
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setMenu(null);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
      clearCloseTimer();
    };
  }, []);

  const closeAll = () => {
    setOpen(false);
    setMenu(null);
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      {typeof document !== "undefined" &&
        createPortal(
          <div
            className={`mega-backdrop ${menu ? "is-open" : ""}`}
            aria-hidden
            onClick={() => setMenu(null)}
          />,
          document.body,
        )}
      <header
        ref={headerRef}
        className={`site-header ${scrolled || open || menu ? "is-solid" : "is-transparent"} ${open ? "is-menu-open" : ""} ${menu ? "has-menu" : ""}`}
        onMouseLeave={scheduleClose}
        onMouseEnter={clearCloseTimer}
      >
        <div className="container site-header__inner">
          <Link to="/" className="logo" onClick={closeAll} aria-label="DisplayAvenue Studios home">
            <span className="logo__mark">DA</span>
            <span className="logo__text">
              DisplayAvenue
              <small>Studios</small>
            </span>
          </Link>

          <nav className="site-nav site-nav--desktop" aria-label="Primary">
            <NavLink to="/about" className="nav-link" onMouseEnter={() => openMenu(null)}>
              About
            </NavLink>

            <button
              type="button"
              className={`nav-link nav-link--btn ${menu === "services" || pathname.startsWith("/services") ? "active" : ""}`}
              aria-expanded={menu === "services"}
              onMouseEnter={() => openMenu("services")}
              onFocus={() => openMenu("services")}
              onClick={() => openMenu(menu === "services" ? null : "services")}
            >
              Services
              <span className="nav-caret" aria-hidden />
            </button>

            <button
              type="button"
              className={`nav-link nav-link--btn ${menu === "packages" || pathname.startsWith("/packages") || pathname === "/pricing" ? "active" : ""}`}
              aria-expanded={menu === "packages"}
              onMouseEnter={() => openMenu("packages")}
              onFocus={() => openMenu("packages")}
              onClick={() => openMenu(menu === "packages" ? null : "packages")}
            >
              Packages
              <span className="nav-caret" aria-hidden />
            </button>

            <NavLink to="/portfolio" className="nav-link" onMouseEnter={() => openMenu(null)}>
              Portfolio
            </NavLink>

            <button
              type="button"
              className={`nav-link nav-link--btn ${menu === "explore" || ["/locations", "/industries", "/blog", "/faqs", "/pages"].some((p) => pathname.startsWith(p)) ? "active" : ""}`}
              aria-expanded={menu === "explore"}
              onMouseEnter={() => openMenu("explore")}
              onFocus={() => openMenu("explore")}
              onClick={() => openMenu(menu === "explore" ? null : "explore")}
            >
              Explore
              <span className="nav-caret" aria-hidden />
            </button>

            <NavLink to="/contact" className="nav-link" onMouseEnter={() => openMenu(null)}>
              Contact
            </NavLink>
          </nav>

          <div className="site-header__actions">
            <a className="header-phone" href={company.phoneHref} aria-label={`Call ${company.phone}`}>
              {company.phone}
            </a>
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

        {/* Full-width mega panels anchored under the header bar */}
        <div
          className={`mega-shell ${menu ? "is-open" : ""}`}
          onMouseEnter={clearCloseTimer}
        >
          <div className="container">
            {menu === "services" && (
              <div className="mega-panel mega-panel--services" role="region" aria-label="Services menu">
                <div className="mega-panel__head">
                  <div>
                    <p className="eyebrow">Services</p>
                    <h3>Photography, film &amp; post production</h3>
                  </div>
                  <Link to="/services" className="btn btn--dark btn--sm" onClick={closeAll}>
                    View all services
                  </Link>
                </div>

                <div className="mega-cats">
                  {serviceCategories.map((category) => {
                    const items = services
                      .filter((s) => s.category === category)
                      .slice(0, 5);
                    if (!items.length) return null;
                    return (
                      <div key={category} className="mega-cat">
                        <p className="mega-cat__title">{category}</p>
                        <ul>
                          {items.map((s) => (
                            <li key={s.slug}>
                              <Link to={`/services/${s.slug}`} onClick={closeAll}>
                                {s.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>

                <div className="mega-popular">
                  <p className="mega-cat__title">Popular</p>
                  <div className="mega-popular__row">
                    {featuredServices.map(
                      (s) =>
                        s && (
                          <Link
                            key={s.slug}
                            to={`/services/${s.slug}`}
                            className="mega-popular__card"
                            onClick={closeAll}
                          >
                            <img src={s.image} alt="" loading="lazy" />
                            <span>{s.title}</span>
                          </Link>
                        ),
                    )}
                  </div>
                </div>
              </div>
            )}

            {menu === "packages" && (
              <div className="mega-panel mega-panel--packages" role="region" aria-label="Packages menu">
                <div className="mega-packages">
                  <Link to="/packages" className="mega-pack-card mega-pack-card--all" onClick={closeAll}>
                    <span className="eyebrow">Overview</span>
                    <strong>All packages</strong>
                    <p>Compare Essential, Signature and Luxury tiers</p>
                  </Link>
                  {packageGroups.map((g) => (
                    <Link
                      key={g.slug}
                      to={`/packages/${g.slug}`}
                      className="mega-pack-card"
                      onClick={closeAll}
                    >
                      <span className="eyebrow">Package</span>
                      <strong>{g.title}</strong>
                      <p>{g.subtitle}</p>
                    </Link>
                  ))}
                  <Link to="/pricing" className="mega-pack-card mega-pack-card--accent" onClick={closeAll}>
                    <span className="eyebrow">Guide</span>
                    <strong>Pricing</strong>
                    <p>See what shapes your quote →</p>
                  </Link>
                </div>
              </div>
            )}

            {menu === "explore" && (
              <div className="mega-panel mega-panel--explore" role="region" aria-label="Explore menu">
                <div className="mega-explore-grid">
                  <div className="mega-cat">
                    <p className="mega-cat__title">Discover</p>
                    <ul>
                      <li><Link to="/locations" onClick={closeAll}>Locations</Link></li>
                      <li><Link to="/industries" onClick={closeAll}>Industries</Link></li>
                      <li><Link to="/blog" onClick={closeAll}>Blog</Link></li>
                      <li><Link to="/faqs" onClick={closeAll}>FAQs</Link></li>
                      <li><Link to="/pages" onClick={closeAll}>All pages</Link></li>
                    </ul>
                  </div>
                  <div className="mega-cat">
                    <p className="mega-cat__title">Top cities</p>
                    <ul>
                      {locations.slice(0, 8).map((loc) => (
                        <li key={loc.slug}>
                          <Link to={`/locations/${loc.slug}`} onClick={closeAll}>
                            {loc.city}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mega-book">
                    <p className="eyebrow">Book consultation</p>
                    <strong>Ready when you are</strong>
                    <p>Share your date and city — we reply quickly on WhatsApp.</p>
                    <div className="mega-book__actions">
                      <Link to="/book-now" className="btn btn--gold btn--sm" onClick={closeAll}>
                        Book Now
                      </Link>
                      <a
                        href={company.whatsappHref}
                        className="btn btn--outline-light btn--sm"
                        target="_blank"
                        rel="noreferrer"
                        onClick={closeAll}
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
                    <Link to="/services" onClick={closeAll}>All services</Link>
                    {featuredServices.map(
                      (s) =>
                        s && (
                          <Link key={s.slug} to={`/services/${s.slug}`} onClick={closeAll}>
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
                    <Link to="/packages" onClick={closeAll}>All packages</Link>
                    {packageGroups.map((g) => (
                      <Link key={g.slug} to={`/packages/${g.slug}`} onClick={closeAll}>
                        {g.title}
                      </Link>
                    ))}
                    <Link to="/pricing" onClick={closeAll}>Pricing</Link>
                  </div>
                )}
              </div>

              <nav className="mobile-drawer__links" aria-label="Mobile">
                <NavLink to="/about" onClick={closeAll}>About</NavLink>
                <NavLink to="/portfolio" onClick={closeAll}>Portfolio</NavLink>
                <NavLink to="/locations" onClick={closeAll}>Locations</NavLink>
                <NavLink to="/industries" onClick={closeAll}>Industries</NavLink>
                <NavLink to="/blog" onClick={closeAll}>Blog</NavLink>
                <NavLink to="/faqs" onClick={closeAll}>FAQs</NavLink>
                <NavLink to="/contact" onClick={closeAll}>Contact</NavLink>
              </nav>

              <div className="mobile-drawer__actions">
                <Link to="/book-now" className="btn btn--gold" onClick={closeAll}>Book Now</Link>
                <a href={company.whatsappHref} className="btn btn--dark" target="_blank" rel="noreferrer" onClick={closeAll}>
                  WhatsApp us
                </a>
                <a href={company.phoneHref} className="mobile-drawer__phone">{company.phone}</a>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
