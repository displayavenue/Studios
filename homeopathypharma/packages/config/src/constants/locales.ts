export const LOCALES = {
  "en-IN": { code: "en-IN", language: "en", region: "IN", label: "English (India)" },
  "hi-IN": { code: "hi-IN", language: "hi", region: "IN", label: "Hindi (India)" },
  "en-US": { code: "en-US", language: "en", region: "US", label: "English (United States)" },
  "en-GB": { code: "en-GB", language: "en", region: "GB", label: "English (United Kingdom)" },
} as const;

export type LocaleCode = keyof typeof LOCALES;

export const LOCALE_CODES = Object.keys(LOCALES) as [LocaleCode, ...LocaleCode[]];

export function isLocaleCode(value: string): value is LocaleCode {
  return value in LOCALES;
}
