import { useEffect, useId, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { company, navItems, type MegaKey } from "../data/company";
import { Logo } from "./Logo";
import { Icon } from "./Icon";
import { WhatWeDoMenu } from "./menus/WhatWeDoMenu";
import { SolutionsMenu } from "./menus/SolutionsMenu";
import { AiPlatformMenu } from "./menus/AiPlatformMenu";
import { IndustriesMenu } from "./menus/IndustriesMenu";
import "./Header.css";

export function Header() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState<MegaKey | null>(null);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);
  const navId = useId();

  useEffect(() => {
    setOpen(false);
    setMega(null);
    setMobileSection(null);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("menu-open", open);
    return () => document.body.classList.remove("menu-open");
  }, [open]);

  const openMega = (key: MegaKey) => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setMega(key);
  };

  const scheduleClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setMega(null), 120);
  };

  const isActive = (href: string, key?: MegaKey | false) => {
    if (href === "/") return pathname === "/";
    if (key && mega === key) return true;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="site-header">
      <div className="announcement">
        <div className="container-wide announcement-inner">
          <span>
            New! AI-Powered Marketing Solutions are now available.
          </span>
          <div className="announcement-actions">
            <Link to="/contact">Book Free Audit</Link>
            <a href={company.phoneHref}>{company.phone}</a>
          </div>
        </div>
      </div>

      <div
        className="header-bar"
        onMouseLeave={scheduleClose}
      >
        <div className="container-wide header-inner">
          <Logo light />

          <nav className="desktop-nav" aria-label="Primary">
            {navItems.map((item) => {
              const hasMega = Boolean(item.mega);
              return (
                <div
                  key={item.label}
                  className={`nav-item ${hasMega ? "has-mega" : ""} ${
                    isActive(item.href, item.mega) ? "active" : ""
                  }`}
                  onMouseEnter={() =>
                    item.mega ? openMega(item.mega) : setMega(null)
                  }
                >
                  <NavLink
                    to={item.href}
                    className="nav-link"
                    onFocus={() =>
                      item.mega ? openMega(item.mega) : setMega(null)
                    }
                  >
                    {item.label}
                    {hasMega && <Icon name="chevron" size={12} />}
                  </NavLink>
                </div>
              );
            })}
          </nav>

          <div className="header-actions">
            <button className="icon-btn" aria-label="Search" type="button">
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

        {mega && (
          <div
            className="mega-panel"
            onMouseEnter={() => openMega(mega)}
            onMouseLeave={scheduleClose}
          >
            <div className="container-wide">
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
            <Link to="/contact" className="btn btn-primary" onClick={() => setOpen(false)}>
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
