import { Link } from 'react-router-dom'
import { SERVICES, servicePriceText } from '../data/services'
import { useLanguage } from '../hooks/useLanguage'
import { copy } from '../lib/i18n'
import { PageHero } from '../components/PageHero'

export function ServicesPage() {
  const { lang } = useLanguage()

  return (
    <div className="page-wrap">
      <div className="container">
        <PageHero
          title={lang === 'hi' ? 'सेवाएँ' : 'Services'}
          subtitle={
            lang === 'hi'
              ? 'कुंडली से शुरू करें। मिलान, करियर, मुहूर्त व परामर्श चरणबद्ध आ रहे हैं।'
              : 'Start with your Vedic kundali. Matching, career, muhurat, and consults roll out next.'
          }
          cta
        />

        <div className="service-grid">
          {SERVICES.map((s) => (
            <article className="service-row" key={s.id}>
              <div className="service-row-top">
                <h2>{lang === 'hi' ? s.titleHi : s.titleEn}</h2>
                <div className="service-meta">
                  <span className="service-price">{servicePriceText(s)}</span>
                  <span className={`pill ${s.status === 'live' ? 'pill-live' : 'pill-soon'}`}>
                    {s.status === 'live'
                      ? lang === 'hi'
                        ? 'उपलब्ध'
                        : 'Live'
                      : lang === 'hi'
                        ? 'जल्द'
                        : 'Soon'}
                  </span>
                </div>
              </div>
              <p className="muted">{lang === 'hi' ? s.blurbHi : s.blurbEn}</p>
              <p className="audience">
                {lang === 'hi' ? 'के लिए:' : 'For:'} {lang === 'hi' ? s.audienceHi : s.audienceEn}
              </p>
              <ul className="include-list">
                {(lang === 'hi' ? s.includesHi : s.includesEn).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {s.status === 'live' && s.ctaTo ? (
                <Link className="btn btn-primary" to={s.ctaTo}>
                  {copy.ctaPrimaryShort(lang)}
                </Link>
              ) : (
                <Link className="btn btn-ghost" to="/contact">
                  {lang === 'hi' ? 'लॉन्च अलर्ट लें' : 'Get launch alert'}
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
