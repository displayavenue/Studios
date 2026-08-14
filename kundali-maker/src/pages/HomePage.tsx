import { Link } from 'react-router-dom'
import { copy } from '../lib/i18n'
import { formatInr, PRICING } from '../lib/pricing'
import { useLanguage } from '../hooks/useLanguage'

export function HomePage() {
  const { lang } = useLanguage()

  return (
    <>
      <section className="hero">
        <div className="hero-bg" aria-hidden />
        <div className="container hero-content">
          <div className="hero-brand">{copy.brand(lang)}</div>
          <h1>
            {lang === 'hi'
              ? 'जन्म विवरण दें, भुगतान करें, कुंडली PDF पाएँ।'
              : 'Share birth details, pay once, receive your kundali PDF.'}
          </h1>
          <p>
            {lang === 'hi'
              ? 'लग्न, ग्रह, नक्षत्र व महादशा — स्पष्ट चार्ट के साथ। जरूरत हो तो उपाय अलग से अनलॉक करें।'
              : 'Lagna, planets, nakshatras, and dasha in a clear chart. Unlock remedies later only if you need them.'}
          </p>
          <div className="hero-cta">
            <Link className="btn btn-primary" to="/generate">
              {copy.ctaGenerate(lang)}
            </Link>
            <a className="btn btn-secondary" href="#how">
              {lang === 'hi' ? 'कैसे काम करता है' : 'How it works'}
            </a>
          </div>
        </div>
      </section>

      <section className="section" id="how">
        <div className="container">
          <div className="section-head">
            <h2>{lang === 'hi' ? 'चार सरल चरण' : 'Four clear steps'}</h2>
            <p>
              {lang === 'hi'
                ? 'पहले कुंडली। उपाय तभी जब चार्ट में संकेत दिखें।'
                : 'Kundali first. Remedies only when your chart flags something worth addressing.'}
            </p>
          </div>
          <div className="flow-steps">
            <div className="flow-step">
              <h3>{lang === 'hi' ? 'विवरण' : 'Details'}</h3>
              <p>
                {lang === 'hi'
                  ? 'नाम, जन्म तिथि/समय और स्थान चुनें।'
                  : 'Enter name, birth date/time, and place.'}
              </p>
            </div>
            <div className="flow-step">
              <h3>{lang === 'hi' ? 'भुगतान' : 'Pay'}</h3>
              <p>
                {lang === 'hi'
                  ? `कुंडली अनलॉक करें — ${formatInr(PRICING.kundaliInr)}।`
                  : `Unlock the full kundali — ${formatInr(PRICING.kundaliInr)}.`}
              </p>
            </div>
            <div className="flow-step">
              <h3>{lang === 'hi' ? 'कुंडली + PDF' : 'Chart + PDF'}</h3>
              <p>
                {lang === 'hi'
                  ? 'उत्तर भारतीय चार्ट देखें और PDF डाउनलोड करें।'
                  : 'View the North Indian chart and download PDF.'}
              </p>
            </div>
            <div className="flow-step">
              <h3>{lang === 'hi' ? 'उपाय (वैकल्पिक)' : 'Remedies (optional)'}</h3>
              <p>
                {lang === 'hi'
                  ? `जरूरत हो तो अतिरिक्त ${formatInr(PRICING.remediesInr)} में उपाय खोलें।`
                  : `If needed, unlock tailored remedies for ${formatInr(PRICING.remediesInr)} more.`}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="pricing">
        <div className="container">
          <div className="section-head">
            <h2>{lang === 'hi' ? 'मूल्य' : 'Pricing'}</h2>
            <p>
              {lang === 'hi'
                ? 'एक बार भुगतान — PDF हमेशा आपके पास।'
                : 'Pay once — keep the PDF. Remedies are a separate choice.'}
            </p>
          </div>
          <div className="pricing-row">
            <div className="price-block">
              <h3>{lang === 'hi' ? 'कुंडली' : 'Kundali'}</h3>
              <div className="amount">{formatInr(PRICING.kundaliInr)}</div>
              <p>{lang === 'hi' ? 'आवश्यक' : 'Required to generate'}</p>
              <ul>
                <li>{lang === 'hi' ? 'लग्न व ग्रह स्थिति' : 'Lagna & planetary positions'}</li>
                <li>{lang === 'hi' ? 'नक्षत्र व पद' : 'Nakshatra & pada'}</li>
                <li>{lang === 'hi' ? 'महादशा अवलोकन' : 'Mahadasha overview'}</li>
                <li>{lang === 'hi' ? 'PDF डाउनलोड' : 'PDF download'}</li>
              </ul>
            </div>
            <div className="price-block addon">
              <h3>{lang === 'hi' ? 'उपाय ऐड-ऑन' : 'Remedies add-on'}</h3>
              <div className="amount">+{formatInr(PRICING.remediesInr)}</div>
              <p>{lang === 'hi' ? 'कुंडली के बाद, यदि आवश्यक' : 'After kundali, only if needed'}</p>
              <ul>
                <li>{lang === 'hi' ? 'दोष-आधारित मंत्र' : 'Dosha-linked mantras'}</li>
                <li>{lang === 'hi' ? 'दान व अनुष्ठान सुझाव' : 'Charity & ritual suggestions'}</li>
                <li>{lang === 'hi' ? 'अपडेटेड PDF' : 'Updated PDF with remedies'}</li>
              </ul>
            </div>
          </div>
          <div className="form-actions">
            <Link className="btn btn-primary" to="/generate">
              {copy.ctaGenerate(lang)}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
