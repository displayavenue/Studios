import { computeMilan, type MilanResult } from '../astrology/milan'
import type { BirthDetails, Language } from '../astrology/types'
import { PRICING } from './pricing'

const STORAGE_KEY = 'jyotish_milan_orders_v1'

export type MilanOrderStatus = 'draft' | 'paid'

export interface MilanOrder {
  id: string
  createdAt: string
  status: MilanOrderStatus
  language: Language
  boy: BirthDetails
  girl: BirthDetails
  whatsapp?: string
  amountInr: number
  paidAt?: string
  paymentId?: string
  razorpayOrderId?: string
  result?: MilanResult
}

function uid(): string {
  return `JM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
}

function readAll(): MilanOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as MilanOrder[]
  } catch {
    return []
  }
}

function writeAll(orders: MilanOrder[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

export function createMilanDraft(
  boy: BirthDetails,
  girl: BirthDetails,
  language: Language,
  whatsapp?: string,
): MilanOrder {
  const order: MilanOrder = {
    id: uid(),
    createdAt: new Date().toISOString(),
    status: 'draft',
    language,
    boy: { ...boy, name: boy.name.trim(), gender: 'male', language },
    girl: { ...girl, name: girl.name.trim(), gender: 'female', language },
    whatsapp: whatsapp?.trim() || undefined,
    amountInr: PRICING.milanInr,
  }
  const all = readAll()
  all.unshift(order)
  writeAll(all)
  return order
}

export function getMilanOrder(id: string): MilanOrder | undefined {
  return readAll().find((o) => o.id === id)
}

export function updateMilanOrder(order: MilanOrder): MilanOrder {
  const all = readAll()
  const idx = all.findIndex((o) => o.id === order.id)
  if (idx >= 0) all[idx] = order
  else all.unshift(order)
  writeAll(all)
  return order
}

export function payForMilan(
  orderId: string,
  payment?: { paymentId?: string; razorpayOrderId?: string },
): MilanOrder {
  const order = getMilanOrder(orderId)
  if (!order) throw new Error('Milan order not found')
  if (order.status === 'draft') {
    order.result = computeMilan(order.boy, order.girl)
    order.status = 'paid'
    order.paidAt = new Date().toISOString()
    if (payment?.paymentId) order.paymentId = payment.paymentId
    if (payment?.razorpayOrderId) order.razorpayOrderId = payment.razorpayOrderId
    updateMilanOrder(order)
  }
  return order
}
