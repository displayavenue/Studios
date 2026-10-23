import { SIGNS_EN, SIGNS_HI, norm360, signIndex } from './constants'
import type { KundaliChart, Language, PlanetPosition } from './types'

export interface HouseReading {
  house: number
  signIndex: number
  signEn: string
  signHi: string
  lordEn: string
  lordHi: string
  planetsEn: string
  planetsHi: string
  titleEn: string
  titleHi: string
  bodyEn: string
  bodyHi: string
}

export interface YogaHit {
  id: string
  nameEn: string
  nameHi: string
  bodyEn: string
  bodyHi: string
}

export interface VargaChart {
  nameEn: string
  nameHi: string
  lagnaSignIndex: number
  lagnaEn: string
  lagnaHi: string
  planets: { id: string; nameEn: string; nameHi: string; signEn: string; signHi: string; signIndex: number }[]
}

export interface ReportChapter {
  id: string
  titleEn: string
  titleHi: string
  bodyEn: string
  bodyHi: string
}

export interface CompleteReport {
  methodEn: string
  methodHi: string
  howToReadEn: string
  howToReadHi: string
  snapshotBulletsEn: string[]
  snapshotBulletsHi: string[]
  houses: HouseReading[]
  personality: ReportChapter
  mind: ReportChapter
  career: ReportChapter
  marriage: ReportChapter
  family: ReportChapter
  health: ReportChapter
  education: ReportChapter
  foreign: ReportChapter
  dashaAdvice: ReportChapter
  yearAhead: ReportChapter
  summaryBulletsEn: string[]
  summaryBulletsHi: string[]
  yogas: YogaHit[]
  aspectsEn: string[]
  aspectsHi: string[]
  navamsa: VargaChart
  dasamsha: VargaChart
  doDontEn: { do: string[]; dont: string[] }
  doDontHi: { do: string[]; dont: string[] }
}

const HOUSE_META = [
  { en: 'Self & body (1st)', hi: 'तनु भाव (१)', themeEn: 'identity, vitality, appearance', themeHi: 'व्यक्तित्व, ऊर्जा, स्वरूप' },
  { en: 'Wealth & speech (2nd)', hi: 'धन भाव (२)', themeEn: 'family resources, speech, values', themeHi: 'परिवार, वाणी, मूल्य' },
  { en: 'Courage & skills (3rd)', hi: 'सहज भाव (३)', themeEn: 'effort, siblings, short travel', themeHi: 'साहस, सहोदर, कौशल' },
  { en: 'Home & peace (4th)', hi: 'सुख भाव (४)', themeEn: 'mother, property, inner peace', themeHi: 'माता, संपत्ति, मानसिक शांति' },
  { en: 'Intelligence & children (5th)', hi: 'पुत्र भाव (५)', themeEn: 'creativity, romance, mantra, progeny', themeHi: 'बुद्धि, संतान, रचनात्मकता' },
  { en: 'Service & challenges (6th)', hi: 'रिपु भाव (६)', themeEn: 'work, health routines, competition', themeHi: 'सेवा, स्वास्थ्य, प्रतिस्पर्धा' },
  { en: 'Partnership (7th)', hi: 'कलत्र भाव (७)', themeEn: 'marriage, business partners, public dealings', themeHi: 'विवाह, साझेदारी, लोक व्यवहार' },
  { en: 'Transformation (8th)', hi: 'आयु भाव (८)', themeEn: 'shared resources, research, sudden change', themeHi: 'सह-संसाधन, शोध, अचानक परिवर्तन' },
  { en: 'Dharma & fortune (9th)', hi: 'धर्म भाव (९)', themeEn: 'luck, father, higher learning, travel', themeHi: 'भाग्य, पिता, उच्च शिक्षा, यात्रा' },
  { en: 'Career & status (10th)', hi: 'कर्म भाव (१०)', themeEn: 'profession, reputation, authority', themeHi: 'पेशा, प्रतिष्ठा, अधिकार' },
  { en: 'Gains & network (11th)', hi: 'लाभ भाव (११)', themeEn: 'income, friends, aspirations', themeHi: 'आय, मित्र, इच्छाएँ' },
  { en: 'Expenses & retreat (12th)', hi: 'व्यय भाव (१२)', themeEn: 'losses, foreign lands, solitude, moksha', themeHi: 'व्यय, विदेश, एकांत, मोक्ष' },
] as const

const SIGN_LORDS = [
  { en: 'Mars', hi: 'मंगल' },
  { en: 'Venus', hi: 'शुक्र' },
  { en: 'Mercury', hi: 'बुध' },
  { en: 'Moon', hi: 'चन्द्र' },
  { en: 'Sun', hi: 'सूर्य' },
  { en: 'Mercury', hi: 'बुध' },
  { en: 'Venus', hi: 'शुक्र' },
  { en: 'Mars', hi: 'मंगल' },
  { en: 'Jupiter', hi: 'गुरु' },
  { en: 'Saturn', hi: 'शनि' },
  { en: 'Saturn', hi: 'शनि' },
  { en: 'Jupiter', hi: 'गुरु' },
] as const

const LAGNA_TRAITS = [
  { en: 'pioneering, direct, energetic', hi: 'अग्रणी, सीधे, ऊर्जावान' },
  { en: 'steady, comfort-loving, artistic', hi: 'स्थिर, सुखप्रिय, कलात्मक' },
  { en: 'curious, communicative, adaptable', hi: 'जिज्ञासु, संवादी, अनुकूलनीय' },
  { en: 'nurturing, sensitive, protective', hi: 'पोषणकारी, संवेदनशील, सुरक्षात्मक' },
  { en: 'confident, expressive, leadership-oriented', hi: 'आत्मविश्वासी, अभिव्यक्त, नेतृत्व' },
  { en: 'analytical, service-minded, precise', hi: 'विश्लेषिक, सेवाभावी, सटीक' },
  { en: 'balanced, relationship-focused, aesthetic', hi: 'संतुलित, संबंध-केंद्रित, सौंदर्यप्रिय' },
  { en: 'intense, determined, transformative', hi: 'गंभीर, दृढ़, परिवर्तनकारी' },
  { en: 'optimistic, expansive, philosophical', hi: 'आशावादी, विस्तारशील, दार्शनिक' },
  { en: 'ambitious, disciplined, practical', hi: 'महत्वाकांक्षी, अनुशासित, व्यावहारिक' },
  { en: 'independent, innovative, humanitarian', hi: 'स्वतंत्र, नवोन्मेषी, मानवतावादी' },
  { en: 'imaginative, compassionate, intuitive', hi: 'कल्पनाशील, करुणामय, सहजज्ञ' },
]

function planetsInHouse(planets: PlanetPosition[], house: number): PlanetPosition[] {
  return planets.filter((p) => p.house === house)
}

function vargaSign(longitude: number, divisor: number): number {
  // Standard harmonic: floor(lon * D / 30) % 12 for many vargas; D9/D10 use classical mapping
  void divisor
  return signIndex(longitude)
}

/** Navamsa (D9): each sign divided into 9 parts of 3°20' */
export function navamsaSign(longitude: number): number {
  const lon = norm360(longitude)
  const sign = Math.floor(lon / 30)
  const deg = lon % 30
  const part = Math.floor(deg / (30 / 9))
  const movable = sign % 3 === 0
  const fixed = sign % 3 === 1
  let start: number
  if (movable) start = sign
  else if (fixed) start = (sign + 8) % 12
  else start = (sign + 4) % 12
  return (start + part) % 12
}

/** Dasamsha (D10): each sign into 10 parts of 3° */
export function dasamshaSign(longitude: number): number {
  const lon = norm360(longitude)
  const sign = Math.floor(lon / 30)
  const deg = lon % 30
  const part = Math.floor(deg / 3)
  const odd = sign % 2 === 0
  const start = odd ? sign : (sign + 8) % 12
  return (start + part) % 12
}

function buildVarga(
  nameEn: string,
  nameHi: string,
  planets: PlanetPosition[],
  lagnaLon: number,
  mapper: (lon: number) => number,
): VargaChart {
  const lagnaSignIndex = mapper(lagnaLon)
  return {
    nameEn,
    nameHi,
    lagnaSignIndex,
    lagnaEn: SIGNS_EN[lagnaSignIndex],
    lagnaHi: SIGNS_HI[lagnaSignIndex],
    planets: planets.map((p) => {
        const s = mapper(p.longitude)
        return {
          id: p.id,
          nameEn: p.nameEn,
          nameHi: p.nameHi,
          signIndex: s,
          signEn: SIGNS_EN[s],
          signHi: SIGNS_HI[s],
        }
      }),
  }
}

function detectYogas(planets: PlanetPosition[], lagnaSign: number): YogaHit[] {
  const byId = Object.fromEntries(planets.map((p) => [p.id, p]))
  const hits: YogaHit[] = []
  const moon = byId.moon
  const jupiter = byId.jupiter
  const sun = byId.sun
  const mercury = byId.mercury
  const venus = byId.venus
  const mars = byId.mars
  const saturn = byId.saturn

  if (moon && jupiter) {
    const diff = Math.abs(moon.signIndex - jupiter.signIndex)
    const aspect = diff === 0 || diff === 6 || diff === 3 || diff === 9
    if (aspect) {
      hits.push({
        id: 'gajakesari',
        nameEn: 'Gajakesari Yoga (indicative)',
        nameHi: 'गजकेसरी योग (संकेत)',
        bodyEn: 'Moon–Jupiter relationship suggests dignity, wisdom, and social respect when well-supported.',
        bodyHi: 'चन्द्र–गुरु संबंध सम्मान, बुद्धि व सामाजिक प्रतिष्ठा का संकेत दे सकता है।',
      })
    }
  }

  if (sun && mercury && Math.abs(sun.longitude - mercury.longitude) < 12) {
    hits.push({
      id: 'budhaditya',
      nameEn: 'Budhaditya Yoga (close Sun–Mercury)',
      nameHi: 'बुधादित्य योग',
      bodyEn: 'Sun–Mercury proximity supports intellect, communication, and analytical skills.',
      bodyHi: 'सूर्य–बुध निकटता बुद्धि, संचार व विश्लेषण क्षमता को बल दे सकती है।',
    })
  }

  const kendra = [1, 4, 7, 10]
  const trikona = [1, 5, 9]
  if (jupiter && kendra.includes(jupiter.house) && trikona.includes(jupiter.house) === false) {
    hits.push({
      id: 'guru-kendra',
      nameEn: 'Jupiter in Kendra',
      nameHi: 'गुरु केन्द्र में',
      bodyEn: 'Jupiter in an angular house often supports growth, guidance, and opportunity through mentors.',
      bodyHi: 'केन्द्र में गुरु प्रायः विकास, मार्गदर्शन व अवसरों का संकेत देता है।',
    })
  }

  if (venus && (venus.house === 1 || venus.house === 4 || venus.house === 7 || venus.house === 10)) {
    hits.push({
      id: 'malavya-like',
      nameEn: 'Venus angular emphasis',
      nameHi: 'शुक्र केन्द्र बल',
      bodyEn: 'Strong Venus placement supports harmony, arts, comforts, and relationship grace.',
      bodyHi: 'बलवान शुक्र सामंजस्य, कला, सुख व संबंधों में सौम्यता दे सकता है।',
    })
  }

  if (mars && kendra.includes(mars.house)) {
    hits.push({
      id: 'ruchaka-like',
      nameEn: 'Mars angular drive',
      nameHi: 'मंगल केन्द्र ऊर्जा',
      bodyEn: 'Mars in kendra can give courage, competitive drive, and capacity to push through obstacles.',
      bodyHi: 'केन्द्र में मंगल साहस, प्रतिस्पर्धा व बाधा पार करने की क्षमता दे सकता है।',
    })
  }

  if (saturn && (saturn.house === 3 || saturn.house === 6 || saturn.house === 11)) {
    hits.push({
      id: 'shani-upachaya',
      nameEn: 'Saturn in Upachaya',
      nameHi: 'शनि उपचय में',
      bodyEn: 'Saturn in 3/6/11 can mature into persistence, strategic effort, and delayed but solid gains.',
      bodyHi: '३/६/११ में शनि धैर्य, रणनीति व देर से किंतु ठोस लाभ का संकेत हो सकता है।',
    })
  }

  // Raja yoga lite: lords of kendra/trikona co-located — approximate via planet in both themes
  const fifth = planetsInHouse(planets, 5)
  const ninth = planetsInHouse(planets, 9)
  const tenth = planetsInHouse(planets, 10)
  if ((fifth.length && tenth.length) || (ninth.length && tenth.length)) {
    hits.push({
      id: 'raja-link',
      nameEn: 'Kendra–Trikona link (Raja yoga flavour)',
      nameHi: 'केन्द्र–त्रिकोण संबंध',
      bodyEn: 'Connection between fortune/creativity houses and career house can support recognition over time.',
      bodyHi: 'भाग्य/रचना व कर्म भावों का संबंध समय के साथ मान-प्रतिष्ठा का संकेत दे सकता है।',
    })
  }

  if (hits.length === 0) {
    hits.push({
      id: 'balanced',
      nameEn: 'Balanced planetary distribution',
      nameHi: 'संतुलित ग्रह विन्यास',
      bodyEn: 'No single dramatic classical yoga dominates. Steady effort and dasha timing matter more than rare combinations.',
      bodyHi: 'कोई एक नाटकीय शास्त्रीय योग प्रधान नहीं। स्थिर प्रयास व दशा समय अधिक महत्वपूर्ण।',
    })
  }

  void lagnaSign
  void sun
  return hits.slice(0, 12)
}

function aspectLines(planets: PlanetPosition[], lang: Language): string[] {
  const lines: string[] = []
  for (const p of planets) {
    if (p.id === 'ketu') continue
    const seventh = ((p.house + 6 - 1) % 12) + 1
    const targets = planets.filter((o) => o.id !== p.id && o.house === seventh)
    if (targets.length) {
      const names = targets.map((t) => (lang === 'hi' ? t.nameHi : t.nameEn)).join(', ')
      lines.push(
        lang === 'hi'
          ? `${p.nameHi} → सप्तम दृष्टि भाव ${seventh} (${names})`
          : `${p.nameEn} aspects house ${seventh} (7th): ${names}`,
      )
    }
    if (p.id === 'mars') {
      const h4 = ((p.house + 3 - 1) % 12) + 1
      const h8 = ((p.house + 7 - 1) % 12) + 1
      lines.push(lang === 'hi' ? `मंगल विशेष दृष्टि: भाव ${h4} व ${h8}` : `Mars special aspects: houses ${h4} & ${h8}`)
    }
    if (p.id === 'jupiter') {
      const h5 = ((p.house + 4 - 1) % 12) + 1
      const h9 = ((p.house + 8 - 1) % 12) + 1
      lines.push(lang === 'hi' ? `गुरु विशेष दृष्टि: भाव ${h5} व ${h9}` : `Jupiter special aspects: houses ${h5} & ${h9}`)
    }
    if (p.id === 'saturn') {
      const h3 = ((p.house + 2 - 1) % 12) + 1
      const h10 = ((p.house + 9 - 1) % 12) + 1
      lines.push(lang === 'hi' ? `शनि विशेष दृष्टि: भाव ${h3} व ${h10}` : `Saturn special aspects: houses ${h3} & ${h10}`)
    }
  }
  return lines.slice(0, 18)
}

function chapter(
  id: string,
  titleEn: string,
  titleHi: string,
  bodyEn: string,
  bodyHi: string,
): ReportChapter {
  return { id, titleEn, titleHi, bodyEn, bodyHi }
}

/** lagna sidereal longitude approximated from lagna sign mid if only sign known — use planet-derived */
export function buildCompleteReport(
  chart: KundaliChart,
  lagnaLongitude: number,
): CompleteReport {
  const planets = chart.planets
  const houses: HouseReading[] = chart.houses.map((signIdx, i) => {
    const house = i + 1
    const meta = HOUSE_META[i]
    const lord = SIGN_LORDS[signIdx]
    const plist = planetsInHouse(planets, house)
    const planetsEn = plist.length ? plist.map((p) => p.nameEn + (p.isRetrograde ? ' (R)' : '')).join(', ') : '—'
    const planetsHi = plist.length ? plist.map((p) => p.nameHi + (p.isRetrograde ? ' (व)' : '')).join(', ') : '—'
    const occEn = plist.length
      ? `Occupied by ${planetsEn}. These grahas colour how ${meta.themeEn} express in life.`
      : `No planet occupies this house; results flow mainly through the house lord (${lord.en}) and aspects.`
    const occHi = plist.length
      ? `यहाँ ${planetsHi} स्थित हैं—ये ${meta.themeHi} की अभिव्यक्ति को रंग देते हैं।`
      : `यह भाव रिक्त है; फल मुख्यतः भावेश (${lord.hi}) व दृष्टियों से आता है।`
    return {
      house,
      signIndex: signIdx,
      signEn: SIGNS_EN[signIdx],
      signHi: SIGNS_HI[signIdx],
      lordEn: lord.en,
      lordHi: lord.hi,
      planetsEn,
      planetsHi,
      titleEn: meta.en,
      titleHi: meta.hi,
      bodyEn: `House ${house} falls in ${SIGNS_EN[signIdx]} (lord: ${lord.en}), governing ${meta.themeEn}. ${occEn} Read this with the current Mahadasha of ${chart.currentDasha.lordEn} for timing.`,
      bodyHi: `भाव ${house} ${SIGNS_HI[signIdx]} में है (स्वामी: ${lord.hi})—${meta.themeHi}। ${occHi} समय हेतु वर्तमान महादशा ${chart.currentDasha.lordHi} से मिलाकर देखें।`,
    }
  })

  const trait = LAGNA_TRAITS[chart.lagnaSignIndex]
  const moon = planets.find((p) => p.id === 'moon')!
  const sun = planets.find((p) => p.id === 'sun')!
  const venus = planets.find((p) => p.id === 'venus')
  const jupiter = planets.find((p) => p.id === 'jupiter')
  const tenth = houses[9]
  const seventh = houses[6]
  const second = houses[1]
  const eleventh = houses[10]

  const personality = chapter(
    'personality',
    'Lagna & personality',
    'लग्न व व्यक्तित्व',
    `Your Lagna is ${chart.lagnaEn}, typically ${trait.en}. The Ascendant sets the lens for the whole chart. Lagna lord ${SIGN_LORDS[chart.lagnaSignIndex].en} and planets in the 1st house refine confidence, health habits, and how others first perceive you. Strengthen the lagna through consistent routine, honest self-presentation, and dasha-aware decisions rather than forcing outcomes.`,
    `आपकी लग्न ${chart.lagnaHi} है—स्वभावतः ${trait.hi}। लग्न पूरी कुंडली का दृष्टिकोण तय करती है। लग्नेश ${SIGN_LORDS[chart.lagnaSignIndex].hi} व प्रथम भाव के ग्रह आत्मविश्वास, स्वास्थ्य आदत व प्रथम प्रभाव को गढ़ते हैं। नियमित दिनचर्या व दशा-अनुकूल निर्णयों से लग्न बल बढ़े।`,
  )

  const mind = chapter(
    'mind',
    'Moon, mind & emotions',
    'चन्द्र, मन व भावनाएँ',
    `Moon is in ${moon.signEn} (house ${moon.house}), nakshatra ${moon.nakshatraEn} pada ${moon.pada}. This shows emotional needs, comfort patterns, and how you process stress. Moon sign is also the popular “rashi” used in daily horoscopes. Honour rest cycles, hydration, and supportive company—especially when Moon dasha or hard Saturn/Mars periods run.`,
    `चन्द्र ${moon.signHi} में (भाव ${moon.house}), नक्षत्र ${moon.nakshatraHi} पद ${moon.pada}। इससे भावनात्मक जरूरतें व तनाव-प्रक्रिया समझ आती है। चन्द्र राशि दैनिक राशिफल का आधार भी है। विश्राम, जल व सहयोगी संगति—विशेषकर चन्द्र दशा या कठोर शनि/मंगल काल में—महत्वपूर्ण हैं।`,
  )

  const career = chapter(
    'career',
    'Career, status & money',
    'करियर, प्रतिष्ठा व धन',
    `10th house is ${tenth.signEn} with lord ${tenth.lordEn}; occupants: ${tenth.planetsEn}. 2nd house (${second.signEn}) and 11th (${eleventh.signEn}) speak to income and gains. Sun in ${sun.signEn} (H${sun.house}) colours authority and visibility. Prefer roles matching lagna drive (${trait.en}) and current dasha of ${chart.currentDasha.lordEn} (${chart.currentDasha.start} to ${chart.currentDasha.end}). Avoid impulsive job hops during heavy Saturn pressure unless necessity demands.`,
    `दशम भाव ${tenth.signHi} (स्वामी ${tenth.lordHi}); ग्रह: ${tenth.planetsHi}। द्वितीय (${second.signHi}) व एकादश (${eleventh.signHi}) आय/लाभ बताते हैं। सूर्य ${sun.signHi} (भाव ${sun.house}) में प्रतिष्ठा को रंग देता है। लग्न स्वभाव व वर्तमान दशा ${chart.currentDasha.lordHi} (${chart.currentDasha.start}–${chart.currentDasha.end}) के अनुकूल भूमिका चुनें।`,
  )

  const marriage = chapter(
    'marriage',
    'Marriage & relationships',
    'विवाह व संबंध',
    `7th house is ${seventh.signEn} (lord ${seventh.lordEn}); planets: ${seventh.planetsEn}. Venus at ${venus?.signEn ?? '—'} (H${venus?.house ?? '—'}) and Jupiter at ${jupiter?.signEn ?? '—'} (H${jupiter?.house ?? '—'}) refine love, grace, and spousal support themes. Manglik and other dosha flags in this report should be read as timing/compatibility notes—not fear labels. Navamsa (D9) below adds marriage-strength context.`,
    `सप्तम भाव ${seventh.signHi} (स्वामी ${seventh.lordHi}); ग्रह: ${seventh.planetsHi}। शुक्र ${venus?.signHi ?? '—'} व गुरु ${jupiter?.signHi ?? '—'} प्रेम/सहायता को सूक्ष्म बनाते हैं। मंगलिक आदि संकेत भय नहीं—समय व अनुकूलता के नोट्स हैं। नीचे नवमांश (D9) विवाह बल का संदर्भ देता है।`,
  )

  const family = chapter(
    'family',
    'Home, parents & peace',
    'घर, माता-पिता व शांति',
    `4th house shows home and emotional roots; 9th shows father/dharma and higher guidance. Keep family communication practical during dasha shifts. Property or relocation decisions work better when Moon and 4th-lord periods are supportive.`,
    `चतुर्थ भाव घर व भावनात्मक जड़ें; नवम पिता/धर्म व उच्च मार्गदर्शन। दशा परिवर्तन पर पारिवारिक संवाद व्यावहारिक रखें। संपत्ति/स्थान परिवर्तन चन्द्र व चतुर्थेश अनुकूल हों तब बेहतर।`,
  )

  const health = chapter(
    'health',
    'Vitality & routines (general)',
    'ऊर्जा व दिनचर्या (सामान्य)',
    `1st and 6th houses guide vitality and daily habits. This is general wellness guidance only—not medical advice. Prioritise sleep, digestion-friendly food, and movement. If 6th/8th are heavy, prefer preventive checkups and stress reduction over self-diagnosis.`,
    `प्रथम व षष्ठ भाव ऊर्जा व आदतें बताते हैं। यह सामान्य सुझाव है—चिकित्सा सलाह नहीं। नींद, सुपाच्य आहार व व्यायाम रखें। ६/८ भारी हों तो आत्म-निदान नहीं, रोकथाम व तनाव कम करें।`,
  )

  const education = chapter(
    'education',
    'Learning & intellect',
    'शिक्षा व बुद्धि',
    `5th house and Mercury/Jupiter placements support study style. Moon nakshatra ${moon.nakshatraEn} adds a learning flavour (intuition vs analysis). Structured revision beats last-minute intensity—especially under Saturn dasha.`,
    `पंचम भाव व बुध/गुरु शिक्षा शैली बताते हैं। चन्द्र नक्षत्र ${moon.nakshatraHi} सीखने का रंग जोड़ता है। शनि दशा में नियमित दोहराव जल्दबाजी से बेहतर।`,
  )

  const foreign = chapter(
    'foreign',
    'Travel, foreign & solitude',
    'यात्रा, विदेश व एकांत',
    `9th and 12th houses, plus Rahu themes, speak to long travel, foreign exposure, and retreat. Timing improves when dasha lords connect to these houses. Plan paperwork early; avoid romanticising escape during 12th-heavy periods.`,
    `नवम–द्वादश व राहु दीर्घ यात्रा/विदेश/एकांत से जुड़ते हैं। इन भावों से जुड़ी दशा में समय अनुकूल। कागजी तैयारी पहले करें; १२वें के दबाव में पलायन का मोह समझदारी से देखें।`,
  )

  const dashaAdvice = chapter(
    'dasha',
    'Current Mahadasha guidance',
    'वर्तमान महादशा मार्गदर्शन',
    `You are running ${chart.currentDasha.lordEn} Mahadasha from ${chart.currentDasha.start} to ${chart.currentDasha.end}. This period emphasises the houses and significations of ${chart.currentDasha.lordEn}. Upcoming: ${chart.upcomingDashas.map((d) => `${d.lordEn} (${d.start})`).join(', ') || 'see table'}. Use this window for aligned goals; push less against the grain of the dasha lord.`,
    `आपकी महादशा ${chart.currentDasha.lordHi} (${chart.currentDasha.start}–${chart.currentDasha.end}) चल रही है—इस ग्रह के भाव/कारकत्व प्रमुख हैं। आगे: ${chart.upcomingDashas.map((d) => `${d.lordHi} (${d.start})`).join(', ') || 'तालिका देखें'}। दशा के अनुकूल लक्ष्य चुनें।`,
  )

  const year = new Date().getFullYear()
  const yearAhead = chapter(
    'year',
    `Year-ahead highlights (${year}–${year + 1})`,
    `वर्ष संकेत (${year}–${year + 1})`,
    `Next 12–18 months sit inside ${chart.currentDasha.lordEn} dasha. Q1–Q2: consolidate skills and cashflow (2nd/11th themes). Mid-year: watch relationship and partnership clarity (7th). Final quarter: career visibility rises if 10th is active by transit/dasha. Treat this as a planning sketch—not a fixed fate calendar.`,
    `अगले १२–१८ माह ${chart.currentDasha.lordHi} दशा में हैं। आरंभ: कौशल व नकदी (२/११)। मध्य: संबंध स्पष्टता (७)। अंत: कर्म दृश्यता यदि दशम सक्रिय। यह योजना स्केच है—नियति कैलेंडर नहीं।`,
  )

  const yogas = detectYogas(planets, chart.lagnaSignIndex)
  const navamsa = buildVarga('Navamsa (D9)', 'नवमांश (D9)', planets, lagnaLongitude, navamsaSign)
  const dasamsha = buildVarga('Dasamsha (D10)', 'दशमांश (D10)', planets, lagnaLongitude, dasamshaSign)

  // silence unused
  void vargaSign

  return {
    methodEn: 'Vedic sidereal · Lahiri (Chitrapaksha) ayanamsa · whole-sign houses · mean nodes',
    methodHi: 'वैदिक सायन · लाहिरी अयनांश · पूर्ण-राशि भाव · मीन राहु-केतु',
    howToReadEn:
      'Start with Lagna (personality), Moon (mind), then the house chapters. Timing comes from Mahadasha. Vargas (D9/D10) refine marriage and career. Remedies are optional and never medical advice. Birth-time accuracy matters—if time is uncertain, lagna may shift.',
    howToReadHi:
      'पहले लग्न (व्यक्तित्व), फिर चन्द्र (मन), फिर भाव अध्याय पढ़ें। समय महादशा से आता है। D9/D10 विवाह व करियर सूक्ष्म करते हैं। उपाय वैकल्पिक हैं—चिकित्सा सलाह नहीं। जन्म समय अनिश्चित हो तो लग्न बदल सकता है।',
    snapshotBulletsEn: [
      `Lagna: ${chart.lagnaEn}`,
      `Moon sign: ${chart.moonSignEn} · ${moon.nakshatraEn} (pada ${moon.pada})`,
      `Sun sign: ${chart.sunSignEn}`,
      `Ayanamsa (Lahiri): ${chart.ayanamsa.toFixed(4)}°`,
      `Current Mahadasha: ${chart.currentDasha.lordEn} (${chart.currentDasha.start} → ${chart.currentDasha.end})`,
      `Dosha flags: ${chart.doshas.map((d) => d.nameEn).join(', ')}`,
    ],
    snapshotBulletsHi: [
      `लग्न: ${chart.lagnaHi}`,
      `चन्द्र राशि: ${chart.moonSignHi} · ${moon.nakshatraHi} (पद ${moon.pada})`,
      `सूर्य राशि: ${chart.sunSignHi}`,
      `अयनांश (लाहिरी): ${chart.ayanamsa.toFixed(4)}°`,
      `महादशा: ${chart.currentDasha.lordHi} (${chart.currentDasha.start} → ${chart.currentDasha.end})`,
      `दोष संकेत: ${chart.doshas.map((d) => d.nameHi).join(', ')}`,
    ],
    houses,
    personality,
    mind,
    career,
    marriage,
    family,
    health,
    education,
    foreign,
    dashaAdvice,
    yearAhead,
    summaryBulletsEn: [
      `${chart.lagnaEn} lagna with ${trait.en} baseline.`,
      `Moon in ${moon.signEn} / ${moon.nakshatraEn} guides emotional pacing.`,
      `Career focus via 10th in ${tenth.signEn}; money via 2nd/11th.`,
      `Relationship lens: 7th in ${seventh.signEn}; check D9.`,
      `Operate inside ${chart.currentDasha.lordEn} Mahadasha timing.`,
      `Review dosha flags calmly; remedies only if useful.`,
      `Re-read house chapters before major decisions.`,
      `Keep birth details private; this PDF is for personal guidance.`,
      `Pair chart insight with real-world effort and professional advice where needed.`,
      `Optional next step: matching, muhurat, or live consult.`,
    ],
    summaryBulletsHi: [
      `${chart.lagnaHi} लग्न—${trait.hi} आधार।`,
      `चन्द्र ${moon.signHi}/${moon.nakshatraHi} भावना गति तय करते हैं।`,
      `कर्म: दशम ${tenth.signHi}; धन: २/११।`,
      `संबंध: सप्तम ${seventh.signHi}; D9 देखें।`,
      `${chart.currentDasha.lordHi} महादशा में कार्य करें।`,
      `दोष संकेतों को शांति से पढ़ें; उपाय जरूरत पर।`,
      `बड़े निर्णय से पहले भाव अध्याय दोहराएँ।`,
      `जन्म विवरण गोपनीय रखें।`,
      `कुंडली के साथ वास्तविक प्रयास व विशेषज्ञ सलाह मिलाएँ।`,
      `अगला कदम: मिलान, मुहूर्त या परामर्श।`,
    ],
    yogas,
    aspectsEn: aspectLines(planets, 'en'),
    aspectsHi: aspectLines(planets, 'hi'),
    navamsa,
    dasamsha,
    doDontEn: {
      do: [
        'Keep exact birth time records for future updates',
        'Align big moves with supportive dasha windows',
        'Use remedies as discipline, not magic',
        'Journal decisions during major antardasha changes',
      ],
      dont: [
        'Do not treat doshas as lifelong curses',
        'Do not skip medical/legal/financial professionals',
        'Do not share birth data publicly',
        'Do not force gemstones without proper consultation',
      ],
    },
    doDontHi: {
      do: [
        'सटीक जन्म समय सुरक्षित रखें',
        'बड़े कदम अनुकूल दशा में उठाएँ',
        'उपाय को अनुशासन समझें, जादू नहीं',
        'अन्तर्दशा बदलाव पर निर्णय डायरी रखें',
      ],
      dont: [
        'दोष को जीवन-शाप न मानें',
        'चिकित्सक/वकील/वित्तीय सलाह न छोड़ें',
        'जन्म डेटा सार्वजनिक न करें',
        'बिना सलाह रत्न न थोपें',
      ],
    },
  }
}

export function pickText(lang: Language, en: string, hi: string): string {
  return lang === 'hi' ? hi : en
}
