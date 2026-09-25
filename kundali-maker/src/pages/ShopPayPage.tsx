import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { getCatalogOrder, payForCatalog } from '../lib/catalogOrders'
import { formatInr } from '../lib/pricing'
import { fetchRazorpayStatus, startRazorpayCheckout, type RazorpayStatus } from '../lib/razorpay'

export function ShopPayPage() {
  const { productId = '', orderId = '' } = useParams()
  const { lang } = useLanguage()
  const navigate = useNavigate()
  const order = useMemo(() => getCatalogOrder(orderId), [orderId])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState<RazorpayStatus | null>(null)

  useEffect(() => {
    let c = false
    fetchRazorpayStatus().then((s) => {
      if (!c) setStatus(s)
    })
    return () => {
      c = true
    }
  }, [])

  if (!order || order.productId !== productId) {
    return <Navigate to="/services" replace />
  }
  if (order.status !== 'draft') {
    return <Navigate to={`/shop/${productId}/result/${order.id}`} replace />
  }

  async function pay() {
    setBusy(true)
    setError('')
    try {
      const result = await startRazorpayCheckout({
        product: order.productId,
        localOrderId: order.id,
        amountInr: order.amountInr,
        customerName: order.details.name,
        description: `${order.productId} report`,
      })
      payForCatalog(order.id, {
        paymentId: result.razorpayPaymentId,
        razorpayOrderId: result.razorpayOrderId,
      })
      navigate(`/shop/${productId}/result/${order.id}`)
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
      payForCatalog(order.id, { paymentId: `demo_${Date.now()}` })
      navigate(`/shop/${productId}/result/${order.id}`)
    }, 400)
  }

  const ready = status?.configured === true
  const demoOk = status?.allow_demo === true

  return (
    <div className="page-wrap">
      <div className="container" style={{ maxWidth: 560 }}>
        <h1 className="page-title">{lang === 'hi' ? 'सुरक्षित भुगतान' : 'Secure payment'}</h1>
        <p className="page-sub">
          {lang === 'hi'
            ? 'भुगतान के बाद रिपोर्ट तुरंत PDF में खुलती है—UPI / कार्ड (Razorpay)।'
            : 'Report unlocks as instant PDF after payment—UPI / cards via Razorpay.'}
        </p>
        <div className="panel">
          <div className="kv">
            <div>
              <span>{lang === 'hi' ? 'ऑर्डर' : 'Order'}</span>
              <span>{order.id}</span>
            </div>
            <div>
              <span>{lang === 'hi' ? 'उत्पाद' : 'Product'}</span>
              <span>{order.productId}</span>
            </div>
            <div>
              <span>{lang === 'hi' ? 'नाम' : 'Name'}</span>
              <span>{order.details.name}</span>
            </div>
            <div>
              <span>{lang === 'hi' ? 'राशि' : 'Amount'}</span>
              <span>{formatInr(order.amountInr)}</span>
            </div>
          </div>
        </div>
        {error && <p className="alert">{error}</p>}
        <div className="form-actions">
          <Link className="btn btn-ghost" to={`/shop/${productId}`}>
            {lang === 'hi' ? 'वापस' : 'Back'}
          </Link>
          {ready ? (
            <button type="button" className="btn btn-primary" disabled={busy} onClick={pay}>
              {busy
                ? '…'
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
