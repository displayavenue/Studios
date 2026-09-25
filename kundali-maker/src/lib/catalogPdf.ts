import { jsPDF } from 'jspdf'
import { downloadKundaliPdf } from './pdf'
import type { CatalogOrder } from './catalogOrders'
import { formatInr } from './pricing'
import type { KundaliOrder } from '../astrology/types'

export function downloadCatalogPdf(order: CatalogOrder): void {
  if (!order.result) throw new Error('Result missing')
  const r = order.result

  // Deep bundle also emits the full kundali PDF
  if (order.productId === 'deep' && order.result.chart) {
    const fake: KundaliOrder = {
      id: order.id,
      createdAt: order.createdAt,
      details: order.details,
      status: 'kundali_paid',
      chart: order.result.chart,
      amountKundali: order.amountInr,
      amountRemedies: 0,
      kundaliPaymentId: order.paymentId,
      kundaliPaidAt: order.paidAt,
    }
    downloadKundaliPdf(fake, false)
  }

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const margin = 16
  let y = margin
  const ensure = (need: number) => {
    if (y + need > 280) {
      doc.addPage()
      y = margin
    }
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(92, 26, 26)
  doc.text('Jyotish Kundali', margin, y)
  y += 8
  doc.setFontSize(13)
  doc.text(r.titleEn, margin, y)
  doc.setTextColor(0)
  y += 10
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`Prepared for: ${order.details.name}`, margin, y)
  y += 6
  doc.text(`Birth: ${order.details.dateOfBirth} ${order.details.timeOfBirth} · ${order.details.placeName}`, margin, y)
  y += 6
  doc.text(`Order: ${order.id} · ${formatInr(order.amountInr)}`, margin, y)
  y += 10

  const sum: string[] = doc.splitTextToSize(r.summaryEn, 178)
  for (const line of sum) {
    ensure(6)
    doc.text(line, margin, y)
    y += 5
  }
  y += 4

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(92, 26, 26)
  ensure(10)
  doc.text('Report notes', margin, y)
  doc.setTextColor(0)
  y += 8
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  for (const b of r.bulletsEn) {
    const lines: string[] = doc.splitTextToSize(`• ${b}`, 178)
    for (const line of lines) {
      ensure(6)
      doc.text(line, margin, y)
      y += 5
    }
    y += 2
  }

  y += 6
  ensure(12)
  doc.setFontSize(9)
  doc.text('Guidance only—not medical, legal, or financial advice. https://jyotishkundali.com', margin, y)

  const slug = order.productId
  doc.save(`${slug}-${order.details.name.replace(/\s+/g, '-').toLowerCase()}.pdf`)
}
