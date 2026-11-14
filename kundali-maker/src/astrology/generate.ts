import * as Astronomy from 'astronomy-engine'
import {
  DASHA_LORDS,
  NAKSHATRA_LORDS,
  NAKSHATRAS_EN,
  NAKSHATRAS_HI,
  PLANETS,
  SIGNS_EN,
  SIGNS_HI,
  degreeInSign,
  julianDay,
  lahiriAyanamsa,
  nakshatraFromLongitude,
  norm360,
  signIndex,
} from './constants'
import type {
  BirthDetails,
  DashaPeriod,
  DoshaFlag,
  KundaliChart,
  PlanetPosition,
  RemedyItem,
} from './types'

function birthToUtc(details: BirthDetails): Date {
  const [y, m, d] = details.dateOfBirth.split('-').map(Number)
  const [hh, mm] = details.timeOfBirth.split(':').map(Number)
  // Local civil time → UTC using provided offset (minutes east of UTC are positive)
  const localAsUtc = Date.UTC(y, m - 1, d, hh, mm, 0)
  return new Date(localAsUtc - details.timezoneOffsetMinutes * 60_000)
}

/** Mean lunar ascending node (Rahu) in tropical longitude degrees */
function meanRahuTropical(jd: number): number {
  const t = (jd - 2451545.0) / 36525.0
  return norm360(125.04455501 - 1934.13618497 * t + 0.0020762 * t * t)
}

function tropicalLongitude(body: Astronomy.Body, date: Date): number {
  const vec = Astronomy.GeoVector(body, date, true)
  const ecl = Astronomy.Ecliptic(vec)
  return norm360(ecl.elon)
}

function isRetrograde(body: Astronomy.Body, date: Date): boolean {
  if (body === Astronomy.Body.Sun || body === Astronomy.Body.Moon) return false
  const t0 = date.getTime()
  const d1 = new Date(t0 - 12 * 3600_000)
  const d2 = new Date(t0 + 12 * 3600_000)
  const lon1 = tropicalLongitude(body, d1)
  const lon2 = tropicalLongitude(body, d2)
  let delta = lon2 - lon1
  if (delta > 180) delta -= 360
  if (delta < -180) delta += 360
  return delta < 0
}

/**
 * Ascendant (Lagna) tropical longitude from RAMC, latitude, obliquity.
 * Standard spherical astronomy formula.
 */
function tropicalAscendant(
  date: Date,
  latitudeDeg: number,
  longitudeDeg: number,
): number {
  const time = Astronomy.MakeTime(date)
  const gast = Astronomy.SiderealTime(time) // hours
  const lstHours = gast + longitudeDeg / 15
  const ramc = norm360(lstHours * 15) // degrees
  const eps = (23.4392911 * Math.PI) / 180
  const lat = (latitudeDeg * Math.PI) / 180
  const ramcRad = (ramc * Math.PI) / 180

  const y = -Math.cos(ramcRad)
  const x = Math.sin(ramcRad) * Math.cos(eps) + Math.tan(lat) * Math.sin(eps)
  let asc = (Math.atan2(y, x) * 180) / Math.PI
  return norm360(asc)
}

function wholeSignHouses(lagnaSign: number): number[] {
  return Array.from({ length: 12 }, (_, i) => (lagnaSign + i) % 12)
}

function houseOfPlanet(planetSign: number, houses: number[]): number {
  const idx = houses.indexOf(planetSign)
  return idx >= 0 ? idx + 1 : 1
}

function formatDateISO(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function computeDashas(moonSidereal: number, birth: Date): {
  current: DashaPeriod
  upcoming: DashaPeriod[]
} {
  const { index: nak } = nakshatraFromLongitude(moonSidereal)
  const lordIdx = NAKSHATRA_LORDS[nak]
  const span = 360 / 27
  const elapsedInNak = moonSidereal - nak * span
  const fractionLeft = 1 - elapsedInNak / span
  const firstYears = DASHA_LORDS[lordIdx].years * fractionLeft

  const periods: DashaPeriod[] = []
  let cursor = new Date(birth.getTime())
  let idx = lordIdx

  for (let i = 0; i < 9; i++) {
    const lord = DASHA_LORDS[idx % 9]
    const years = i === 0 ? firstYears : lord.years
    const start = new Date(cursor)
    const end = new Date(cursor.getTime() + years * 365.25 * 86400000)
    periods.push({
      lordEn: lord.en,
      lordHi: lord.hi,
      start: formatDateISO(start),
      end: formatDateISO(end),
      isCurrent: false,
    })
    cursor = end
    idx++
  }

  const now = new Date()
  let current = periods[0]
  for (const p of periods) {
    const s = new Date(p.start).getTime()
    const e = new Date(p.end).getTime()
    if (now.getTime() >= s && now.getTime() < e) {
      p.isCurrent = true
      current = p
      break
    }
  }
  if (!periods.some((p) => p.isCurrent)) {
    periods[0].isCurrent = true
    current = periods[0]
  }

  const upcoming = periods.filter((p) => !p.isCurrent).slice(0, 3)
  return { current, upcoming }
}

export const REMEDIES_CATALOG: RemedyItem[] = [
  {
    id: 'mangal-mantra',
    titleEn: 'Mangal Beej Mantra',
    titleHi: 'मंगल बीज मंत्र',
    bodyEn: 'Chant “Om Kraum Bhaumaya Namah” 108 times on Tuesdays for 21 weeks.',
    bodyHi: 'मंगलवार को २१ सप्ताह तक “ॐ क्रौं भौमाय नमः” का १०८ जाप करें।',
    category: 'mantra',
  },
  {
    id: 'mangal-daan',
    titleEn: 'Mars Charity',
    titleHi: 'मंगल दान',
    bodyEn: 'Donate red lentils, jaggery, or copper on Tuesday morning.',
    bodyHi: 'मंगलवार प्रातः लाल मसूर, गुड़ या ताँबा दान करें।',
    category: 'daan',
  },
  {
    id: 'shani-mantra',
    titleEn: 'Shani Mantra',
    titleHi: 'शनि मंत्र',
    bodyEn: 'Recite “Om Sham Shanicharaya Namah” 108 times on Saturdays.',
    bodyHi: 'शनिवार को “ॐ शं शनैश्चराय नमः” का १०८ जाप करें।',
    category: 'mantra',
  },
  {
    id: 'shani-oil',
    titleEn: 'Sesame Oil Lamp',
    titleHi: 'तिल तेल दीप',
    bodyEn: 'Light a sesame-oil lamp under a Peepal tree on Saturday evening.',
    bodyHi: 'शनिवार सायंकाल पीपल के नीचे तिल तेल का दीप जलाएँ।',
    category: 'ritual',
  },
  {
    id: 'rahu-ketu',
    titleEn: 'Rahu–Ketu Pacification',
    titleHi: 'राहु–केतु शांति',
    bodyEn: 'Offer mustard oil and blue cloth on Saturday; visit a Navagraha temple.',
    bodyHi: 'शनिवार को सरसों तेल व नीला वस्त्र अर्पित करें; नवग्रह मंदिर जाएँ।',
    category: 'ritual',
  },
  {
    id: 'kaalsarp-puja',
    titleEn: 'Kaal Sarp Awareness Ritual',
    titleHi: 'कालसर्प शांति अनुष्ठान',
    bodyEn: 'Perform Rudrabhishek or Kaal Sarp shanti under guidance of a trusted pandit.',
    bodyHi: 'विश्वसनीय पंडित की देखरेख में रुद्राभिषेक या कालसर्प शांति करवाएँ।',
    category: 'ritual',
  },
  {
    id: 'general-lifestyle',
    titleEn: 'Daily Discipline',
    titleHi: 'दैनिक अनुशासन',
    bodyEn: 'Wake before sunrise, keep a gratitude journal, and avoid harsh speech on weak-planet days.',
    bodyHi: 'सूर्योदय से पहले उठें, कृतज्ञता डायरी रखें, कमजोर ग्रह वाले दिन कटु वचन से बचें।',
    category: 'lifestyle',
  },
  {
    id: 'yellow-sapphire',
    titleEn: 'Yellow Sapphire Guidance',
    titleHi: 'पुखराज परामर्श',
    bodyEn: 'If Jupiter is weak, consult a gemologist before wearing Pukhraj in gold on the index finger.',
    bodyHi: 'गुरु कमजोर हो तो पुखराज सोने में तर्जनी में पहनने से पहले रत्न विशेषज्ञ से सलाह लें।',
    category: 'gemstone',
  },
]

function detectDoshas(planets: PlanetPosition[], houses: number[]): DoshaFlag[] {
  const flags: DoshaFlag[] = []
  const byId = Object.fromEntries(planets.map((p) => [p.id, p]))

  const mars = byId.mars
  const mangalHouses = [1, 2, 4, 7, 8, 12]
  if (mars && mangalHouses.includes(mars.house)) {
    flags.push({
      id: 'mangal',
      nameEn: 'Mangal Dosha',
      nameHi: 'मंगल दोष',
      severity: mars.house === 7 || mars.house === 8 ? 'high' : 'medium',
      summaryEn: `Mars is in house ${mars.house} (${mars.signEn}), which can indicate Manglik influence for marriage timing and temperament.`,
      summaryHi: `मंगल ${mars.house} भाव (${mars.signHi}) में है — विवाह समय व स्वभाव हेतु मंगलिक प्रभाव संभव।`,
      remedyIds: ['mangal-mantra', 'mangal-daan'],
    })
  }

  const saturn = byId.saturn
  if (saturn && (saturn.house === 1 || saturn.house === 7 || saturn.house === 8 || saturn.house === 10)) {
    flags.push({
      id: 'shani',
      nameEn: 'Saturn Pressure',
      nameHi: 'शनि प्रभाव',
      severity: saturn.house === 8 ? 'high' : 'medium',
      summaryEn: `Saturn in house ${saturn.house} asks for patience, discipline, and long-term planning.`,
      summaryHi: `शनि ${saturn.house} भाव में धैर्य, अनुशासन और दीर्घकालीन योजना मांगता है।`,
      remedyIds: ['shani-mantra', 'shani-oil'],
    })
  }

  const rahu = byId.rahu
  const ketu = byId.ketu
  if (rahu && ketu) {
    const axisTight =
      Math.abs(((rahu.signIndex - ketu.signIndex + 6) % 12) - 6) === 0 ||
      (rahu.signIndex + 6) % 12 === ketu.signIndex
    if (axisTight) {
      // Simplified Kaal Sarp: all planets between Rahu and Ketu arc
      const rahuLon = rahu.longitude
      const others = planets.filter((p) => p.id !== 'rahu' && p.id !== 'ketu')
      const allOneSide = others.every((p) => {
        const d = norm360(p.longitude - rahuLon)
        return d > 0 && d < 180
      }) || others.every((p) => {
        const d = norm360(p.longitude - rahuLon)
        return d > 180 && d < 360
      })
      if (allOneSide) {
        flags.push({
          id: 'kaalsarp',
          nameEn: 'Kaal Sarp Pattern',
          nameHi: 'कालसर्प योग संकेत',
          severity: 'medium',
          summaryEn: 'Planets appear clustered between Rahu and Ketu — a Kaal Sarp-like pattern. Balance and spiritual practice help.',
          summaryHi: 'ग्रह राहु–केतु के बीच संकेतित हैं — कालसर्प जैसा योग। संतुलन व साधना सहायक।',
          remedyIds: ['kaalsarp-puja', 'rahu-ketu'],
        })
      }
    }
  }

  const jupiter = byId.jupiter
  if (jupiter && (jupiter.house === 6 || jupiter.house === 8 || jupiter.house === 12)) {
    flags.push({
      id: 'guru-weak',
      nameEn: 'Jupiter Dusthana',
      nameHi: 'गुरु दुस्थान',
      severity: 'low',
      summaryEn: 'Jupiter in a dusthana house may slow wisdom/fortune expression — strengthen Guru with mantra and learning.',
      summaryHi: 'गुरु दुस्थान में ज्ञान/भाग्य की अभिव्यक्ति धीमी हो सकती है — मंत्र व अध्ययन से बल दें।',
      remedyIds: ['yellow-sapphire', 'general-lifestyle'],
    })
  }

  if (flags.length === 0) {
    flags.push({
      id: 'general',
      nameEn: 'General Balance',
      nameHi: 'सामान्य संतुलन',
      severity: 'low',
      summaryEn: 'No major classic dosha flagged. Optional lifestyle remedies still support clarity and calm.',
      summaryHi: 'कोई बड़ा शास्त्रीय दोष नहीं। वैकल्पिक जीवनशैली उपाय फिर भी शांति हेतु उपयोगी।',
      remedyIds: ['general-lifestyle'],
    })
  }

  // touch houses to avoid unused lint if tree-shaken oddly
  void houses
  return flags
}

function buildSummary(
  details: BirthDetails,
  lagnaEn: string,
  lagnaHi: string,
  moonEn: string,
  moonHi: string,
  current: DashaPeriod,
): { en: string; hi: string } {
  return {
    en: `${details.name}'s Lagna is ${lagnaEn} with Moon in ${moonEn}. Current Mahadasha is ${current.lordEn} (${current.start} → ${current.end}). This chart uses Lahiri ayanamsa and whole-sign houses.`,
    hi: `${details.name} की लग्न ${lagnaHi} है तथा चन्द्र ${moonHi} में है। वर्तमान महादशा ${current.lordHi} (${current.start} → ${current.end}) है। यह कुंडली लाहिरी अयनांश व पूर्ण राशि भाव पद्धति पर आधारित है।`,
  }
}

export function generateKundali(details: BirthDetails): KundaliChart {
  const utc = birthToUtc(details)
  const jd = julianDay(utc)
  const ayanamsa = lahiriAyanamsa(jd)

  const lagnaTrop = tropicalAscendant(utc, details.latitude, details.longitude)
  const lagnaSid = norm360(lagnaTrop - ayanamsa)
  const lagnaSign = signIndex(lagnaSid)
  const houses = wholeSignHouses(lagnaSign)

  const rahuTrop = meanRahuTropical(jd)
  const rahuSid = norm360(rahuTrop - ayanamsa)
  const ketuSid = norm360(rahuSid + 180)

  const planets: PlanetPosition[] = PLANETS.map((p) => {
    let sid: number
    let retro = false
    if (p.id === 'rahu') {
      sid = rahuSid
    } else if (p.id === 'ketu') {
      sid = ketuSid
    } else {
      const body = Astronomy.Body[p.body as keyof typeof Astronomy.Body] as Astronomy.Body
      const trop = tropicalLongitude(body, utc)
      sid = norm360(trop - ayanamsa)
      retro = isRetrograde(body, utc)
    }

    const sIdx = signIndex(sid)
    const nak = nakshatraFromLongitude(sid)
    return {
      id: p.id,
      nameEn: p.nameEn,
      nameHi: p.nameHi,
      longitude: sid,
      signIndex: sIdx,
      signEn: SIGNS_EN[sIdx],
      signHi: SIGNS_HI[sIdx],
      degreeInSign: degreeInSign(sid),
      nakshatraIndex: nak.index,
      nakshatraEn: NAKSHATRAS_EN[nak.index],
      nakshatraHi: NAKSHATRAS_HI[nak.index],
      pada: nak.pada,
      house: houseOfPlanet(sIdx, houses),
      isRetrograde: retro,
    }
  })

  const moon = planets.find((p) => p.id === 'moon')!
  const sun = planets.find((p) => p.id === 'sun')!
  const dashas = computeDashas(moon.longitude, utc)
  const doshas = detectDoshas(planets, houses)
  const summary = buildSummary(
    details,
    SIGNS_EN[lagnaSign],
    SIGNS_HI[lagnaSign],
    moon.signEn,
    moon.signHi,
    dashas.current,
  )

  return {
    generatedAt: new Date().toISOString(),
    lagnaSignIndex: lagnaSign,
    lagnaEn: SIGNS_EN[lagnaSign],
    lagnaHi: SIGNS_HI[lagnaSign],
    lagnaLongitude: lagnaSid,
    moonSignIndex: moon.signIndex,
    moonSignEn: moon.signEn,
    moonSignHi: moon.signHi,
    sunSignIndex: sun.signIndex,
    sunSignEn: sun.signEn,
    sunSignHi: sun.signHi,
    ayanamsa,
    planets,
    houses,
    currentDasha: dashas.current,
    upcomingDashas: dashas.upcoming,
    doshas,
    summaryEn: summary.en,
    summaryHi: summary.hi,
  }
}

export function remediesForChart(chart: KundaliChart): RemedyItem[] {
  const ids = new Set(chart.doshas.flatMap((d) => d.remedyIds))
  return REMEDIES_CATALOG.filter((r) => ids.has(r.id))
}
