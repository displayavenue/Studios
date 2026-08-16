import { useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../hooks/useLanguage'
import { getOrder, listOrders } from '../lib/orders'
import { PageHero } from '../components/PageHero'
import { formatInr } from '../lib/pricing'

export function OrdersPage() {
  const { lang } = useLanguage()
  const [query, setQuery] = useState('')
  const [searched, setSearched] = useState('')
  const recent = useMemo(() => listOrders().slice(0, 8), [searched])

  const found = searched ? getOrder(searched) : undefined

  function onSearch(e: FormEvent) {
    e.preventDefault()
    setSearched(query.trim().toUpperCase())
  }

  return (
    <div className="page-wrap">
      <div className="container narrow">
        <PageHero
          title={lang === 'hi' ? 'ऑर्डर खोजें' : 'Order lookup'}
          subtitle={
            lang === 'hi'
              ? 'Order ID से अपनी कुंडली फिर खोलें (इस डिवाइस पर सहेजे ऑर्डर)।'
              : 'Re-open your kundali with Order ID (orders saved on this device).'
          }
        />

        <form onSubmit={onSearch} className="form-grid" style={{ marginBottom: '1.5rem' }}>
          <div className="field">
            <label htmlFor="orderQuery">{lang === 'hi' ? 'ऑर्डर ID' : 'Order ID'}</label>
            <input
              id="orderQuery"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="JK-…"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              {lang === 'hi' ? 'खोजें' : 'Find'}
            </button>
          </div>
        </form>

        {searched && !found && (
          <p className="alert">
            {lang === 'hi'
              ? 'इस डिवाइस पर ऑर्डर नहीं मिला। Order ID जाँचें या उसी ब्राउज़र से फिर कोशिश करें।'
              : 'Order not found on this device. Check the Order ID or retry from the same browser.'}
          </p>
        )}

        {found && (
          <div className="panel">
            <h3>{found.id}</h3>
            <div className="kv">
              <div>
                <span>{lang === 'hi' ? 'नाम' : 'Name'}</span>
                <span>{found.details.name}</span>
              </div>
              <div>
                <span>{lang === 'hi' ? 'स्थिति' : 'Status'}</span>
                <span>{found.status}</span>
              </div>
              <div>
                <span>{lang === 'hi' ? 'कुंडली' : 'Kundali'}</span>
                <span>{formatInr(found.amountKundali)}</span>
              </div>
            </div>
            <div className="form-actions">
              {found.status === 'draft' ? (
                <Link className="btn btn-primary" to={`/pay/${found.id}`}>
                  {lang === 'hi' ? 'भुगतान पूरा करें' : 'Complete payment'}
                </Link>
              ) : (
                <Link className="btn btn-primary" to={`/result/${found.id}`}>
                  {lang === 'hi' ? 'कुंडली खोलें' : 'Open kundali'}
                </Link>
              )}
              {found.status !== 'draft' && (
                <Link className="btn btn-ghost" to={`/remedies/${found.id}`}>
                  {lang === 'hi' ? 'उपाय' : 'Remedies'}
                </Link>
              )}
            </div>
          </div>
        )}

        {recent.length > 0 && (
          <div className="content-block">
            <h2>{lang === 'hi' ? 'इस डिवाइस पर हाल के ऑर्डर' : 'Recent orders on this device'}</h2>
            <ul className="include-list">
              {recent.map((o) => (
                <li key={o.id}>
                  <Link to={o.status === 'draft' ? `/pay/${o.id}` : `/result/${o.id}`}>
                    {o.id} — {o.details.name} ({o.status})
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
