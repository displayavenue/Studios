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
            {copy.brand(lang)}
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
            <button type="button" className="btn btn-primary" onClick={() => navigate('/generate')}>
              {copy.ctaGenerate(lang)}
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
                ? 'वैदिक कुंडली · PDF · वैकल्पिक उपाय'
                : 'Vedic kundali · PDF · optional remedies'}
            </p>
          </div>
          <p>
            {lang === 'hi'
              ? 'जन्म विवरण गोपनीय रखा जाता है। चार्ट शैक्षिक/उपभोक्ता उपयोग हेतु हैं।'
              : 'Birth details stay on your device. Charts are for educational/consumer use.'}
          </p>
        </div>
      </footer>
    </div>
  )
}
