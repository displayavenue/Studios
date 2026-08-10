import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { type MegaKey } from "../data/company";
import { useCms } from "../cms/CmsProvider";
import { Logo } from "./Logo";
import { Icon } from "./Icon";
import { WhatWeDoMenu } from "./menus/WhatWeDoMenu";
import { SolutionsMenu } from "./menus/SolutionsMenu";
import { AiPlatformMenu } from "./menus/AiPlatformMenu";
import { IndustriesMenu } from "./menus/IndustriesMenu";
import { SiteSearch } from "./SiteSearch";
import "./Header.css";

export function Header() {
  const { company } = useCms();
  const navItems = company.navItems;
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState<MegaKey | null>(null);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeTimer = useRef<number | null>(null);
  const navId = useId();
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  useEffect(() => {
    setOpen(false);
    setMega(null);
    setMobileSection(null);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      document.body.classList.remove("menu-open");
      document.body.style.removeProperty("top");
      return;
    }

    const scrollY = window.scrollY;
    document.body.classList.add("menu-open");
    document.body.style.top = `-${scrollY}px`;

    return () => {
      document.body.classList.remove("menu-open");
      document.body.style.removeProperty("top");
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if (typing) return;
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
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
    <header className={`site-header${open ? " is-menu-open" : ""}`}>
      <div className="announcement">
        <div className="container-wide announcement-inner">
          <span className="announcement-text">
            {company.announcement ||
              "New! AI-Powered Marketing Solutions are now available."}
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
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen(true)}
            >
              <Icon name="search" size={18} color="#fff" />
            </button>
            <Link
              className="btn btn-ghost btn-sm client-login"
              to="/catalogue"
            >
              <Icon name="doc" size={14} color="#fff" />
              Catalogue
            </Link>
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

      {open && (
        <button
          type="button"
          className="mobile-drawer-backdrop"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        id={navId}
        className={`mobile-drawer ${open ? "open" : ""}`}
        hidden={!open}
      >
        <div className="mobile-drawer-inner">
          <div className="mobile-drawer__top">
            <p className="mobile-drawer__label">Menu</p>
            <button
              type="button"
              className="mobile-drawer__close"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <Icon name="close" size={18} color="#000b33" />
              Close
            </button>
          </div>
          <button
            type="button"
            className="mobile-link search-mobile-btn"
            onClick={() => {
              setOpen(false);
              setSearchOpen(true);
            }}
          >
            <Icon name="search" size={16} color="#0056ff" />
            Search the site
          </button>
          {navItems.map((item) => {
            const expanded = mobileSection === item.label;
            if (!item.mega) {
              return (
                <Link
                  key={item.label}
                  to={item.href}
                  className="mobile-link"
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
              to="/contact"
              className="btn btn-primary"
              onClick={() => setOpen(false)}
            >
              Get Free Proposal
            </Link>
            <a
              className="btn btn-outline"
              href={company.whatsappHref}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
            >
              WhatsApp us
            </a>
            <Link
              className="btn btn-outline"
              to="/catalogue"
              onClick={() => setOpen(false)}
            >
              Catalogue
            </Link>
          </div>
        </div>
      </div>

      <SiteSearch open={searchOpen} onClose={closeSearch} />
    </header>
  );
}
