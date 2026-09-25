import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ChartNorthIndian } from '../components/ChartNorthIndian'
import { useLanguage } from '../hooks/useLanguage'
import { getOrder } from '../lib/orders'
import { downloadKundaliPdf } from '../lib/pdf'

export function ResultPage() {
  const { orderId = '' } = useParams()
  const { lang } = useLanguage()
  const order = useMemo(() => getOrder(orderId), [orderId])
  const [pdfError, setPdfError] = useState('')

  if (!order || order.status === 'draft' || !order.chart) {
    return (
      <div className="page-wrap">
        <div className="container">
          <h1 className="page-title">
            {lang === 'hi' ? 'कुंडली अभी तैयार नहीं' : 'Kundali not ready'}
          </h1>
          <p className="page-sub">
            {lang === 'hi'
              ? 'पहले जन्म विवरण भरकर कुंडली बनाएँ।'
              : 'Enter birth details and generate your kundali first.'}
          </p>
          <Link className="btn btn-primary" to="/generate">
            {lang === 'hi' ? 'शुरू करें' : 'Start'}
          </Link>
        </div>
      </div>
    )
  }

  const chart = order.chart
  const reportLang = order.details.language
  const hasRemedies = order.status === 'remedies_paid'

  function onPdf(withRemedies: boolean) {
    setPdfError('')
    try {
      downloadKundaliPdf(order, withRemedies)
    } catch (e) {
      setPdfError(e instanceof Error ? e.message : 'PDF failed')
    }
  }

  return (
    <div className="page-wrap">
      <div className="container">
        <h1 className="page-title">
          {reportLang === 'hi' ? `${order.details.name} की कुंडली` : `${order.details.name}'s Kundali`}
        </h1>
        <p className="page-sub">
          {reportLang === 'hi' ? chart.summaryHi : chart.summaryEn}
        </p>

        <div className="delivery-banner">
          <div>
            <strong>{lang === 'hi' ? 'पूर्ण कुंडली तैयार' : 'Full kundali ready'}</strong>
            <p>
              {lang === 'hi'
                ? `रेफरेंस ${order.id} — पूर्ण विस्तृत PDF अभी डाउनलोड करें। बाद में Order lookup से फिर खोलें।`
                : `Reference ${order.id} — download the full detailed PDF now. Re-open later via Order lookup.`}
            </p>
          </div>
          <Link className="btn btn-ghost" to="/orders">
            {lang === 'hi' ? 'ऑर्डर खोजें' : 'Order lookup'}
          </Link>
        </div>

        <div className="form-actions" style={{ marginTop: 0, marginBottom: '1.5rem' }}>
          <button type="button" className="btn btn-primary" onClick={() => onPdf(false)}>
            {lang === 'hi' ? 'पूर्ण ~२० पृष्ठ PDF डाउनलोड' : 'Download complete ~20 page PDF'}
          </button>
          {hasRemedies && (
            <button type="button" className="btn btn-gold" onClick={() => onPdf(true)}>
              {lang === 'hi' ? 'उपाय सहित PDF' : 'PDF with remedies'}
            </button>
          )}
          <Link className="btn btn-ghost" to="/generate">
            {lang === 'hi' ? 'नई कुंडली' : 'New kundali'}
          </Link>
        </div>
        {pdfError && <p className="alert">{pdfError}</p>}

        <div className="chart-layout">
          <ChartNorthIndian chart={chart} lang={reportLang} />
          <div>
            <div className="kv">
              <div>
                <span>{reportLang === 'hi' ? 'लग्न' : 'Lagna'}</span>
                <span>{reportLang === 'hi' ? chart.lagnaHi : chart.lagnaEn}</span>
              </div>
              <div>
                <span>{reportLang === 'hi' ? 'चन्द्र राशि' : 'Moon sign'}</span>
                <span>{reportLang === 'hi' ? chart.moonSignHi : chart.moonSignEn}</span>
              </div>
              <div>
                <span>{reportLang === 'hi' ? 'सूर्य राशि' : 'Sun sign'}</span>
                <span>{reportLang === 'hi' ? chart.sunSignHi : chart.sunSignEn}</span>
              </div>
              <div>
                <span>{reportLang === 'hi' ? 'अयनांश (लाहिरी)' : 'Ayanamsa (Lahiri)'}</span>
                <span>{chart.ayanamsa.toFixed(4)}°</span>
              </div>
              <div>
                <span>{reportLang === 'hi' ? 'वर्तमान महादशा' : 'Current Mahadasha'}</span>
                <span>
                  {reportLang === 'hi' ? chart.currentDasha.lordHi : chart.currentDasha.lordEn} (
                  {chart.currentDasha.start} → {chart.currentDasha.end})
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="panel">
          <h3>{reportLang === 'hi' ? 'ग्रह स्थिति' : 'Planetary positions'}</h3>
          <div className="table-wrap">
            <table className="planets">
              <thead>
                <tr>
                  <th>{reportLang === 'hi' ? 'ग्रह' : 'Planet'}</th>
                  <th>{reportLang === 'hi' ? 'राशि' : 'Sign'}</th>
                  <th>{reportLang === 'hi' ? 'अंश' : 'Deg'}</th>
                  <th>{reportLang === 'hi' ? 'नक्षत्र' : 'Nakshatra'}</th>
                  <th>{reportLang === 'hi' ? 'भाव' : 'House'}</th>
                </tr>
              </thead>
              <tbody>
                {chart.planets.map((p) => (
                  <tr key={p.id}>
                    <td>
                      {reportLang === 'hi' ? p.nameHi : p.nameEn}
                      {p.isRetrograde ? ' ᴿ' : ''}
                    </td>
                    <td>{reportLang === 'hi' ? p.signHi : p.signEn}</td>
                    <td>{p.degreeInSign.toFixed(1)}°</td>
                    <td>
                      {reportLang === 'hi' ? p.nakshatraHi : p.nakshatraEn} ({p.pada})
                    </td>
                    <td>{p.house}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="panel">
          <h3>{reportLang === 'hi' ? 'दोष / संकेत' : 'Dosha flags'}</h3>
          <div className="dosha-list">
            {chart.doshas.map((d) => (
              <div className="dosha-item" key={d.id}>
                <h4>
                  {reportLang === 'hi' ? d.nameHi : d.nameEn}
                  <span className="severity">{d.severity}</span>
                </h4>
                <p>{reportLang === 'hi' ? d.summaryHi : d.summaryEn}</p>
              </div>
            ))}
          </div>
        </div>

        {hasRemedies && (
          <p className="success-note">
            {lang === 'hi'
              ? 'उपाय अनलॉक हैं — ऊपर से उपाय सहित PDF लें।'
              : 'Remedies unlocked — download the remedies PDF above.'}
          </p>
        )}
      </div>
    </div>
  )
}
