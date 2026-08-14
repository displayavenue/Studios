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
            items: ['स्क्रीन पर चार्ट', 'PDF डाउनलोड', 'हिन्दी या अंग्रेज़ी', 'ऑर्डर ID'],
          },
          {
            t: 'वैकल्पिक उपाय',
            items: ['मंत्र', 'दान', 'अनुष्ठान सुझाव', 'जीवनशैली—केवल अतिरिक्त भुगतान पर'],
          },
          {
            t: 'जल्द जुड़ने वाला',
            items: ['नवमांश (D9)', 'दशमांश (D10)', 'अन्तर्दशा', 'कुंडली मिलान', 'मुहूर्त', 'वर्षफल'],
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
            items: ['On-screen chart', 'PDF download', 'Hindi or English', 'Order ID'],
          },
          {
            t: 'Optional remedies',
            items: ['Mantras', 'Charity', 'Ritual suggestions', 'Lifestyle—only after add-on pay'],
          },
          {
            t: 'Coming next',
            items: ['Navamsa (D9)', 'Dasamsha (D10)', 'Antardasha', 'Kundali Milan', 'Muhurat', 'Varshphal'],
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
          <Link className="btn btn-ghost" to="/services">
            {lang === 'hi' ? 'सभी सेवाएँ' : 'All services'}
          </Link>
        </div>
      </div>
    </div>
  )
}
