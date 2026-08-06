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
      <div className="container cta-banner__inner">
        <div>
          <p className="eyebrow">{banner.eyebrow}</p>
          <h2>{resolvedTitle}</h2>
          <p>{resolvedText}</p>
          <p className="cta-banner__phone">
            Prefer to talk?{" "}
            <a href={company.phoneHref}>{company.phone}</a>
          </p>
        </div>
        <div className="cta-banner__actions">
          <a href={company.phoneHref} className="btn btn--gold">
            Call Now
          </a>
          <a
            href={company.whatsappHref}
            className="btn btn--outline-light"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
          <Link to={banner.primaryPath || "/book-now"} className="btn btn--outline-light">
            {banner.primaryLabel || "Book Consultation"}
          </Link>
        </div>
      </div>
    </section>
  );
}
