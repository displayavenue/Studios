export const CURRENCIES = {
  INR: { code: "INR", symbol: "₹", name: "Indian Rupee", decimals: 2 },
  USD: { code: "USD", symbol: "$", name: "US Dollar", decimals: 2 },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", decimals: 2 },
  EUR: { code: "EUR", symbol: "€", name: "Euro", decimals: 2 },
  AED: { code: "AED", symbol: "د.إ", name: "UAE Dirham", decimals: 2 },
  SGD: { code: "SGD", symbol: "S$", name: "Singapore Dollar", decimals: 2 },
} as const;

export type CurrencyCode = keyof typeof CURRENCIES;

export const CURRENCY_CODES = Object.keys(CURRENCIES) as [CurrencyCode, ...CurrencyCode[]];

export function isCurrencyCode(value: string): value is CurrencyCode {
  return value in CURRENCIES;
}
