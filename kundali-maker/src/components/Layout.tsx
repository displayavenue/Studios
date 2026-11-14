import { Link, Outlet } from 'react-router-dom'
import { copy } from '../lib/i18n'
import type { Language } from '../astrology/types'
import { useLanguage } from '../hooks/useLanguage'
import { SITE, whatsappLink } from '../data/site'
import { formatInr, PRICING } from '../lib/pricing'

export function Layout() {
  const { lang, setLang } = useLanguage()

  return (
    <div className="site-shell lp-shell">
      <header className="site-header lp-header">
        <div className="container header-inner">
          <Link to="/" className="brand" aria-label={copy.brand(lang)}>
            <span className="brand-mark" aria-hidden>
              ✦
            </span>
            <span className="brand-text">{copy.brand(lang)}</span>
          </Link>

          <div className="nav-actions">
            <div className="lang-toggle" role="group" aria-label="Language">
              <button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>
                EN
              </button>
              <button type="button" className={lang === 'hi' ? 'active' : ''} onClick={() => setLang('hi')}>
                हिं
              </button>
            </div>
            <a className="btn btn-ghost btn-nav-cta" href={whatsappLink()} target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <a className="btn btn-primary btn-nav-cta" href="#order">
              {lang === 'hi' ? `भुगतान · ${formatInr(PRICING.kundaliInr)}` : `Pay · ${formatInr(PRICING.kundaliInr)}`}
            </a>
          </div>
        </div>
      </header>

      <main className="site-main">
        <Outlet context={{ lang } satisfies { lang: Language }} />
      </main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div>
            <strong>{copy.brand(lang)}</strong>
            <p>
              {lang === 'hi'
                ? 'वैदिक कुंडली · भुगतान या WhatsApp · PDF डिलीवरी'
                : 'Vedic kundali · pay or WhatsApp · PDF delivery'}
            </p>
          </div>
          <div className="footer-links">
            <a href="#order">{lang === 'hi' ? 'ऑर्डर' : 'Order'}</a>
            <a href={whatsappLink()} target="_blank" rel="noreferrer">
              WhatsApp {SITE.whatsappDisplay}
            </a>
            <Link to="/legal/privacy">{lang === 'hi' ? 'गोपनीयता' : 'Privacy'}</Link>
            <Link to="/legal/terms">{lang === 'hi' ? 'शर्तें' : 'Terms'}</Link>
            <Link to="/legal/refund">{lang === 'hi' ? 'रिफंड' : 'Refund'}</Link>
            <Link to="/legal/disclaimer">{lang === 'hi' ? 'अस्वीकरण' : 'Disclaimer'}</Link>
          </div>
          <p className="footer-note">
            {lang === 'hi'
              ? 'जन्म विवरण गोपनीय। रिपोर्ट मार्गदर्शन हेतु—चिकित्सा/कानूनी सलाह नहीं।'
              : 'Birth details kept private. Reports are guidance—not medical or legal advice.'}
          </p>
        </div>
      </footer>
    </div>
  )
}
