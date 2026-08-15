import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { BirthDetails } from '../astrology/types'
import { useLanguage } from '../hooks/useLanguage'
import { CITIES } from '../lib/cities'
import { createMilanDraft } from '../lib/milanOrders'
import { formatInr, PRICING } from '../lib/pricing'

type PersonForm = Omit<BirthDetails, 'language' | 'gender' | 'whatsapp'>

const emptyPerson = (): PersonForm => ({
  name: '',
  dateOfBirth: '',
  timeOfBirth: '10:00',
  placeName: CITIES[0].name,
  latitude: CITIES[0].latitude,
  longitude: CITIES[0].longitude,
  timezoneOffsetMinutes: CITIES[0].timezoneOffsetMinutes,
})

export function MilanPage() {
  const { lang } = useLanguage()
  const navigate = useNavigate()
  const [boy, setBoy] = useState<PersonForm>(emptyPerson)
  const [girl, setGirl] = useState<PersonForm>(emptyPerson)
  const [whatsapp, setWhatsapp] = useState('')
  const [error, setError] = useState('')

  const cityOptions = useMemo(
    () => CITIES.map((c) => ({ ...c, label: lang === 'hi' ? `${c.nameHi} (${c.name})` : c.name })),
    [lang],
  )

  function applyCity(which: 'boy' | 'girl', name: string) {
    const city = CITIES.find((c) => c.name === name) ?? CITIES[0]
    const patch = {
      placeName: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
      timezoneOffsetMinutes: city.timezoneOffsetMinutes,
    }
    if (which === 'boy') setBoy((f) => ({ ...f, ...patch }))
    else setGirl((f) => ({ ...f, ...patch }))
  }

  function validate(): boolean {
    if (!boy.name.trim() || !girl.name.trim()) {
      setError(lang === 'hi' ? 'वर व वधू दोनों के नाम आवश्यक।' : 'Both names are required.')
      return false
    }
    if (!boy.dateOfBirth || !girl.dateOfBirth || !boy.timeOfBirth || !girl.timeOfBirth) {
      setError(lang === 'hi' ? 'दोनों की जन्म तिथि व समय भरें।' : 'Enter date and time for both.')
      return false
    }
    setError('')
    return true
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate()) return
    const order = createMilanDraft(
      { ...boy, name: boy.name.trim(), gender: 'male', language: lang },
      { ...girl, name: girl.name.trim(), gender: 'female', language: lang },
      lang,
      whatsapp || undefined,
    )
    navigate(`/milan/pay/${order.id}`)
  }

  function personFields(
    which: 'boy' | 'girl',
    form: PersonForm,
    setForm: (f: PersonForm) => void,
    title: string,
  ) {
    return (
      <fieldset className="panel milan-person">
        <legend>{title}</legend>
        <div className="form-grid two">
          <div className="field">
            <label>{lang === 'hi' ? 'नाम' : 'Name'}</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
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
            <label>{lang === 'hi' ? 'जन्म स्थान' : 'Place of birth'}</label>
            <select value={form.placeName} onChange={(e) => applyCity(which, e.target.value)}>
              {cityOptions.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </fieldset>
    )
  }

  return (
    <div className="page-wrap">
      <div className="container">
        <h1 className="page-title">{lang === 'hi' ? 'कुंडली मिलान (गुण मिलान)' : 'Kundali Milan (Gun Milan)'}</h1>
        <p className="page-sub">
          {lang === 'hi'
            ? `अष्टकूट ३६ अंक + मंगलिक तुलना · PDF · ${formatInr(PRICING.milanInr)} एक बार।`
            : `Ashtakoot 36-point matching + manglik compare · PDF · ${formatInr(PRICING.milanInr)} one-time.`}
        </p>

        <form onSubmit={onSubmit}>
          {personFields('boy', boy, setBoy, lang === 'hi' ? 'वर (पुरुष)' : 'Boy / Groom')}
          {personFields('girl', girl, setGirl, lang === 'hi' ? 'वधू (महिला)' : 'Girl / Bride')}

          <div className="field" style={{ marginTop: '1rem' }}>
            <label htmlFor="mwa">
              {lang === 'hi' ? 'आपका WhatsApp (वैकल्पिक—PDF डिलीवरी हेतु)' : 'Your WhatsApp (optional—for PDF delivery)'}
            </label>
            <input
              id="mwa"
              inputMode="tel"
              placeholder="91XXXXXXXXXX"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>

          {error && <p className="alert">{error}</p>}

          <div className="form-actions">
            <Link className="btn btn-ghost" to="/sample">
              {lang === 'hi' ? 'कुंडली SAMPLE देखें' : 'See kundali SAMPLE'}
            </Link>
            <button type="submit" className="btn btn-primary">
              {lang === 'hi'
                ? `जारी रखें · ${formatInr(PRICING.milanInr)}`
                : `Continue · ${formatInr(PRICING.milanInr)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
