import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { remediesForChart } from '../astrology/generate'
import type { KundaliOrder } from '../astrology/types'
import { useLanguage } from '../hooks/useLanguage'
import { getOrder, payForRemedies } from '../lib/orders'
import { downloadKundaliPdf } from '../lib/pdf'
import { formatInr } from '../lib/pricing'

export function RemediesPage() {
  const { orderId = '' } = useParams()
  const { lang } = useLanguage()
  const [tick, setTick] = useState(0)
  const order = useMemo(() => getOrder(orderId), [orderId, tick])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

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

  function mockPay(current: KundaliOrder) {
    setBusy(true)
    setError('')
    window.setTimeout(() => {
      try {
        payForRemedies(current.id)
        setTick((n) => n + 1)
        setBusy(false)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Payment failed')
        setBusy(false)
      }
    }, 700)
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
            <div className="mock-badge">
              {lang === 'hi' ? 'डेमो भुगतान' : 'Demo payment'}
            </div>
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
            <button type="button" className="btn btn-gold" disabled={busy} onClick={() => mockPay(order)}>
              {busy
                ? lang === 'hi'
                  ? 'प्रोसेस…'
                  : 'Processing…'
                : lang === 'hi'
                  ? `उपाय अनलॉक — ${formatInr(order.amountRemedies)}`
                  : `Unlock remedies — ${formatInr(order.amountRemedies)}`}
            </button>
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
