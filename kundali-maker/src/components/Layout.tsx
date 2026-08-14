import { Link, Outlet, useNavigate } from 'react-router-dom'
import { copy } from '../lib/i18n'
import type { Language } from '../astrology/types'
import { useLanguage } from '../hooks/useLanguage'

export function Layout() {
  const { lang, setLang } = useLanguage()
  const navigate = useNavigate()

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand" aria-label={copy.brand(lang)}>
            <span className="brand-mark" aria-hidden>
              ✦
            </span>
            <span className="brand-text">{copy.brand(lang)}</span>
          </Link>
          <div className="nav-actions">
            <div className="lang-toggle" role="group" aria-label="Language">
              <button
                type="button"
                className={lang === 'en' ? 'active' : ''}
                onClick={() => setLang('en')}
              >
                EN
              </button>
              <button
                type="button"
                className={lang === 'hi' ? 'active' : ''}
                onClick={() => setLang('hi')}
              >
                हिं
              </button>
            </div>
            <button
              type="button"
              className="btn btn-primary btn-nav-cta"
              onClick={() => navigate('/generate')}
            >
              <span className="cta-full">{copy.ctaPrimaryShort(lang)}</span>
            </button>
          </div>
        </div>
      </header>
      <main className="site-main">
        <Outlet context={{ lang } satisfies { lang: Language }} />
      </main>
      <footer className="site-footer">
        <div className="container footer-inner">
          <div>
            <strong>{copy.brand(lang)}</strong>
            <p>
              {lang === 'hi'
                ? 'प्रामाणिक वैदिक कुंडली · PDF · वैकल्पिक उपाय'
                : 'Authentic Vedic kundali · PDF · optional remedies'}
            </p>
          </div>
          <p>
            {lang === 'hi'
              ? 'जन्म विवरण आपके उपकरण पर रहते हैं। रिपोर्ट शैक्षिक/व्यक्तिगत मार्गदर्शन हेतु हैं।'
              : 'Birth details stay on your device. Reports are for personal guidance and education.'}
          </p>
        </div>
      </footer>
    </div>
  )
}
