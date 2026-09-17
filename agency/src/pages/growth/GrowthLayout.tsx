import { Outlet, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCms } from "../../cms/CmsProvider";
import { TrackingScripts } from "../../components/TrackingScripts";
import { ScrollToTop } from "../../components/ScrollToTop";
import { trackCtaClick, trackGrowthEvent } from "./growthAnalytics";
import { captureGrowthAttribution } from "./growthAttribution";
import "./Growth.css";

const NAV = [
  { href: "#services", label: "Services" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#cases", label: "Case Studies" },
  { href: "#reviews", label: "Reviews" },
  { href: "#pricing", label: "Pricing" },
] as const;

/** Slim paid-traffic shell — premium sticky nav, no main site chrome. */
export function GrowthLayout() {
  const { company } = useCms();
  const { pathname } = useLocation();
  const [hideSticky, setHideSticky] = useState(false);
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const isThanks = pathname.includes("thank-you");

  useEffect(() => {
    setHideSticky(isThanks);
    setMenuOpen(false);
    if (isThanks) return;
    let io: IntersectionObserver | null = null;
    let cancelled = false;
    const attach = () => {
      if (cancelled) return;
      const form = document.getElementById("growth-form");
      if (!form || typeof IntersectionObserver === "undefined") {
        window.setTimeout(attach, 120);
        return;
      }
      io = new IntersectionObserver(
        ([entry]) => setHideSticky(Boolean(entry?.isIntersecting)),
        { rootMargin: "-10% 0px -35% 0px", threshold: 0.05 },
      );
      io.observe(form);
    };
    attach();
    return () => {
      cancelled = true;
      io?.disconnect();
    };
  }, [pathname, isThanks]);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      setCompact(scrolled > 40);
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (scrolled / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const scrollToForm = (cta_text: string, cta_location: string) => {
    const { last } = captureGrowthAttribution();
    trackCtaClick({
      cta_text,
      cta_location,
      utm_source: last.utm_source,
      utm_campaign: last.utm_campaign,
    });
    setMenuOpen(false);
    document
      .getElementById("growth-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className={`growth-shell ${menuOpen ? "is-menu-open" : ""}`}>
      <ScrollToTop />
      <TrackingScripts />
      <div className="growth-progress" aria-hidden>
        <div style={{ width: `${progress}%` }} />
      </div>
      <header className={`growth-topbar ${compact ? "is-compact" : ""}`}>
        <div className="growth-topbar__inner">
          <a href="/growth" className="growth-brand">
            <strong>DisplayAvenue</strong>
            <small>Digital Growth</small>
          </a>
          {!isThanks && (
            <nav className="growth-nav" aria-label="Growth page">
              {NAV.map((item) => (
                <a key={item.href} href={item.href}>
                  {item.label}
                </a>
              ))}
            </nav>
          )}
          <div className="growth-topbar__actions">
            <a
              className="growth-topbar__phone"
              href={company.phoneHref}
              onClick={() => trackGrowthEvent("phone_click", { cta_location: "topbar" })}
            >
              {company.phone}
            </a>
            <button
              type="button"
              className="growth-btn growth-btn--primary growth-btn--sm"
              onClick={() => scrollToForm("Get My Growth Plan", "topbar")}
            >
              Get My Growth Plan <span className="growth-btn__arrow">→</span>
            </button>
            <button
              type="button"
              className={`growth-menu-toggle ${menuOpen ? "is-open" : ""}`}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
        {menuOpen && !isThanks && (
          <div className="growth-mobile-menu">
            {NAV.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>
                {item.label}
              </a>
            ))}
            <button
              type="button"
              className="growth-btn growth-btn--primary"
              onClick={() => scrollToForm("Get My Growth Plan", "mobile_menu")}
            >
              Get My Growth Plan →
            </button>
          </div>
        )}
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="growth-footer">
        <div className="growth-wrap growth-footer__grid">
          <div>
            <strong>DisplayAvenue</strong>
            <p>Mediashouter Group</p>
            <p className="growth-footer__muted">
              One digital growth partner for website, marketing, leads & e-commerce.
            </p>
          </div>
          <div>
            <h4>Services</h4>
            <ul>
              <li>Website Development</li>
              <li>Website Management</li>
              <li>Meta Ads</li>
              <li>Google Ads</li>
              <li>Google Business Profile</li>
              <li>Lead Generation</li>
              <li>E-commerce Management</li>
            </ul>
          </div>
          <div>
            <h4>Company</h4>
            <ul>
              <li>
                <Link to="/why-displayavenue">About</Link>
              </li>
              <li>
                <Link to="/case-studies">Case Studies</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Legal</h4>
            <ul>
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms">Terms</Link>
              </li>
            </ul>
            <h4>Contact</h4>
            <ul>
              <li>
                <a href={company.phoneHref}>{company.phone}</a>
              </li>
              <li>
                <a href={company.whatsappHref} target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={company.emailHref}>{company.email}</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="growth-wrap growth-footer__bottom">
          <span>© {new Date().getFullYear()} DisplayAvenue</span>
          <Link to="/">Main website</Link>
        </div>
      </footer>

      {!hideSticky && !isThanks && (
        <div className="growth-sticky-cta">
          <div>
            <strong>Plans Starting ₹30K</strong>
          </div>
          <button
            type="button"
            onClick={() =>
              scrollToForm("Plans Starting ₹30K — Get My Growth Plan", "sticky_mobile")
            }
          >
            Get My Growth Plan →
          </button>
        </div>
      )}
    </div>
  );
}
