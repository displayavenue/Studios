import { Link, useParams } from 'react-router-dom'
import { SITE } from '../data/site'
import { useLanguage } from '../hooks/useLanguage'
import { PageHero, ContentSection } from '../components/PageHero'

const SECTIONS = ['privacy', 'terms', 'refund', 'disclaimer'] as const
type Section = (typeof SECTIONS)[number]

export function LegalPage() {
  const { lang } = useLanguage()
  const { section = 'privacy' } = useParams()
  const active = (SECTIONS.includes(section as Section) ? section : 'privacy') as Section

  const nav = [
    { id: 'privacy', en: 'Privacy Policy', hi: 'गोपनीयता नीति' },
    { id: 'terms', en: 'Terms of Service', hi: 'सेवा की शर्तें' },
    { id: 'refund', en: 'Refund Policy', hi: 'रिफंड नीति' },
    { id: 'disclaimer', en: 'Disclaimer', hi: 'अस्वीकरण' },
  ] as const

  return (
    <div className="page-wrap">
      <div className="container narrow">
        <PageHero
          title={lang === 'hi' ? 'कानूनी' : 'Legal'}
          subtitle={
            lang === 'hi'
              ? 'पारदर्शिता हेतु नीतियाँ। मार्गदर्शन—गारंटी नहीं।'
              : 'Policies for transparency. Guidance—not guarantees.'
          }
        />

        <nav className="legal-nav" aria-label="Legal sections">
          {nav.map((n) => (
            <Link
              key={n.id}
              to={`/legal/${n.id}`}
              className={active === n.id ? 'active' : undefined}
            >
              {lang === 'hi' ? n.hi : n.en}
            </Link>
          ))}
        </nav>

        {active === 'privacy' && (
          <ContentSection title={lang === 'hi' ? 'गोपनीयता नीति' : 'Privacy Policy'}>
            <p>
              {lang === 'hi'
                ? `${SITE.businessName} जन्म विवरण केवल कुंडली बनाने व ऑर्डर पूरा करने हेतु उपयोग करता है। हम जन्म डेटा तीसरे पक्ष को नहीं बेचते।`
                : `${SITE.businessName} uses birth details only to prepare your kundali and fulfil your order. We do not sell birth data to third parties.`}
            </p>
            <p>
              {lang === 'hi'
                ? 'वर्तमान MVP में ऑर्डर आपके ब्राउज़र की localStorage में रह सकते हैं। सर्वर अकाउंट आने पर एन्क्रिप्शन, सहमति व प्रतिधारण नीति लागू होगी (DPDP Act, 2023 / IT Act सिद्धांतों के अनुरूप)।'
                : 'In the current MVP, orders may remain in your browser localStorage. When server accounts launch, encryption, consent, and retention controls will apply (aligned with DPDP Act, 2023 / IT Act principles).'}
            </p>
            <p>
              {lang === 'hi'
                ? `संपर्क: ${SITE.supportEmail}. शिकायत अधिकारी: ${SITE.grievanceName} (${SITE.grievanceEmail}).`
                : `Contact: ${SITE.supportEmail}. Grievance Officer: ${SITE.grievanceName} (${SITE.grievanceEmail}).`}
            </p>
          </ContentSection>
        )}

        {active === 'terms' && (
          <ContentSection title={lang === 'hi' ? 'सेवा की शर्तें' : 'Terms of Service'}>
            <p>
              {lang === 'hi'
                ? 'सेवाओं का उपयोग करके आप सहमत होते हैं कि ज्योतिष रिपोर्ट व्यक्तिगत/शैक्षिक मार्गदर्शन हेतु हैं। आप १८+ व अनुबंध करने योग्य हों।'
                : 'By using the services you agree astrology reports are for personal/educational guidance. You must be 18+ and competent to contract.'}
            </p>
            <p>
              {lang === 'hi'
                ? 'भुगतान सफल होने के बाद डिजिटल उत्पाद डिलीवर होते हैं। गलत जन्म विवरण से गलत चार्ट की ज़िम्मेदारी उपयोगकर्ता की है।'
                : 'Digital products are delivered after successful payment. Incorrect birth details leading to an incorrect chart remain the user’s responsibility.'}
            </p>
            <p>
              {lang === 'hi'
                ? `विधि: भारत। व्यवसाय: ${SITE.businessName}, ${SITE.businessAddress}.`
                : `Governing law: India. Business: ${SITE.businessName}, ${SITE.businessAddress}.`}
            </p>
          </ContentSection>
        )}

        {active === 'refund' && (
          <ContentSection title={lang === 'hi' ? 'रिफंड नीति' : 'Refund Policy'}>
            <p>
              {lang === 'hi'
                ? 'एक बार कुंडली/PDF जनरेट होने के बाद सामान्यतः रिफंड नहीं मिलता (डिजिटल वस्तु)।'
                : 'Once a kundali/PDF is generated, refunds are generally not available (digital goods).'}
            </p>
            <p>
              {lang === 'hi'
                ? 'यदि भुगतान कट गया पर रिपोर्ट अनलॉक नहीं हुई, ४८ घंटे में Order ID के साथ हमें लिखें—हम डिलीवरी ठीक करेंगे या पात्र मामलों में रिफंड देखेंगे।'
                : 'If payment was captured but the report did not unlock, contact us within 48 hours with Order ID—we will fix delivery or consider a refund in eligible cases.'}
            </p>
            <p>
              {lang === 'hi'
                ? 'लाइव परामर्श (जब उपलब्ध हों) की रद्दीकरण नीति बुकिंग पृष्ठ पर अलग से बताई जाएगी।'
                : 'Live consult cancellation rules (when available) will be stated on the booking page.'}
            </p>
          </ContentSection>
        )}

        {active === 'disclaimer' && (
          <ContentSection title={lang === 'hi' ? 'अस्वीकरण' : 'Disclaimer'}>
            <p>
              {lang === 'hi'
                ? 'ज्योतिष सेवाएँ चिकित्सा, कानूनी, वित्तीय या मनोवैज्ञानिक सलाह नहीं हैं और उनके स्थान पर नहीं ली जानी चाहिए।'
                : 'Astrology services are not medical, legal, financial, or psychological advice and must not replace qualified professionals.'}
            </p>
            <p>
              {lang === 'hi'
                ? 'हम परिणाम, विवाह, नौकरी, स्वास्थ्य या धन की गारंटी नहीं देते। उपाय पारंपरिक सुझाव हैं।'
                : 'We do not guarantee outcomes for marriage, career, health, or wealth. Remedies are traditional suggestions only.'}
            </p>
            <p>
              {lang === 'hi'
                ? `गणना पद्धति: ${SITE.methodNoteHi}. शैक्षिक/उपभोक्ता उपयोग हेतु।`
                : `Calculation method: ${SITE.methodNoteEn}. For educational/consumer use.`}
            </p>
          </ContentSection>
        )}
      </div>
    </div>
  )
}
