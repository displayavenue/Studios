import { useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { getCatalogOrder } from '../lib/catalogOrders'
import { downloadCatalogPdf } from '../lib/catalogPdf'
import { formatInr } from '../lib/pricing'

export function ShopResultPage() {
  const { productId = '', orderId = '' } = useParams()
  const { lang } = useLanguage()
  const order = useMemo(() => getCatalogOrder(orderId), [orderId])
  const [err, setErr] = useState('')

  if (!order || order.productId !== productId || order.status !== 'paid' || !order.result) {
    return <Navigate to="/services" replace />
  }

  const r = order.result
  const hi = order.language === 'hi'

  function onPdf() {
    setErr('')
    try {
      downloadCatalogPdf(order)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'PDF failed')
    }
  }

  return (
    <div className="page-wrap">
      <div className="container">
        <h1 className="page-title anim-rise">{hi ? r.titleHi : r.titleEn}</h1>
        <p className="page-sub anim-rise delay-1">{hi ? r.summaryHi : r.summaryEn}</p>

        <div className="delivery-banner anim-rise delay-2">
          <div>
            <strong>{lang === 'hi' ? 'तुरंत PDF तैयार' : 'Instant PDF ready'}</strong>
            <p>
              {lang === 'hi'
                ? `ऑर्डर ${order.id} · ${formatInr(order.amountInr)} · बिना कॉल डाउनलोड करें।`
                : `Order ${order.id} · ${formatInr(order.amountInr)} · download now—no call needed.`}
            </p>
          </div>
          <button type="button" className="btn btn-primary" onClick={onPdf}>
            {lang === 'hi' ? 'PDF डाउनलोड' : 'Download PDF'}
          </button>
        </div>
        {err && <p className="alert">{err}</p>}

        <div className="panel anim-rise delay-3">
          <h3>{lang === 'hi' ? 'मुख्य बिंदु' : 'Key points'}</h3>
          <ul className="include-list">
            {(hi ? r.bulletsHi : r.bulletsEn).slice(0, 8).map((b) => (
              <li key={b.slice(0, 48)}>{b}</li>
            ))}
          </ul>
        </div>

        <div className="form-actions">
          <Link className="btn btn-secondary" to="/generate">
            {lang === 'hi' ? 'पूर्ण कुंडली' : 'Full kundali'}
          </Link>
          <Link className="btn btn-ghost" to="/services">
            {lang === 'hi' ? 'और सेवाएँ' : 'More services'}
          </Link>
        </div>
      </div>
    </div>
  )
}
