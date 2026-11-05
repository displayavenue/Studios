import { useCms } from "../cms/CmsProvider";
import "./StickyMobileCta.css";

const DEFAULT_CATALOGUE = "/catalogue/DisplayAvenue-Catalogue.pdf";

/** Mobile sticky bar: WhatsApp + Catalogue download */
export function StickyMobileCta() {
  const { company } = useCms();
  const catalogueHref = company.catalogueUrl || DEFAULT_CATALOGUE;
  const catalogueName =
    company.catalogueFileName || "DisplayAvenue-Catalogue.pdf";

  return (
    <nav className="sticky-mcta" aria-label="Quick actions">
      <a
        className="sticky-mcta__btn sticky-mcta__btn--whatsapp"
        href={company.whatsappHref}
        target="_blank"
        rel="noreferrer"
      >
        WhatsApp
      </a>
      <a
        className="sticky-mcta__btn sticky-mcta__btn--catalogue"
        href={catalogueHref}
        download={catalogueName}
        target="_blank"
        rel="noreferrer"
      >
        Catalogue
      </a>
    </nav>
  );
}
