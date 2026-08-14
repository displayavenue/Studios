import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Language } from '../astrology/types'

const LangContext = createContext<{
  lang: Language
  setLang: (l: Language) => void
} | null>(null)

const KEY = 'jyotish_lang'

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem(KEY)
    return saved === 'hi' || saved === 'en' ? saved : 'en'
  })

  const value = useMemo(
    () => ({
      lang,
      setLang: (l: Language) => {
        localStorage.setItem(KEY, l)
        setLangState(l)
      },
    }),
    [lang],
  )

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

export function useLanguage() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
