import type { Language } from '../astrology/types'
import { formatInr, PRICING } from './pricing'

export function t(lang: Language, en: string, hi: string): string {
  return lang === 'hi' ? hi : en
}

export const copy = {
  brand: (lang: Language) => t(lang, 'Jyotish Kundali', 'ज्योतिष कुंडली'),
  tagline: (lang: Language) =>
    t(
      lang,
      'Authentic Vedic birth chart, prepared from your exact birth details.',
      'आपके सटीक जन्म विवरण से तैयार प्रामाणिक वैदिक जन्म कुंडली।',
    ),
  /** Primary CTA — pay / WhatsApp order page */
  ctaPrimary: (lang: Language) =>
    t(lang, 'Order My Kundali', 'मेरी कुंडली मँगवाएँ'),
  ctaPrimaryShort: (lang: Language) => t(lang, 'Order', 'मँगवाएँ'),
  priceKundali: (lang: Language) =>
    t(lang, `Kundali PDF — ${formatInr(PRICING.kundaliInr)}`, `कुंडली PDF — ${formatInr(PRICING.kundaliInr)}`),
  priceRemedies: (lang: Language) =>
    t(lang, `Remedies add-on — ${formatInr(PRICING.remediesInr)}`, `उपाय ऐड-ऑन — ${formatInr(PRICING.remediesInr)}`),
}
