import { Link } from 'react-router-dom'
import { SITE } from '../data/site'
import { useLanguage } from '../hooks/useLanguage'
import { PageHero, ContentSection } from '../components/PageHero'

export function ContactPage() {
  const { lang } = useLanguage()

  return (
    <div className="page-wrap">
      <div className="container narrow">
        <PageHero
          title={lang === 'hi' ? 'संपर्क' : 'Contact'}
          subtitle={
            lang === 'hi'
              ? 'यह स्वयं-सेवा साइट है—कुंडली/मिलान तुरंत PDF से मिलते हैं। दुर्लभ भुगतान समस्या हेतु ईमेल।'
              : 'This is a self-serve site—kundali/milan unlock as instant PDFs. Email only for rare payment issues.'
          }
        />

        <ContentSection>
          <div className="kv">
            <div>
              <span>Email</span>
              <span>
                <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>
              </span>
            </div>
            <div>
              <span>{lang === 'hi' ? 'ऑर्डर खोजें' : 'Find order'}</span>
              <span>
                <Link to="/orders">{lang === 'hi' ? 'Order lookup' : 'Order lookup'}</Link>
              </span>
            </div>
            <div>
              <span>{lang === 'hi' ? 'विशेषताएँ' : 'Features'}</span>
              <span>
                <Link to="/features">{lang === 'hi' ? '५० विशेषताएँ देखें' : 'See 50 features'}</Link>
              </span>
            </div>
          </div>
          <p className="muted" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
            {lang === 'hi'
              ? 'कोई फोन/WhatsApp परामर्श या पंडित चैट नहीं—भुगतान के बाद रिपोर्ट अपने आप खुलती है।'
              : 'No phone/WhatsApp consults or pandit chat—reports unlock automatically after payment.'}
          </p>
        </ContentSection>
      </div>
    </div>
  )
}
