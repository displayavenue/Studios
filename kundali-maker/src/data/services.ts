import { formatInr, PRICING } from '../lib/pricing'

export type ServiceStatus = 'live' | 'soon'

export interface ServiceItem {
  id: string
  slug: string
  status: ServiceStatus
  priceInr: number
  priceLabel?: string
  titleEn: string
  titleHi: string
  blurbEn: string
  blurbHi: string
  audienceEn: string
  audienceHi: string
  includesEn: string[]
  includesHi: string[]
  ctaTo?: string
}

export const SERVICES: ServiceItem[] = [
  {
    id: 'kundali',
    slug: 'vedic-kundali',
    status: 'live',
    priceInr: PRICING.kundaliInr,
    titleEn: 'Complete Vedic Kundali (~20 page PDF)',
    titleHi: 'पूर्ण वैदिक कुंडली (~२० पृष्ठ PDF)',
    blurbEn: 'Complete ~20-page birth-time Vedic report with houses, life chapters, D9/D10, dasha, yogas, and PDF.',
    blurbHi: 'जन्म-समय आधारित ~२० पृष्ठ पूर्ण वैदिक रिपोर्ट—भाव, जीवन अध्याय, D9/D10, दशा, योग व PDF।',
    audienceEn: 'Everyone',
    audienceHi: 'सभी',
    includesEn: [
      'Complete ~20 page PDF',
      'Lagna, houses 1–12 readings',
      'Personality, mind, career, marriage',
      'Navamsa (D9) & Dasamsha (D10)',
      'Mahadasha + yogas + dosha flags',
      'Year-ahead planning notes',
    ],
    includesHi: [
      'पूर्ण ~२० पृष्ठ PDF',
      'लग्न व १–१२ भाव पाठ',
      'व्यक्तित्व, मन, करियर, विवाह',
      'नवमांश (D9) व दशमांश (D10)',
      'महादशा + योग + दोष संकेत',
      'वर्ष संकेत',
    ],
    ctaTo: '/generate',
  },
  {
    id: 'remedies',
    slug: 'remedies',
    status: 'live',
    priceInr: PRICING.remediesInr,
    priceLabel: 'add-on',
    titleEn: 'Personalized Remedies Add-on',
    titleHi: 'व्यक्तिगत उपाय ऐड-ऑन',
    blurbEn: 'Unlock mantras, daan, and ritual suggestions mapped to your dosha flags—only if you need them.',
    blurbHi: 'आपके दोष संकेतों से जुड़े मंत्र, दान व अनुष्ठान—केवल जरूरत हो तो।',
    audienceEn: 'After kundali',
    audienceHi: 'कुंडली के बाद',
    includesEn: ['Dosha-linked mantras', 'Charity & ritual tips', 'Lifestyle guidance', 'Updated remedies PDF'],
    includesHi: ['दोष-आधारित मंत्र', 'दान व अनुष्ठान', 'जीवनशैली सुझाव', 'अपडेटेड उपाय PDF'],
    ctaTo: '/generate',
  },
  {
    id: 'milan',
    slug: 'kundali-milan',
    status: 'live',
    priceInr: PRICING.milanInr,
    titleEn: 'Kundali Milan (Gun Milan)',
    titleHi: 'कुंडली मिलान (गुण मिलान)',
    blurbEn: 'Ashtakoot matching with manglik comparison for marriage decisions—PDF for both families.',
    blurbHi: 'विवाह हेतु अष्टकूट मिलान व मंगलिक तुलना—दोनों परिवारों हेतु PDF।',
    audienceEn: 'Family / Shaadi',
    audienceHi: 'परिवार / शादी',
    includesEn: ['36-point gun milan', 'Manglik compare', 'Plain-language summary', 'Instant PDF'],
    includesHi: ['३६ अंक गुण मिलान', 'मंगलिक तुलना', 'सरल सारांश', 'तुरंत PDF'],
    ctaTo: '/milan',
  },
  {
    id: 'manglik',
    slug: 'manglik-check',
    status: 'live',
    priceInr: PRICING.manglikInr,
    titleEn: 'Manglik Dosha Check',
    titleHi: 'मंगलिक दोष जाँच',
    blurbEn: 'Fast standalone manglik assessment with severity and plain notes.',
    blurbHi: 'तीव्रता व सरल नोट्स के साथ त्वरित मंगलिक आकलन।',
    audienceEn: 'Shaadi prep',
    audienceHi: 'शादी तैयारी',
    includesEn: ['Manglik present/absent', 'House-based notes', 'Plain guidance', 'Instant PDF'],
    includesHi: ['मंगलिक है/नहीं', 'भाव आधारित नोट्स', 'सरल मार्गदर्शन', 'तुरंत PDF'],
    ctaTo: '/shop/manglik',
  },
  {
    id: 'career',
    slug: 'career-report',
    status: 'live',
    priceInr: PRICING.careerInr,
    titleEn: 'Career & Profession Report',
    titleHi: 'करियर व व्यवसाय रिपोर्ट',
    blurbEn: '10th-house focused guidance for job change, business, and growth years.',
    blurbHi: 'नौकरी/व्यवसाय व वृद्धि वर्षों हेतु दशम भाव केंद्रित मार्गदर्शन।',
    audienceEn: 'Professionals & business',
    audienceHi: 'पेशेवर व व्यवसायी',
    includesEn: ['Career house analysis', 'Dasha timing notes', 'Job vs business pointers', 'PDF report'],
    includesHi: ['करियर भाव विश्लेषण', 'दशा समय संकेत', 'नौकरी बनाम व्यवसाय', 'PDF रिपोर्ट'],
    ctaTo: '/shop/career',
  },
  {
    id: 'varshphal',
    slug: 'varshphal',
    status: 'live',
    priceInr: PRICING.varshphalInr,
    titleEn: 'Yearly Varshphal',
    titleHi: 'वार्षिक वर्षफल',
    blurbEn: 'Your year-ahead overview from birthday — ideal annual repurchase.',
    blurbHi: 'जन्मदिन से अगले वर्ष का अवलोकन—वार्षिक पुनः खरीद हेतु उत्तम।',
    audienceEn: 'Everyone',
    audienceHi: 'सभी',
    includesEn: ['Year themes', 'Key months', 'Caution periods', 'PDF'],
    includesHi: ['वर्ष विषय', 'मुख्य महीने', 'सावधानियाँ', 'PDF'],
    ctaTo: '/shop/varshphal',
  },
  {
    id: 'muhurat',
    slug: 'muhurat',
    status: 'live',
    priceInr: PRICING.muhuratInr,
    titleEn: 'Muhurat Finder',
    titleHi: 'मुहूर्त चयन',
    blurbEn: 'Auspicious windows for wedding, griha pravesh, or business opening.',
    blurbHi: 'विवाह, गृह प्रवेश या व्यवसाय शुभारंभ हेतु शुभ समय।',
    audienceEn: 'Family & business',
    audienceHi: 'परिवार व व्यवसाय',
    includesEn: ['Event-type selection', 'Date shortlist', 'Avoid windows', 'PDF schedule'],
    includesHi: ['कार्य प्रकार चयन', 'तिथि शॉर्टलिस्ट', 'वर्जित समय', 'PDF अनुसूची'],
    ctaTo: '/shop/muhurat',
  },
  {
    id: 'deep',
    slug: 'deep-report-bundle',
    status: 'live',
    priceInr: PRICING.deepInr,
    titleEn: 'Deep Report Bundle (automated)',
    titleHi: 'गहन रिपोर्ट बंडल (स्वचालित)',
    blurbEn: 'Full kundali PDF plus extended career and year-ahead notes—fully self-serve.',
    blurbHi: 'पूर्ण कुंडली PDF + विस्तारित करियर व वर्ष संकेत—पूरी तरह स्वयं-सेवा।',
    audienceEn: 'Power users',
    audienceHi: 'गहन उपयोगकर्ता',
    includesEn: ['Complete kundali PDF', 'Extended career notes', 'Year-ahead notes', 'Instant unlock'],
    includesHi: ['पूर्ण कुंडली PDF', 'विस्तारित करियर नोट्स', 'वर्ष नोट्स', 'तुरंत अनलॉक'],
    ctaTo: '/shop/deep',
  },
  {
    id: 'shaadi',
    slug: 'shaadi-pack',
    status: 'live',
    priceInr: PRICING.shaadiPackInr,
    titleEn: 'Shaadi Pack',
    titleHi: 'शादी पैक',
    blurbEn: 'Gun milan + manglik compare for the couple in one checkout.',
    blurbHi: 'जोड़े हेतु गुण मिलान + मंगलिक तुलना—एक चेकआउट।',
    audienceEn: 'Families',
    audienceHi: 'परिवार',
    includesEn: ['Ashtakoot 36', 'Manglik compare', 'Shareable PDF', 'Instant unlock'],
    includesHi: ['अष्टकूट ३६', 'मंगलिक तुलना', 'साझा PDF', 'तुरंत अनलॉक'],
    ctaTo: '/shop/shaadi',
  },
  {
    id: 'business',
    slug: 'business-pack',
    status: 'live',
    priceInr: PRICING.businessPackInr,
    titleEn: 'Business Pack',
    titleHi: 'बिज़नेस पैक',
    blurbEn: 'Career guidance plus business muhurat shortlist—automated.',
    blurbHi: 'करियर मार्गदर्शन + व्यवसाय मुहूर्त शॉर्टलिस्ट—स्वचालित।',
    audienceEn: 'Owners & founders',
    audienceHi: 'व्यवसायी',
    includesEn: ['Career notes', 'Business muhurat windows', 'PDF', 'No calls'],
    includesHi: ['करियर नोट्स', 'व्यवसाय मुहूर्त', 'PDF', 'बिना कॉल'],
    ctaTo: '/shop/business',
  },
  {
    id: 'student',
    slug: 'student-pack',
    status: 'live',
    priceInr: PRICING.studentPackInr,
    titleEn: 'Student Pack',
    titleHi: 'स्टूडेंट पैक',
    blurbEn: 'Education and career timing notes for students—instant PDF.',
    blurbHi: 'छात्रों हेतु शिक्षा व करियर समय नोट्स—तुरंत PDF।',
    audienceEn: 'Students & parents',
    audienceHi: 'छात्र व अभिभावक',
    includesEn: ['Study rhythm notes', 'Dasha timing', 'Career pointers', 'PDF'],
    includesHi: ['अध्ययन लय', 'दशा समय', 'करियर संकेत', 'PDF'],
    ctaTo: '/shop/student',
  },
]

export const BUNDLES = [
  {
    id: 'shaadi',
    titleEn: 'Shaadi Pack',
    titleHi: 'शादी पैक',
    priceInr: PRICING.shaadiPackInr,
    status: 'live' as const,
    itemsEn: ['Gun milan', 'Manglik compare', 'Instant PDF'],
    itemsHi: ['गुण मिलान', 'मंगलिक तुलना', 'तुरंत PDF'],
    ctaTo: '/shop/shaadi',
  },
  {
    id: 'business',
    titleEn: 'Business Pack',
    titleHi: 'बिज़नेस पैक',
    priceInr: PRICING.businessPackInr,
    status: 'live' as const,
    itemsEn: ['Career notes', 'Business muhurat shortlist', 'PDF'],
    itemsHi: ['करियर नोट्स', 'व्यवसाय मुहूर्त', 'PDF'],
    ctaTo: '/shop/business',
  },
  {
    id: 'student',
    titleEn: 'Student Pack',
    titleHi: 'स्टूडेंट पैक',
    priceInr: PRICING.studentPackInr,
    status: 'live' as const,
    itemsEn: ['Education timing', 'Career pointers', 'PDF'],
    itemsHi: ['शिक्षा समय', 'करियर संकेत', 'PDF'],
    ctaTo: '/shop/student',
  },
]

export function servicePriceText(s: ServiceItem): string {
  const base = formatInr(s.priceInr)
  if (s.priceLabel === 'add-on') return `+${base}`
  return base
}
