import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { copy } from '../lib/i18n'
import { useLanguage } from '../hooks/useLanguage'

export function PageHero({
  title,
  subtitle,
  cta,
}: {
  title: string
  subtitle?: string
  cta?: boolean
}) {
  const { lang } = useLanguage()
  return (
    <header className="content-hero">
      <h1 className="page-title">{title}</h1>
      {subtitle ? <p className="page-sub">{subtitle}</p> : null}
      {cta ? (
        <div className="form-actions" style={{ marginTop: '1rem' }}>
          <Link className="btn btn-primary" to="/generate">
            {copy.ctaPrimary(lang)}
          </Link>
        </div>
      ) : null}
    </header>
  )
}

export function ContentSection({
  title,
  children,
}: {
  title?: string
  children: ReactNode
}) {
  return (
    <section className="content-block">
      {title ? <h2>{title}</h2> : null}
      {children}
    </section>
  )
}
