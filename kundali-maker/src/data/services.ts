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
    status: 'soon',
    priceInr: 399,
    titleEn: 'Kundali Milan (Gun Milan)',
    titleHi: 'कुंडली मिलान (गुण मिलान)',
    blurbEn: 'Ashtakoot matching with manglik comparison for marriage decisions.',
    blurbHi: 'विवाह हेतु अष्टकूट मिलान व मंगलिक तुलना।',
    audienceEn: 'Family / Shaadi',
    audienceHi: 'परिवार / शादी',
    includesEn: ['36-point gun milan', 'Manglik compare', 'Plain-language summary', 'PDF for both families'],
    includesHi: ['३६ अंक गुण मिलान', 'मंगलिक तुलना', 'सरल सारांश', 'दोनों परिवारों हेतु PDF'],
  },
  {
    id: 'career',
    slug: 'career-report',
    status: 'soon',
    priceInr: 499,
    titleEn: 'Career & Profession Report',
    titleHi: 'करियर व व्यवसाय रिपोर्ट',
    blurbEn: '10th-house focused guidance for job change, business, and growth years.',
    blurbHi: 'नौकरी/व्यवसाय व वृद्धि वर्षों हेतु दशम भाव केंद्रित मार्गदर्शन।',
    audienceEn: 'Professionals & business',
    audienceHi: 'पेशेवर व व्यवसायी',
    includesEn: ['Career house analysis', 'Dasha timing notes', 'Job vs business pointers', 'PDF report'],
    includesHi: ['करियर भाव विश्लेषण', 'दशा समय संकेत', 'नौकरी बनाम व्यवसाय', 'PDF रिपोर्ट'],
  },
  {
    id: 'muhurat',
    slug: 'muhurat',
    status: 'soon',
    priceInr: 699,
    titleEn: 'Muhurat Finder',
    titleHi: 'मुहूर्त चयन',
    blurbEn: 'Auspicious windows for wedding, griha pravesh, or business opening.',
    blurbHi: 'विवाह, गृह प्रवेश या व्यवसाय शुभारंभ हेतु शुभ समय।',
    audienceEn: 'Family & business',
    audienceHi: 'परिवार व व्यवसाय',
    includesEn: ['Event-type selection', 'Date shortlist', 'Avoid windows', 'PDF schedule'],
    includesHi: ['कार्य प्रकार चयन', 'तिथि शॉर्टलिस्ट', 'वर्जित समय', 'PDF अनुसूची'],
  },
  {
    id: 'varshphal',
    slug: 'varshphal',
    status: 'soon',
    priceInr: 599,
    titleEn: 'Yearly Varshphal',
    titleHi: 'वार्षिक वर्षफल',
    blurbEn: 'Your year-ahead overview from birthday — ideal annual repurchase.',
    blurbHi: 'जन्मदिन से अगले वर्ष का अवलोकन—वार्षिक पुनः खरीद हेतु उत्तम।',
    audienceEn: 'Everyone',
    audienceHi: 'सभी',
    includesEn: ['Year themes', 'Key months', 'Caution periods', 'PDF'],
    includesHi: ['वर्ष विषय', 'मुख्य महीने', 'सावधानियाँ', 'PDF'],
  },
  {
    id: 'manglik',
    slug: 'manglik-check',
    status: 'soon',
    priceInr: 149,
    titleEn: 'Manglik Dosha Check',
    titleHi: 'मंगलिक दोष जाँच',
    blurbEn: 'Fast standalone manglik assessment with severity and plain notes.',
    blurbHi: 'तीव्रता व सरल नोट्स के साथ त्वरित मंगलिक आकलन।',
    audienceEn: 'Shaadi prep',
    audienceHi: 'शादी तैयारी',
    includesEn: ['Manglik present/absent', 'House-based notes', 'Cancellation hints', 'Shareable PDF'],
    includesHi: ['मंगलिक है/नहीं', 'भाव आधारित नोट्स', 'निरसन संकेत', 'साझा योग्य PDF'],
  },
  {
    id: 'consult',
    slug: 'live-consult',
    status: 'soon',
    priceInr: 1499,
    titleEn: 'Live Astrologer Consult',
    titleHi: 'लाइव ज्योतिष परामर्श',
    blurbEn: 'Book a focused 30-minute call after your chart is ready.',
    blurbHi: 'कुंडली तैयार होने के बाद ३० मिनट का केंद्रित कॉल।',
    audienceEn: 'High-stakes decisions',
    audienceHi: 'महत्वपूर्ण निर्णय',
    includesEn: ['30-min slot', 'Your PDF shared in advance', '3 priority questions', 'Follow-up notes'],
    includesHi: ['३० मिनट स्लॉट', 'पहले से PDF', '३ प्राथमिक प्रश्न', 'फॉलो-अप नोट्स'],
  },
]

export const BUNDLES = [
  {
    id: 'shaadi',
    titleEn: 'Shaadi Pack',
    titleHi: 'शादी पैक',
    priceInr: 799,
    status: 'soon' as const,
    itemsEn: ['2 × Vedic Kundali', 'Kundali Milan', 'Manglik compare'],
    itemsHi: ['२ × वैदिक कुंडली', 'कुंडली मिलान', 'मंगलिक तुलना'],
  },
  {
    id: 'business',
    titleEn: 'Business Pack',
    titleHi: 'बिज़नेस पैक',
    priceInr: 1299,
    status: 'soon' as const,
    itemsEn: ['Vedic Kundali', 'Career report', 'Business muhurat shortlist'],
    itemsHi: ['वैदिक कुंडली', 'करियर रिपोर्ट', 'व्यवसाय मुहूर्त सूची'],
  },
  {
    id: 'student',
    titleEn: 'Student Pack',
    titleHi: 'स्टूडेंट पैक',
    priceInr: 699,
    status: 'soon' as const,
    itemsEn: ['Vedic Kundali', 'Education/career timing notes'],
    itemsHi: ['वैदिक कुंडली', 'शिक्षा/करियर समय संकेत'],
  },
]

export function servicePriceText(s: ServiceItem): string {
  const base = formatInr(s.priceInr)
  if (s.priceLabel === 'add-on') return `+${base}`
  return base
}
