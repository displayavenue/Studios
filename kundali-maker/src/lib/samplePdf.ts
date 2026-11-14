import { jsPDF } from 'jspdf'
import { generateKundali } from '../astrology/generate'
import { buildCompleteReport } from '../astrology/report'
import type { BirthDetails, KundaliOrder } from '../astrology/types'
import { PRICING } from './pricing'
import { formatInr } from './pricing'

const SAMPLE_DETAILS: BirthDetails = {
  name: 'Sample Native (Demo)',
  gender: 'female',
  dateOfBirth: '1992-03-21',
  timeOfBirth: '14:45',
  placeName: 'Mumbai',
  latitude: 19.076,
  longitude: 72.8777,
  timezoneOffsetMinutes: 330,
  language: 'en',
}

function watermark(doc: jsPDF) {
  const total = doc.getNumberOfPages()
  for (let i = 1; i <= total; i++) {
    doc.setPage(i)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(48)
    doc.setTextColor(200, 180, 160)
    doc.text('SAMPLE', 105, 160, { align: 'center', angle: 35 })
    doc.setTextColor(0)
  }
}

/** Free 5-page sample so buyers see report depth before paying */
export function downloadSampleKundaliPdf(): void {
  const chart = generateKundali(SAMPLE_DETAILS)
  const report = buildCompleteReport(chart, chart.lagnaLongitude)
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const margin = 16
  let y = 36

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(92, 26, 26)
  doc.text('Jyotish Kundali', 105, y, { align: 'center' })
  y += 10
  doc.setFontSize(13)
  doc.text('SAMPLE Report Preview (not a real order)', 105, y, { align: 'center' })
  doc.setTextColor(0)
  y += 14
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.text('This free sample shows the style of our complete ~20 page PDF.', 105, y, { align: 'center' })
  y += 8
  doc.text(`Full kundali unlocks after payment (${formatInr(PRICING.kundaliInr)}).`, 105, y, { align: 'center' })
  y += 14
  doc.setFontSize(10)
  doc.text(`Demo birth: ${SAMPLE_DETAILS.dateOfBirth} ${SAMPLE_DETAILS.timeOfBirth} · ${SAMPLE_DETAILS.placeName}`, 105, y, {
    align: 'center',
  })
  y += 7
  doc.text(`Lagna ${chart.lagnaEn} · Moon ${chart.moonSignEn} · Sun ${chart.sunSignEn}`, 105, y, { align: 'center' })

  doc.addPage()
  y = margin
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(92, 26, 26)
  doc.text('1. Birth snapshot (sample)', margin, y)
  doc.setTextColor(0)
  y += 10
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  for (const line of report.snapshotBulletsEn) {
    const wrapped: string[] = doc.splitTextToSize(`• ${line}`, 178)
    for (const w of wrapped) {
      doc.text(w, margin, y)
      y += 5
    }
  }
  y += 4
  const sum: string[] = doc.splitTextToSize(chart.summaryEn, 178)
  for (const w of sum) {
    doc.text(w, margin, y)
    y += 5
  }

  doc.addPage()
  y = margin
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(92, 26, 26)
  doc.text('2. House reading example (1st–3rd)', margin, y)
  doc.setTextColor(0)
  y += 10
  for (const h of report.houses.slice(0, 3)) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(h.titleEn, margin, y)
    y += 6
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    const body: string[] = doc.splitTextToSize(h.bodyEn, 178)
    for (const w of body) {
      if (y > 280) break
      doc.text(w, margin, y)
      y += 4.5
    }
    y += 4
  }

  doc.addPage()
  y = margin
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(92, 26, 26)
  doc.text('3. Life chapter example — Personality', margin, y)
  doc.setTextColor(0)
  y += 10
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  for (const w of doc.splitTextToSize(report.personality.bodyEn, 178) as string[]) {
    doc.text(w, margin, y)
    y += 5
  }
  y += 6
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(92, 26, 26)
  doc.text('Career (excerpt)', margin, y)
  doc.setTextColor(0)
  y += 7
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  for (const w of doc.splitTextToSize(report.career.bodyEn.slice(0, 520) + '…', 178) as string[]) {
    doc.text(w, margin, y)
    y += 5
  }

  doc.addPage()
  y = margin
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.setTextColor(92, 26, 26)
  doc.text('4. What the full paid PDF includes', margin, y)
  doc.setTextColor(0)
  y += 10
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  const includes = [
    'Cover, method & birth snapshot',
    'Full D1 overview + all planetary positions',
    'Houses 1–12 detailed readings',
    'Personality, mind, career, marriage, family, health',
    'Navamsa (D9) & Dasamsha (D10)',
    'Vimshottari Mahadasha + year-ahead notes',
    'Yogas, dosha flags, aspects, do/don’t',
    '10-point summary — ~20 pages total',
    'Optional remedies add-on after unlock',
    'Re-download anytime with Order ID (same device)',
  ]
  for (const item of includes) {
    doc.text(`• ${item}`, margin, y)
    y += 7
  }
  y += 10
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text(`Unlock your real chart for ${formatInr(PRICING.kundaliInr)} at jyotishkundali.com/generate`, margin, y)

  watermark(doc)
  doc.save('jyotish-kundali-sample-report.pdf')
}

/** Build a fake order shape if needed by callers */
export function sampleOrderPreview(): KundaliOrder {
  const chart = generateKundali(SAMPLE_DETAILS)
  return {
    id: 'SAMPLE',
    createdAt: new Date().toISOString(),
    details: SAMPLE_DETAILS,
    status: 'kundali_paid',
    chart,
    amountKundali: PRICING.kundaliInr,
    amountRemedies: PRICING.remediesInr,
  }
}
