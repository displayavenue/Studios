import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { CITIES } from '../lib/cities'
import { copy } from '../lib/i18n'
import {
  createManualRequest,
  kundaliPaidWhatsAppMessage,
  kundaliWhatsAppRequestMessage,
  markManualPaid,
  markManualWhatsApp,
  type ManualKundaliRequest,
} from '../lib/manualOrders'
import { formatInr, PRICING } from '../lib/pricing'
import { fetchRazorpayStatus, startRazorpayCheckout, type RazorpayStatus } from '../lib/razorpay'
import { openWhatsAppDelivery } from '../lib/whatsapp'
import { SITE } from '../data/site'
import { useLanguage } from '../hooks/useLanguage'

const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

export function HomePage() {
  const { lang, setLang } = useLanguage()
  const [name, setName] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [timeOfBirth, setTimeOfBirth] = useState('12:00')
  const [placeName, setPlaceName] = useState(CITIES[0]?.name ?? 'Delhi')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState<RazorpayStatus | null>(null)
  const [done, setDone] = useState<ManualKundaliRequest | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchRazorpayStatus().then((s) => {
      if (!cancelled) setStatus(s)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const cityOptions = useMemo(
    () =>
      CITIES.map((c) => ({
        ...c,
        label: lang === 'hi' ? `${c.nameHi} (${c.name})` : c.name,
      })),
    [lang],
  )

  function validate(): boolean {
    if (!name.trim()) {
      setError(lang === 'hi' ? 'नाम आवश्यक है।' : 'Name is required.')
      return false
    }
    if (!whatsapp.trim() || whatsapp.replace(/\D/g, '').length < 10) {
      setError(lang === 'hi' ? 'सही WhatsApp नंबर दें।' : 'Enter a valid WhatsApp number.')
      return false
    }
    if (!dateOfBirth) {
      setError(lang === 'hi' ? 'जन्म तिथि आवश्यक है।' : 'Date of birth is required.')
      return false
    }
    if (!timeOfBirth) {
      setError(lang === 'hi' ? 'जन्म समय आवश्यक है।' : 'Time of birth is required.')
      return false
    }
    setError('')
    return true
  }

  function buildDraft(): ManualKundaliRequest {
    return createManualRequest({
      name,
      whatsapp,
      dateOfBirth,
      timeOfBirth,
      placeName,
      language: lang,
    })
  }

  async function onPay(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setBusy(true)
    setError('')
    try {
      const order = buildDraft()
      if (!status?.configured) {
        throw new Error(
          lang === 'hi'
            ? 'भुगतान अभी उपलब्ध नहीं—WhatsApp पर माँगें।'
            : 'Payment is unavailable right now—please request on WhatsApp.',
        )
      }
      const pay = await startRazorpayCheckout({
        product: 'kundali',
        localOrderId: order.id,
        amountInr: order.amountInr,
        customerName: order.name,
        prefillContact: order.whatsapp.replace(/\D/g, '').slice(-10),
        description: lang === 'hi' ? 'वैदिक कुंडली PDF (WhatsApp डिलीवरी)' : 'Vedic Kundali PDF (WhatsApp delivery)',
      })
      const paid = markManualPaid(order.id, {
        paymentId: pay.razorpayPaymentId,
        razorpayOrderId: pay.razorpayOrderId,
      })
      setDone(paid)
      openWhatsAppDelivery(kundaliPaidWhatsAppMessage(paid))
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Payment failed'
      if (msg !== 'Payment cancelled') setError(msg)
    } finally {
      setBusy(false)
    }
  }

  function onWhatsApp(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    const order = buildDraft()
    markManualWhatsApp(order.id)
    setDone(order)
    openWhatsAppDelivery(kundaliWhatsAppRequestMessage(order))
  }

  if (done) {
    return (
      <section className="lp-thanks">
        <div className="container narrow">
          <p className="lp-kicker">{copy.brand(lang)}</p>
          <h1>
            {done.status === 'paid'
              ? lang === 'hi'
                ? 'भुगतान मिल गया'
                : 'Payment received'
              : lang === 'hi'
                ? 'WhatsApp अनुरोध तैयार'
                : 'WhatsApp request ready'}
          </h1>
          <p className="lp-lede">
            {lang === 'hi'
              ? `रेफरेंस ${done.id}। हम आपकी कुंडली तैयार कर WhatsApp (${done.whatsapp}) पर भेजेंगे।`
              : `Reference ${done.id}. We’ll prepare your kundali and send it on WhatsApp (${done.whatsapp}).`}
          </p>
          <div className="lp-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                openWhatsAppDelivery(
                  done.status === 'paid'
                    ? kundaliPaidWhatsAppMessage(done)
                    : kundaliWhatsAppRequestMessage(done),
                )
              }
            >
              {lang === 'hi' ? 'WhatsApp खोलें' : 'Open WhatsApp'}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setDone(null)}>
              {lang === 'hi' ? 'नया अनुरोध' : 'New request'}
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <div className="lp">
      <section className="lp-hero" id="top">
        <div className="lp-hero-media" aria-hidden>
          <video
            className="lp-hero-video"
            autoPlay
            muted
            loop
            playsInline
            poster={asset('images/hero.jpg')}
          >
            <source src={asset('videos/hero-ambiance.mp4')} type="video/mp4" />
          </video>
          <img className="lp-hero-fallback" src={asset('images/hero.jpg')} alt="" />
          <div className="lp-hero-veil" />
        </div>
        <div className="container lp-hero-copy">
          <p className="lp-brand anim-rise">{copy.brand(lang)}</p>
          <h1 className="anim-rise delay-1">
            {lang === 'hi' ? 'अपनी वैदिक कुंडली मँगवाएँ।' : 'Order your Vedic kundali.'}
          </h1>
          <p className="lp-lede anim-rise delay-2">
            {lang === 'hi'
              ? `भुगतान करें या WhatsApp पर माँगें—हम पूर्ण कुंडली PDF तैयार कर भेजते हैं · ${formatInr(PRICING.kundaliInr)}`
              : `Pay online or ask on WhatsApp—we prepare and send your full kundali PDF · ${formatInr(PRICING.kundaliInr)}`}
          </p>
          <div className="lp-hero-cta anim-rise delay-3">
            <a className="btn btn-primary btn-pulse" href="#order">
              {lang === 'hi' ? `अभी भुगतान करें · ${formatInr(PRICING.kundaliInr)}` : `Pay now · ${formatInr(PRICING.kundaliInr)}`}
            </a>
            <a className="btn btn-ghost-light" href="#order">
              {lang === 'hi' ? 'WhatsApp पर माँगें' : 'Ask on WhatsApp'}
            </a>
          </div>
        </div>
      </section>

      <section className="lp-order section" id="order">
        <div className="container lp-order-grid">
          <div className="lp-order-copy">
            <h2>{lang === 'hi' ? 'जन्म विवरण भेजें' : 'Send birth details'}</h2>
            <p>
              {lang === 'hi'
                ? 'आप भुगतान करें या WhatsApp पर पूछें—हम कुंडली बनाकर PDF भेजते हैं।'
                : 'Pay securely or message us—we prepare the kundali and deliver the PDF.'}
            </p>
            <ul className="lp-bullets">
              {(lang === 'hi'
                ? [
                    'लग्न, ग्रह, नक्षत्र, महादशा',
                    'सरल भाषा में पूर्ण रिपोर्ट',
                    'WhatsApp पर PDF डिलीवरी',
                    `एक बार भुगतान · ${formatInr(PRICING.kundaliInr)}`,
                  ]
                : [
                    'Lagna, planets, nakshatra, dasha',
                    'Full report in plain language',
                    'PDF delivery on WhatsApp',
                    `One-time payment · ${formatInr(PRICING.kundaliInr)}`,
                  ]
              ).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <div className="lp-media-card">
              <video
                autoPlay
                muted
                loop
                playsInline
                poster={asset('images/report.jpg')}
              >
                <source src={asset('videos/report-ambiance.mp4')} type="video/mp4" />
              </video>
            </div>
          </div>

          <form className="lp-form panel" onSubmit={onPay}>
            <div className="form-grid two">
              <div className="field">
                <label htmlFor="name">{lang === 'hi' ? 'पूरा नाम' : 'Full name'}</label>
                <input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={lang === 'hi' ? 'उदा. प्रिया शर्मा' : 'e.g. Priya Sharma'}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="wa">{lang === 'hi' ? 'WhatsApp नंबर' : 'WhatsApp number'}</label>
                <input
                  id="wa"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="98xxxxxxxx"
                  inputMode="tel"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="dob">{lang === 'hi' ? 'जन्म तिथि' : 'Date of birth'}</label>
                <input
                  id="dob"
                  type="date"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="tob">{lang === 'hi' ? 'जन्म समय' : 'Time of birth'}</label>
                <input
                  id="tob"
                  type="time"
                  value={timeOfBirth}
                  onChange={(e) => setTimeOfBirth(e.target.value)}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="place">{lang === 'hi' ? 'जन्म स्थान' : 'Place of birth'}</label>
                <select
                  id="place"
                  value={placeName}
                  onChange={(e) => setPlaceName(e.target.value)}
                >
                  {cityOptions.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="lang">{lang === 'hi' ? 'रिपोर्ट भाषा' : 'Report language'}</label>
                <select
                  id="lang"
                  value={lang}
                  onChange={(e) => setLang(e.target.value as 'en' | 'hi')}
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी</option>
                </select>
              </div>
            </div>

            {error && <p className="alert">{error}</p>}

            <div className="lp-form-actions">
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy
                  ? lang === 'hi'
                    ? 'Razorpay खुल रहा…'
                    : 'Opening Razorpay…'
                  : lang === 'hi'
                    ? `भुगतान करें · ${formatInr(PRICING.kundaliInr)}`
                    : `Pay · ${formatInr(PRICING.kundaliInr)}`}
              </button>
              <button type="button" className="btn btn-whatsapp" disabled={busy} onClick={onWhatsApp}>
                {lang === 'hi' ? 'WhatsApp पर माँगें' : 'Ask on WhatsApp'}
              </button>
            </div>
            <p className="lp-fine">
              {lang === 'hi'
                ? `UPI / कार्ड · डिलीवरी ${SITE.whatsappDisplay} पर · हम स्वयं कुंडली बनाकर भेजते हैं।`
                : `UPI / cards · delivery on ${SITE.whatsappDisplay} · we prepare and send your kundali.`}
            </p>
          </form>
        </div>
      </section>

      <section className="lp-how section" id="how">
        <div className="container">
          <div className="section-head">
            <h2>{lang === 'hi' ? '३ आसान चरण' : '3 easy steps'}</h2>
            <p>
              {lang === 'hi'
                ? 'आप चुनें—भुगतान या WhatsApp। बाकी हम संभालते हैं।'
                : 'You choose—pay or WhatsApp. We handle the rest.'}
            </p>
          </div>
          <div className="flow-steps flow-steps-3">
            <div className="flow-step">
              <span className="step-num">1</span>
              <h3>{lang === 'hi' ? 'विवरण भेजें' : 'Share details'}</h3>
              <p>{lang === 'hi' ? 'नाम, जन्म, WhatsApp।' : 'Name, birth, WhatsApp.'}</p>
            </div>
            <div className="flow-step">
              <span className="step-num">2</span>
              <h3>{lang === 'hi' ? 'भुगतान या चैट' : 'Pay or chat'}</h3>
              <p>
                {lang === 'hi'
                  ? `${formatInr(PRICING.kundaliInr)} ऑनलाइन, या WhatsApp पर पूछें।`
                  : `${formatInr(PRICING.kundaliInr)} online, or ask on WhatsApp.`}
              </p>
            </div>
            <div className="flow-step">
              <span className="step-num">3</span>
              <h3>{lang === 'hi' ? 'PDF प्राप्त करें' : 'Get your PDF'}</h3>
              <p>
                {lang === 'hi'
                  ? 'हम कुंडली बनाकर WhatsApp पर भेजते हैं।'
                  : 'We prepare the kundali and send it on WhatsApp.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="lp-visual section">
        <div className="container visual-split">
          <img
            src={asset('images/phone.jpg')}
            alt={lang === 'hi' ? 'WhatsApp पर कुंडली PDF' : 'Kundali PDF on WhatsApp'}
            className="visual-img"
            loading="lazy"
          />
          <div>
            <h2>{lang === 'hi' ? 'WhatsApp पर डिलीवरी' : 'Delivered on WhatsApp'}</h2>
            <p className="lp-lede">
              {lang === 'hi'
                ? 'कोई ऐप डाउनलोड नहीं। भुगतान या अनुरोध के बाद हम पूर्ण कुंडली PDF आपके WhatsApp पर भेजते हैं।'
                : 'No app to download. After payment or request, we send your full kundali PDF on WhatsApp.'}
            </p>
            <a className="btn btn-primary" href="#order">
              {lang === 'hi' ? 'अभी ऑर्डर करें' : 'Order now'}
            </a>
          </div>
        </div>
      </section>

      <section className="lp-trust section">
        <div className="container narrow">
          <h2>{lang === 'hi' ? 'सीधा और स्पष्ट' : 'Simple and clear'}</h2>
          <p>
            {lang === 'hi'
              ? 'यह एक पेज है—ऑनलाइन भुगतान या WhatsApp अनुरोध। कुंडली हम तैयार कर भेजते हैं।'
              : 'One page—pay online or request on WhatsApp. We prepare and send your kundali.'}
          </p>
          <div className="lp-actions">
            <a className="btn btn-primary" href="#order">
              {lang === 'hi' ? 'भुगतान करें' : 'Pay now'}
            </a>
            <a className="btn btn-whatsapp" href="#order">
              {lang === 'hi' ? 'WhatsApp' : 'WhatsApp'}
            </a>
          </div>
          <p className="lp-fine">
            <Link to="/legal/privacy">{lang === 'hi' ? 'गोपनीयता' : 'Privacy'}</Link>
            {' · '}
            <Link to="/legal/terms">{lang === 'hi' ? 'शर्तें' : 'Terms'}</Link>
            {' · '}
            <Link to="/legal/refund">{lang === 'hi' ? 'रिफंड' : 'Refund'}</Link>
          </p>
        </div>
      </section>
    </div>
  )
}
