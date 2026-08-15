import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { copy } from '../lib/i18n'
import type { Language } from '../astrology/types'
import { useLanguage } from '../hooks/useLanguage'
import { whatsappLink } from '../data/site'

const NAV = [
  { to: '/services', en: 'Services', hi: 'सेवाएँ' },
  { to: '/milan', en: 'Milan', hi: 'मिलान' },
  { to: '/sample', en: 'Sample', hi: 'नमूना' },
  { to: '/pricing', en: 'Pricing', hi: 'मूल्य' },
  { to: '/faq', en: 'FAQ', hi: 'FAQ' },
  { to: '/contact', en: 'Contact', hi: 'संपर्क' },
] as const

export function Layout() {
  const { lang, setLang } = useLanguage()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  function go(to: string) {
    setMenuOpen(false)
    navigate(to)
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="container header-inner">
          <Link to="/" className="brand" aria-label={copy.brand(lang)} onClick={() => setMenuOpen(false)}>
            <span className="brand-mark" aria-hidden>
              ✦
            </span>
            <span className="brand-text">{copy.brand(lang)}</span>
          </Link>

          <nav className="nav-desktop" aria-label="Primary">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : undefined)}>
                {lang === 'hi' ? item.hi : item.en}
              </NavLink>
            ))}
          </nav>

          <div className="nav-actions">
            <div className="lang-toggle" role="group" aria-label="Language">
              <button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>
                EN
              </button>
              <button type="button" className={lang === 'hi' ? 'active' : ''} onClick={() => setLang('hi')}>
                हिं
              </button>
            </div>
            <button type="button" className="btn btn-primary btn-nav-cta" onClick={() => go('/generate')}>
              <span className="cta-full">{copy.ctaPrimaryShort(lang)}</span>
            </button>
            <button
              type="button"
              className="menu-toggle"
              aria-expanded={menuOpen}
              aria-label={lang === 'hi' ? 'मेनू' : 'Menu'}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="mobile-drawer container">
            {NAV.map((item) => (
              <button key={item.to} type="button" className="drawer-link" onClick={() => go(item.to)}>
                {lang === 'hi' ? item.hi : item.en}
              </button>
            ))}
            <button type="button" className="drawer-link" onClick={() => go('/orders')}>
              {lang === 'hi' ? 'ऑर्डर खोजें' : 'Order lookup'}
            </button>
            <a
              className="drawer-link"
              href={whatsappLink()}
              target="_blank"
              rel="noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              WhatsApp
            </a>
          </div>
        )}
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
                ? 'प्रामाणिक वैदिक कुंडली · PDF · वैकल्पिक उपाय'
                : 'Authentic Vedic kundali · PDF · optional remedies'}
            </p>
          </div>
          <div className="footer-links">
            <Link to="/services">{lang === 'hi' ? 'सेवाएँ' : 'Services'}</Link>
            <Link to="/milan">{lang === 'hi' ? 'कुंडली मिलान' : 'Kundali Milan'}</Link>
            <Link to="/sample">{lang === 'hi' ? 'नमूना PDF' : 'Sample PDF'}</Link>
            <Link to="/pricing">{lang === 'hi' ? 'मूल्य' : 'Pricing'}</Link>
            <Link to="/whats-inside">{lang === 'hi' ? 'कुंडली में क्या' : "What's inside"}</Link>
            <Link to="/faq">FAQ</Link>
            <Link to="/about">{lang === 'hi' ? 'परिचय' : 'About'}</Link>
            <Link to="/contact">{lang === 'hi' ? 'संपर्क' : 'Contact'}</Link>
            <Link to="/orders">{lang === 'hi' ? 'ऑर्डर' : 'Orders'}</Link>
          </div>
          <div className="footer-links">
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

      <a
        className="wa-float"
        href={whatsappLink('Namaste, I want help ordering from Jyotish Kundali.')}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
      >
        WhatsApp
      </a>
    </div>
  )
}
