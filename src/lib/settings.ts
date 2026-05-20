import { createClient } from "@/lib/supabase/server";

export interface Country {
  code: string;
  name: string;
  nameAr: string;
  currency: string;
  currencySymbol: string;
  phoneCode: string;
  flag: string;
}

export const COUNTRIES: Country[] = [
  { code: "SA", name: "Saudi Arabia", nameAr: "المملكة العربية السعودية", currency: "SAR", currencySymbol: "ر.س", phoneCode: "+966", flag: "🇸🇦" },
  { code: "MA", name: "Morocco", nameAr: "المغرب", currency: "MAD", currencySymbol: "د.م.", phoneCode: "+212", flag: "🇲🇦" },
  { code: "AE", name: "United Arab Emirates", nameAr: "الإمارات العربية المتحدة", currency: "AED", currencySymbol: "د.إ", phoneCode: "+971", flag: "🇦🇪" },
  { code: "EG", name: "Egypt", nameAr: "مصر", currency: "EGP", currencySymbol: "ج.م", phoneCode: "+20", flag: "🇪🇬" },
  { code: "KW", name: "Kuwait", nameAr: "الكويت", currency: "KWD", currencySymbol: "د.ك", phoneCode: "+965", flag: "🇰🇼" },
  { code: "QA", name: "Qatar", nameAr: "قطر", currency: "QAR", currencySymbol: "ر.ق", phoneCode: "+974", flag: "🇶🇦" },
  { code: "BH", name: "Bahrain", nameAr: "البحرين", currency: "BHD", currencySymbol: "د.ب", phoneCode: "+973", flag: "🇧🇭" },
  { code: "OM", name: "Oman", nameAr: "عُمان", currency: "OMR", currencySymbol: "ر.ع", phoneCode: "+968", flag: "🇴🇲" },
  { code: "JO", name: "Jordan", nameAr: "الأردن", currency: "JOD", currencySymbol: "د.أ", phoneCode: "+962", flag: "🇯🇴" },
  { code: "LB", name: "Lebanon", nameAr: "لبنان", currency: "LBP", currencySymbol: "ل.ل", phoneCode: "+961", flag: "🇱🇧" },
  { code: "TN", name: "Tunisia", nameAr: "تونس", currency: "TND", currencySymbol: "د.ت", phoneCode: "+216", flag: "🇹🇳" },
  { code: "DZ", name: "Algeria", nameAr: "الجزائر", currency: "DZD", currencySymbol: "د.ج", phoneCode: "+213", flag: "🇩🇿" },
];

export interface StoreSettings {
  supported_countries: string[];
  default_country: string;
  currency: string;
  currency_symbol: string;
  phone_code: string;
  free_shipping_threshold: number;
  default_shipping_cost: number;
  store_phone: string;
  store_email: string;
}

const defaultSettings: StoreSettings = {
  supported_countries: ["SA", "MA", "AE", "EG", "KW", "QA", "BH", "OM", "JO", "LB", "TN", "DZ"],
  default_country: "MA",
  currency: "MAD",
  currency_symbol: "د.م.",
  phone_code: "+212",
  free_shipping_threshold: 500,
  default_shipping_cost: 50,
  store_phone: "+212 6XX XXX XXX",
  store_email: "contact@ysf.shoop",
};

let cachedSettings: StoreSettings | null = null;

export async function getStoreSettings(): Promise<StoreSettings> {
  if (cachedSettings) return cachedSettings;

  const supabase = await createClient();
  const { data } = await supabase.from("store_settings").select("key, value");

  if (!data || data.length === 0) {
    await seedSettings();
    cachedSettings = defaultSettings;
    return defaultSettings;
  }

  const settings: Record<string, unknown> = {};
  for (const item of data) {
    settings[item.key] = item.value;
  }

  cachedSettings = {
    supported_countries: (settings.supported_countries as string[]) || defaultSettings.supported_countries,
    default_country: (settings.default_country as string) || defaultSettings.default_country,
    currency: (settings.currency as string) || defaultSettings.currency,
    currency_symbol: (settings.currency_symbol as string) || defaultSettings.currency_symbol,
    phone_code: (settings.phone_code as string) || defaultSettings.phone_code,
    free_shipping_threshold: (settings.free_shipping_threshold as number) || defaultSettings.free_shipping_threshold,
    default_shipping_cost: (settings.default_shipping_cost as number) || defaultSettings.default_shipping_cost,
    store_phone: (settings.store_phone as string) || defaultSettings.store_phone,
    store_email: (settings.store_email as string) || defaultSettings.store_email,
  };

  return cachedSettings;
}

export function getCountryByCode(code: string): Country | undefined {
  return COUNTRIES.find(c => c.code === code);
}

export async function seedSettings() {
  const supabase = await createClient();
  
  for (const [key, value] of Object.entries(defaultSettings)) {
    await supabase
      .from("store_settings")
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });
  }
  
  console.log("Seed settings complete");
}

export function clearSettingsCache() {
  cachedSettings = null;
}