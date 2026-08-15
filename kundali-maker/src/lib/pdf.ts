import { jsPDF } from 'jspdf'
import { remediesForChart } from '../astrology/generate'
import { buildCompleteReport, pickText } from '../astrology/report'
import type { KundaliOrder } from '../astrology/types'
import { formatInr } from './pricing'

type Doc = jsPDF

function ensureSpace(doc: Doc, y: number, need: number, margin: number): number {
  if (y + need > 280) {
    doc.addPage()
    return margin
  }
  return y
}

function pageFooter(doc: Doc, page: number, totalHint: string, margin: number) {
  doc.setFontSize(8)
  doc.setTextColor(120)
  doc.setFont('helvetica', 'normal')
  doc.text(`Jyotish Kundali · Complete Report · ${totalHint}`, margin, 290)
  doc.text(String(page), 210 - margin, 290, { align: 'right' })
  doc.setTextColor(0)
}

function h1(doc: Doc, text: string, y: number, margin: number): number {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(92, 26, 26)
  doc.text(text, margin, y)
  doc.setTextColor(0)
  return y + 9
}

function h2(doc: Doc, text: string, y: number, margin: number): number {
  y = ensureSpace(doc, y, 12, margin)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(92, 26, 26)
  doc.text(text, margin, y)
  doc.setTextColor(0)
  return y + 7
}

function para(doc: Doc, text: string, y: number, margin: number, size = 10): number {
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(size)
  const lines: string[] = doc.splitTextToSize(text, 210 - margin * 2)
  for (const line of lines) {
    y = ensureSpace(doc, y, 6, margin)
    doc.text(line, margin, y)
    y += 5
  }
  return y + 2
}

function bullets(doc: Doc, items: string[], y: number, margin: number): number {
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  for (const item of items) {
    const lines: string[] = doc.splitTextToSize(`• ${item}`, 210 - margin * 2)
    for (const line of lines) {
      y = ensureSpace(doc, y, 6, margin)
      doc.text(line, margin, y)
      y += 5
    }
  }
  return y + 2
}

/**
 * Complete ~20 page Vedic kundali PDF.
 * Long interpretive text is rendered in English for reliable PDF fonts;
 * Hindi UI remains on the website. Cover notes report language.
 */
export function buildKundaliPdfDoc(order: KundaliOrder, includeRemedies: boolean): Doc {
  if (!order.chart) throw new Error('Chart not generated')
  const chart = order.chart
  const lang = order.details.language
  const report = buildCompleteReport(chart, chart.lagnaLongitude ?? chart.lagnaSignIndex * 30 + 15)
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const margin = 16
  let page = 1
  const mark = (hint: string) => {
    pageFooter(doc, page, hint, margin)
    page += 1
  }

  // PDF body uses English for glyph safety; bilingual titles where short
  const useHiLabels = lang === 'hi'

  // ——— Page 1: Cover ———
  let y = 40
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(92, 26, 26)
  doc.text('Jyotish Kundali', 105, y, { align: 'center' })
  y += 10
  doc.setFontSize(14)
  doc.text(useHiLabels ? 'Complete Vedic Kundali Report (~20 pages)' : 'Complete Vedic Kundali Report (~20 pages)', 105, y, {
    align: 'center',
  })
  doc.setTextColor(0)
  y += 16
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text(`Prepared for: ${order.details.name}`, 105, y, { align: 'center' })
  y += 8
  doc.text(`Birth: ${order.details.dateOfBirth}  ${order.details.timeOfBirth}`, 105, y, { align: 'center' })
  y += 7
  doc.text(`Place: ${order.details.placeName}`, 105, y, { align: 'center' })
  y += 7
  doc.text(`Lat ${order.details.latitude.toFixed(2)} · Lon ${order.details.longitude.toFixed(2)}`, 105, y, {
    align: 'center',
  })
  y += 14
  doc.setFontSize(10)
  doc.text(`Order: ${order.id}`, 105, y, { align: 'center' })
  y += 6
  doc.text(`Generated: ${new Date(chart.generatedAt).toLocaleString('en-IN')}`, 105, y, { align: 'center' })
  y += 12
  doc.setFont('helvetica', 'bold')
  doc.text(report.methodEn, 105, y, { align: 'center' })
  y += 16
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(80)
  const coverNote = useHiLabels
    ? 'On-screen report available in Hindi. This PDF uses English for clear print fonts.'
    : 'Personal guidance report. Not medical, legal, or financial advice.'
  doc.text(coverNote, 105, y, { align: 'center' })
  doc.setTextColor(0)
  mark('Cover')

  // ——— Page 2: How to read ———
  doc.addPage()
  y = margin
  y = h1(doc, '1. How to read this report', y, margin)
  y = para(doc, report.howToReadEn, y, margin)
  y = h2(doc, 'Method', y, margin)
  y = para(doc, report.methodEn, y, margin)
  y = h2(doc, 'Disclaimer', y, margin)
  y = para(
    doc,
    'Astrology reports are for educational and personal reflection. They do not replace professional medical, legal, psychological, or financial advice. Outcomes are not guaranteed.',
    y,
    margin,
  )
  mark('How to read')

  // ——— Page 3: Snapshot ———
  doc.addPage()
  y = margin
  y = h1(doc, '2. Birth snapshot', y, margin)
  y = bullets(doc, report.snapshotBulletsEn, y, margin)
  y = h2(doc, 'Summary', y, margin)
  y = para(doc, chart.summaryEn, y, margin)
  mark('Snapshot')

  // ——— Page 4: Chart overview ———
  doc.addPage()
  y = margin
  y = h1(doc, '3. Rasi chart overview (D1)', y, margin)
  y = para(
    doc,
    `Lagna ${chart.lagnaEn}. Whole-sign houses begin from lagna. Open the website result screen for the North Indian graphic chart. House signs below:`,
    y,
    margin,
  )
  for (let i = 0; i < 12; i++) {
    y = ensureSpace(doc, y, 6, margin)
    doc.setFontSize(10)
    doc.text(`House ${i + 1}: ${report.houses[i].signEn} (lord ${report.houses[i].lordEn}) · ${report.houses[i].planetsEn}`, margin, y)
    y += 5.5
  }
  mark('D1 overview')

  // ——— Page 5: Planet table ———
  doc.addPage()
  y = margin
  y = h1(doc, '4. Planetary positions', y, margin)
  doc.setFontSize(9)
  for (const p of chart.planets) {
    y = ensureSpace(doc, y, 7, margin)
    doc.setFont('helvetica', 'bold')
    doc.text(`${p.nameEn}${p.isRetrograde ? ' (R)' : ''}`, margin, y)
    doc.setFont('helvetica', 'normal')
    y += 4.5
    doc.text(
      `${p.signEn} ${p.degreeInSign.toFixed(2)}° · ${p.nakshatraEn} pada ${p.pada} · House ${p.house} · Lon ${p.longitude.toFixed(2)}°`,
      margin,
      y,
    )
    y += 6
  }
  mark('Planets')

  // ——— Pages 6–7: Houses ———
  doc.addPage()
  y = margin
  y = h1(doc, '5. Houses 1–6', y, margin)
  for (const h of report.houses.slice(0, 6)) {
    y = h2(doc, h.titleEn, y, margin)
    y = para(doc, h.bodyEn, y, margin, 9.5)
  }
  mark('Houses 1–6')

  doc.addPage()
  y = margin
  y = h1(doc, '6. Houses 7–12', y, margin)
  for (const h of report.houses.slice(6)) {
    y = h2(doc, h.titleEn, y, margin)
    y = para(doc, h.bodyEn, y, margin, 9.5)
  }
  mark('Houses 7–12')

  // ——— Page 8: Personality ———
  doc.addPage()
  y = margin
  y = h1(doc, `7. ${report.personality.titleEn}`, y, margin)
  y = para(doc, report.personality.bodyEn, y, margin)
  mark('Personality')

  // ——— Page 9: Mind ———
  doc.addPage()
  y = margin
  y = h1(doc, `8. ${report.mind.titleEn}`, y, margin)
  y = para(doc, report.mind.bodyEn, y, margin)
  mark('Mind')

  // ——— Page 10: Career ———
  doc.addPage()
  y = margin
  y = h1(doc, `9. ${report.career.titleEn}`, y, margin)
  y = para(doc, report.career.bodyEn, y, margin)
  y = h2(doc, report.education.titleEn, y, margin)
  y = para(doc, report.education.bodyEn, y, margin)
  mark('Career')

  // ——— Page 11: Marriage ———
  doc.addPage()
  y = margin
  y = h1(doc, `10. ${report.marriage.titleEn}`, y, margin)
  y = para(doc, report.marriage.bodyEn, y, margin)
  y = h2(doc, report.family.titleEn, y, margin)
  y = para(doc, report.family.bodyEn, y, margin)
  mark('Marriage')

  // ——— Page 12: Navamsa ———
  doc.addPage()
  y = margin
  y = h1(doc, `11. ${report.navamsa.nameEn}`, y, margin)
  y = para(
    doc,
    `Navamsa lagna: ${report.navamsa.lagnaEn}. D9 refines marriage, dharma, and the underlying strength of planets.`,
    y,
    margin,
  )
  for (const p of report.navamsa.planets) {
    y = ensureSpace(doc, y, 5.5, margin)
    doc.setFontSize(10)
    doc.text(`${p.nameEn}: ${p.signEn}`, margin, y)
    y += 5
  }
  mark('Navamsa')

  // ——— Page 13: Dasamsha ———
  doc.addPage()
  y = margin
  y = h1(doc, `12. ${report.dasamsha.nameEn}`, y, margin)
  y = para(
    doc,
    `Dasamsha lagna: ${report.dasamsha.lagnaEn}. D10 is used for profession, status, and work-direction refinement.`,
    y,
    margin,
  )
  for (const p of report.dasamsha.planets) {
    y = ensureSpace(doc, y, 5.5, margin)
    doc.setFontSize(10)
    doc.text(`${p.nameEn}: ${p.signEn}`, margin, y)
    y += 5
  }
  mark('Dasamsha')

  // ——— Page 14: Dasha ———
  doc.addPage()
  y = margin
  y = h1(doc, '13. Vimshottari Mahadasha', y, margin)
  y = para(
    doc,
    `Current: ${chart.currentDasha.lordEn} (${chart.currentDasha.start} → ${chart.currentDasha.end})`,
    y,
    margin,
  )
  y = h2(doc, 'Upcoming Mahadashas', y, margin)
  for (const d of chart.upcomingDashas) {
    y = ensureSpace(doc, y, 6, margin)
    doc.text(`${d.lordEn}: ${d.start} → ${d.end}`, margin, y)
    y += 6
  }
  y = h2(doc, report.dashaAdvice.titleEn, y, margin)
  y = para(doc, report.dashaAdvice.bodyEn, y, margin)
  mark('Dasha')

  // ——— Page 15: Current advice already partly on 14; Year ahead ———
  doc.addPage()
  y = margin
  y = h1(doc, `14. ${report.yearAhead.titleEn}`, y, margin)
  y = para(doc, report.yearAhead.bodyEn, y, margin)
  y = h2(doc, report.foreign.titleEn, y, margin)
  y = para(doc, report.foreign.bodyEn, y, margin)
  mark('Year ahead')

  // ——— Page 16: Yogas ———
  doc.addPage()
  y = margin
  y = h1(doc, '15. Yogas detected', y, margin)
  for (const g of report.yogas) {
    y = h2(doc, g.nameEn, y, margin)
    y = para(doc, g.bodyEn, y, margin, 9.5)
  }
  mark('Yogas')

  // ——— Page 17: Doshas + aspects ———
  doc.addPage()
  y = margin
  y = h1(doc, '16. Dosha flags & aspects', y, margin)
  for (const d of chart.doshas) {
    y = h2(doc, `${d.nameEn} (${d.severity})`, y, margin)
    y = para(doc, d.summaryEn, y, margin, 9.5)
  }
  y = h2(doc, 'Key aspects (drishti notes)', y, margin)
  y = bullets(doc, report.aspectsEn, y, margin)
  mark('Doshas')

  // ——— Page 18: Health + do/dont ———
  doc.addPage()
  y = margin
  y = h1(doc, `17. ${report.health.titleEn}`, y, margin)
  y = para(doc, report.health.bodyEn, y, margin)
  y = h2(doc, 'Do', y, margin)
  y = bullets(doc, report.doDontEn.do, y, margin)
  y = h2(doc, "Don't", y, margin)
  y = bullets(doc, report.doDontEn.dont, y, margin)
  mark('Health & habits')

  // ——— Page 19: Remedies or next steps placeholder ———
  doc.addPage()
  y = margin
  if (includeRemedies && order.status === 'remedies_paid') {
    y = h1(doc, '18. Personalized remedies (unlocked)', y, margin)
    const remedies = remediesForChart(chart)
    for (const r of remedies) {
      y = h2(doc, pickText('en', r.titleEn, r.titleHi), y, margin)
      y = para(doc, r.bodyEn, y, margin, 9.5)
      y = para(doc, `Category: ${r.category}`, y, margin, 9)
    }
  } else {
    y = h1(doc, '18. Remedies (optional add-on)', y, margin)
    y = para(
      doc,
      'Personalized mantras, charity, and ritual suggestions mapped to your dosha flags are available as an optional paid add-on after this kundali. Unlock from your order result page if needed. Remedies are traditional guidance only.',
      y,
      margin,
    )
    y = h2(doc, 'Dosha flags in your chart', y, margin)
    y = bullets(
      doc,
      chart.doshas.map((d) => `${d.nameEn}: ${d.summaryEn}`),
      y,
      margin,
    )
  }
  mark('Remedies')

  // ——— Page 20: Summary ———
  doc.addPage()
  y = margin
  y = h1(doc, '19. Ten-point summary & next steps', y, margin)
  y = bullets(doc, report.summaryBulletsEn, y, margin)
  y = h2(doc, 'Next steps', y, margin)
  y = bullets(
    doc,
    [
      'Re-download this PDF anytime via Order lookup on jyotishkundali.com',
      'Consider Kundali Milan / Muhurat when those services launch',
      'WhatsApp support from the Contact page for order help',
      includeRemedies && order.status === 'remedies_paid'
        ? 'Practice remedies gently and consistently'
        : 'Unlock remedies add-on only if you want chart-linked suggestions',
    ],
    y,
    margin,
  )
  y = h2(doc, 'Payment record', y, margin)
  y = para(
    doc,
    `Kundali ${formatInr(order.amountKundali)}${order.kundaliPaymentId ? ` · Pay ID ${order.kundaliPaymentId}` : ''}${
      order.status === 'remedies_paid'
        ? ` · Remedies ${formatInr(order.amountRemedies)}${order.remediesPaymentId ? ` · ${order.remediesPaymentId}` : ''}`
        : ''
    }`,
    y,
    margin,
    9,
  )
  y = para(doc, 'Thank you for choosing Jyotish Kundali. https://jyotishkundali.com', y, margin, 9)
  mark('Summary')

  return doc
}

export function downloadKundaliPdf(order: KundaliOrder, includeRemedies: boolean): void {
  const doc = buildKundaliPdfDoc(order, includeRemedies)
  const suffix = includeRemedies && order.status === 'remedies_paid' ? '-complete-remedies' : '-complete'
  doc.save(`kundali-${order.details.name.replace(/\s+/g, '-').toLowerCase()}${suffix}.pdf`)
}
