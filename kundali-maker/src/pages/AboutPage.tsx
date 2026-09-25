import { Link } from 'react-router-dom'
import { SITE } from '../data/site'
import { useLanguage } from '../hooks/useLanguage'
import { copy } from '../lib/i18n'
import { PageHero, ContentSection } from '../components/PageHero'

export function AboutPage() {
  const { lang } = useLanguage()

  return (
    <div className="page-wrap">
      <div className="container narrow">
        <PageHero
          title={lang === 'hi' ? 'हमारे बारे में' : 'About us'}
          subtitle={
            lang === 'hi'
              ? 'प्रामाणिक वैदिक कुंडली—स्पष्ट कीमत, बिना दबाव।'
              : 'Authentic Vedic kundali—clear pricing, no pressure.'
          }
        />

        <ContentSection title={lang === 'hi' ? 'हमारा वादा' : 'Our promise'}>
          <p>
            {lang === 'hi'
              ? `${SITE.brandHi} जन्म विवरण से वैदिक कुंडली तैयार करता है और भुगतान के बाद PDF देता है। उपाय अलग ऐड-ऑन हैं—केवल जब चार्ट में संकेत हों और आप चाहें।`
              : `${SITE.brandEn} prepares a Vedic kundali from your birth details and delivers a PDF after payment. Remedies are a separate add-on—only when your chart flags something and you choose.`}
          </p>
        </ContentSection>

        <ContentSection title={lang === 'hi' ? 'पद्धति' : 'Method'}>
          <p>{lang === 'hi' ? SITE.methodNoteHi : SITE.methodNoteEn}</p>
          <p>
            {lang === 'hi'
              ? 'सटीक जन्म समय लग्न के लिए आवश्यक है। हम डराने वाली भाषा या नकली गारंटी से बचते हैं।'
              : 'Exact birth time is essential for lagna. We avoid fear language and fake guarantees.'}
          </p>
        </ContentSection>

        <ContentSection title={lang === 'hi' ? 'किसके लिए' : 'Who we serve'}>
          <ul className="include-list">
            <li>{lang === 'hi' ? 'व्यवसायी — समय व दिशा' : 'Business owners — timing & direction'}</li>
            <li>{lang === 'hi' ? 'छात्र — शिक्षा/करियर दशा' : 'Students — education/career dasha'}</li>
            <li>{lang === 'hi' ? 'परिवार — विवाह तैयारी' : 'Families — marriage prep'}</li>
            <li>{lang === 'hi' ? 'पेशेवर — दबाव वाले वर्ष' : 'Professionals — pressure years'}</li>
          </ul>
        </ContentSection>

        <div className="form-actions">
          <Link className="btn btn-primary" to="/generate">
            {copy.ctaPrimary(lang)}
          </Link>
          <Link className="btn btn-ghost" to="/whats-inside">
            {lang === 'hi' ? 'कुंडली में क्या है' : "What's inside"}
          </Link>
        </div>
      </div>
    </div>
  )
}
