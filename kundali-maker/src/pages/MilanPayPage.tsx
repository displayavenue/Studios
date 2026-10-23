import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { getMilanOrder, payForMilan } from '../lib/milanOrders'
import { formatInr } from '../lib/pricing'
import { fetchRazorpayStatus, startRazorpayCheckout, type RazorpayStatus } from '../lib/razorpay'

export function MilanPayPage() {
  const { orderId = '' } = useParams()
  const { lang } = useLanguage()
  const navigate = useNavigate()
  const order = useMemo(() => getMilanOrder(orderId), [orderId])
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
          <Link className="btn btn-primary" to="/milan">
            {lang === 'hi' ? 'मिलान शुरू करें' : 'Start Milan'}
          </Link>
        </div>
      </div>
    )
  }

  if (order.status !== 'draft') {
    return (
      <div className="page-wrap">
        <div className="container">
          <h1 className="page-title">{lang === 'hi' ? 'पहले से भुगतान' : 'Already paid'}</h1>
          <Link className="btn btn-primary" to={`/milan/result/${order.id}`}>
            {lang === 'hi' ? 'रिपोर्ट देखें' : 'View report'}
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
        product: 'milan',
        localOrderId: order.id,
        amountInr: order.amountInr,
        customerName: `${order.boy.name} & ${order.girl.name}`,
        description: lang === 'hi' ? 'कुंडली मिलान PDF' : 'Kundali Milan PDF',
        prefillContact: order.whatsapp,
      })
      payForMilan(order.id, {
        paymentId: result.razorpayPaymentId,
        razorpayOrderId: result.razorpayOrderId,
      })
      navigate(`/milan/result/${order.id}`)
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Payment failed'
      if (msg !== 'Payment cancelled') setError(msg)
      setBusy(false)
    }
  }

  function demoPay() {
    if (!status?.allow_demo) return
    setBusy(true)
    window.setTimeout(() => {
      try {
        payForMilan(order.id, { paymentId: `demo_${Date.now()}` })
        navigate(`/milan/result/${order.id}`)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed')
        setBusy(false)
      }
    }, 400)
  }

  const ready = status?.configured === true
  const demoOk = status?.allow_demo === true

  return (
    <div className="page-wrap">
      <div className="container" style={{ maxWidth: 560 }}>
        <h1 className="page-title">
          {lang === 'hi' ? 'मिलान रिपोर्ट अनलॉक करें' : 'Unlock Milan report'}
        </h1>
        <p className="page-sub">
          {lang === 'hi'
            ? 'भुगतान के बाद अष्टकूट सारांश, मंगलिक तुलना व PDF।'
            : 'After payment: Ashtakoot summary, manglik compare, and PDF.'}
        </p>
        <div className="panel">
          <div className="kv">
            <div>
              <span>{lang === 'hi' ? 'ऑर्डर' : 'Order'}</span>
              <span>{order.id}</span>
            </div>
            <div>
              <span>{lang === 'hi' ? 'वर' : 'Boy'}</span>
              <span>
                {order.boy.name} · {order.boy.dateOfBirth}
              </span>
            </div>
            <div>
              <span>{lang === 'hi' ? 'वधू' : 'Girl'}</span>
              <span>
                {order.girl.name} · {order.girl.dateOfBirth}
              </span>
            </div>
            <div>
              <span>{lang === 'hi' ? 'राशि' : 'Amount'}</span>
              <span>{formatInr(order.amountInr)}</span>
            </div>
          </div>
        </div>
        {error && <p className="alert">{error}</p>}
        <div className="form-actions">
          <Link className="btn btn-ghost" to="/milan">
            {lang === 'hi' ? 'वापस' : 'Back'}
          </Link>
          {ready ? (
            <button type="button" className="btn btn-primary" disabled={busy} onClick={payWithRazorpay}>
              {busy
                ? lang === 'hi'
                  ? 'Razorpay…'
                  : 'Razorpay…'
                : lang === 'hi'
                  ? `पे करें ${formatInr(order.amountInr)}`
                  : `Pay ${formatInr(order.amountInr)}`}
            </button>
          ) : demoOk ? (
            <button type="button" className="btn btn-primary" disabled={busy} onClick={demoPay}>
              {lang === 'hi' ? `डेमो पे ${formatInr(order.amountInr)}` : `Demo pay ${formatInr(order.amountInr)}`}
            </button>
          ) : (
            <button type="button" className="btn btn-primary" disabled>
              {lang === 'hi' ? 'भुगतान जल्द' : 'Payments soon'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
