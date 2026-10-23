import { buildCatalogResult, type CatalogProductId, type CatalogResult } from '../astrology/catalog'
import type { BirthDetails, Language } from '../astrology/types'
import { PRICING } from './pricing'

const STORAGE_KEY = 'jyotish_catalog_orders_v1'

export type CatalogOrderStatus = 'draft' | 'paid'

export interface CatalogOrder {
  id: string
  createdAt: string
  status: CatalogOrderStatus
  productId: CatalogProductId
  language: Language
  details: BirthDetails
  eventType?: string
  amountInr: number
  paidAt?: string
  paymentId?: string
  razorpayOrderId?: string
  result?: CatalogResult
}

const AMOUNT: Record<CatalogProductId, number> = {
  career: PRICING.careerInr,
  manglik: PRICING.manglikInr,
  varshphal: PRICING.varshphalInr,
  muhurat: PRICING.muhuratInr,
  deep: PRICING.deepInr,
  student: PRICING.studentPackInr,
  business: PRICING.businessPackInr,
}

function uid(): string {
  return `JC-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
}

function readAll(): CatalogOrder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as CatalogOrder[]
  } catch {
    return []
  }
}

function writeAll(orders: CatalogOrder[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
}

export function catalogAmount(productId: CatalogProductId): number {
  return AMOUNT[productId]
}

export function createCatalogDraft(
  productId: CatalogProductId,
  details: BirthDetails,
  language: Language,
  eventType?: string,
): CatalogOrder {
  const order: CatalogOrder = {
    id: uid(),
    createdAt: new Date().toISOString(),
    status: 'draft',
    productId,
    language,
    details: { ...details, name: details.name.trim(), language },
    eventType,
    amountInr: AMOUNT[productId],
  }
  const all = readAll()
  all.unshift(order)
  writeAll(all)
  return order
}

export function getCatalogOrder(id: string): CatalogOrder | undefined {
  return readAll().find((o) => o.id === id)
}

export function updateCatalogOrder(order: CatalogOrder): CatalogOrder {
  const all = readAll()
  const idx = all.findIndex((o) => o.id === order.id)
  if (idx >= 0) all[idx] = order
  else all.unshift(order)
  writeAll(all)
  return order
}

export function payForCatalog(
  orderId: string,
  payment?: { paymentId?: string; razorpayOrderId?: string },
): CatalogOrder {
  const order = getCatalogOrder(orderId)
  if (!order) throw new Error('Order not found')
  if (order.status === 'draft') {
    order.result = buildCatalogResult(order.productId, order.details, { eventType: order.eventType })
    order.status = 'paid'
    order.paidAt = new Date().toISOString()
    if (payment?.paymentId) order.paymentId = payment.paymentId
    if (payment?.razorpayOrderId) order.razorpayOrderId = payment.razorpayOrderId
    updateCatalogOrder(order)
  }
  return order
}
