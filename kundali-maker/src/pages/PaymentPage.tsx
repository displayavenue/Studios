import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { getOrder, payForKundali } from '../lib/orders'
import { formatInr } from '../lib/pricing'
import { fetchRazorpayStatus, startRazorpayCheckout, type RazorpayStatus } from '../lib/razorpay'

export function PaymentPage() {
  const { orderId = '' } = useParams()
  const { lang } = useLanguage()
  const navigate = useNavigate()
  const order = useMemo(() => getOrder(orderId), [orderId])
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

  if (!order) {
    return (
      <div className="page-wrap">
        <div className="container">
          <h1 className="page-title">{lang === 'hi' ? 'ऑर्डर नहीं मिला' : 'Order not found'}</h1>
          <Link className="btn btn-primary" to="/generate">
            {lang === 'hi' ? 'फिर से शुरू करें' : 'Start again'}
          </Link>
        </div>
      </div>
    )
  }

  if (order.status !== 'draft') {
    return (
      <div className="page-wrap">
        <div className="container">
          <h1 className="page-title">{lang === 'hi' ? 'पहले से भुगतान हो चुका' : 'Already paid'}</h1>
          <Link className="btn btn-primary" to={`/result/${order.id}`}>
            {lang === 'hi' ? 'कुंडली देखें' : 'View kundali'}
          </Link>
        </div>
      </div>
    )
  }

  async function payWithRazorpay() {
    setBusy(true)
    setError('')
    try {
      const result = await startRazorpayCheckout({
        product: 'kundali',
        localOrderId: order.id,
        amountInr: order.amountKundali,
        customerName: order.details.name,
        description:
          lang === 'hi' ? 'वैदिक कुंडली + PDF' : 'Vedic Kundali + PDF',
      })
      payForKundali(order.id, {
        paymentId: result.razorpayPaymentId,
        razorpayOrderId: result.razorpayOrderId,
      })
      navigate(`/result/${order.id}`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Payment failed'
      if (msg !== 'Payment cancelled') setError(msg)
      setBusy(false)
    }
  }

  function demoPay() {
    if (!status?.allow_demo) return
    setBusy(true)
    setError('')
    window.setTimeout(() => {
      try {
        payForKundali(order.id, { paymentId: `demo_${Date.now()}` })
        navigate(`/result/${order.id}`)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Payment failed')
        setBusy(false)
      }
    }, 500)
  }

  const d = order.details
  const ready = status?.configured === true
  const demoOk = status?.allow_demo === true

  return (
    <div className="page-wrap">
      <div className="container" style={{ maxWidth: 560 }}>
        <h1 className="page-title">
          {lang === 'hi' ? 'अपनी कुंडली सुरक्षित रूप से लें' : 'Receive your kundali securely'}
        </h1>
        <p className="page-sub">
          {lang === 'hi'
            ? 'भुगतान के बाद ही पूरी कुंडली व PDF खुलती है—UPI / कार्ड / नेटबैंकिंग (Razorpay)।'
            : 'Full chart and PDF unlock after payment—UPI / cards / netbanking via Razorpay.'}
        </p>

        {status && (
          <div className="mock-badge">
            {ready
              ? status.mode === 'live'
                ? lang === 'hi'
                  ? 'Razorpay लाइव'
                  : 'Razorpay live'
                : lang === 'hi'
                  ? 'Razorpay टेस्ट मोड'
                  : 'Razorpay test mode'
              : lang === 'hi'
                ? 'Razorpay कुंजियाँ सेट नहीं'
                : 'Razorpay keys not set yet'}
          </div>
        )}

        <div className="panel">
          <div className="kv">
            <div>
              <span>{lang === 'hi' ? 'ऑर्डर' : 'Order'}</span>
              <span>{order.id}</span>
            </div>
            <div>
              <span>{lang === 'hi' ? 'नाम' : 'Name'}</span>
              <span>{d.name}</span>
            </div>
            <div>
              <span>{lang === 'hi' ? 'जन्म' : 'Birth'}</span>
              <span>
                {d.dateOfBirth} {d.timeOfBirth} · {d.placeName}
              </span>
            </div>
            <div>
              <span>{lang === 'hi' ? 'राशि' : 'Amount'}</span>
              <span>{formatInr(order.amountKundali)}</span>
            </div>
          </div>
        </div>

        {error && <p className="alert">{error}</p>}

        {!ready && status && (
          <p className="muted" style={{ marginBottom: '1rem' }}>
            {lang === 'hi'
              ? 'लाइव भुगतान हेतु Razorpay Key ID/Secret जोड़ें। तब तक डेमो तभी अगर सर्वर अनुमति दे।'
              : 'Add Razorpay Key ID/Secret to enable live checkout. Demo only if server allows it.'}
          </p>
        )}

        <div className="form-actions">
          <Link className="btn btn-ghost" to="/generate">
            {lang === 'hi' ? 'वापस' : 'Back'}
          </Link>
          {ready ? (
            <button type="button" className="btn btn-primary" disabled={busy} onClick={payWithRazorpay}>
              {busy
                ? lang === 'hi'
                  ? 'Razorpay खुल रहा…'
                  : 'Opening Razorpay…'
                : lang === 'hi'
                  ? `Razorpay से पे करें ${formatInr(order.amountKundali)}`
                  : `Pay with Razorpay ${formatInr(order.amountKundali)}`}
            </button>
          ) : demoOk ? (
            <button type="button" className="btn btn-primary" disabled={busy} onClick={demoPay}>
              {busy
                ? lang === 'hi'
                  ? 'प्रोसेस…'
                  : 'Processing…'
                : lang === 'hi'
                  ? `डेमो पे ${formatInr(order.amountKundali)}`
                  : `Demo pay ${formatInr(order.amountKundali)}`}
            </button>
          ) : (
            <button type="button" className="btn btn-primary" disabled>
              {lang === 'hi' ? 'भुगतान जल्द सक्रिय' : 'Payments activating soon'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
