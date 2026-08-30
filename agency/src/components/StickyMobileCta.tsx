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
      const doc = document.documentElement;
      const max = Math.max(1, doc.scrollHeight - window.innerHeight);
      const ratio = window.scrollY / max;
      setVisible(ratio >= 0.28);
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
