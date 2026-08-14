import { Link } from 'react-router-dom'
import { BUNDLES, SERVICES, servicePriceText } from '../data/services'
import { useLanguage } from '../hooks/useLanguage'
import { formatInr, PRICING } from '../lib/pricing'
import { copy } from '../lib/i18n'
import { PageHero } from '../components/PageHero'

export function PricingPage() {
  const { lang } = useLanguage()

  return (
    <div className="page-wrap">
      <div className="container">
        <PageHero
          title={lang === 'hi' ? 'मूल्य सूची' : 'Pricing'}
          subtitle={
            lang === 'hi'
              ? 'स्पष्ट एक-बार कीमतें। छुपी फीस नहीं। उपाय तभी जब आप चुनें।'
              : 'Clear one-time prices. No hidden fees. Remedies only if you choose.'
          }
        />

        <div className="pricing-row" style={{ marginBottom: '2rem' }}>
          <div className="price-block">
            <h3>{lang === 'hi' ? 'वैदिक कुंडली' : 'Vedic Kundali'}</h3>
            <div className="amount">{formatInr(PRICING.kundaliInr)}</div>
            <p>{lang === 'hi' ? 'अभी उपलब्ध' : 'Available now'}</p>
            <ul>
              <li>{lang === 'hi' ? 'पूरा D1 चार्ट + PDF' : 'Full D1 chart + PDF'}</li>
              <li>{lang === 'hi' ? 'नक्षत्र, महादशा, दोष संकेत' : 'Nakshatra, dasha, dosha flags'}</li>
            </ul>
            <div className="form-actions">
              <Link className="btn btn-primary" to="/generate">
                {copy.ctaPrimary(lang)}
              </Link>
            </div>
          </div>
          <div className="price-block addon">
            <h3>{lang === 'hi' ? 'उपाय ऐड-ऑन' : 'Remedies add-on'}</h3>
            <div className="amount">+{formatInr(PRICING.remediesInr)}</div>
            <p>{lang === 'hi' ? 'कुंडली के बाद वैकल्पिक' : 'Optional after kundali'}</p>
            <ul>
              <li>{lang === 'hi' ? 'व्यक्तिगत मंत्र व दान' : 'Personal mantras & daan'}</li>
              <li>{lang === 'hi' ? 'उपाय सहित PDF' : 'PDF with remedies'}</li>
            </ul>
          </div>
        </div>

        <section className="content-block">
          <h2>{lang === 'hi' ? 'सभी सेवा कीमतें' : 'All service prices'}</h2>
          <div className="table-wrap">
            <table className="planets price-table">
              <thead>
                <tr>
                  <th>{lang === 'hi' ? 'सेवा' : 'Service'}</th>
                  <th>{lang === 'hi' ? 'मूल्य' : 'Price'}</th>
                  <th>{lang === 'hi' ? 'स्थिति' : 'Status'}</th>
                </tr>
              </thead>
              <tbody>
                {SERVICES.map((s) => (
                  <tr key={s.id}>
                    <td>{lang === 'hi' ? s.titleHi : s.titleEn}</td>
                    <td>{servicePriceText(s)}</td>
                    <td>{s.status === 'live' ? (lang === 'hi' ? 'लाइव' : 'Live') : lang === 'hi' ? 'जल्द' : 'Soon'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="content-block">
          <h2>{lang === 'hi' ? 'बंडल (जल्द)' : 'Bundles (coming soon)'}</h2>
          <div className="bundle-grid">
            {BUNDLES.map((b) => (
              <div className="bundle-item" key={b.id}>
                <h3>{lang === 'hi' ? b.titleHi : b.titleEn}</h3>
                <div className="amount" style={{ fontSize: '1.8rem' }}>
                  {formatInr(b.priceInr)}
                </div>
                <ul className="include-list">
                  {(lang === 'hi' ? b.itemsHi : b.itemsEn).map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
