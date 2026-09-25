import { Link } from 'react-router-dom'
import { PageHero, ContentSection } from '../components/PageHero'
import { useLanguage } from '../hooks/useLanguage'
import { copy } from '../lib/i18n'
import { formatInr, PRICING } from '../lib/pricing'
import { downloadSampleKundaliPdf } from '../lib/samplePdf'

export function SamplePage() {
  const { lang } = useLanguage()

  return (
    <div className="page-wrap">
      <div className="container narrow">
        <PageHero
          title={lang === 'hi' ? 'नमूना रिपोर्ट देखें' : 'See a sample report'}
          subtitle={
            lang === 'hi'
              ? 'पेमेंट से पहले शैली समझें—यह डेमो जन्म से बना मुफ़्त SAMPLE PDF है।'
              : 'Understand the style before you pay—free SAMPLE PDF from demo birth data.'
          }
        />

        <ContentSection>
          <p className="muted">
            {lang === 'hi'
              ? `पूरा भुगतान वाला PDF ~२० पृष्ठ का होता है (${formatInr(PRICING.kundaliInr)})। नमूना ५ पृष्ठ दिखाता है कि भाव, जीवन अध्याय और सारांश कैसे लिखे जाते हैं।`
              : `The paid PDF is ~20 pages (${formatInr(PRICING.kundaliInr)}). This 5-page sample shows how houses, life chapters, and summaries are written.`}
          </p>
          <div className="form-actions" style={{ marginTop: '1.25rem' }}>
            <button type="button" className="btn btn-primary" onClick={() => downloadSampleKundaliPdf()}>
              {lang === 'hi' ? 'मुफ़्त SAMPLE PDF डाउनलोड' : 'Download free SAMPLE PDF'}
            </button>
            <Link className="btn btn-secondary" to="/generate">
              {copy.ctaPrimary(lang)}
            </Link>
          </div>
        </ContentSection>

        <ContentSection title={lang === 'hi' ? 'नमूने में क्या है' : "What's in the sample"}>
          <ul className="include-list">
            {(lang === 'hi'
              ? [
                  'कवर व डेमो जन्म झलक',
                  'भाव पाठ उदाहरण (१–३)',
                  'व्यक्तित्व व करियर अंश',
                  'पूर्ण PDF में क्या-क्या आता है—सूची',
                  'हर पृष्ठ पर SAMPLE वॉटरमार्क',
                ]
              : [
                  'Cover + demo birth snapshot',
                  'House reading examples (1–3)',
                  'Personality & career excerpts',
                  'Checklist of the full ~20 page PDF',
                  'SAMPLE watermark on every page',
                ]
            ).map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </ContentSection>
      </div>
    </div>
  )
}
