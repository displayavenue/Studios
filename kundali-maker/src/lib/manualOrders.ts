import { PRICING } from './pricing'

const STORAGE_KEY = 'jyotish_manual_kundali_orders_v1'

export interface ManualKundaliRequest {
  id: string
  createdAt: string
  name: string
  whatsapp: string
  dateOfBirth: string
  timeOfBirth: string
  placeName: string
  language: 'en' | 'hi'
  status: 'draft' | 'paid' | 'whatsapp'
  amountInr: number
  paymentId?: string
  razorpayOrderId?: string
  paidAt?: string
}

function uid(): string {
  return `JK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
}

function readAll(): ManualKundaliRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as ManualKundaliRequest[]
  } catch {
    return []
  }
}

function writeAll(orders: ManualKundaliRequest[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

export function createManualRequest(input: {
  name: string
  whatsapp: string
  dateOfBirth: string
  timeOfBirth: string
  placeName: string
  language: 'en' | 'hi'
}): ManualKundaliRequest {
  const order: ManualKundaliRequest = {
    id: uid(),
    createdAt: new Date().toISOString(),
    name: input.name.trim(),
    whatsapp: input.whatsapp.trim(),
    dateOfBirth: input.dateOfBirth,
    timeOfBirth: input.timeOfBirth,
    placeName: input.placeName.trim(),
    language: input.language,
    status: 'draft',
    amountInr: PRICING.kundaliInr,
  }
  const all = readAll()
  all.unshift(order)
  writeAll(all)
  return order
}

export function markManualPaid(
  id: string,
  payment?: { paymentId?: string; razorpayOrderId?: string },
): ManualKundaliRequest {
  const all = readAll()
  const order = all.find((o) => o.id === id)
  if (!order) throw new Error('Order not found')
  order.status = 'paid'
  order.paidAt = new Date().toISOString()
  if (payment?.paymentId) order.paymentId = payment.paymentId
  if (payment?.razorpayOrderId) order.razorpayOrderId = payment.razorpayOrderId
  writeAll(all)
  return order
}

export function markManualWhatsApp(id: string): ManualKundaliRequest {
  const all = readAll()
  const order = all.find((o) => o.id === id)
  if (!order) throw new Error('Order not found')
  order.status = 'whatsapp'
  writeAll(all)
  return order
}

export function getManualOrder(id: string): ManualKundaliRequest | undefined {
  return readAll().find((o) => o.id === id)
}

export function kundaliWhatsAppRequestMessage(order: ManualKundaliRequest): string {
  return (
    `Namaste, I want a Vedic Kundali PDF from Jyotish Kundali.\n` +
    `Reference: ${order.id}\n` +
    `Name: ${order.name}\n` +
    `Birth: ${order.dateOfBirth} ${order.timeOfBirth}, ${order.placeName}\n` +
    `My WhatsApp: ${order.whatsapp}\n` +
    `Language: ${order.language === 'hi' ? 'Hindi' : 'English'}\n` +
    `Please share payment / prepare my kundali.`
  )
}

export function kundaliPaidWhatsAppMessage(order: ManualKundaliRequest): string {
  return (
    `Namaste, I paid for Vedic Kundali on jyotishkundali.com.\n` +
    `Order ID: ${order.id}\n` +
    `Payment ID: ${order.paymentId || '—'}\n` +
    `Name: ${order.name}\n` +
    `Birth: ${order.dateOfBirth} ${order.timeOfBirth}, ${order.placeName}\n` +
    `My WhatsApp: ${order.whatsapp}\n` +
    `Please prepare and send my full kundali PDF here.`
  )
}
