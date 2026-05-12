export const localesConfig = {
  en: {
    name: "English",
    nativeName: "English",
    flag: "🇬🇧",
    dir: "ltr",
    currency: "SAR",
    currencySymbol: "ر.س",
    dateFormat: "MM/DD/YYYY",
  },
  ar: {
    name: "Arabic",
    nativeName: "العربية",
    flag: "🇸🇦",
    dir: "rtl",
    currency: "SAR",
    currencySymbol: "ر.س",
    dateFormat: "DD/MM/YYYY",
  },
  fr: {
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    dir: "ltr",
    currency: "EUR",
    currencySymbol: "€",
    dateFormat: "DD/MM/YYYY",
  },
  es: {
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    dir: "ltr",
    currency: "EUR",
    currencySymbol: "€",
    dateFormat: "DD/MM/YYYY",
  },
} as const;

export type Locale = keyof typeof localesConfig;

export function getLocaleConfig(locale: string) {
  return localesConfig[locale as Locale] ?? localesConfig.en;
}

export function isRTL(locale: string): boolean {
  return locale === "ar";
}
