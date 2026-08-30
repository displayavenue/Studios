import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import "./StickyMobileCta.css";

/** Mobile sticky conversion bar — slides in after ~30% scroll. */
export function StickyMobileCta() {
  const { company } = useCms();
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);
  const hideOnContact = pathname === "/contact" || pathname.startsWith("/contact/");

  useEffect(() => {
    if (hideOnContact) {
      setVisible(false);
      return;
    }
    const onScroll = () => {
      // Viewport-based gate: InternalLinks make document height huge, so % of
      // scrollHeight never matches "25–35% of the page journey" users expect.
      const threshold = Math.max(280, window.innerHeight * 0.32);
      setVisible(window.scrollY >= threshold);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [hideOnContact, pathname]);

  if (hideOnContact) return null;

  return (
    <nav
      className={`sticky-mcta${visible ? " is-visible" : ""}`}
      aria-label="Quick contact"
      aria-hidden={!visible}
    >
      <a className="sticky-mcta__btn sticky-mcta__btn--call" href={company.phoneHref} tabIndex={visible ? 0 : -1}>
        Call
      </a>
      <a
        className="sticky-mcta__btn sticky-mcta__btn--wa"
        href={company.whatsappHref}
        target="_blank"
        rel="noreferrer"
        tabIndex={visible ? 0 : -1}
      >
        WhatsApp
      </a>
      <Link className="sticky-mcta__btn sticky-mcta__btn--cta" to="/contact" tabIndex={visible ? 0 : -1}>
        Get Free Proposal
      </Link>
    </nav>
  );
}
