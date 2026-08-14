import { generateKundali } from '../astrology/generate'
import type { BirthDetails, KundaliOrder } from '../astrology/types'
import { PRICING } from './pricing'

const STORAGE_KEY = 'jyotish_kundali_orders_v1'

function uid(): string {
  return `JK-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
}

function readAll(): KundaliOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as KundaliOrder[]
  } catch {
    return []
  }
}

function writeAll(orders: KundaliOrder[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

export function createDraftOrder(details: BirthDetails): KundaliOrder {
  const order: KundaliOrder = {
    id: uid(),
    createdAt: new Date().toISOString(),
    details,
    status: 'draft',
    amountKundali: PRICING.kundaliInr,
    amountRemedies: PRICING.remediesInr,
  }
  const all = readAll()
  all.unshift(order)
  writeAll(all)
  return order
}

export function getOrder(id: string): KundaliOrder | undefined {
  return readAll().find((o) => o.id === id)
}

export function updateOrder(order: KundaliOrder): KundaliOrder {
  const all = readAll()
  const idx = all.findIndex((o) => o.id === order.id)
  if (idx >= 0) all[idx] = order
  else all.unshift(order)
  writeAll(all)
  return order
}

/** Mock payment: unlocks kundali generation */
export function payForKundali(orderId: string): KundaliOrder {
  const order = getOrder(orderId)
  if (!order) throw new Error('Order not found')
  if (order.status === 'draft') {
    order.chart = generateKundali(order.details)
    order.status = 'kundali_paid'
    order.kundaliPaidAt = new Date().toISOString()
    updateOrder(order)
  }
  return order
}

/** Mock payment: unlocks remedies for an already-paid kundali */
export function payForRemedies(orderId: string): KundaliOrder {
  const order = getOrder(orderId)
  if (!order) throw new Error('Order not found')
  if (order.status === 'draft') throw new Error('Pay for kundali first')
  if (order.status === 'kundali_paid') {
    order.status = 'remedies_paid'
    order.remediesPaidAt = new Date().toISOString()
    updateOrder(order)
  }
  return order
}

export function listOrders(): KundaliOrder[] {
  return readAll()
}
