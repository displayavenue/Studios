import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { computeMilan } from '../astrology/milan'
import type { BirthDetails } from '../astrology/types'
import { useLanguage } from '../hooks/useLanguage'
import { CITIES } from '../lib/cities'
import { createMilanDraft, payForMilan, updateMilanOrder } from '../lib/milanOrders'
import { PRICING, formatInr } from '../lib/pricing'
import { fetchRazorpayStatus, startRazorpayCheckout } from '../lib/razorpay'

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

/** Shaadi pack: Milan + manglik compare at pack price, self-serve */
export function ShaadiPackPage() {
  const { lang } = useLanguage()
  const navigate = useNavigate()
  const [boy, setBoy] = useState(emptyPerson)
  const [girl, setGirl] = useState(emptyPerson)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

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

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!boy.name.trim() || !girl.name.trim() || !boy.dateOfBirth || !girl.dateOfBirth) {
      setError(lang === 'hi' ? 'दोनों के नाम व जन्म तिथि भरें।' : 'Enter both names and birth dates.')
      return
    }
    setError('')
    setBusy(true)
    const order = createMilanDraft(
      { ...boy, name: boy.name.trim(), gender: 'male', language: lang },
      { ...girl, name: girl.name.trim(), gender: 'female', language: lang },
      lang,
    )
    order.amountInr = PRICING.shaadiPackInr
    updateMilanOrder(order)

    try {
      const status = await fetchRazorpayStatus()
      if (status.configured) {
        const pay = await startRazorpayCheckout({
          product: 'shaadi',
          localOrderId: order.id,
          amountInr: PRICING.shaadiPackInr,
          customerName: `${boy.name} & ${girl.name}`,
          description: 'Shaadi Pack — Milan + Manglik',
        })
        payForMilan(order.id, { paymentId: pay.razorpayPaymentId, razorpayOrderId: pay.razorpayOrderId })
      } else if (status.allow_demo) {
        const paid = payForMilan(order.id, { paymentId: `demo_${Date.now()}` })
        if (!paid.result) {
          paid.result = computeMilan(paid.boy, paid.girl)
          updateMilanOrder(paid)
        }
      } else {
        setError(lang === 'hi' ? 'भुगतान अभी उपलब्ध नहीं।' : 'Payments not available yet.')
        setBusy(false)
        return
      }
      navigate(`/milan/result/${order.id}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed'
      if (msg !== 'Payment cancelled') setError(msg)
      setBusy(false)
    }
  }

  function fields(which: 'boy' | 'girl', form: PersonForm, setForm: (f: PersonForm) => void, title: string) {
    return (
      <fieldset className="panel milan-person">
        <legend>{title}</legend>
        <div className="form-grid two">
          <div className="field">
            <label>{lang === 'hi' ? 'नाम' : 'Name'}</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className="field">
            <label>{lang === 'hi' ? 'जन्म तिथि' : 'DOB'}</label>
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label>{lang === 'hi' ? 'समय' : 'Time'}</label>
            <input
              type="time"
              value={form.timeOfBirth}
              onChange={(e) => setForm({ ...form, timeOfBirth: e.target.value })}
              required
            />
          </div>
          <div className="field">
            <label>{lang === 'hi' ? 'स्थान' : 'Place'}</label>
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
        <h1 className="page-title">{lang === 'hi' ? 'शादी पैक' : 'Shaadi Pack'}</h1>
        <p className="page-sub">
          {lang === 'hi'
            ? `गुण मिलान + मंगलिक तुलना · ${formatInr(PRICING.shaadiPackInr)} · तुरंत PDF`
            : `Gun milan + manglik compare · ${formatInr(PRICING.shaadiPackInr)} · instant PDF`}
        </p>
        <form onSubmit={onSubmit}>
          {fields('boy', boy, setBoy, lang === 'hi' ? 'वर' : 'Boy')}
          {fields('girl', girl, setGirl, lang === 'hi' ? 'वधू' : 'Girl')}
          {error && <p className="alert">{error}</p>}
          <div className="form-actions">
            <Link className="btn btn-ghost" to="/milan">
              {lang === 'hi' ? 'केवल मिलान' : 'Milan only'}
            </Link>
            <button type="submit" className="btn btn-primary" disabled={busy}>
              {busy
                ? '…'
                : lang === 'hi'
                  ? `पे करें ${formatInr(PRICING.shaadiPackInr)}`
                  : `Pay ${formatInr(PRICING.shaadiPackInr)}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
