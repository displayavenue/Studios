export const SIGNS_EN = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
] as const

export const SIGNS_HI = [
  'मेष',
  'वृषभ',
  'मिथुन',
  'कर्क',
  'सिंह',
  'कन्या',
  'तुला',
  'वृश्चिक',
  'धनु',
  'मकर',
  'कुम्भ',
  'मीन',
] as const

export const NAKSHATRAS_EN = [
  'Ashwini',
  'Bharani',
  'Krittika',
  'Rohini',
  'Mrigashira',
  'Ardra',
  'Punarvasu',
  'Pushya',
  'Ashlesha',
  'Magha',
  'Purva Phalguni',
  'Uttara Phalguni',
  'Hasta',
  'Chitra',
  'Swati',
  'Vishakha',
  'Anuradha',
  'Jyeshtha',
  'Mula',
  'Purva Ashadha',
  'Uttara Ashadha',
  'Shravana',
  'Dhanishta',
  'Shatabhisha',
  'Purva Bhadrapada',
  'Uttara Bhadrapada',
  'Revati',
] as const

export const NAKSHATRAS_HI = [
  'अश्विनी',
  'भरणी',
  'कृत्तिका',
  'रोहिणी',
  'मृगशिरा',
  'आर्द्रा',
  'पुनर्वसु',
  'पुष्य',
  'अश्लेषा',
  'मघा',
  'पूर्वा फाल्गुनी',
  'उत्तरा फाल्गुनी',
  'हस्त',
  'चित्रा',
  'स्वाति',
  'विशाखा',
  'अनुराधा',
  'ज्येष्ठा',
  'मूल',
  'पूर्वाषाढ़ा',
  'उत्तराषाढ़ा',
  'श्रवण',
  'धनिष्ठा',
  'शतभिषा',
  'पूर्वा भाद्रपद',
  'उत्तरा भाद्रपद',
  'रेवती',
] as const

export const PLANETS = [
  { id: 'sun', nameEn: 'Sun', nameHi: 'सूर्य', body: 'Sun' as const },
  { id: 'moon', nameEn: 'Moon', nameHi: 'चन्द्र', body: 'Moon' as const },
  { id: 'mars', nameEn: 'Mars', nameHi: 'मंगल', body: 'Mars' as const },
  { id: 'mercury', nameEn: 'Mercury', nameHi: 'बुध', body: 'Mercury' as const },
  { id: 'jupiter', nameEn: 'Jupiter', nameHi: 'गुरु', body: 'Jupiter' as const },
  { id: 'venus', nameEn: 'Venus', nameHi: 'शुक्र', body: 'Venus' as const },
  { id: 'saturn', nameEn: 'Saturn', nameHi: 'शनि', body: 'Saturn' as const },
  { id: 'rahu', nameEn: 'Rahu', nameHi: 'राहु', body: null },
  { id: 'ketu', nameEn: 'Ketu', nameHi: 'केतु', body: null },
] as const

/** Vimshottari dasha years in order starting from Ketu (Ashwini lord) */
export const DASHA_LORDS = [
  { en: 'Ketu', hi: 'केतु', years: 7 },
  { en: 'Venus', hi: 'शुक्र', years: 20 },
  { en: 'Sun', hi: 'सूर्य', years: 6 },
  { en: 'Moon', hi: 'चन्द्र', years: 10 },
  { en: 'Mars', hi: 'मंगल', years: 7 },
  { en: 'Rahu', hi: 'राहु', years: 18 },
  { en: 'Jupiter', hi: 'गुरु', years: 16 },
  { en: 'Saturn', hi: 'शनि', years: 19 },
  { en: 'Mercury', hi: 'बुध', years: 17 },
] as const

export const NAKSHATRA_LORDS = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, // Ashwini..Ashlesha
  0, 1, 2, 3, 4, 5, 6, 7, 8, // Magha..Jyeshtha
  0, 1, 2, 3, 4, 5, 6, 7, 8, // Mula..Revati
] as const

export function norm360(deg: number): number {
  const x = deg % 360
  return x < 0 ? x + 360 : x
}

export function signIndex(longitude: number): number {
  return Math.floor(norm360(longitude) / 30) % 12
}

export function degreeInSign(longitude: number): number {
  return norm360(longitude) % 30
}

export function nakshatraFromLongitude(longitude: number): {
  index: number
  pada: number
} {
  const lon = norm360(longitude)
  const span = 360 / 27
  const index = Math.min(26, Math.floor(lon / span))
  const within = lon - index * span
  const pada = Math.min(4, Math.floor(within / (span / 4)) + 1)
  return { index, pada }
}

/** Julian Day from UTC Date */
export function julianDay(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5
}

/**
 * Lahiri (Chitrapaksha) ayanamsa approximation.
 * Good enough for educational / consumer MVP charts.
 */
export function lahiriAyanamsa(jd: number): number {
  const t = (jd - 2451545.0) / 36525.0
  return 23.85234477 + t * (1.39697167 + t * (-0.00009232 + t * -0.000000344))
}
