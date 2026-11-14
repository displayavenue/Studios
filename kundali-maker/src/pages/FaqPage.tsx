import { useState } from 'react'
import { FAQS } from '../data/faq'
import { useLanguage } from '../hooks/useLanguage'
import { PageHero } from '../components/PageHero'
import { Link } from 'react-router-dom'
import { copy } from '../lib/i18n'

export function FaqPage() {
  const { lang } = useLanguage()
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="page-wrap">
      <div className="container narrow">
        <PageHero
          title={lang === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently asked questions'}
          subtitle={
            lang === 'hi'
              ? 'जन्म समय, भुगतान, PDF व गोपनीयता—सीधे उत्तर।'
              : 'Birth time, payment, PDF, and privacy—straight answers.'
          }
        />

        <div className="faq-list">
          {FAQS.map((item, idx) => {
            const isOpen = open === idx
            return (
              <div className="faq-item" key={item.qEn}>
                <button
                  type="button"
                  className="faq-q"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : idx)}
                >
                  <span>{lang === 'hi' ? item.qHi : item.qEn}</span>
                  <span className="faq-icon">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen ? (
                  <div className="faq-a">
                    <p>{lang === 'hi' ? item.aHi : item.aEn}</p>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>

        <div className="form-actions">
          <Link className="btn btn-primary" to="/generate">
            {copy.ctaPrimaryShort(lang)}
          </Link>
          <Link className="btn btn-ghost" to="/contact">
            {lang === 'hi' ? 'और पूछें' : 'Ask us'}
          </Link>
        </div>
      </div>
    </div>
  )
}
