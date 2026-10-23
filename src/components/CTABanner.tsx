import { Link } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import "./CTABanner.css";

export function CTABanner() {
  const { home, company } = useCms();
  const c = home.ctaBanner;

  return (
    <section className="cta-banner section">
      <div className="container cta-banner__inner reveal">
        <div>
          <h2>{c.title}</h2>
          <p>{c.text}</p>
        </div>
        <div className="cta-banner__actions">
          <a
            className="btn btn--brass"
            href={company.whatsappHref}
            target="_blank"
            rel="noreferrer"
          >
            {c.primaryCta}
          </a>
          <Link className="btn btn--ghost" to={c.secondaryHref}>
            {c.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
