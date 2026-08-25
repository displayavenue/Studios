import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import { cityFromPathAndSearch, whatsappWithText } from "../lib/geoContext";
import "./StickyMobileCta.css";

const DEFAULT_CATALOGUE = "/catalogue/DisplayAvenue-Catalogue.pdf";

/** Mobile sticky bar: city-aware WhatsApp + Catalogue download */
export function StickyMobileCta() {
  const { company } = useCms();
  const location = useLocation();
  const city = useMemo(
    () => cityFromPathAndSearch(location.pathname, location.search),
    [location.pathname, location.search],
  );

  const catalogueHref = company.catalogueUrl || DEFAULT_CATALOGUE;
  const catalogueName =
    company.catalogueFileName || "DisplayAvenue-Catalogue.pdf";

  const waHref = useMemo(() => {
    const text = city
      ? `Hi DisplayAvenue, I need digital marketing help in ${city}.`
      : "Hi DisplayAvenue, I need a free growth plan.";
    return whatsappWithText(company.whatsappHref, text);
  }, [company.whatsappHref, city]);

  const waLabel = city ? `WhatsApp · ${city}` : "WhatsApp";

  return (
    <nav className="sticky-mcta" aria-label="Quick actions">
      <a
        className="sticky-mcta__btn sticky-mcta__btn--whatsapp"
        href={waHref}
        target="_blank"
        rel="noreferrer"
      >
        {waLabel}
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
