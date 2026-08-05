import { Link } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import "./CTABanner.css";

export function CTABanner({
  title,
  text,
}: {
  title?: string;
  text?: string;
}) {
  const { company, home } = useCms();
  const banner = home.ctaBanner;
  const resolvedTitle = title ?? banner.title;
  const resolvedText = text ?? banner.text;

  return (
    <section className="cta-banner section">
      <div className="container cta-banner__inner reveal">
        <div>
          <p className="eyebrow">{banner.eyebrow}</p>
          <h2>{resolvedTitle}</h2>
          <p>{resolvedText}</p>
        </div>
        <div className="cta-banner__actions">
          <Link to={banner.primaryPath || "/book-now"} className="btn btn--gold">
            {banner.primaryLabel || "Book Consultation"}
          </Link>
          <a
            href={company.whatsappHref}
            className="btn btn--outline-light"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
