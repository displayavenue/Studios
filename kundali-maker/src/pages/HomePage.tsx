import { Link } from 'react-router-dom'
import { copy } from '../lib/i18n'
import { formatInr, PRICING } from '../lib/pricing'
import { useLanguage } from '../hooks/useLanguage'
import { TESTIMONIALS, testimonialText } from '../data/testimonials'

export function HomePage() {
  const { lang } = useLanguage()

  return (
    <>
      <section className="hero">
        <div className="hero-bg" aria-hidden />
        <div className="container hero-content">
          <p className="hero-trust">
            {lang === 'hi'
              ? 'लाहिरी अयनांश · जन्म समय आधारित · PDF आपके पास'
              : 'Lahiri ayanamsa · birth-time based · PDF you keep'}
          </p>
          <div className="hero-brand">{copy.brand(lang)}</div>
          <h1>
            {lang === 'hi'
              ? 'आपकी सटीक वैदिक जन्म कुंडली—बिना भ्रम, बिना दबाव।'
              : 'Your exact Vedic birth chart—clear, private, no pressure.'}
          </h1>
          <p>
            {lang === 'hi'
              ? `जन्म विवरण भरें, एक बार ${formatInr(PRICING.kundaliInr)} का भुगतान करें, और प्रामाणिक कुंडली PDF घर बैठे पाएँ। उपाय तभी—जब सच में ज़रूरत हो।`
              : `Share birth details, pay once (${formatInr(PRICING.kundaliInr)}), and receive an authentic kundali PDF. Remedies stay optional—only if your chart needs them.`}
          </p>
          <div className="hero-cta">
            <Link className="btn btn-primary" to="/generate">
              {copy.ctaPrimary(lang)}
            </Link>
            <Link className="btn btn-secondary" to="/sample">
              {lang === 'hi' ? 'मुफ़्त SAMPLE PDF' : 'Free SAMPLE PDF'}
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-who" id="who">
        <div className="container">
          <div className="section-head">
            <h2>{lang === 'hi' ? 'किसके लिए' : 'Made for real lives'}</h2>
            <p>
              {lang === 'hi'
                ? 'व्यवसाय, पढ़ाई, परिवार या करियर—हर किसी की कुंडली अलग होती है।'
                : 'Business, studies, family, or career—every chart answers a different life question.'}
            </p>
          </div>
          <ul className="who-list">
            <li>
              <strong>{lang === 'hi' ? 'व्यवसायी' : 'Business owners'}</strong>
              <span>
                {lang === 'hi'
                  ? 'विस्तार, साझेदारी व समय चुनने में दिशा'
                  : 'Timing for expansion, partnerships, and decisions'}
              </span>
            </li>
            <li>
              <strong>{lang === 'hi' ? 'छात्र' : 'Students'}</strong>
              <span>
                {lang === 'hi'
                  ? 'शिक्षा व करियर दशा की स्पष्ट समयरेखा'
                  : 'Education and career dasha timelines, plainly'}
              </span>
            </li>
            <li>
              <strong>{lang === 'hi' ? 'गृहिणी / परिवार' : 'Homemakers & family'}</strong>
              <span>
                {lang === 'hi'
                  ? 'विवाह मिलान तैयारी व पारिवारिक शांति'
                  : 'Marriage matching prep and household peace'}
              </span>
            </li>
            <li>
              <strong>{lang === 'hi' ? 'नौकरीपेशा' : 'Professionals'}</strong>
              <span>
                {lang === 'hi'
                  ? 'जॉब बदलाव व दबाव वाले वर्षों की समझ'
                  : 'Clarity for job changes and pressure years'}
              </span>
            </li>
          </ul>
        </div>
      </section>

      <section className="section" id="how">
        <div className="container">
          <div className="section-head">
            <h2>{lang === 'hi' ? 'कैसे मिलती है आपकी कुंडली' : 'How you receive your kundali'}</h2>
            <p>
              {lang === 'hi'
                ? 'कोई मुफ़्त जाल नहीं—भुगतान के बाद ही पूरी रिपोर्ट।'
                : 'No freebait funnel—full report only after a clear one-time payment.'}
            </p>
          </div>
          <div className="flow-steps">
            <div className="flow-step">
              <h3>{lang === 'hi' ? 'जन्म विवरण' : 'Birth details'}</h3>
              <p>
                {lang === 'hi'
                  ? 'नाम, तिथि, समय और जन्म स्थान—जितना सटीक, उतनी सही लग्न।'
                  : 'Name, date, time, and place—accuracy here means a truer lagna.'}
              </p>
            </div>
            <div className="flow-step">
              <h3>{lang === 'hi' ? 'सुरक्षित भुगतान' : 'Secure payment'}</h3>
              <p>
                {lang === 'hi'
                  ? `एक बार ${formatInr(PRICING.kundaliInr)}—छुपी फीस नहीं।`
                  : `One payment of ${formatInr(PRICING.kundaliInr)}—no hidden upsells at checkout.`}
              </p>
            </div>
            <div className="flow-step">
              <h3>{lang === 'hi' ? 'कुंडली + PDF' : 'Chart + PDF'}</h3>
              <p>
                {lang === 'hi'
                  ? 'लग्न, ग्रह, नक्षत्र, महादशा—स्क्रीन पर और PDF में। तुरंत, बिना कॉल।'
                  : 'Lagna, planets, nakshatras, dasha—on screen and in your PDF. Instant, no calls.'}
              </p>
            </div>
            <div className="flow-step">
              <h3>{lang === 'hi' ? 'उपाय (आपकी मर्ज़ी)' : 'Remedies (your choice)'}</h3>
              <p>
                {lang === 'hi'
                  ? `दोष दिखे तो अतिरिक्त ${formatInr(PRICING.remediesInr)} में उपाय खोलें।`
                  : `If doshas appear, unlock remedies for ${formatInr(PRICING.remediesInr)} more—only if you want.`}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section-stories" id="stories">
        <div className="container">
          <div className="section-head">
            <h2>{lang === 'hi' ? 'लोग क्या कहते हैं' : 'What people say'}</h2>
            <p>
              {lang === 'hi'
                ? 'व्यवसायी, छात्र, गृहिणी और पेशेवर—वास्तविक जीवन की ज़रूरतें।'
                : 'From shop floors to campuses and homes—people who wanted clarity, not noise.'}
            </p>
          </div>
          <div className="testimonial-grid">
            {TESTIMONIALS.map((item) => {
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

      <section className="section" id="pricing">
        <div className="container">
          <div className="section-head">
            <h2>{lang === 'hi' ? 'सीधा मूल्य' : 'Straightforward pricing'}</h2>
            <p>
              {lang === 'hi'
                ? 'जो दिखता है वही भुगतान—PDF हमेशा आपके पास रहती है।'
                : 'What you see is what you pay. Keep the PDF forever on your device.'}
            </p>
          </div>
          <div className="pricing-row">
            <div className="price-block">
              <h3>{lang === 'hi' ? 'वैदिक कुंडली' : 'Vedic Kundali'}</h3>
              <div className="amount">{formatInr(PRICING.kundaliInr)}</div>
              <p>{lang === 'hi' ? 'एक बार का भुगतान' : 'One-time'}</p>
              <ul>
                <li>{lang === 'hi' ? 'लग्न व ग्रह स्थिति' : 'Lagna & planetary positions'}</li>
                <li>{lang === 'hi' ? '~२० पृष्ठ पूर्ण PDF' : 'Complete ~20 page PDF'}</li>
                <li>{lang === 'hi' ? 'भाव, करियर, विवाह अध्याय' : 'Houses, career, marriage chapters'}</li>
                <li>{lang === 'hi' ? 'D9/D10, योग व दशा' : 'D9/D10, yogas & dasha'}</li>
              </ul>
            </div>
            <div className="price-block">
              <h3>{lang === 'hi' ? 'कुंडली मिलान' : 'Kundali Milan'}</h3>
              <div className="amount">{formatInr(PRICING.milanInr)}</div>
              <p>{lang === 'hi' ? 'शादी / परिवार' : 'Marriage / family'}</p>
              <ul>
                <li>{lang === 'hi' ? '३६ अंक अष्टकूट' : '36-point Ashtakoot'}</li>
                <li>{lang === 'hi' ? 'मंगलिक तुलना' : 'Manglik compare'}</li>
                <li>{lang === 'hi' ? 'सरल सारांश + PDF' : 'Plain summary + PDF'}</li>
                <li>{lang === 'hi' ? 'तुरंत PDF डाउनलोड' : 'Instant PDF download'}</li>
              </ul>
            </div>
            <div className="price-block addon">
              <h3>{lang === 'hi' ? 'उपाय ऐड-ऑन' : 'Remedies add-on'}</h3>
              <div className="amount">+{formatInr(PRICING.remediesInr)}</div>
              <p>{lang === 'hi' ? 'केवल यदि आप चाहें' : 'Only if you choose'}</p>
              <ul>
                <li>{lang === 'hi' ? 'दोष-आधारित मंत्र' : 'Dosha-linked mantras'}</li>
                <li>{lang === 'hi' ? 'दान व अनुष्ठान सुझाव' : 'Charity & ritual suggestions'}</li>
                <li>{lang === 'hi' ? 'उपाय सहित अपडेटेड PDF' : 'Updated PDF with remedies'}</li>
              </ul>
            </div>
          </div>
          <div className="form-actions">
            <Link className="btn btn-primary" to="/generate">
              {copy.ctaPrimary(lang)}
            </Link>
            <Link className="btn btn-secondary" to="/milan">
              {lang === 'hi' ? 'मिलान करें' : 'Check Milan'}
            </Link>
            <Link className="btn btn-ghost" to="/features">
              {lang === 'hi' ? '५० विशेषताएँ' : '50 features'}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
