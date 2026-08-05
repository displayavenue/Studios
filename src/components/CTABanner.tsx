import { Link } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import "./CTABanner.css";

export function CTABanner({
  title = "Ready to Capture Your Story?",
  text = "Book a consultation with DisplayAvenue Studios — India's Premium Visual Production Studio for weddings, brands and events.",
}: {
  title?: string;
  text?: string;
}) {
  const { company } = useCms();

  return (
    <section className="cta-banner section">
      <div className="container cta-banner__inner reveal">
        <div>
          <p className="eyebrow">Book Consultation</p>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div className="cta-banner__actions">
          <Link to="/book-now" className="btn btn--gold">
            Book Consultation
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
