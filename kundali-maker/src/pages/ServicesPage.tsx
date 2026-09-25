import { Link } from 'react-router-dom'
import { SERVICES, servicePriceText } from '../data/services'
import { useLanguage } from '../hooks/useLanguage'
import { copy } from '../lib/i18n'
import { PageHero } from '../components/PageHero'

function ctaLabel(id: string, lang: 'en' | 'hi'): string {
  if (id === 'milan') return lang === 'hi' ? 'मिलान करें' : 'Check Milan'
  if (id === 'remedies') return lang === 'hi' ? 'कुंडली के बाद' : 'After kundali'
  if (id === 'shaadi') return lang === 'hi' ? 'शादी पैक' : 'Shaadi pack'
  if (id === 'manglik') return lang === 'hi' ? 'जाँच करें' : 'Check now'
  if (id === 'career' || id === 'varshphal' || id === 'muhurat' || id === 'deep' || id === 'business' || id === 'student') {
    return lang === 'hi' ? 'अभी खरीदें' : 'Buy now'
  }
  return copy.ctaPrimaryShort(lang)
}

export function ServicesPage() {
  const { lang } = useLanguage()

  return (
    <div className="page-wrap">
      <div className="container">
        <PageHero
          title={lang === 'hi' ? 'सेवाएँ' : 'Services'}
          subtitle={
            lang === 'hi'
              ? 'सभी सेवाएँ लाइव—भुगतान के बाद तुरंत PDF। कोई कॉल नहीं।'
              : 'All services live—instant PDF after pay. No calls.'
          }
          cta
        />

        <div className="service-grid">
          {SERVICES.map((s) => (
            <article className="service-row anim-rise" key={s.id}>
              <div className="service-row-top">
                <h2>{lang === 'hi' ? s.titleHi : s.titleEn}</h2>
                <div className="service-meta">
                  <span className="service-price">{servicePriceText(s)}</span>
                  <span className="pill pill-live">{lang === 'hi' ? 'लाइव' : 'Live'}</span>
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
              {s.ctaTo && (
                <Link className="btn btn-primary" to={s.ctaTo}>
                  {ctaLabel(s.id, lang)}
                </Link>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
