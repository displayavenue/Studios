import { generateKundali } from './generate'
import { NAKSHATRAS_EN, NAKSHATRAS_HI, SIGNS_EN, SIGNS_HI } from './constants'
import type { BirthDetails, KundaliChart } from './types'

/** Ashtakoot (36-point) Gun Milan + manglik compare */

export interface KootScore {
  id: string
  nameEn: string
  nameHi: string
  max: number
  score: number
  noteEn: string
  noteHi: string
}

export interface MilanResult {
  generatedAt: string
  boy: { name: string; moonSignEn: string; moonSignHi: string; nakshatraEn: string; nakshatraHi: string; manglik: boolean }
  girl: { name: string; moonSignEn: string; moonSignHi: string; nakshatraEn: string; nakshatraHi: string; manglik: boolean }
  koots: KootScore[]
  total: number
  maxTotal: number
  verdictEn: string
  verdictHi: string
  manglikNoteEn: string
  manglikNoteHi: string
  summaryBulletsEn: string[]
  summaryBulletsHi: string[]
  boyChart: KundaliChart
  girlChart: KundaliChart
}

const SIGN_VARNA = [1, 2, 3, 0, 1, 2, 3, 0, 1, 2, 3, 0]

const VASHYA: Record<number, number[]> = {
  0: [0, 1, 2], // Aries controls Aries, Taurus, Gemini (simplified classical groups)
  1: [1, 5],
  2: [2, 5],
  3: [3, 9],
  4: [4, 0],
  5: [5, 2, 11],
  6: [6, 7],
  7: [7, 4],
  8: [8, 11],
  9: [9, 3],
  10: [10, 6],
  11: [11, 8],
}

// Yoni animal per nakshatra (0-26)
const YONI = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
// Enemy yoni pairs (same animal enemy)
const YONI_ENEMY: [number, number][] = [
  [0, 4],
  [1, 8],
  [2, 9],
  [3, 7],
  [5, 11],
  [6, 10],
  [12, 13],
]

const GANA = [
  0, 1, 2, 1, 0, 1, 0, 0, 2, 2, 1, 1, 0, 2, 0, 2, 0, 2, 2, 1, 1, 0, 2, 2, 1, 1, 0,
] // 0 Deva, 1 Manushya, 2 Rakshasa

const NADI = [
  0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2,
] // 0 Adi, 1 Madhya, 2 Antya

const LORD = [2, 5, 3, 1, 0, 3, 5, 2, 4, 6, 6, 4] // Mars Venus Mercury Moon Sun Mercury Venus Mars Jupiter Saturn Saturn Jupiter
// Friendship matrix simplified: 2 friend, 1 neutral, 0 enemy
function lordFriend(a: number, b: number): number {
  if (a === b) return 2
  const friends: Record<number, number[]> = {
    0: [1, 2], // Sun: Moon Mars
    1: [0, 3], // Moon: Sun Mercury
    2: [0, 4, 6], // Mars
    3: [0, 1, 5], // Mercury
    4: [0, 2, 5], // Jupiter
    5: [3, 6], // Venus
    6: [2, 4], // Saturn
  }
  if ((friends[a] || []).includes(b)) return 2
  const enemies: Record<number, number[]> = {
    0: [5, 6],
    1: [],
    2: [3],
    3: [2],
    4: [3, 5],
    5: [0, 2],
    6: [0, 1],
  }
  if ((enemies[a] || []).includes(b)) return 0
  return 1
}

function moonMeta(chart: KundaliChart) {
  const moon = chart.planets.find((p) => p.id === 'moon')
  return {
    sign: chart.moonSignIndex,
    nak: moon?.nakshatraIndex ?? 0,
  }
}

function isManglik(chart: KundaliChart): boolean {
  return chart.doshas.some((d) => d.id === 'mangal')
}

function scoreVarna(boySign: number, girlSign: number): KootScore {
  const br = SIGN_VARNA[boySign]
  const gr = SIGN_VARNA[girlSign]
  // Boy varna >= girl varna → full point (Brahmin highest rank)
  const boyRank = [3, 2, 1, 0][br]
  const girlRank = [3, 2, 1, 0][gr]
  const score = boyRank >= girlRank ? 1 : 0
  return {
    id: 'varna',
    nameEn: 'Varna',
    nameHi: 'वर्ण',
    max: 1,
    score,
    noteEn: score === 1 ? 'Varna compatible.' : 'Girl’s varna is higher—note for elders.',
    noteHi: score === 1 ? 'वर्ण अनुकूल।' : 'कन्या का वर्ण ऊँचा—परिवार से चर्चा करें।',
  }
}

function scoreVashya(boySign: number, girlSign: number): KootScore {
  const list = VASHYA[boySign] || []
  let score = 0
  if (boySign === girlSign) score = 2
  else if (list.includes(girlSign)) score = 1
  return {
    id: 'vashya',
    nameEn: 'Vashya',
    nameHi: 'वश्य',
    max: 2,
    score,
    noteEn: score >= 1 ? 'Mutual influence looks workable.' : 'Low natural pull—extra care in habits.',
    noteHi: score >= 1 ? 'परस्पर प्रभाव ठीक।' : 'स्वाभाविक आकर्षण कम—आदतों में सावधानी।',
  }
}

function scoreTara(boyNak: number, girlNak: number): KootScore {
  const diff = ((girlNak - boyNak + 27) % 27) + 1
  const group = ((diff - 1) % 9) + 1
  // Favourable: 1,2,4,6,8,9 ; unfavourable 3,5,7
  const final = [3, 5, 7].includes(group) ? 0 : group === 4 || group === 6 || group === 8 || group === 9 ? 3 : group === 1 || group === 2 ? 1.5 : 3
  return {
    id: 'tara',
    nameEn: 'Tara',
    nameHi: 'तारा',
    max: 3,
    score: final,
    noteEn: final >= 1.5 ? 'Birth-star count is acceptable.' : 'Tara is sensitive—timing matters.',
    noteHi: final >= 1.5 ? 'जन्म नक्षत्र गणना ठीक।' : 'तारा संवेदनशील—समय का ध्यान।',
  }
}

function scoreYoni(boyNak: number, girlNak: number): KootScore {
  const a = YONI[boyNak]
  const b = YONI[girlNak]
  let score = 4
  if (a === b) score = 4
  else if (YONI_ENEMY.some(([x, y]) => (x === a && y === b) || (x === b && y === a))) score = 0
  else score = 2
  return {
    id: 'yoni',
    nameEn: 'Yoni',
    nameHi: 'योनि',
    max: 4,
    score,
    noteEn: score >= 2 ? 'Physical/temperament yoni is fine.' : 'Yoni clash—patience and counselling help.',
    noteHi: score >= 2 ? 'योनि अनुकूल।' : 'योनि विरोध—धैर्य व संवाद सहायक।',
  }
}

function scoreMaitri(boySign: number, girlSign: number): KootScore {
  const f = lordFriend(LORD[boySign], LORD[girlSign])
  const score = f === 2 ? 5 : f === 1 ? 3 : 0
  return {
    id: 'maitri',
    nameEn: 'Graha Maitri',
    nameHi: 'ग्रह मैत्री',
    max: 5,
    score,
    noteEn: score >= 3 ? 'Moon-lord friendship supports mental rapport.' : 'Mental rapport needs conscious effort.',
    noteHi: score >= 3 ? 'चन्द्रेश मैत्री मानसिक तालमेल देती है।' : 'मानसिक तालमेल हेतु सजग प्रयास।',
  }
}

function scoreGana(boyNak: number, girlNak: number): KootScore {
  const a = GANA[boyNak]
  const b = GANA[girlNak]
  let score = 6
  if (a === b) score = 6
  else if ((a === 0 && b === 1) || (a === 1 && b === 0)) score = 5
  else if ((a === 1 && b === 2) || (a === 2 && b === 1)) score = 1
  else score = 0 // Deva-Rakshasa
  return {
    id: 'gana',
    nameEn: 'Gana',
    nameHi: 'गण',
    max: 6,
    score,
    noteEn: score >= 5 ? 'Temperament gana aligns well.' : score >= 1 ? 'Mixed gana—adjust expectations.' : 'Gana mismatch—family talk advised.',
    noteHi: score >= 5 ? 'गण स्वभाव मेल।' : score >= 1 ? 'मिश्रित गण—अपेक्षाएँ समायोजित करें।' : 'गण असमान—परिवार से चर्चा।',
  }
}

function scoreBhakoot(boySign: number, girlSign: number): KootScore {
  const diff = ((girlSign - boySign + 12) % 12) + 1
  // 2/12, 5/9, 6/8 considered dosha
  const bad = [2, 5, 6, 8, 9, 12].includes(diff)
  const score = bad ? 0 : 7
  return {
    id: 'bhakoot',
    nameEn: 'Bhakoot',
    nameHi: 'भकूट',
    max: 7,
    score,
    noteEn: score === 7 ? 'Bhakoot is clear.' : `Bhakoot dosha (sign distance ${diff})—weigh with other koots.`,
    noteHi: score === 7 ? 'भकूट स्पष्ट।' : `भकूट दोष (राशि अंतर ${diff})—अन्य कूटों संग देखें।`,
  }
}

function scoreNadi(boyNak: number, girlNak: number): KootScore {
  const same = NADI[boyNak] === NADI[girlNak]
  const score = same ? 0 : 8
  return {
    id: 'nadi',
    nameEn: 'Nadi',
    nameHi: 'नाड़ी',
    max: 8,
    score,
    noteEn: same ? 'Same Nadi—classic caution for health/progeny themes; elders often seek cancellation rules.' : 'Nadi is different—favourable.',
    noteHi: same ? 'समान नाड़ी—स्वास्थ्य/संतान हेतु क्लासिक सावधानी; निरसन नियम देखें।' : 'नाड़ी भिन्न—अनुकूल।',
  }
}

function verdict(total: number): { en: string; hi: string } {
  if (total >= 28)
    return { en: 'Excellent match on Ashtakoot points—strong foundation when families agree.', hi: 'अष्टकूट अंक उत्कृष्ट—परिवार सहमति पर मजबूत आधार।' }
  if (total >= 24)
    return { en: 'Very good match. Minor differences can be handled with care.', hi: 'बहुत अच्छा मिलान। छोटे अंतर सावधानी से निपटे जा सकते हैं।' }
  if (total >= 18)
    return { en: 'Acceptable match. Discuss sensitive koots (Nadi/Bhakoot/Manglik) with elders.', hi: 'स्वीकार्य मिलान। संवेदनशील कूट (नाड़ी/भकूट/मंगलिक) परिवार से चर्चा करें।' }
  if (total >= 12)
    return { en: 'Below average. Proceed only with clear family counselling and other factors.', hi: 'औसत से कम। केवल स्पष्ट पारिवारिक सलाह व अन्य कारकों संग आगे बढ़ें।' }
  return { en: 'Low Ashtakoot score. Many families reconsider; do not decide from points alone.', hi: 'अष्टकूट अंक कम। कई परिवार पुनर्विचार करते हैं; केवल अंकों से निर्णय न लें।' }
}

export function computeMilan(boyDetails: BirthDetails, girlDetails: BirthDetails): MilanResult {
  const boyChart = generateKundali({ ...boyDetails, gender: 'male' })
  const girlChart = generateKundali({ ...girlDetails, gender: 'female' })
  const b = moonMeta(boyChart)
  const g = moonMeta(girlChart)

  const koots = [
    scoreVarna(b.sign, g.sign),
    scoreVashya(b.sign, g.sign),
    scoreTara(b.nak, g.nak),
    scoreYoni(b.nak, g.nak),
    scoreMaitri(b.sign, g.sign),
    scoreGana(b.nak, g.nak),
    scoreBhakoot(b.sign, g.sign),
    scoreNadi(b.nak, g.nak),
  ]

  const total = koots.reduce((s, k) => s + k.score, 0)
  const maxTotal = 36
  const v = verdict(total)
  const boyMang = isManglik(boyChart)
  const girlMang = isManglik(girlChart)

  let manglikNoteEn = 'Neither chart shows classic Manglik flag in this scan.'
  let manglikNoteHi = 'इस जाँच में किसी कुंडली में क्लासिक मंगलिक संकेत नहीं।'
  if (boyMang && girlMang) {
    manglikNoteEn = 'Both show Manglik flags—often treated as mutual cancellation in folk practice; confirm with a pandit for your parampara.'
    manglikNoteHi = 'दोनों में मंगलिक संकेत—लोक प्रथा में परस्पर निरसन माना जाता है; अपनी परंपरा से पुष्टि करें।'
  } else if (boyMang || girlMang) {
    manglikNoteEn = `${boyMang ? 'Boy' : 'Girl'} shows Manglik flag; the other does not—discuss remedies / matching rules with family.`
    manglikNoteHi = `${boyMang ? 'वर' : 'वधू'} में मंगलिक संकेत; दूसरे में नहीं—परिवार से उपाय/नियम चर्चा करें।`
  }

  const boyMoon = boyChart.planets.find((p) => p.id === 'moon')
  const girlMoon = girlChart.planets.find((p) => p.id === 'moon')

  return {
    generatedAt: new Date().toISOString(),
    boy: {
      name: boyDetails.name,
      moonSignEn: SIGNS_EN[b.sign],
      moonSignHi: SIGNS_HI[b.sign],
      nakshatraEn: NAKSHATRAS_EN[b.nak],
      nakshatraHi: NAKSHATRAS_HI[b.nak],
      manglik: boyMang,
    },
    girl: {
      name: girlDetails.name,
      moonSignEn: SIGNS_EN[g.sign],
      moonSignHi: SIGNS_HI[g.sign],
      nakshatraEn: NAKSHATRAS_EN[g.nak],
      nakshatraHi: NAKSHATRAS_HI[g.nak],
      manglik: girlMang,
    },
    koots,
    total,
    maxTotal,
    verdictEn: v.en,
    verdictHi: v.hi,
    manglikNoteEn,
    manglikNoteHi,
    summaryBulletsEn: [
      `Total Gunas: ${total} / ${maxTotal}`,
      `Boy Moon: ${SIGNS_EN[b.sign]} · ${NAKSHATRAS_EN[b.nak]} pada ${boyMoon?.pada ?? '—'}`,
      `Girl Moon: ${SIGNS_EN[g.sign]} · ${NAKSHATRAS_EN[g.nak]} pada ${girlMoon?.pada ?? '—'}`,
      manglikNoteEn,
      'Ashtakoot is one traditional filter—not the only factor for marriage.',
    ],
    summaryBulletsHi: [
      `कुल गुण: ${total} / ${maxTotal}`,
      `वर चन्द्र: ${SIGNS_HI[b.sign]} · ${NAKSHATRAS_HI[b.nak]} पद ${boyMoon?.pada ?? '—'}`,
      `वधू चन्द्र: ${SIGNS_HI[g.sign]} · ${NAKSHATRAS_HI[g.nak]} पद ${girlMoon?.pada ?? '—'}`,
      manglikNoteHi,
      'अष्टकूट एक पारंपरिक मापदंड है—विवाह का एकमात्र आधार नहीं।',
    ],
    boyChart,
    girlChart,
  }
}
