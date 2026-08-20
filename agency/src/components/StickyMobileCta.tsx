import { Link } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import "./StickyMobileCta.css";

/** Mobile sticky conversion bar: Call | WhatsApp | Strategy */
export function StickyMobileCta() {
  const { company } = useCms();
  return (
    <nav className="sticky-mcta" aria-label="Quick contact">
      <a className="sticky-mcta__btn sticky-mcta__btn--call" href={company.phoneHref}>
        Call
      </a>
      <a
        className="sticky-mcta__btn sticky-mcta__btn--wa"
        href={company.whatsappHref}
        target="_blank"
        rel="noreferrer"
      >
        WhatsApp
      </a>
      <Link className="sticky-mcta__btn sticky-mcta__btn--cta" to="/contact">
        Get Strategy
      </Link>
    </nav>
  );
}
