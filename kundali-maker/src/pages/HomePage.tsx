import { Link } from 'react-router-dom'
import { copy } from '../lib/i18n'
import { useLanguage } from '../hooks/useLanguage'

export function HomePage() {
  const { lang } = useLanguage()

  return (
    <>
      <section className="hero hero-with-photo">
        <div className="hero-bg" aria-hidden />
        <div className="container hero-content">
          <p className="hero-trust anim-rise">
            {lang === 'hi'
              ? 'मुफ़्त पूर्वावलोकन · तुरंत पूर्ण PDF'
              : 'Free preview · instant full PDF'}
          </p>
          <div className="hero-brand anim-rise delay-1">{copy.brand(lang)}</div>
          <h1 className="anim-rise delay-2">
            {lang === 'hi'
              ? 'अपनी वैदिक कुंडली अभी बनाएँ।'
              : 'Generate your Vedic kundali now.'}
          </h1>
          <p className="anim-rise delay-3">
            {lang === 'hi'
              ? 'जन्म विवरण भरें—लग्न, ग्रह, भाव व ~२० पृष्ठ विस्तृत रिपोर्ट तुरंत डाउनलोड। भुगतान बाद में।'
              : 'Enter birth details—lagna, planets, houses, and a ~20 page detailed report download instantly. Payment comes later.'}
          </p>
          <div className="hero-cta anim-rise delay-4">
            <Link className="btn btn-primary btn-pulse" to="/generate">
              {lang === 'hi' ? 'कुंडली बनाएँ' : 'Generate kundali'}
            </Link>
            <Link className="btn btn-secondary" to="/sample">
              {lang === 'hi' ? 'नमूना PDF देखें' : 'See sample PDF'}
            </Link>
          </div>
          <p className="hero-micro anim-rise delay-5">
            {lang === 'hi'
              ? 'लाहिरी पद्धति · कोई कार्ड/UPI अभी नहीं · PDF आपके फ़ोन पर'
              : 'Lahiri method · no card/UPI yet · PDF stays on your phone'}
          </p>
        </div>
      </section>

      <section className="section section-how-simple reveal" id="how">
        <div className="container">
          <div className="section-head">
            <h2>{lang === 'hi' ? '३ आसान चरण' : '3 easy steps'}</h2>
            <p>
              {lang === 'hi'
                ? 'अभी केवल जाँचें कि कुंडली कैसे बनती है—भुगतान बाद में जोड़ेंगे।'
                : 'Check how the kundali is generated first—we’ll add payment in the next step.'}
            </p>
          </div>
          <div className="flow-steps flow-steps-3">
            <div className="flow-step">
              <span className="step-num">1</span>
              <h3>{lang === 'hi' ? 'जन्म विवरण' : 'Birth details'}</h3>
              <p>{lang === 'hi' ? 'नाम, तारीख, समय, शहर।' : 'Name, date, time, city.'}</p>
            </div>
            <div className="flow-step">
              <span className="step-num">2</span>
              <h3>{lang === 'hi' ? 'पुष्टि' : 'Confirm'}</h3>
              <p>
                {lang === 'hi'
                  ? 'विवरण जाँचें—कोई भुगतान नहीं।'
                  : 'Review details—no payment.'}
              </p>
            </div>
            <div className="flow-step">
              <span className="step-num">3</span>
              <h3>{lang === 'hi' ? 'पूर्ण PDF' : 'Full PDF'}</h3>
              <p>
                {lang === 'hi'
                  ? '~२० पृष्ठ विस्तृत कुंडली डाउनलोड।'
                  : 'Download the ~20 page detailed kundali.'}
              </p>
            </div>
          </div>
          <div className="form-actions center-actions">
            <Link className="btn btn-primary" to="/generate">
              {lang === 'hi' ? 'अभी बनाएँ' : 'Generate now'}
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-visual reveal" id="look">
        <div className="container visual-split">
          <img
            src={`${import.meta.env.BASE_URL}images/report_still_life.jpg`}
            alt={lang === 'hi' ? 'कुंडली रिपोर्ट का अनुभव' : 'Feel of a kundali report'}
            className="visual-img"
            loading="lazy"
          />
          <div>
            <h2>{lang === 'hi' ? 'आपको क्या मिलता है' : 'What you get'}</h2>
            <ul className="include-list">
              {(lang === 'hi'
                ? [
                    '~२० पृष्ठ पूर्ण वैदिक रिपोर्ट',
                    'लग्न, ग्रह, नक्षत्र, महादशा',
                    'करियर, विवाह, मन—सरल भाषा',
                    'PDF फ़ोन में सेव—हमेशा आपके पास',
                  ]
                : [
                    '~20 page complete Vedic report',
                    'Lagna, planets, nakshatra, dasha',
                    'Career, marriage, mind—plain language',
                    'PDF saved on your phone—yours forever',
                  ]
              ).map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
            <Link className="btn btn-secondary" to="/whats-inside">
              {lang === 'hi' ? 'और विवरण' : 'More detail'}
            </Link>
          </div>
        </div>
      </section>

      <div className="sticky-buy" role="region" aria-label="Generate">
        <span>
          {lang === 'hi' ? 'पूर्ण कुंडली PDF · मुफ़्त पूर्वावलोकन' : 'Full kundali PDF · free preview'}
        </span>
        <Link className="btn btn-primary" to="/generate">
          {lang === 'hi' ? 'बनाएँ' : 'Generate'}
        </Link>
      </div>
    </>
  )
}
