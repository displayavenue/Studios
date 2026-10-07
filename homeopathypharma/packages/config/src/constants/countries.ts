export interface CountryDefinition {
  code: string;
  name: string;
  defaultCurrency: string;
  defaultLocale: string;
  phonePrefix: string;
}

/** Primary markets — extend via database for full ISO-3166 coverage at runtime. */
export const COUNTRIES: Record<string, CountryDefinition> = {
  IN: {
    code: "IN",
    name: "India",
    defaultCurrency: "INR",
    defaultLocale: "en-IN",
    phonePrefix: "+91",
  },
  US: {
    code: "US",
    name: "United States",
    defaultCurrency: "USD",
    defaultLocale: "en-US",
    phonePrefix: "+1",
  },
  GB: {
    code: "GB",
    name: "United Kingdom",
    defaultCurrency: "GBP",
    defaultLocale: "en-GB",
    phonePrefix: "+44",
  },
  AE: {
    code: "AE",
    name: "United Arab Emirates",
    defaultCurrency: "AED",
    defaultLocale: "en-IN",
    phonePrefix: "+971",
  },
  SG: {
    code: "SG",
    name: "Singapore",
    defaultCurrency: "SGD",
    defaultLocale: "en-IN",
    phonePrefix: "+65",
  },
} as const;

export type CountryCode = keyof typeof COUNTRIES;

export const COUNTRY_CODES = Object.keys(COUNTRIES) as [CountryCode, ...CountryCode[]];

export function isCountryCode(value: string): value is CountryCode {
  return value in COUNTRIES;
}
