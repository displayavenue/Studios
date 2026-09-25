import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { getOrder, payForKundali } from '../lib/orders'

/**
 * Payment is paused while we validate free kundali generation + PDF download.
 * Draft orders are unlocked here without Razorpay.
 */
export function PaymentPage() {
  const { orderId = '' } = useParams()
  const { lang } = useLanguage()
  const navigate = useNavigate()
  const order = useMemo(() => getOrder(orderId), [orderId])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!order) return
    if (order.status !== 'draft') {
      navigate(`/result/${order.id}`, { replace: true })
    }
  }, [order, navigate])

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

  function unlockFree() {
    setBusy(true)
    setError('')
    try {
      payForKundali(order.id, { paymentId: `free_${Date.now()}` })
      navigate(`/result/${order.id}`)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed')
      setBusy(false)
    }
  }

  return (
    <div className="page-wrap">
      <div className="container" style={{ maxWidth: 560 }}>
        <h1 className="page-title">
          {lang === 'hi' ? 'भुगतान अभी बंद है' : 'Payment paused'}
        </h1>
        <p className="page-sub">
          {lang === 'hi'
            ? 'पहले कुंडली जनरेशन जाँचें। अभी बिना भुगतान पूर्ण PDF अनलॉक करें। Razorpay अगले चरण में जोड़ेगा।'
            : 'We’re validating kundali generation first. Unlock the full PDF without payment for now. Razorpay comes in the next step.'}
        </p>

        <div className="panel">
          <div className="kv">
            <div>
              <span>{lang === 'hi' ? 'रेफरेंस' : 'Reference'}</span>
              <span>{order.id}</span>
            </div>
            <div>
              <span>{lang === 'hi' ? 'नाम' : 'Name'}</span>
              <span>{order.details.name}</span>
            </div>
            <div>
              <span>{lang === 'hi' ? 'जन्म' : 'Birth'}</span>
              <span>
                {order.details.dateOfBirth} {order.details.timeOfBirth} · {order.details.placeName}
              </span>
            </div>
          </div>
        </div>

        {error && <p className="alert">{error}</p>}

        <div className="form-actions">
          <Link className="btn btn-ghost" to="/generate">
            {lang === 'hi' ? 'वापस' : 'Back'}
          </Link>
          <button type="button" className="btn btn-primary" disabled={busy} onClick={unlockFree}>
            {busy
              ? lang === 'hi'
                ? 'बना रहे हैं…'
                : 'Generating…'
              : lang === 'hi'
                ? 'मुफ़्त में कुंडली खोलें'
                : 'Unlock kundali free'}
          </button>
        </div>
      </div>
    </div>
  )
}
