import { useMemo, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import type { BirthDetails } from '../astrology/types'
import { useLanguage } from '../hooks/useLanguage'
import { CITIES } from '../lib/cities'
import { createDraftOrder } from '../lib/orders'

const empty = {
  name: '',
  gender: 'male' as BirthDetails['gender'],
  dateOfBirth: '',
  timeOfBirth: '12:00',
  placeName: CITIES[0].name,
  latitude: CITIES[0].latitude,
  longitude: CITIES[0].longitude,
  timezoneOffsetMinutes: CITIES[0].timezoneOffsetMinutes,
}

export function GeneratePage() {
  const { lang, setLang } = useLanguage()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')

  const cityOptions = useMemo(
    () =>
      CITIES.map((c) => ({
        ...c,
        label: lang === 'hi' ? `${c.nameHi} (${c.name})` : c.name,
      })),
    [lang],
  )

  function onCityChange(name: string) {
    const city = CITIES.find((c) => c.name === name) ?? CITIES[0]
    setForm((f) => ({
      ...f,
      placeName: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
      timezoneOffsetMinutes: city.timezoneOffsetMinutes,
    }))
  }

  function validateStep1(): boolean {
    if (!form.name.trim()) {
      setError(lang === 'hi' ? 'नाम आवश्यक है।' : 'Name is required.')
      return false
    }
    if (!form.dateOfBirth) {
      setError(lang === 'hi' ? 'जन्म तिथि आवश्यक है।' : 'Date of birth is required.')
      return false
    }
    if (!form.timeOfBirth) {
      setError(lang === 'hi' ? 'जन्म समय आवश्यक है।' : 'Time of birth is required.')
      return false
    }
    setError('')
    return true
  }

  function goPreview(e: FormEvent) {
    e.preventDefault()
    if (!validateStep1()) return
    setStep(2)
  }

  function confirmAndPay() {
    const details: BirthDetails = {
      ...form,
      name: form.name.trim(),
      language: lang,
    }
    const order = createDraftOrder(details)
    navigate(`/pay/${order.id}`)
  }

  return (
    <div className="page-wrap">
      <div className="container">
        <h1 className="page-title">
          {lang === 'hi' ? 'कुंडली के लिए विवरण' : 'Birth details for kundali'}
        </h1>
        <p className="page-sub">
          {lang === 'hi'
            ? 'सटीक समय और स्थान बेहतर लग्न देते हैं।'
            : 'Accurate time and place give a better lagna.'}
        </p>

        <div className="steps-bar">
          <span className={step === 1 ? 'active' : 'done'}>
            1. {lang === 'hi' ? 'विवरण' : 'Details'}
          </span>
          <span className={step === 2 ? 'active' : ''}>
            2. {lang === 'hi' ? 'पुष्टि' : 'Confirm'}
          </span>
          <span>3. {lang === 'hi' ? 'भुगतान' : 'Pay'}</span>
          <span>4. {lang === 'hi' ? 'कुंडली' : 'Kundali'}</span>
        </div>

        {step === 1 && (
          <form onSubmit={goPreview}>
            <div className="form-grid two">
              <div className="field">
                <label htmlFor="name">{lang === 'hi' ? 'पूरा नाम' : 'Full name'}</label>
                <input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder={lang === 'hi' ? 'उदा. आरव शर्मा' : 'e.g. Aarav Sharma'}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="gender">{lang === 'hi' ? 'लिंग' : 'Gender'}</label>
                <select
                  id="gender"
                  value={form.gender}
                  onChange={(e) =>
                    setForm({ ...form, gender: e.target.value as BirthDetails['gender'] })
                  }
                >
                  <option value="male">{lang === 'hi' ? 'पुरुष' : 'Male'}</option>
                  <option value="female">{lang === 'hi' ? 'महिला' : 'Female'}</option>
                  <option value="other">{lang === 'hi' ? 'अन्य' : 'Other'}</option>
                </select>
              </div>
              <div className="field">
                <label htmlFor="dob">{lang === 'hi' ? 'जन्म तिथि' : 'Date of birth'}</label>
                <input
                  id="dob"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="tob">{lang === 'hi' ? 'जन्म समय' : 'Time of birth'}</label>
                <input
                  id="tob"
                  type="time"
                  value={form.timeOfBirth}
                  onChange={(e) => setForm({ ...form, timeOfBirth: e.target.value })}
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="place">{lang === 'hi' ? 'जन्म स्थान' : 'Place of birth'}</label>
                <select
                  id="place"
                  value={form.placeName}
                  onChange={(e) => onCityChange(e.target.value)}
                >
                  {cityOptions.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="reportLang">{lang === 'hi' ? 'रिपोर्ट भाषा' : 'Report language'}</label>
                <select
                  id="reportLang"
                  value={lang}
                  onChange={(e) => setLang(e.target.value as 'en' | 'hi')}
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी</option>
                </select>
              </div>
            </div>
            {error && <p className="alert">{error}</p>}
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {lang === 'hi' ? 'समीक्षा करें' : 'Review details'}
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <div className="panel">
            <h3>{lang === 'hi' ? 'पुष्टि करें' : 'Confirm before payment'}</h3>
            <div className="kv">
              <div>
                <span>{lang === 'hi' ? 'नाम' : 'Name'}</span>
                <span>{form.name}</span>
              </div>
              <div>
                <span>{lang === 'hi' ? 'जन्म' : 'Birth'}</span>
                <span>
                  {form.dateOfBirth} · {form.timeOfBirth}
                </span>
              </div>
              <div>
                <span>{lang === 'hi' ? 'स्थान' : 'Place'}</span>
                <span>
                  {form.placeName} ({form.latitude.toFixed(2)}°, {form.longitude.toFixed(2)}°)
                </span>
              </div>
              <div>
                <span>{lang === 'hi' ? 'भाषा' : 'Language'}</span>
                <span>{lang === 'hi' ? 'हिन्दी' : 'English'}</span>
              </div>
            </div>
            <div className="form-actions">
              <button type="button" className="btn btn-ghost" onClick={() => setStep(1)}>
                {lang === 'hi' ? 'वापस' : 'Back'}
              </button>
              <button type="button" className="btn btn-primary" onClick={confirmAndPay}>
                {lang === 'hi' ? 'भुगतान पर जाएँ' : 'Continue to payment'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
