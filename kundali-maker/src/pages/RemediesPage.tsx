import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { remediesForChart } from '../astrology/generate'
import type { KundaliOrder } from '../astrology/types'
import { useLanguage } from '../hooks/useLanguage'
import { getOrder, payForRemedies } from '../lib/orders'
import { downloadKundaliPdf } from '../lib/pdf'
import { formatInr } from '../lib/pricing'
import { fetchRazorpayStatus, startRazorpayCheckout, type RazorpayStatus } from '../lib/razorpay'

export function RemediesPage() {
  const { orderId = '' } = useParams()
  const { lang } = useLanguage()
  const [tick, setTick] = useState(0)
  const order = useMemo(() => getOrder(orderId), [orderId, tick])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState<RazorpayStatus | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchRazorpayStatus().then((s) => {
      if (!cancelled) setStatus(s)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (!order || !order.chart || order.status === 'draft') {
    return (
      <div className="page-wrap">
        <div className="container">
          <h1 className="page-title">
            {lang === 'hi' ? 'पहले कुंडली अनलॉक करें' : 'Unlock kundali first'}
          </h1>
          <Link className="btn btn-primary" to="/generate">
            {lang === 'hi' ? 'शुरू करें' : 'Start'}
          </Link>
        </div>
      </div>
    )
  }

  const remedies = remediesForChart(order.chart)
  const unlocked = order.status === 'remedies_paid'
  const reportLang = order.details.language
  const ready = status?.configured === true
  const demoOk = status?.allow_demo === true

  async function payWithRazorpay(current: KundaliOrder) {
    setBusy(true)
    setError('')
    try {
      const result = await startRazorpayCheckout({
        product: 'remedies',
        localOrderId: `${current.id}-R`,
        amountInr: current.amountRemedies,
        customerName: current.details.name,
        description: lang === 'hi' ? 'उपाय ऐड-ऑन' : 'Remedies add-on',
      })
      payForRemedies(current.id, {
        paymentId: result.razorpayPaymentId,
        razorpayOrderId: result.razorpayOrderId,
      })
      setTick((n) => n + 1)
      setBusy(false)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Payment failed'
      if (msg !== 'Payment cancelled') setError(msg)
      setBusy(false)
    }
  }

  function demoPay(current: KundaliOrder) {
    if (!status?.allow_demo) return
    setBusy(true)
    setError('')
    window.setTimeout(() => {
      try {
        payForRemedies(current.id, { paymentId: `demo_rem_${Date.now()}` })
        setTick((n) => n + 1)
        setBusy(false)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Payment failed')
        setBusy(false)
      }
    }, 500)
  }

  return (
    <div className="page-wrap">
      <div className="container" style={{ maxWidth: 720 }}>
        <h1 className="page-title">
          {lang === 'hi' ? 'व्यक्तिगत उपाय' : 'Personalized remedies'}
        </h1>
        <p className="page-sub">
          {lang === 'hi'
            ? 'कुंडली के दोष संकेतों से जुड़े सुझाव। चिकित्सा सलाह नहीं।'
            : 'Suggestions mapped to your dosha flags. Not medical advice.'}
        </p>

        {!unlocked && (
          <>
            {status && (
              <div className="mock-badge">
                {ready
                  ? status.mode === 'live'
                    ? 'Razorpay live'
                    : lang === 'hi'
                      ? 'Razorpay टेस्ट'
                      : 'Razorpay test'
                  : lang === 'hi'
                    ? 'Razorpay सेटअप बाकी'
                    : 'Razorpay setup pending'}
              </div>
            )}
            <div className="kv">
              <div>
                <span>{lang === 'hi' ? 'ऐड-ऑन राशि' : 'Add-on amount'}</span>
                <span>{formatInr(order.amountRemedies)}</span>
              </div>
              <div>
                <span>{lang === 'hi' ? 'ऑर्डर' : 'Order'}</span>
                <span>{order.id}</span>
              </div>
            </div>
          </>
        )}

        {unlocked && (
          <p className="success-note">
            {lang === 'hi' ? 'उपाय अनलॉक हो गए।' : 'Remedies are unlocked.'}
          </p>
        )}

        <div className={unlocked ? 'remedy-list' : 'remedy-list locked-preview'} aria-hidden={!unlocked}>
          {remedies.map((r) => (
            <div className="remedy-item" key={r.id}>
              <div className="cat">{r.category}</div>
              <h4>{reportLang === 'hi' ? r.titleHi : r.titleEn}</h4>
              <p>{reportLang === 'hi' ? r.bodyHi : r.bodyEn}</p>
            </div>
          ))}
        </div>

        {error && <p className="alert">{error}</p>}

        <div className="form-actions">
          <Link className="btn btn-ghost" to={`/result/${order.id}`}>
            {lang === 'hi' ? 'कुंडली पर वापस' : 'Back to kundali'}
          </Link>
          {!unlocked ? (
            ready ? (
              <button
                type="button"
                className="btn btn-gold"
                disabled={busy}
                onClick={() => payWithRazorpay(order)}
              >
                {busy
                  ? lang === 'hi'
                    ? 'Razorpay…'
                    : 'Razorpay…'
                  : lang === 'hi'
                    ? `Razorpay से अनलॉक — ${formatInr(order.amountRemedies)}`
                    : `Unlock with Razorpay — ${formatInr(order.amountRemedies)}`}
              </button>
            ) : demoOk ? (
              <button type="button" className="btn btn-gold" disabled={busy} onClick={() => demoPay(order)}>
                {busy
                  ? lang === 'hi'
                    ? 'प्रोसेस…'
                    : 'Processing…'
                  : lang === 'hi'
                    ? `डेमो अनलॉक — ${formatInr(order.amountRemedies)}`
                    : `Demo unlock — ${formatInr(order.amountRemedies)}`}
              </button>
            ) : (
              <button type="button" className="btn btn-gold" disabled>
                {lang === 'hi' ? 'भुगतान जल्द' : 'Payments soon'}
              </button>
            )
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => downloadKundaliPdf(order, true)}
            >
              {lang === 'hi' ? 'उपाय PDF डाउनलोड' : 'Download remedies PDF'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
