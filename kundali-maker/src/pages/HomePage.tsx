import { Link } from 'react-router-dom'
import { copy } from '../lib/i18n'
import { formatInr, PRICING } from '../lib/pricing'
import { useLanguage } from '../hooks/useLanguage'
import { TESTIMONIALS, testimonialText } from '../data/testimonials'

export function HomePage() {
  const { lang } = useLanguage()

  return (
    <>
      <section className="hero hero-with-photo">
        <div className="hero-bg" aria-hidden />
        <div className="container hero-content">
          <p className="hero-trust anim-rise">
            {lang === 'hi'
              ? 'भुगतान करें → तुरंत PDF · कोई कॉल नहीं'
              : 'Pay once → instant PDF · no calls'}
          </p>
          <div className="hero-brand anim-rise delay-1">{copy.brand(lang)}</div>
          <h1 className="anim-rise delay-2">
            {lang === 'hi'
              ? 'अपनी वैदिक कुंडली PDF मिनटों में पाएँ।'
              : 'Get your Vedic kundali PDF in minutes.'}
          </h1>
          <p className="anim-rise delay-3">
            {lang === 'hi'
              ? `जन्म विवरण भरें, ${formatInr(PRICING.kundaliInr)} दें—लग्न, ग्रह, भाव व ~२० पृष्ठ रिपोर्ट तुरंत डाउनलोड।`
              : `Enter birth details, pay ${formatInr(PRICING.kundaliInr)}—lagna, planets, houses, and a ~20 page report download instantly.`}
          </p>
          <div className="hero-cta anim-rise delay-4">
            <Link className="btn btn-primary btn-pulse" to="/generate">
              {lang === 'hi' ? `अभी खरीदें · ${formatInr(PRICING.kundaliInr)}` : `Buy now · ${formatInr(PRICING.kundaliInr)}`}
            </Link>
            <Link className="btn btn-secondary" to="/sample">
              {lang === 'hi' ? 'मुफ़्त नमूना देखें' : 'See free sample'}
            </Link>
          </div>
          <p className="hero-micro anim-rise delay-5">
            {lang === 'hi'
              ? 'UPI / कार्ड · लाहिरी पद्धति · PDF आपके फ़ोन पर'
              : 'UPI / cards · Lahiri method · PDF stays on your phone'}
          </p>
        </div>
      </section>

      <section className="section section-how-simple reveal" id="how">
        <div className="container">
          <div className="section-head">
            <h2>{lang === 'hi' ? '३ आसान चरण' : '3 easy steps'}</h2>
            <p>
              {lang === 'hi'
                ? 'जटिल ज्योतिष शब्द नहीं—केवल साफ़ प्रक्रिया।'
                : 'No confusing jargon—just a clear path.'}
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
              <h3>{lang === 'hi' ? 'भुगतान' : 'Pay'}</h3>
              <p>
                {lang === 'hi'
                  ? `${formatInr(PRICING.kundaliInr)} · UPI/कार्ड`
                  : `${formatInr(PRICING.kundaliInr)} · UPI/cards`}
              </p>
            </div>
            <div className="flow-step">
              <span className="step-num">3</span>
              <h3>{lang === 'hi' ? 'PDF डाउनलोड' : 'Download PDF'}</h3>
              <p>{lang === 'hi' ? 'तुरंत—बिना इंतज़ार।' : 'Instant—no waiting.'}</p>
            </div>
          </div>
          <div className="form-actions center-actions">
            <Link className="btn btn-primary" to="/generate">
              {lang === 'hi' ? 'शुरू करें' : 'Start now'}
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

      <section className="section reveal" id="pricing">
        <div className="container">
          <div className="section-head">
            <h2>{lang === 'hi' ? 'सीधा मूल्य' : 'Simple prices'}</h2>
            <p>
              {lang === 'hi' ? 'मुख्य उत्पाद यही है—बाकी वैकल्पिक।' : 'This is the main product—others are optional.'}
            </p>
          </div>
          <div className="price-block price-block-hero anim-float">
            <h3>{lang === 'hi' ? 'वैदिक कुंडली PDF' : 'Vedic Kundali PDF'}</h3>
            <div className="amount">{formatInr(PRICING.kundaliInr)}</div>
            <p>{lang === 'hi' ? 'एक बार · तुरंत अनलॉक' : 'One-time · instant unlock'}</p>
            <Link className="btn btn-primary" to="/generate">
              {lang === 'hi' ? 'अभी खरीदें' : 'Buy now'}
            </Link>
          </div>
          <div className="home-more-services">
            <p className="muted">
              {lang === 'hi' ? 'और चाहिए?' : 'Need something else?'}
            </p>
            <div className="chip-row">
              <Link to="/milan">{lang === 'hi' ? `मिलान ${formatInr(PRICING.milanInr)}` : `Milan ${formatInr(PRICING.milanInr)}`}</Link>
              <Link to="/shop/manglik">
                {lang === 'hi' ? `मंगलिक ${formatInr(PRICING.manglikInr)}` : `Manglik ${formatInr(PRICING.manglikInr)}`}
              </Link>
              <Link to="/shop/career">
                {lang === 'hi' ? `करियर ${formatInr(PRICING.careerInr)}` : `Career ${formatInr(PRICING.careerInr)}`}
              </Link>
              <Link to="/shop/shaadi">
                {lang === 'hi' ? `शादी पैक ${formatInr(PRICING.shaadiPackInr)}` : `Shaadi pack ${formatInr(PRICING.shaadiPackInr)}`}
              </Link>
              <Link to="/services">{lang === 'hi' ? 'सभी सेवाएँ' : 'All services'}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-stories reveal" id="stories">
        <div className="container">
          <div className="section-head">
            <h2>{lang === 'hi' ? 'लोग क्या कहते हैं' : 'What people say'}</h2>
          </div>
          <div className="testimonial-grid">
            {TESTIMONIALS.slice(0, 3).map((item) => {
              const tx = testimonialText(item, lang)
              return (
                <blockquote className="testimonial" key={item.name}>
                  <p>“{tx.quote}”</p>
                  <footer>
                    <cite>{tx.name}</cite>
                    <span>
                      {tx.role} · {tx.city}
                    </span>
                  </footer>
                </blockquote>
              )
            })}
          </div>
        </div>
      </section>

      <section className="section section-shaadi-band reveal">
        <div className="container shaadi-band">
          <img
            src={`${import.meta.env.BASE_URL}images/shaadi_mood.jpg`}
            alt=""
            className="shaadi-band-img"
            loading="lazy"
          />
          <div>
            <h2>{lang === 'hi' ? 'शादी की तैयारी?' : 'Planning a wedding?'}</h2>
            <p>
              {lang === 'hi'
                ? 'गुण मिलान व मंगलिक जाँच—तुरंत PDF, बिना पंडित कॉल।'
                : 'Gun milan and manglik check—instant PDF, no pandit call.'}
            </p>
            <Link className="btn btn-primary" to="/shop/shaadi">
              {lang === 'hi' ? 'शादी पैक देखें' : 'See Shaadi pack'}
            </Link>
          </div>
        </div>
      </section>

      <div className="sticky-buy" role="region" aria-label="Buy">
        <span>
          {lang === 'hi' ? `कुंडली PDF · ${formatInr(PRICING.kundaliInr)}` : `Kundali PDF · ${formatInr(PRICING.kundaliInr)}`}
        </span>
        <Link className="btn btn-primary" to="/generate">
          {lang === 'hi' ? 'खरीदें' : 'Buy'}
        </Link>
      </div>
    </>
  )
}
