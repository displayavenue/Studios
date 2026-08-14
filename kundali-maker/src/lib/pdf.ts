import { jsPDF } from 'jspdf'
import { remediesForChart } from '../astrology/generate'
import type { KundaliOrder } from '../astrology/types'
import { formatInr } from './pricing'

export function downloadKundaliPdf(order: KundaliOrder, includeRemedies: boolean): void {
  if (!order.chart) throw new Error('Chart not generated')
  const chart = order.chart
  const lang = order.details.language
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const margin = 16
  let y = margin

  const title = lang === 'hi' ? 'ज्योतिष कुंडली' : 'Jyotish Kundali'
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text(title, margin, y)
  y += 8

  doc.setFontSize(11)
  doc.setFont('helvetica', 'normal')
  doc.text(`Order: ${order.id}`, margin, y)
  y += 6
  doc.text(
    lang === 'hi'
      ? `नाम: ${order.details.name}  |  जन्म: ${order.details.dateOfBirth} ${order.details.timeOfBirth}`
      : `Name: ${order.details.name}  |  Birth: ${order.details.dateOfBirth} ${order.details.timeOfBirth}`,
    margin,
    y,
  )
  y += 6
  doc.text(
    lang === 'hi'
      ? `स्थान: ${order.details.placeName} (${order.details.latitude.toFixed(2)}, ${order.details.longitude.toFixed(2)})`
      : `Place: ${order.details.placeName} (${order.details.latitude.toFixed(2)}, ${order.details.longitude.toFixed(2)})`,
    margin,
    y,
  )
  y += 10

  doc.setFont('helvetica', 'bold')
  doc.text(lang === 'hi' ? 'सारांश' : 'Summary', margin, y)
  y += 6
  doc.setFont('helvetica', 'normal')
  const summary = lang === 'hi' ? chart.summaryHi : chart.summaryEn
  const summaryLines = doc.splitTextToSize(summary, 180)
  doc.text(summaryLines, margin, y)
  y += summaryLines.length * 5 + 6

  doc.setFont('helvetica', 'bold')
  doc.text(
    lang === 'hi'
      ? `लग्न: ${chart.lagnaHi}   चन्द्र: ${chart.moonSignHi}   सूर्य: ${chart.sunSignHi}`
      : `Lagna: ${chart.lagnaEn}   Moon: ${chart.moonSignEn}   Sun: ${chart.sunSignEn}`,
    margin,
    y,
  )
  y += 8

  doc.text(lang === 'hi' ? 'ग्रह स्थिति' : 'Planetary Positions', margin, y)
  y += 6
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)

  for (const p of chart.planets) {
    if (y > 270) {
      doc.addPage()
      y = margin
    }
    const line =
      lang === 'hi'
        ? `${p.nameHi} — ${p.signHi} ${p.degreeInSign.toFixed(1)}° | नक्षत्र ${p.nakshatraHi} (पद ${p.pada}) | भाव ${p.house}${p.isRetrograde ? ' | वक्री' : ''}`
        : `${p.nameEn} — ${p.signEn} ${p.degreeInSign.toFixed(1)}° | ${p.nakshatraEn} (pada ${p.pada}) | House ${p.house}${p.isRetrograde ? ' | R' : ''}`
    doc.text(line, margin, y)
    y += 5
  }

  y += 4
  doc.setFontSize(11)
  doc.setFont('helvetica', 'bold')
  if (y > 260) {
    doc.addPage()
    y = margin
  }
  doc.text(lang === 'hi' ? 'महादशा' : 'Mahadasha', margin, y)
  y += 6
  doc.setFont('helvetica', 'normal')
  const d = chart.currentDasha
  doc.text(
    lang === 'hi'
      ? `वर्तमान: ${d.lordHi} (${d.start} → ${d.end})`
      : `Current: ${d.lordEn} (${d.start} → ${d.end})`,
    margin,
    y,
  )
  y += 8

  doc.setFont('helvetica', 'bold')
  doc.text(lang === 'hi' ? 'दोष / संकेत' : 'Dosha Flags', margin, y)
  y += 6
  doc.setFont('helvetica', 'normal')
  for (const flag of chart.doshas) {
    if (y > 270) {
      doc.addPage()
      y = margin
    }
    const t = lang === 'hi' ? flag.nameHi : flag.nameEn
    const s = lang === 'hi' ? flag.summaryHi : flag.summaryEn
    doc.setFont('helvetica', 'bold')
    doc.text(`${t} (${flag.severity})`, margin, y)
    y += 5
    doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(s, 180)
    doc.text(lines, margin, y)
    y += lines.length * 5 + 4
  }

  if (includeRemedies && order.status === 'remedies_paid') {
    doc.addPage()
    y = margin
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.text(lang === 'hi' ? 'उपाय (Remedies)' : 'Remedies Add-on', margin, y)
    y += 10
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const remedies = remediesForChart(chart)
    for (const r of remedies) {
      if (y > 260) {
        doc.addPage()
        y = margin
      }
      doc.setFont('helvetica', 'bold')
      doc.text(lang === 'hi' ? r.titleHi : r.titleEn, margin, y)
      y += 5
      doc.setFont('helvetica', 'normal')
      const body = doc.splitTextToSize(lang === 'hi' ? r.bodyHi : r.bodyEn, 180)
      doc.text(body, margin, y)
      y += body.length * 5 + 6
    }
  }

  y = 285
  doc.setFontSize(8)
  doc.setTextColor(100)
  doc.text(
    lang === 'hi'
      ? `भुगतान: कुंडली ${formatInr(order.amountKundali)}${order.status === 'remedies_paid' ? ` + उपाय ${formatInr(order.amountRemedies)}` : ''} · शैक्षिक/उपभोक्ता उपयोग हेतु`
      : `Paid: Kundali ${formatInr(order.amountKundali)}${order.status === 'remedies_paid' ? ` + Remedies ${formatInr(order.amountRemedies)}` : ''} · For educational/consumer use`,
    margin,
    y,
  )

  const suffix = includeRemedies && order.status === 'remedies_paid' ? '-remedies' : ''
  doc.save(`kundali-${order.details.name.replace(/\s+/g, '-').toLowerCase()}${suffix}.pdf`)
}
