import { writeFileSync } from 'node:fs'
import { generateKundali } from '../src/astrology/generate'
import type { BirthDetails, KundaliOrder } from '../src/astrology/types'
import { buildKundaliPdfDoc } from '../src/lib/pdf'

const details: BirthDetails = {
  name: 'Sample Native',
  gender: 'female',
  dateOfBirth: '1992-03-21',
  timeOfBirth: '14:45',
  placeName: 'Mumbai',
  latitude: 19.076,
  longitude: 72.8777,
  timezoneOffsetMinutes: 330,
  language: 'en',
}

const chart = generateKundali(details)
const order: KundaliOrder = {
  id: 'TEST-PDF-20',
  createdAt: new Date().toISOString(),
  status: 'kundali_paid',
  details,
  chart,
  amountKundali: 29900,
  amountRemedies: 19900,
  kundaliPaymentId: 'pay_test_sample',
}

const doc = buildKundaliPdfDoc(order, false)
const pages = doc.getNumberOfPages()
const out = '/opt/cursor/artifacts/sample_complete_kundali_report.pdf'
writeFileSync(out, Buffer.from(doc.output('arraybuffer')))

console.log(
  JSON.stringify(
    {
      pages,
      ok: pages >= 18 && pages <= 28,
      lagna: chart.lagnaEn,
      output: out,
      bytes: Buffer.from(doc.output('arraybuffer')).length,
    },
    null,
    2,
  ),
)

if (pages < 18 || pages > 28) {
  throw new Error(`Expected ~20 pages, got ${pages}`)
}
