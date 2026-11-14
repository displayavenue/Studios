import { useMemo, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import type { BirthDetails } from '../astrology/types'
import type { CatalogProductId } from '../astrology/catalog'
import { useLanguage } from '../hooks/useLanguage'
import { CITIES } from '../lib/cities'
import { catalogAmount, createCatalogDraft } from '../lib/catalogOrders'
import { formatInr } from '../lib/pricing'
import { SERVICES } from '../data/services'

const PRODUCT_IDS: CatalogProductId[] = [
  'career',
  'manglik',
  'varshphal',
  'muhurat',
  'deep',
  'student',
  'business',
]

const empty = {
  name: '',
  gender: 'male' as BirthDetails['gender'],
  dateOfBirth: '',
  timeOfBirth: '10:30',
  placeName: CITIES[0].name,
  latitude: CITIES[0].latitude,
  longitude: CITIES[0].longitude,
  timezoneOffsetMinutes: CITIES[0].timezoneOffsetMinutes,
}

export function ShopProductPage() {
  const { productId = '' } = useParams()
  const { lang, setLang } = useLanguage()
  const navigate = useNavigate()
  const [form, setForm] = useState(empty)
  const [eventType, setEventType] = useState('wedding')
  const [error, setError] = useState('')

  const pid = productId as CatalogProductId
  const service = SERVICES.find((s) => s.id === pid || s.slug.includes(pid))

  if (!PRODUCT_IDS.includes(pid)) {
    return <Navigate to="/services" replace />
  }

  const amount = catalogAmount(pid)
  const cityOptions = useMemo(
    () => CITIES.map((c) => ({ ...c, label: lang === 'hi' ? `${c.nameHi} (${c.name})` : c.name })),
    [lang],
  )

  function onCity(name: string) {
    const city = CITIES.find((c) => c.name === name) ?? CITIES[0]
    setForm((f) => ({
      ...f,
      placeName: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
      timezoneOffsetMinutes: city.timezoneOffsetMinutes,
    }))
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.dateOfBirth || !form.timeOfBirth) {
      setError(lang === 'hi' ? 'नाम, तिथि व समय आवश्यक।' : 'Name, date and time are required.')
      return
    }
    setError('')
    const details: BirthDetails = { ...form, name: form.name.trim(), language: lang }
    const order = createCatalogDraft(pid, details, lang, pid === 'muhurat' ? eventType : undefined)
    navigate(`/shop/${pid}/pay/${order.id}`)
  }

  const title = service
    ? lang === 'hi'
      ? service.titleHi
      : service.titleEn
    : pid
  const blurb = service ? (lang === 'hi' ? service.blurbHi : service.blurbEn) : ''

  return (
    <div className="page-wrap">
      <div className="container">
        <h1 className="page-title anim-rise">{title}</h1>
        <p className="page-sub anim-rise delay-1">
          {blurb} · {formatInr(amount)} · {lang === 'hi' ? 'तुरंत PDF · बिना कॉल' : 'Instant PDF · no calls'}
        </p>

        <form onSubmit={onSubmit} className="anim-rise delay-2">
          {pid === 'muhurat' && (
            <div className="field" style={{ marginBottom: '1rem' }}>
              <label htmlFor="event">{lang === 'hi' ? 'कार्य प्रकार' : 'Event type'}</label>
              <select id="event" value={eventType} onChange={(e) => setEventType(e.target.value)}>
                <option value="wedding">{lang === 'hi' ? 'विवाह' : 'Wedding'}</option>
                <option value="griha">{lang === 'hi' ? 'गृह प्रवेश' : 'Griha pravesh'}</option>
                <option value="business">{lang === 'hi' ? 'व्यवसाय शुभारंभ' : 'Business opening'}</option>
              </select>
            </div>
          )}
          <div className="form-grid two">
            <div className="field">
              <label>{lang === 'hi' ? 'नाम' : 'Name'}</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="field">
              <label>{lang === 'hi' ? 'लिंग' : 'Gender'}</label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value as BirthDetails['gender'] })}
              >
                <option value="male">{lang === 'hi' ? 'पुरुष' : 'Male'}</option>
                <option value="female">{lang === 'hi' ? 'महिला' : 'Female'}</option>
                <option value="other">{lang === 'hi' ? 'अन्य' : 'Other'}</option>
              </select>
            </div>
            <div className="field">
              <label>{lang === 'hi' ? 'जन्म तिथि' : 'Date of birth'}</label>
              <input
                type="date"
                value={form.dateOfBirth}
                onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label>{lang === 'hi' ? 'जन्म समय' : 'Time of birth'}</label>
              <input
                type="time"
                value={form.timeOfBirth}
                onChange={(e) => setForm({ ...form, timeOfBirth: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label>{lang === 'hi' ? 'जन्म स्थान' : 'Place'}</label>
              <select value={form.placeName} onChange={(e) => onCity(e.target.value)}>
                {cityOptions.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>{lang === 'hi' ? 'भाषा' : 'Language'}</label>
              <select value={lang} onChange={(e) => setLang(e.target.value as 'en' | 'hi')}>
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
              </select>
            </div>
          </div>
          {error && <p className="alert">{error}</p>}
          <div className="form-actions">
            <Link className="btn btn-ghost" to="/services">
              {lang === 'hi' ? 'सभी सेवाएँ' : 'All services'}
            </Link>
            <button type="submit" className="btn btn-primary">
              {lang === 'hi' ? `आगे बढ़ें · ${formatInr(amount)}` : `Continue · ${formatInr(amount)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
