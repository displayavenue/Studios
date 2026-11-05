import { Link } from "react-router-dom";
import { useCms } from "../cms/CmsProvider";
import "./AwardsCertsHome.css";

export function AwardsCertsHome() {
  const { awards, certifications } = useCms();
  if (!awards?.enabled && !certifications?.enabled) return null;

  const awardLimit = awards.homeAwardsLimit ?? 6;
  const certLimit = awards.homeCertsLimit ?? 8;
  const awardItems = (awards.items || [])
    .filter((a) => a.featured !== false)
    .slice(0, awardLimit);
  const certItems = (certifications.items || [])
    .filter((c) => c.featured !== false)
    .slice(0, certLimit);

  if (!awardItems.length && !certItems.length) return null;

  return (
    <section className="achome" aria-labelledby="achome-title">
      <div className="container">
        <header className="achome__head">
          <p className="achome__kicker">Proof of craft</p>
          <h2 id="achome-title">{awards.homeTitle || "Certifications & awards"}</h2>
          <p className="achome__sub">
            {awards.homeSub ||
              "Credentials our team earned from Google, Meta, HubSpot, and more - plus awards for real client results."}
          </p>
          <div className="achome__cta">
            <Link to="/awards" className="btn btn-primary btn-sm">
              View all awards
            </Link>
            <Link to="/certifications" className="btn btn-outline btn-sm">
              View all certifications
            </Link>
          </div>
        </header>

        {awardItems.length > 0 && (
          <div className="achome__block">
            <div className="achome__block-head">
              <h3>Awards</h3>
              <Link to="/awards" className="link-arrow">
                All {awards.items.length} awards →
              </Link>
            </div>
            <div className="achome__awards">
              {awardItems.map((item, i) => (
                <article
                  key={item.id}
                  className={`achome__award reveal reveal-delay-${(i % 3) + 1}`}
                >
                  <div className="achome__award-media">
                    <img src={item.image} alt="" width={1000} height={700} loading="lazy" />
                  </div>
                  <div className="achome__award-body">
                    <span>{item.year}</span>
                    <h4>{item.title}</h4>
                    <p>{item.issuer}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {certItems.length > 0 && (
          <div className="achome__block">
            <div className="achome__block-head">
              <h3>Certifications</h3>
              <Link to="/certifications" className="link-arrow">
                All {certifications.items.length} certificates →
              </Link>
            </div>
            <div className="achome__certs">
              {certItems.map((item, i) => (
                <article
                  key={item.id}
                  className={`achome__cert reveal reveal-delay-${(i % 4) + 1}`}
                >
                  <div className="achome__cert-media">
                    <img src={item.image} alt="" width={1200} height={850} loading="lazy" />
                  </div>
                  <div className="achome__cert-body">
                    <span className="achome__brand">{item.brand}</span>
                    <h4>{item.title}</h4>
                    <p>
                      {item.issuer} · {item.year}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
