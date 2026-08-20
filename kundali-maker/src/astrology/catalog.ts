import { generateKundali } from './generate'
import { buildCompleteReport } from './report'
import type { BirthDetails, KundaliChart } from './types'
import { SIGNS_EN, SIGNS_HI } from './constants'

export type CatalogProductId =
  | 'career'
  | 'manglik'
  | 'varshphal'
  | 'muhurat'
  | 'deep'
  | 'student'
  | 'business'

export interface CatalogResult {
  productId: CatalogProductId
  titleEn: string
  titleHi: string
  summaryEn: string
  summaryHi: string
  bulletsEn: string[]
  bulletsHi: string[]
  chart?: KundaliChart
  extra?: Record<string, string>
}

function manglikFromChart(chart: KundaliChart) {
  const flag = chart.doshas.find((d) => d.id === 'mangal')
  return {
    present: Boolean(flag),
    severity: flag?.severity ?? 'low',
    summaryEn: flag?.summaryEn ?? 'No classic Manglik flag detected in this scan.',
    summaryHi: flag?.summaryHi ?? 'इस जाँच में क्लासिक मंगलिक संकेत नहीं मिला।',
  }
}

export function buildCatalogResult(
  productId: CatalogProductId,
  details: BirthDetails,
  opts?: { eventType?: string },
): CatalogResult {
  const chart = generateKundali(details)
  const report = buildCompleteReport(chart, chart.lagnaLongitude)
  const manglik = manglikFromChart(chart)

  if (productId === 'manglik') {
    return {
      productId,
      titleEn: 'Manglik Dosha Check',
      titleHi: 'मंगलिक दोष जाँच',
      summaryEn: manglik.present
        ? `Manglik flag: present (${manglik.severity}). ${manglik.summaryEn}`
        : `Manglik flag: not present. ${manglik.summaryEn}`,
      summaryHi: manglik.present
        ? `मंगलिक संकेत: हाँ (${manglik.severity})। ${manglik.summaryHi}`
        : `मंगलिक संकेत: नहीं। ${manglik.summaryHi}`,
      bulletsEn: [
        `Lagna ${chart.lagnaEn} · Mars house check on 1/2/4/7/8/12`,
        manglik.summaryEn,
        'This is a traditional flag—not a marriage veto by itself.',
        'Compare with partner via Kundali Milan for context.',
      ],
      bulletsHi: [
        `लग्न ${chart.lagnaHi} · मंगल भाव जाँच १/२/४/७/८/१२`,
        manglik.summaryHi,
        'यह पारंपरिक संकेत है—अकेला विवाह रोक नहीं।',
        'संदर्भ हेतु कुंडली मिलान देखें।',
      ],
      chart,
      extra: { severity: manglik.severity, present: manglik.present ? 'yes' : 'no' },
    }
  }

  if (productId === 'career') {
    return {
      productId,
      titleEn: 'Career & Profession Report',
      titleHi: 'करियर व व्यवसाय रिपोर्ट',
      summaryEn: report.career.bodyEn.slice(0, 280) + '…',
      summaryHi: report.career.bodyHi.slice(0, 280) + '…',
      bulletsEn: [
        report.career.bodyEn,
        report.education.bodyEn,
        `Current Mahadasha: ${chart.currentDasha.lordEn} (${chart.currentDasha.start} → ${chart.currentDasha.end})`,
        report.dasamsha.lagnaEn
          ? `Dasamsha (D10) lagna flavour: ${report.dasamsha.lagnaEn}`
          : 'Dasamsha overview included in PDF.',
        'Job vs business: favour the path that matches 10th-lord dignity and dasha support.',
      ],
      bulletsHi: [
        report.career.bodyHi,
        report.education.bodyHi,
        `वर्तमान महादशा: ${chart.currentDasha.lordHi}`,
        `दशमांश लग्न: ${report.dasamsha.lagnaHi}`,
        'नौकरी बनाम व्यवसाय: दशमेश व दशा समर्थन देखें।',
      ],
      chart,
    }
  }

  if (productId === 'varshphal') {
    return {
      productId,
      titleEn: 'Yearly Varshphal',
      titleHi: 'वार्षिक वर्षफल',
      summaryEn: report.yearAhead.bodyEn.slice(0, 280) + '…',
      summaryHi: report.yearAhead.bodyHi.slice(0, 280) + '…',
      bulletsEn: [
        report.yearAhead.bodyEn,
        report.dashaAdvice.bodyEn,
        ...chart.upcomingDashas.slice(0, 3).map((d) => `${d.lordEn}: ${d.start} → ${d.end}`),
        'Focus months: align big moves with supportive Moon/Jupiter periods when possible.',
        'Caution: avoid rushed contracts in heavy Saturn pressure windows noted in your chart.',
      ],
      bulletsHi: [
        report.yearAhead.bodyHi,
        report.dashaAdvice.bodyHi,
        ...chart.upcomingDashas.slice(0, 3).map((d) => `${d.lordHi}: ${d.start} → ${d.end}`),
        'बड़े निर्णय अनुकूल चन्द्र/गुरु काल में रखें।',
        'शनि दबाव काल में जल्दबाज़ी वाले करार से बचें।',
      ],
      chart,
    }
  }

  if (productId === 'muhurat') {
    const event = opts?.eventType || 'wedding'
    const windows = buildMuhuratWindows(chart, event)
    return {
      productId,
      titleEn: 'Muhurat Finder',
      titleHi: 'मुहूर्त चयन',
      summaryEn: `Automated shortlist for ${event} based on your Moon (${chart.moonSignEn}) and lagna (${chart.lagnaEn}).`,
      summaryHi: `${event} हेतु स्वचालित शॉर्टलिस्ट—चन्द्र ${chart.moonSignHi}, लग्न ${chart.lagnaHi}।`,
      bulletsEn: windows.en,
      bulletsHi: windows.hi,
      chart,
      extra: { eventType: event },
    }
  }

  if (productId === 'student') {
    return {
      productId,
      titleEn: 'Student Pack Report',
      titleHi: 'स्टूडेंट पैक रिपोर्ट',
      summaryEn: report.education.bodyEn.slice(0, 280) + '…',
      summaryHi: report.education.bodyHi.slice(0, 280) + '…',
      bulletsEn: [
        report.education.bodyEn,
        report.mind.bodyEn,
        report.career.bodyEn,
        `Moon ${chart.moonSignEn} / ${chart.planets.find((p) => p.id === 'moon')?.nakshatraEn} guides study rhythm.`,
        `Current dasha ${chart.currentDasha.lordEn}—pace exams and applications accordingly.`,
      ],
      bulletsHi: [
        report.education.bodyHi,
        report.mind.bodyHi,
        report.career.bodyHi,
        `चन्द्र ${chart.moonSignHi} अध्ययन लय बताता है।`,
        `वर्तमान दशा ${chart.currentDasha.lordHi}—परीक्षा/आवेदन समय मिलाएँ।`,
      ],
      chart,
    }
  }

  if (productId === 'business') {
    const windows = buildMuhuratWindows(chart, 'business')
    return {
      productId,
      titleEn: 'Business Pack Report',
      titleHi: 'बिज़नेस पैक रिपोर्ट',
      summaryEn: report.career.bodyEn.slice(0, 240) + '…',
      summaryHi: report.career.bodyHi.slice(0, 240) + '…',
      bulletsEn: [
        report.career.bodyEn,
        report.foreign.bodyEn,
        ...windows.en.slice(0, 4),
        `10th house sign: ${SIGNS_EN[chart.houses[9]]}`,
        'Partnership moves: check Milan separately if a co-founder match is needed.',
      ],
      bulletsHi: [
        report.career.bodyHi,
        report.foreign.bodyHi,
        ...windows.hi.slice(0, 4),
        `दशम भाव राशि: ${SIGNS_HI[chart.houses[9]]}`,
        'साझेदार मिलान अलग से Kundali Milan से जाँचें।',
      ],
      chart,
    }
  }

  // deep bundle
  return {
    productId: 'deep',
    titleEn: 'Deep Report Bundle',
    titleHi: 'गहन रिपोर्ट बंडल',
    summaryEn: chart.summaryEn,
    summaryHi: chart.summaryHi,
    bulletsEn: [
      chart.summaryEn,
      report.personality.bodyEn,
      report.career.bodyEn,
      report.marriage.bodyEn,
      report.yearAhead.bodyEn,
      'Full ~20 page kundali PDF unlocks with this bundle plus extended career/year notes below.',
    ],
    bulletsHi: [
      chart.summaryHi,
      report.personality.bodyHi,
      report.career.bodyHi,
      report.marriage.bodyHi,
      report.yearAhead.bodyHi,
      'इस बंडल में पूर्ण ~२० पृष्ठ कुंडली PDF व विस्तारित करियर/वर्ष नोट्स।',
    ],
    chart,
  }
}

function buildMuhuratWindows(chart: KundaliChart, event: string): { en: string[]; hi: string[] } {
  const moon = chart.moonSignIndex
  const preferDow = [(moon + 1) % 7, (moon + 3) % 7, (moon + 5) % 7] // simple preference from moon
  const dowNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dowHi = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि']
  const start = new Date()
  start.setHours(10, 0, 0, 0)
  const picks: { en: string; hi: string }[] = []
  for (let i = 1; i <= 75 && picks.length < 6; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const dow = d.getDay()
    if (!preferDow.includes(dow)) continue
    // skip typical avoid: Sat for wedding-ish, Tue optional skip for some events
    if (event === 'wedding' && (dow === 6 || dow === 2)) continue
    const label = d.toISOString().slice(0, 10)
    picks.push({
      en: `${label} (${dowNames[dow]}) · morning window ~10:00–12:00 · favour for ${event}`,
      hi: `${label} (${dowHi[dow]}) · प्रातः ~१०–१२ · ${event} हेतु अनुकूल`,
    })
  }
  const avoidEn = [
    'Avoid rushed starts on your personally heavy Saturn pressure days when possible.',
    'Confirm final muhurat with family tradition; this is an automated shortlist.',
  ]
  const avoidHi = [
    'संभव हो तो शनि दबाव दिनों में जल्दबाज़ी शुभारंभ से बचें।',
    'अंतिम मुहूर्त परिवार परंपरा से पुष्टि करें; यह स्वचालित शॉर्टलिस्ट है।',
  ]
  return {
    en: [...picks.map((p) => p.en), ...avoidEn],
    hi: [...picks.map((p) => p.hi), ...avoidHi],
  }
}
