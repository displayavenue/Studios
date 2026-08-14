import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { getOrder, payForKundali } from '../lib/orders'
import { formatInr } from '../lib/pricing'

export function PaymentPage() {
  const { orderId = '' } = useParams()
  const { lang } = useLanguage()
  const navigate = useNavigate()
  const order = useMemo(() => getOrder(orderId), [orderId])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

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

  function mockPay() {
    setBusy(true)
    setError('')
    try {
      // Simulate brief payment processing
      window.setTimeout(() => {
        try {
          payForKundali(order.id)
          navigate(`/result/${order.id}`)
        } catch (e) {
          setError(e instanceof Error ? e.message : 'Payment failed')
          setBusy(false)
        }
      }, 700)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Payment failed')
      setBusy(false)
    }
  }

  const d = order.details

  return (
    <div className="page-wrap">
      <div className="container" style={{ maxWidth: 560 }}>
        <h1 className="page-title">
          {lang === 'hi' ? 'अपनी कुंडली सुरक्षित रूप से लें' : 'Receive your kundali securely'}
        </h1>
        <p className="page-sub">
          {lang === 'hi'
            ? 'भुगतान के बाद ही पूरी कुंडली व PDF खुलती है—कोई अधूरी मुफ़्त रिपोर्ट नहीं।'
            : 'Full chart and PDF unlock only after payment—no incomplete free teaser.'}
        </p>

        <div className="mock-badge">
          {lang === 'hi' ? 'डेमो भुगतान (Razorpay-ready)' : 'Demo payment (Razorpay-ready)'}
        </div>

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

        <div className="form-actions">
          <Link className="btn btn-ghost" to="/generate">
            {lang === 'hi' ? 'वापस' : 'Back'}
          </Link>
          <button type="button" className="btn btn-primary" disabled={busy} onClick={mockPay}>
            {busy
              ? lang === 'hi'
                ? 'प्रोसेस हो रहा…'
                : 'Processing…'
              : lang === 'hi'
                ? `पे करें ${formatInr(order.amountKundali)}`
                : `Pay ${formatInr(order.amountKundali)}`}
          </button>
        </div>
      </div>
    </div>
  )
}
