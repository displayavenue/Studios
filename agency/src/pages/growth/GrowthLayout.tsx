import { Outlet, Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCms } from "../../cms/CmsProvider";
import { TrackingScripts } from "../../components/TrackingScripts";
import { ScrollToTop } from "../../components/ScrollToTop";
import { Logo } from "../../components/Logo";
import { trackCtaClick, trackGrowthEvent } from "./growthAnalytics";
import { captureGrowthAttribution } from "./growthAttribution";
import "./Growth.css";

/** Slim paid-traffic shell — no main mega-nav, InternalLinks, or site sticky CTA. */
export function GrowthLayout() {
  const { company } = useCms();
  const { pathname } = useLocation();
  const [hideSticky, setHideSticky] = useState(false);

  useEffect(() => {
    setHideSticky(pathname.includes("thank-you"));
    const form = document.getElementById("growth-form");
    if (!form || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setHideSticky(Boolean(entry?.isIntersecting)),
      { rootMargin: "-10% 0px -35% 0px", threshold: 0.05 },
    );
    io.observe(form);
    return () => io.disconnect();
  }, [pathname]);

  const scrollToForm = (cta_text: string, cta_location: string) => {
    const { last } = captureGrowthAttribution();
    trackCtaClick({
      cta_text,
      cta_location,
      utm_source: last.utm_source,
      utm_campaign: last.utm_campaign,
    });
    document
      .getElementById("growth-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="growth-shell">
      <ScrollToTop />
      <TrackingScripts />
      <header className="growth-topbar">
        <div className="growth-topbar__inner">
          <Logo light />
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
              className="btn btn-primary btn-sm"
              onClick={() => scrollToForm("Get My Growth Plan", "topbar")}
            >
              Get My Growth Plan
            </button>
          </div>
        </div>
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

      {!hideSticky && (
        <div className="growth-sticky-cta">
          <button
            type="button"
            onClick={() =>
              scrollToForm("Plans Starting ₹30K — Get My Growth Plan", "sticky_mobile")
            }
          >
            Plans Starting ₹30K — Get My Growth Plan
          </button>
        </div>
      )}
    </div>
  );
}
