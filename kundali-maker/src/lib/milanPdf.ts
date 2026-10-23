import { jsPDF } from 'jspdf'
import type { MilanOrder } from './milanOrders'
import { formatInr } from './pricing'

export function downloadMilanPdf(order: MilanOrder): void {
  if (!order.result) throw new Error('Milan not computed')
  const r = order.result
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const margin = 16
  let y = margin

  const h1 = (t: string) => {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.setTextColor(92, 26, 26)
    doc.text(t, margin, y)
    doc.setTextColor(0)
    y += 9
  }
  const para = (t: string, size = 10) => {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(size)
    const lines: string[] = doc.splitTextToSize(t, 210 - margin * 2)
    for (const line of lines) {
      if (y > 280) {
        doc.addPage()
        y = margin
      }
      doc.text(line, margin, y)
      y += 5
    }
    y += 2
  }

  h1('Jyotish Kundali — Gun Milan Report')
  para(`Order: ${order.id}`)
  para(`Boy: ${r.boy.name} · Moon ${r.boy.moonSignEn} · ${r.boy.nakshatraEn}${r.boy.manglik ? ' · Manglik flag' : ''}`)
  para(`Girl: ${r.girl.name} · Moon ${r.girl.moonSignEn} · ${r.girl.nakshatraEn}${r.girl.manglik ? ' · Manglik flag' : ''}`)
  para(`Total Gunas: ${r.total} / ${r.maxTotal}`)
  para(r.verdictEn)
  y += 4
  h1('Ashtakoot breakdown')
  for (const k of r.koots) {
    if (y > 270) {
      doc.addPage()
      y = margin
    }
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text(`${k.nameEn}: ${k.score} / ${k.max}`, margin, y)
    y += 5
    para(k.noteEn, 9.5)
  }
  h1('Manglik compare')
  para(r.manglikNoteEn)
  h1('Summary')
  for (const b of r.summaryBulletsEn) {
    para(`• ${b}`, 9.5)
  }
  para(`Payment: ${formatInr(order.amountInr)}${order.paymentId ? ` · ${order.paymentId}` : ''}`, 9)
  para('Guidance only—not medical or legal advice. https://jyotishkundali.com', 9)

  doc.save(`milan-${r.boy.name.replace(/\s+/g, '-').toLowerCase()}-${r.girl.name.replace(/\s+/g, '-').toLowerCase()}.pdf`)
}
