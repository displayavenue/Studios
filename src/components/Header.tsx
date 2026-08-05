import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import type { MenuNavItem } from "../data/menu";
import "./Header.css";

type OpenMenu = "services" | "packages" | "explore" | null;

function isMegaActive(item: MenuNavItem, pathname: string) {
  if (item.mega === "services") return pathname.startsWith("/services");
  if (item.mega === "packages") {
    return pathname.startsWith("/packages") || pathname === "/pricing";
  }
  if (item.mega === "explore") {
    return ["/locations", "/industries", "/blog", "/faqs", "/pages"].some((p) =>
      pathname.startsWith(p),
    );
  }
  return false;
}

export function Header() {
  const { company, services, packageGroups, locations, homeServices, menu } =
    useCms();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<OpenMenu>(null);
  const [mobileSection, setMobileSection] = useState<string | null>("services");
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | null>(null);

  const servicesMega = menu.servicesMega;
  const packagesMega = menu.packagesMega;
  const exploreMega = menu.exploreMega;

  const popularSlugs =
    servicesMega.popularSlugs?.length > 0
      ? servicesMega.popularSlugs
      : homeServices;

  const featuredServices = (
    popularSlugs.length
      ? popularSlugs
          .map((slug) => services.find((s) => s.slug === slug))
          .filter(Boolean)
      : services.slice(0, servicesMega.popularCount || 6)
  ).slice(0, servicesMega.popularCount || 6);

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const openMega = (key: OpenMenu) => {
    clearCloseTimer();
    setActiveMega(key);
  };

  const scheduleClose = () => {
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => setActiveMega(null), 160);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setActiveMega(null);
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
        setActiveMega(null);
        setOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setActiveMega(null);
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
    setActiveMega(null);
  };

  const renderDesktopItem = (item: MenuNavItem) => {
    if (item.type === "mega" && item.mega) {
      const key = item.mega;
      const active = activeMega === key || isMegaActive(item, pathname);
      return (
        <button
          key={item.id}
          type="button"
          className={`nav-link nav-link--btn ${active ? "active" : ""}`}
          aria-expanded={activeMega === key}
          onMouseEnter={() => openMega(key)}
          onFocus={() => openMega(key)}
          onClick={() => openMega(activeMega === key ? null : key)}
        >
          {item.label}
          <span className="nav-caret" aria-hidden />
        </button>
      );
    }

    const path = item.path || "/";
    return (
      <NavLink
        key={item.id}
        to={path}
        className="nav-link"
        onMouseEnter={() => openMega(null)}
      >
        {item.label}
      </NavLink>
    );
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      {typeof document !== "undefined" &&
        createPortal(
          <div
            className={`mega-backdrop ${activeMega ? "is-open" : ""}`}
            aria-hidden
            onClick={() => setActiveMega(null)}
          />,
          document.body,
        )}
      <header
        ref={headerRef}
        className={`site-header ${scrolled || open || activeMega ? "is-solid" : "is-transparent"} ${open ? "is-menu-open" : ""} ${activeMega ? "has-menu" : ""}`}
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
            {menu.items.map(renderDesktopItem)}
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
            <Link to={menu.cta.path || "/book-now"} className="btn btn--gold header-cta">
              {menu.cta.label || "Book Now"}
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

        <div
          className={`mega-shell ${activeMega ? "is-open" : ""}`}
          onMouseEnter={clearCloseTimer}
        >
          <div className="container">
            {activeMega === "services" && (
              <div className="mega-panel mega-panel--services" role="region" aria-label="Services menu">
                <div className="mega-panel__head">
                  <div>
                    <p className="eyebrow">{servicesMega.eyebrow}</p>
                    <h3>{servicesMega.title}</h3>
                  </div>
                  <Link
                    to={servicesMega.viewAllPath || "/services"}
                    className="btn btn--dark btn--sm"
                    onClick={closeAll}
                  >
                    {servicesMega.viewAllLabel || "View all services"}
                  </Link>
                </div>

                <div className="mega-cats">
                  {(servicesMega.categories || []).map((category) => {
                    const items = services
                      .filter((s) => s.category === category)
                      .slice(0, Number(servicesMega.linksPerCategory) || 5);
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
                  <p className="mega-cat__title">{servicesMega.popularLabel || "Popular"}</p>
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

            {activeMega === "packages" && (
              <div className="mega-panel mega-panel--packages" role="region" aria-label="Packages menu">
                <div className="mega-packages">
                  <Link
                    to={packagesMega.allPath || "/packages"}
                    className="mega-pack-card mega-pack-card--all"
                    onClick={closeAll}
                  >
                    <span className="eyebrow">{packagesMega.allEyebrow}</span>
                    <strong>{packagesMega.allLabel}</strong>
                    <p>{packagesMega.allText}</p>
                  </Link>
                  {packageGroups.map((g) => (
                    <Link
                      key={g.slug}
                      to={`/packages/${g.slug}`}
                      className="mega-pack-card"
                      onClick={closeAll}
                    >
                      <span className="eyebrow">{packagesMega.itemEyebrow || "Package"}</span>
                      <strong>{g.title}</strong>
                      <p>{g.subtitle}</p>
                    </Link>
                  ))}
                  {packagesMega.showPricing !== false && (
                    <Link
                      to={packagesMega.pricingPath || "/pricing"}
                      className="mega-pack-card mega-pack-card--accent"
                      onClick={closeAll}
                    >
                      <span className="eyebrow">{packagesMega.pricingEyebrow}</span>
                      <strong>{packagesMega.pricingLabel}</strong>
                      <p>{packagesMega.pricingText}</p>
                    </Link>
                  )}
                </div>
              </div>
            )}

            {activeMega === "explore" && (
              <div className="mega-panel mega-panel--explore" role="region" aria-label="Explore menu">
                <div className="mega-explore-grid">
                  <div className="mega-cat">
                    <p className="mega-cat__title">{exploreMega.discoverTitle}</p>
                    <ul>
                      {(exploreMega.discoverLinks || []).map((link) => (
                        <li key={`${link.path}-${link.label}`}>
                          <Link to={link.path} onClick={closeAll}>
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mega-cat">
                    <p className="mega-cat__title">{exploreMega.citiesTitle}</p>
                    <ul>
                      {locations.slice(0, Number(exploreMega.citiesCount) || 8).map((loc) => (
                        <li key={loc.slug}>
                          <Link to={`/locations/${loc.slug}`} onClick={closeAll}>
                            {loc.city}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mega-book">
                    <p className="eyebrow">{exploreMega.ctaEyebrow}</p>
                    <strong>{exploreMega.ctaTitle}</strong>
                    <p>{exploreMega.ctaText}</p>
                    <div className="mega-book__actions">
                      <Link
                        to={exploreMega.ctaPrimaryPath || "/book-now"}
                        className="btn btn--gold btn--sm"
                        onClick={closeAll}
                      >
                        {exploreMega.ctaPrimaryLabel || "Book Now"}
                      </Link>
                      {exploreMega.showWhatsApp !== false && (
                        <a
                          href={company.whatsappHref}
                          className="btn btn--outline-light btn--sm"
                          target="_blank"
                          rel="noreferrer"
                          onClick={closeAll}
                        >
                          {exploreMega.ctaSecondaryLabel || "WhatsApp"}
                        </a>
                      )}
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
                  {menu.items.find((i) => i.mega === "services")?.label || "Services"}
                </button>
                {mobileSection === "services" && (
                  <div className="mobile-acc__body">
                    <Link to={servicesMega.viewAllPath || "/services"} onClick={closeAll}>
                      {servicesMega.viewAllLabel || "All services"}
                    </Link>
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
                  {menu.items.find((i) => i.mega === "packages")?.label || "Packages"}
                </button>
                {mobileSection === "packages" && (
                  <div className="mobile-acc__body">
                    <Link to={packagesMega.allPath || "/packages"} onClick={closeAll}>
                      {packagesMega.allLabel || "All packages"}
                    </Link>
                    {packageGroups.map((g) => (
                      <Link key={g.slug} to={`/packages/${g.slug}`} onClick={closeAll}>
                        {g.title}
                      </Link>
                    ))}
                    {packagesMega.showPricing !== false && (
                      <Link to={packagesMega.pricingPath || "/pricing"} onClick={closeAll}>
                        {packagesMega.pricingLabel || "Pricing"}
                      </Link>
                    )}
                  </div>
                )}
              </div>

              <nav className="mobile-drawer__links" aria-label="Mobile">
                {(menu.mobileLinks || []).map((link) => (
                  <NavLink key={`${link.path}-${link.label}`} to={link.path} onClick={closeAll}>
                    {link.label}
                  </NavLink>
                ))}
              </nav>

              <div className="mobile-drawer__actions">
                <Link to={menu.cta.path || "/book-now"} className="btn btn--gold" onClick={closeAll}>
                  {menu.cta.label || "Book Now"}
                </Link>
                <a
                  href={company.whatsappHref}
                  className="btn btn--dark"
                  target="_blank"
                  rel="noreferrer"
                  onClick={closeAll}
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
