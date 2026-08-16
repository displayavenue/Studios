import { Link } from 'react-router-dom'
import { PageHero } from '../components/PageHero'
import { featuresByGroup } from '../data/features'
import { useLanguage } from '../hooks/useLanguage'
import { copy } from '../lib/i18n'
import { formatInr, PRICING } from '../lib/pricing'

export function FeaturesPage() {
  const { lang } = useLanguage()
  const groups = featuresByGroup(lang)
  const liveCount = groups.reduce((n, g) => n + g.items.filter((i) => i.status === 'live').length, 0)

  return (
    <div className="page-wrap">
      <div className="container">
        <PageHero
          title={lang === 'hi' ? '५० विशेषताएँ' : '50 features'}
          subtitle={
            lang === 'hi'
              ? 'पूरी तरह स्वयं-सेवा—कॉल या पंडित चैट नहीं। मुफ़्त चार्ट साइटों से गहराई में अंतर।'
              : 'Fully self-serve—no calls or pandit chat. Built to be deeper than free chart sites.'
          }
        />

        <div className="feature-lead panel">
          <p>
            {lang === 'hi'
              ? `${liveCount} विशेषताएँ अभी लाइव। शेष जल्द—सब स्वचालित उत्पाद के रूप में। मूल्य: कुंडली ${formatInr(PRICING.kundaliInr)} · मिलान ${formatInr(PRICING.milanInr)}।`
              : `${liveCount} features live now. The rest ship as automated products—no humans in the loop. Pricing: kundali ${formatInr(PRICING.kundaliInr)} · milan ${formatInr(PRICING.milanInr)}.`}
          </p>
          <div className="form-actions">
            <Link className="btn btn-primary" to="/generate">
              {copy.ctaPrimary(lang)}
            </Link>
            <Link className="btn btn-secondary" to="/sample">
              {lang === 'hi' ? 'SAMPLE PDF' : 'SAMPLE PDF'}
            </Link>
            <Link className="btn btn-ghost" to="/milan">
              {lang === 'hi' ? 'मिलान' : 'Milan'}
            </Link>
          </div>
        </div>

        <div className="compare-strip">
          <div>
            <h3>{lang === 'hi' ? 'मुफ़्त साइटें' : 'Free sites'}</h3>
            <ul className="include-list">
              {(lang === 'hi'
                ? ['तुरंत पतली चार्ट', 'विज्ञापन / लीड स्पैम', 'कम व्याख्या', 'अस्पष्ट पद्धति']
                : ['Instant thin chart', 'Ads / lead spam', 'Shallow text', 'Hidden method']
              ).map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>{lang === 'hi' ? 'Jyotish Kundali' : 'Jyotish Kundali'}</h3>
            <ul className="include-list">
              {(lang === 'hi'
                ? ['~२० पृष्ठ रिपोर्ट', 'भुगतान के बाद तुरंत PDF', 'मिलान व उपाय उत्पाद', 'स्पष्ट लाहिरी पद्धति']
                : ['~20 page report', 'Instant PDF after pay', 'Milan & remedies products', 'Clear Lahiri method']
              ).map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </div>
        </div>

        {groups.map((g) => {
          let n = groups.slice(0, groups.indexOf(g)).reduce((acc, x) => acc + x.items.length, 0)
          return (
          <section className="feature-group" key={g.group}>
            <h2>{g.group}</h2>
            <ol className="feature-list">
              {g.items.map((f) => {
                n += 1
                return (
                <li key={f.id} className={f.status === 'soon' ? 'soon' : 'live'}>
                  <div className="feature-list-top">
                    <strong>
                      {n}. {lang === 'hi' ? f.titleHi : f.titleEn}
                    </strong>
                    <span className={`pill ${f.status === 'live' ? 'pill-live' : 'pill-soon'}`}>
                      {f.status === 'live' ? (lang === 'hi' ? 'लाइव' : 'Live') : lang === 'hi' ? 'जल्द' : 'Soon'}
                    </span>
                  </div>
                  <p>{lang === 'hi' ? f.blurbHi : f.blurbEn}</p>
                </li>
              )})}
            </ol>
          </section>
        )})}
      </div>
    </div>
  )
}
