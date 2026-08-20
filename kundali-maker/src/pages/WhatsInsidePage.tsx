import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { copy } from '../lib/i18n'
import { PageHero, ContentSection } from '../components/PageHero'
import { SITE } from '../data/site'

export function WhatsInsidePage() {
  const { lang } = useLanguage()

  const blocks =
    lang === 'hi'
      ? [
          {
            t: 'आवश्यक जन्म विवरण',
            items: ['नाम, लिंग', 'जन्म तिथि व सटीक समय', 'जन्म स्थान (अक्षांश/देशांतर)', 'समय क्षेत्र (IST आदि)'],
          },
          {
            t: 'मुख्य कुंडली (D1)',
            items: ['लग्न व लग्नेश', '९ ग्रह स्थितियाँ', '१२ भाव', 'नक्षत्र व पद', 'वक्री संकेत'],
          },
          {
            t: 'समय प्रणाली',
            items: ['विंशोत्तरी महादशा', 'वर्तमान दशा अवधि', 'आगामी महादशा झलक'],
          },
          {
            t: 'दोष / संकेत',
            items: ['मंगलिक जाँच', 'शनि दबाव संकेत', 'कालसर्प जैसा पैटर्न (यदि हो)', 'सामान्य संतुलन नोट्स'],
          },
          {
            t: 'डिलीवरी',
            items: ['स्क्रीन पर चार्ट', 'पूर्ण ~२० पृष्ठ PDF', 'ऑर्डर ID से पुनः डाउनलोड', 'बिना कॉल/चैट'],
          },
          {
            t: 'वैकल्पिक उपाय',
            items: ['मंत्र', 'दान', 'अनुष्ठान सुझाव', 'जीवनशैली—केवल अतिरिक्त भुगतान पर'],
          },
          {
            t: 'कुंडली मिलान (लाइव)',
            items: ['अष्टकूट ३६ अंक', 'मंगलिक तुलना', 'मिलान PDF', 'तुरंत अनलॉक'],
          },
          {
            t: 'जल्द जुड़ने वाला',
            items: ['अन्तर्दशा विस्तार', 'मुहूर्त', 'वर्षफल गहन', 'शादी पैक'],
          },
        ]
      : [
          {
            t: 'Birth details required',
            items: ['Name, gender', 'Date & exact time of birth', 'Place (lat/long)', 'Timezone (e.g. IST)'],
          },
          {
            t: 'Core chart (D1)',
            items: ['Lagna & lagna lord', '9 planetary positions', '12 houses', 'Nakshatra & pada', 'Retrograde markers'],
          },
          {
            t: 'Timing',
            items: ['Vimshottari Mahadasha', 'Current period dates', 'Upcoming dasha overview'],
          },
          {
            t: 'Dosha flags',
            items: ['Manglik check', 'Saturn pressure notes', 'Kaal Sarp-like pattern (if any)', 'Balance notes'],
          },
          {
            t: 'Delivery',
            items: ['On-screen chart', 'Complete ~20 page PDF', 'Re-download via Order ID', 'No call/chat needed'],
          },
          {
            t: 'Complete report chapters',
            items: [
              'Cover & method',
              'Houses 1–12 readings',
              'Personality, mind, career, marriage',
              'Navamsa (D9) & Dasamsha (D10)',
              'Yogas, aspects, year-ahead',
              'Summary & next steps',
            ],
          },
          {
            t: 'Optional remedies',
            items: ['Mantras', 'Charity', 'Ritual suggestions', 'Lifestyle—only after add-on pay'],
          },
          {
            t: 'Kundali Milan (live)',
            items: ['Ashtakoot 36 points', 'Manglik compare', 'Milan PDF', 'Instant unlock'],
          },
          {
            t: 'Coming next',
            items: ['Antardasha detail', 'Muhurat', 'Varshphal deep-dive', 'Shaadi pack'],
          },
        ]

  return (
    <div className="page-wrap">
      <div className="container narrow">
        <PageHero
          title={lang === 'hi' ? 'कुंडली में क्या-क्या होता है' : "What's inside a kundali"}
          subtitle={
            lang === 'hi'
              ? `पद्धति: ${SITE.methodNoteHi}`
              : `Method: ${SITE.methodNoteEn}`
          }
          cta
        />

        {blocks.map((b) => (
          <ContentSection key={b.t} title={b.t}>
            <ul className="include-list">
              {b.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          </ContentSection>
        ))}

        <div className="form-actions">
          <Link className="btn btn-primary" to="/generate">
            {copy.ctaPrimary(lang)}
          </Link>
          <Link className="btn btn-secondary" to="/sample">
            {lang === 'hi' ? 'SAMPLE PDF' : 'SAMPLE PDF'}
          </Link>
          <Link className="btn btn-ghost" to="/features">
            {lang === 'hi' ? '५० विशेषताएँ' : '50 features'}
          </Link>
        </div>
      </div>
    </div>
  )
}
