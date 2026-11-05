import { useCms } from "../cms/CmsProvider";
import "./StickyMobileCta.css";

const CATALOGUE_HREF = "/catalogue/DisplayAvenue-Catalogue.pdf";

/** Mobile sticky bar: single Catalogue download CTA */
export function StickyMobileCta() {
  useCms();
  return (
    <nav className="sticky-mcta" aria-label="Catalogue download">
      <a
        className="sticky-mcta__btn sticky-mcta__btn--catalogue"
        href={CATALOGUE_HREF}
        download="DisplayAvenue-Catalogue.pdf"
        target="_blank"
        rel="noreferrer"
      >
        Catalogue
      </a>
    </nav>
  );
}
