import { useEffect, useId, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { type MegaKey } from "../data/company";
import { useCms } from "../cms/CmsProvider";
import { Logo } from "./Logo";
import { Icon } from "./Icon";
import { SiteSearch } from "./SiteSearch";
import { WhatWeDoMenu } from "./menus/WhatWeDoMenu";
import { SolutionsMenu } from "./menus/SolutionsMenu";
import { AiPlatformMenu } from "./menus/AiPlatformMenu";
import { IndustriesMenu } from "./menus/IndustriesMenu";
import "./Header.css";

export function Header() {
  const { company } = useCms();
  const navItems = company.navItems;
  const catalogueHref =
    company.catalogueUrl || "/catalogue/DisplayAvenue-Catalogue.pdf";
  const catalogueName =
    company.catalogueFileName || "DisplayAvenue-Catalogue.pdf";
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mega, setMega] = useState<MegaKey | null>(null);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);
  const navId = useId();

  useEffect(() => {
    setOpen(false);
    setMega(null);
    setMobileSection(null);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const openMega = (key: MegaKey) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setMega(key);
  };

  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMega(null), 160);
  };

  const keepOpen = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  };

  const isActive = (href: string, key?: MegaKey | false) => {
    if (href === "/") return pathname === "/" || pathname === "";
    if (key && mega === key) return true;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="site-header">
      <SiteSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
      <div className="announcement">
        <div className="container-wide announcement-inner">
          <span>
            {company.announcement ||
              "Free growth call for business owners - book in 2 minutes."}
          </span>
          <div className="announcement-actions">
            <Link to="/contact">Book Free Audit</Link>
            <a href={company.phoneHref}>{company.phone}</a>
          </div>
        </div>
      </div>

      <div className="header-top">
        <div className="container-wide header-top-inner">
          <Logo light />
          <div className="header-actions">
            <button
              className="icon-btn"
              aria-label="Search"
              type="button"
              onClick={() => setSearchOpen(true)}
            >
              <Icon name="search" size={18} color="#fff" />
            </button>
            <a
              className="btn btn-ghost btn-sm client-login"
              href={company.clientLogin}
            >
              <Icon name="user" size={14} color="#fff" />
              Client Login
            </a>
            <Link to="/contact" className="btn btn-primary btn-sm proposal-btn">
              Get Free Proposal
              <Icon name="arrow" size={14} color="#fff" />
            </Link>
            <button
              className="icon-btn mobile-toggle"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls={navId}
              type="button"
              onClick={() => setOpen((v) => !v)}
            >
              <Icon name={open ? "close" : "menu"} size={22} color="#fff" />
            </button>
          </div>
        </div>
      </div>

      <div
        className={`header-nav ${mega ? "mega-open" : ""}`}
        onMouseLeave={scheduleClose}
      >
        <div className="container-wide header-nav-inner">
          <nav className="desktop-nav" aria-label="Primary">
            {navItems.map((item) => {
              const hasMega = Boolean(item.mega);
              return (
                <div
                  key={item.label}
                  className={`nav-item ${hasMega ? "has-mega" : ""} ${
                    isActive(item.href, item.mega) ? "active" : ""
                  }`}
                  onMouseEnter={() => {
                    keepOpen();
                    if (item.mega) openMega(item.mega);
                    else setMega(null);
                  }}
                >
                  <NavLink
                    to={item.href}
                    className="nav-link"
                    onFocus={() => {
                      keepOpen();
                      if (item.mega) openMega(item.mega);
                      else setMega(null);
                    }}
                  >
                    {item.label}
                    {hasMega && (
                      <span className="nav-caret" aria-hidden>
                        <Icon name="chevron" size={11} />
                      </span>
                    )}
                  </NavLink>
                </div>
              );
            })}
          </nav>
        </div>

        {mega && (
          <div
            className="mega-panel"
            onMouseEnter={keepOpen}
            onMouseLeave={scheduleClose}
          >
            <div className="container-wide mega-panel-inner">
              {mega === "whatWeDo" && <WhatWeDoMenu />}
              {mega === "solutions" && <SolutionsMenu />}
              {mega === "aiPlatform" && <AiPlatformMenu />}
              {mega === "industries" && <IndustriesMenu />}
            </div>
          </div>
        )}
      </div>

      <div
        id={navId}
        className={`mobile-drawer ${open ? "open" : ""}`}
        hidden={!open}
      >
        <div className="mobile-drawer-inner">
          {navItems.map((item) => {
            const expanded = mobileSection === item.label;
            if (!item.mega) {
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className={`mobile-link${
                    item.href === "/why-displayavenue" ? " mobile-link--why" : ""
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              );
            }
            return (
              <div key={item.label} className="mobile-accordion">
                <button
                  type="button"
                  className="mobile-link accordion-btn"
                  aria-expanded={expanded}
                  onClick={() =>
                    setMobileSection(expanded ? null : item.label)
                  }
                >
                  {item.label}
                  <Icon name="chevron" size={14} />
                </button>
                {expanded && (
                  <div className="mobile-mega">
                    {item.mega === "whatWeDo" && <WhatWeDoMenu compact />}
                    {item.mega === "solutions" && <SolutionsMenu compact />}
                    {item.mega === "aiPlatform" && <AiPlatformMenu compact />}
                    {item.mega === "industries" && <IndustriesMenu compact />}
                  </div>
                )}
              </div>
            );
          })}
          <div className="mobile-cta">
            <Link
              to="/why-displayavenue"
              className="btn btn-outline"
              onClick={() => setOpen(false)}
            >
              Why DisplayAvenue
            </Link>
            <a
              className="btn btn-primary"
              href={catalogueHref}
              download={catalogueName}
              onClick={() => setOpen(false)}
            >
              Download Catalogue
            </a>
            <Link
              to="/contact"
              className="btn btn-primary"
              onClick={() => setOpen(false)}
            >
              Get Free Proposal
            </Link>
            <a className="btn btn-outline" href={company.clientLogin}>
              Client Login
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
