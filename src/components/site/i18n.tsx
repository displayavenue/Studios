"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Lang = "en" | "hi";

const STRINGS = {
  en: {
    paySecurely: "Pay securely",
    samplePreview: "Sample preview",
    membershipIncludes: "Included with Premium",
    downloadPdf: "Download PDF",
    reportReady: "Your report is ready",
    addBirth: "Add birth details",
    support: "Contact support",
  },
  hi: {
    paySecurely: "सुरक्षित भुगतान",
    samplePreview: "नमूना पूर्वावलोकन",
    membershipIncludes: "प्रीमियम में शामिल",
    downloadPdf: "PDF डाउनलोड करें",
    reportReady: "आपकी रिपोर्ट तैयार है",
    addBirth: "जन्म विवरण जोड़ें",
    support: "सहायता से संपर्क करें",
  },
} as const;

type I18nCtx = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof STRINGS.en) => string;
};

const Ctx = createContext<I18nCtx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("jk_lang");
    if (saved === "hi" || saved === "en") setLangState(saved);
  }, []);

  function setLang(l: Lang) {
    setLangState(l);
    window.localStorage.setItem("jk_lang", l);
  }

  return (
    <Ctx.Provider value={{ lang, setLang, t: (key) => STRINGS[lang][key] }}>
      {children}
    </Ctx.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) {
    return {
      lang: "en" as Lang,
      setLang: () => undefined,
      t: (key: keyof typeof STRINGS.en) => STRINGS.en[key],
    };
  }
  return ctx;
}

export function LanguageToggle() {
  const { lang, setLang } = useI18n();
  return (
    <div className="inline-flex rounded-full border border-white/20 p-0.5 text-xs">
      <button
        type="button"
        className={`rounded-full px-2.5 py-1 ${lang === "en" ? "bg-[var(--jk-gold)] text-[var(--jk-navy)]" : "text-white/80"}`}
        onClick={() => setLang("en")}
      >
        EN
      </button>
      <button
        type="button"
        className={`rounded-full px-2.5 py-1 ${lang === "hi" ? "bg-[var(--jk-gold)] text-[var(--jk-navy)]" : "text-white/80"}`}
        onClick={() => setLang("hi")}
      >
        हिं
      </button>
    </div>
  );
}
