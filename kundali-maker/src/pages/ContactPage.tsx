import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { SITE, whatsappLink } from '../data/site'
import { useLanguage } from '../hooks/useLanguage'
import { PageHero, ContentSection } from '../components/PageHero'

export function ContactPage() {
  const { lang } = useLanguage()
  const [name, setName] = useState('')
  const [orderId, setOrderId] = useState('')
  const [message, setMessage] = useState('')

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    const body =
      lang === 'hi'
        ? `नमस्ते, मेरा नाम ${name || '—'} है।\nऑर्डर: ${orderId || '—'}\nसंदेश: ${message || '—'}`
        : `Namaste, my name is ${name || '—'}.\nOrder: ${orderId || '—'}\nMessage: ${message || '—'}`
    window.open(whatsappLink(body), '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="page-wrap">
      <div className="container narrow">
        <PageHero
          title={lang === 'hi' ? 'संपर्क' : 'Contact'}
          subtitle={
            lang === 'hi'
              ? 'ऑर्डर सहायता, PDF, या लॉन्च अलर्ट—WhatsApp सबसे तेज़ है।'
              : 'Order help, PDF issues, or launch alerts—WhatsApp is fastest.'
          }
        />

        <ContentSection>
          <div className="kv">
            <div>
              <span>WhatsApp</span>
              <span>
                <a href={whatsappLink()} target="_blank" rel="noreferrer">
                  {SITE.whatsappDisplay}
                </a>
              </span>
            </div>
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
          </div>
        </ContentSection>

        <ContentSection title={lang === 'hi' ? 'WhatsApp संदेश भेजें' : 'Send a WhatsApp message'}>
          <form onSubmit={onSubmit} className="form-grid">
            <div className="field">
              <label htmlFor="cname">{lang === 'hi' ? 'नाम' : 'Name'}</label>
              <input id="cname" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="oid">{lang === 'hi' ? 'ऑर्डर ID (यदि हो)' : 'Order ID (if any)'}</label>
              <input id="oid" value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="JK-…" />
            </div>
            <div className="field">
              <label htmlFor="msg">{lang === 'hi' ? 'संदेश' : 'Message'}</label>
              <input id="msg" value={message} onChange={(e) => setMessage(e.target.value)} required />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {lang === 'hi' ? 'WhatsApp खोलें' : 'Open WhatsApp'}
              </button>
            </div>
          </form>
          <p className="muted" style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
            {lang === 'hi'
              ? 'नोट: लाइव नंबर अपडेट होने तक डेमो नंबर दिख सकता है—site.ts में बदलें।'
              : 'Note: Replace the demo WhatsApp number in site settings when ready.'}
          </p>
        </ContentSection>
      </div>
    </div>
  )
}
