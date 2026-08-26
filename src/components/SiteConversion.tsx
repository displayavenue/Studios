import { Link, useLocation } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import "./SiteConversion.css";

const skipPaths = ["/book-now"];

export function SiteConversion() {
  const { pathname } = useLocation();
  const { company, testimonials } = useCms();
  const trustBadges = company.trustBadges || [];

  if (skipPaths.includes(pathname)) return null;

  const reviews = testimonials.slice(0, 3);

  return (
    <section className="site-conversion" aria-label="Reviews and booking">
      <div className="container site-conversion__inner">
        <div className="site-conversion__proof">
          <p className="eyebrow">Client love</p>
          <h2>Ready when you are — call, WhatsApp or book</h2>
          <p>
            Couples and families across India trust DisplayAvenue for weddings,
            campaigns and hospitality visuals. Tell us your date and city —
            we’ll reply fast with a clear plan.
          </p>

          <div className="site-conversion__rating" aria-label="4.9 out of 5 stars">
            <strong>★★★★★ 4.9/5</strong>
            <span>Based on recent client reviews</span>
          </div>

          {reviews.length > 0 && (
            <div className="site-conversion__quotes">
              {reviews.map((t) => (
                <blockquote key={`${t.name}-${t.role}`}>
                  <p>“{t.quote}”</p>
                  <footer>
                    <img src={t.image} alt="" loading="lazy" width={40} height={40} />
                    <span>
                      <strong>{t.name}</strong>
                      {t.role}
                    </span>
                  </footer>
                </blockquote>
              ))}
            </div>
          )}
        </div>

        <div className="site-conversion__buy">
          <div className="site-conversion__card">
            <p className="eyebrow">Book your shoot</p>
            <strong className="site-conversion__phone">{company.phone}</strong>
            <p>Speak with our Mumbai studio team — usually within a few hours.</p>

            <div className="site-conversion__actions">
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
              <Link to="/book-now" className="btn btn--outline-light">
                Book Consultation
              </Link>
            </div>

            <ul className="site-conversion__trust">
              {(trustBadges.length
                ? trustBadges
                : [
                    "Pan India Coverage",
                    "Luxury Experience",
                    "Professional Team",
                    "Fast Delivery",
                  ]
              ).map((badge) => (
                <li key={badge}>{badge}</li>
              ))}
            </ul>

            <p className="site-conversion__meta">
              <a href={company.emailHref}>{company.email}</a>
              <span>·</span>
              <span>
                {company.address.addressLocality}, {company.address.addressRegion}
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
