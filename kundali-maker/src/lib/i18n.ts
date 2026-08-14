import type { Language } from '../astrology/types'
import { formatInr, PRICING } from './pricing'

export function t(lang: Language, en: string, hi: string): string {
  return lang === 'hi' ? hi : en
}

export const copy = {
  brand: (lang: Language) => t(lang, 'Jyotish Kundali', 'ज्योतिष कुंडली'),
  tagline: (lang: Language) =>
    t(lang, 'Your Vedic birth chart, paid & delivered as PDF.', 'वैदिक जन्म कुंडली — भुगतान के बाद PDF में प्राप्त करें।'),
  ctaGenerate: (lang: Language) => t(lang, 'Generate Kundali', 'कुंडली बनाएँ'),
  priceKundali: (lang: Language) =>
    t(lang, `Kundali PDF — ${formatInr(PRICING.kundaliInr)}`, `कुंडली PDF — ${formatInr(PRICING.kundaliInr)}`),
  priceRemedies: (lang: Language) =>
    t(lang, `Remedies add-on — ${formatInr(PRICING.remediesInr)}`, `उपाय ऐड-ऑन — ${formatInr(PRICING.remediesInr)}`),
}
