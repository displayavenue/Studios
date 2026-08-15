import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { getMilanOrder } from '../lib/milanOrders'
import { downloadMilanPdf } from '../lib/milanPdf'
import { formatInr } from '../lib/pricing'
import { milanDeliveryWhatsAppMessage, openWhatsAppDelivery } from '../lib/whatsapp'

export function MilanResultPage() {
  const { orderId = '' } = useParams()
  const { lang } = useLanguage()
  const order = useMemo(() => getMilanOrder(orderId), [orderId])
  const [err, setErr] = useState('')

  if (!order || order.status !== 'paid' || !order.result) {
    return (
      <div className="page-wrap">
        <div className="container">
          <h1 className="page-title">{lang === 'hi' ? 'मिलान तैयार नहीं' : 'Milan not ready'}</h1>
          <Link className="btn btn-primary" to="/milan">
            {lang === 'hi' ? 'शुरू करें' : 'Start'}
          </Link>
        </div>
      </div>
    )
  }

  const r = order.result
  const reportLang = order.language

  function onPdf() {
    setErr('')
    try {
      downloadMilanPdf(order)
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'PDF failed')
    }
  }

  function onWhatsApp() {
    try {
      downloadMilanPdf(order)
    } catch {
      /* still open WA */
    }
    openWhatsAppDelivery(milanDeliveryWhatsAppMessage(order))
  }

  return (
    <div className="page-wrap">
      <div className="container">
        <h1 className="page-title">
          {reportLang === 'hi' ? 'गुण मिलान परिणाम' : 'Gun Milan result'}
        </h1>
        <p className="page-sub">
          {reportLang === 'hi' ? r.verdictHi : r.verdictEn}
        </p>

        <div className="milan-score">
          <div className="milan-score-num">
            {r.total}
            <span>/{r.maxTotal}</span>
          </div>
          <p>{reportLang === 'hi' ? 'कुल गुण' : 'Total Gunas'}</p>
        </div>

        <div className="form-actions" style={{ marginTop: 0, marginBottom: '1.25rem' }}>
          <button type="button" className="btn btn-primary" onClick={onPdf}>
            {lang === 'hi' ? 'मिलान PDF डाउनलोड' : 'Download Milan PDF'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onWhatsApp}>
            {lang === 'hi' ? 'WhatsApp पर भेजें / पुष्टि' : 'WhatsApp delivery / confirm'}
          </button>
          <Link className="btn btn-ghost" to="/generate">
            {lang === 'hi' ? 'व्यक्तिगत कुंडली' : 'Individual kundali'}
          </Link>
        </div>
        {err && <p className="alert">{err}</p>}

        <div className="panel">
          <h3>{reportLang === 'hi' ? 'चन्द्र व नक्षत्र' : 'Moon & nakshatra'}</h3>
          <div className="kv">
            <div>
              <span>{r.boy.name}</span>
              <span>
                {reportLang === 'hi' ? r.boy.moonSignHi : r.boy.moonSignEn} ·{' '}
                {reportLang === 'hi' ? r.boy.nakshatraHi : r.boy.nakshatraEn}
                {r.boy.manglik ? (reportLang === 'hi' ? ' · मंगलिक' : ' · Manglik') : ''}
              </span>
            </div>
            <div>
              <span>{r.girl.name}</span>
              <span>
                {reportLang === 'hi' ? r.girl.moonSignHi : r.girl.moonSignEn} ·{' '}
                {reportLang === 'hi' ? r.girl.nakshatraHi : r.girl.nakshatraEn}
                {r.girl.manglik ? (reportLang === 'hi' ? ' · मंगलिक' : ' · Manglik') : ''}
              </span>
            </div>
          </div>
        </div>

        <div className="panel">
          <h3>{reportLang === 'hi' ? 'अष्टकूट अंक' : 'Ashtakoot points'}</h3>
          <div className="table-wrap">
            <table className="planets">
              <thead>
                <tr>
                  <th>{reportLang === 'hi' ? 'कूट' : 'Koot'}</th>
                  <th>{reportLang === 'hi' ? 'अंक' : 'Score'}</th>
                  <th>{reportLang === 'hi' ? 'नोट' : 'Note'}</th>
                </tr>
              </thead>
              <tbody>
                {r.koots.map((k) => (
                  <tr key={k.id}>
                    <td>{reportLang === 'hi' ? k.nameHi : k.nameEn}</td>
                    <td>
                      {k.score}/{k.max}
                    </td>
                    <td>{reportLang === 'hi' ? k.noteHi : k.noteEn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <h3>{reportLang === 'hi' ? 'मंगलिक तुलना' : 'Manglik compare'}</h3>
          <p>{reportLang === 'hi' ? r.manglikNoteHi : r.manglikNoteEn}</p>
        </div>

        <p className="muted" style={{ fontSize: '0.9rem' }}>
          {lang === 'hi'
            ? `ऑर्डर ${order.id} · ${formatInr(order.amountInr)} · मार्गदर्शन हेतु—केवल अंकों से निर्णय न लें।`
            : `Order ${order.id} · ${formatInr(order.amountInr)} · Guidance only—do not decide from points alone.`}
        </p>
      </div>
    </div>
  )
}
