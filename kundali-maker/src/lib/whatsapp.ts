import { SITE, whatsappLink } from '../data/site'
import type { KundaliOrder } from '../astrology/types'
import type { MilanOrder } from './milanOrders'

/** Normalize to digits for wa.me (expects country code, e.g. 91…) */
export function normalizeWhatsApp(input: string): string {
  const digits = input.replace(/\D/g, '')
  if (digits.length === 10) return `91${digits}`
  return digits
}

export function supportWhatsAppHref(message?: string): string {
  return whatsappLink(message)
}

export function kundaliDeliveryWhatsAppMessage(order: KundaliOrder): string {
  const wa = order.details.whatsapp ? `\nMy WhatsApp: ${order.details.whatsapp}` : ''
  return (
    `Namaste, I paid for Vedic Kundali on ${SITE.domain}.\n` +
    `Order ID: ${order.id}\n` +
    `Name: ${order.details.name}\n` +
    `Birth: ${order.details.dateOfBirth} ${order.details.timeOfBirth}, ${order.details.placeName}\n` +
    `Please confirm PDF delivery / help me save the report.${wa}`
  )
}

export function milanDeliveryWhatsAppMessage(order: MilanOrder): string {
  const wa = order.whatsapp ? `\nMy WhatsApp: ${order.whatsapp}` : ''
  return (
    `Namaste, I paid for Kundali Milan on ${SITE.domain}.\n` +
    `Order ID: ${order.id}\n` +
    `Boy: ${order.boy.name} · Girl: ${order.girl.name}\n` +
    `Gunas: ${order.result ? `${order.result.total}/${order.result.maxTotal}` : '—'}\n` +
    `Please confirm Milan PDF delivery.${wa}`
  )
}

export function openWhatsAppDelivery(message: string): void {
  window.open(whatsappLink(message), '_blank', 'noopener,noreferrer')
}

export function isWhatsAppConfigured(): boolean {
  return Boolean(SITE.whatsappNumber && !SITE.whatsappNumber.includes('9999999999'))
}
