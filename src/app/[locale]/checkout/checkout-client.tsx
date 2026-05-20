"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { CheckCircleIcon } from "@shopify/polaris-icons";
import { formatPrice } from "@/lib/format";
import { createCODOrder } from "@/features/checkout/actions";
import { Cart, CartItem } from "@/types/database";

interface Country {
  code: string;
  name: string;
  nameAr: string;
  currency: string;
  currencySymbol: string;
  phoneCode: string;
  flag: string;
}

interface Settings {
  free_shipping_threshold: number;
  default_shipping_cost: number;
  currency_symbol: string;
  phone_code: string;
}

interface CheckoutClientProps {
  cart: Cart;
  locale: string;
  settings: Settings;
  countries: Country[];
}

export function CheckoutClient({ cart, locale, settings, countries }: CheckoutClientProps) {
  const t = useTranslations();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ fullName: "", phone: "", city: "", country: settings?.currency_symbol ? countries[0]?.code || "MA" : "MA", address: "", deliveryNotes: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const items = cart?.items || [];
  const subtotal = items.reduce((sum: number, item: CartItem) => {
    const price = item.variant?.price_override ?? item.product?.price ?? 0;
    return sum + (price * item.quantity);
  }, 0);
  
  const freeShippingThreshold = settings?.free_shipping_threshold || 500;
  const defaultShippingCost = settings?.default_shipping_cost || 50;
  const shipping = subtotal > freeShippingThreshold ? 0 : defaultShippingCost;
  const currencySymbol = settings?.currency_symbol || "ر.س";
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("fullName", form.fullName);
      formData.append("phone", form.phone);
      formData.append("city", form.city);
      formData.append("address", form.address);
      formData.append("country", countries.find(c => c.code === form.country)?.name || form.country);
      if (form.deliveryNotes) formData.append("deliveryNotes", form.deliveryNotes);
      formData.append("locale", locale);

      await createCODOrder(formData);
    } catch (e) {
      console.error(e);
      alert(t("errors.default") || "An error occurred");
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-primary mb-4">{t("cart.cartEmpty")}</h2>
          <Link href={`/${locale}/shop`} className="btn-luxury btn-luxury-primary">{t("common.continueShopping")}</Link>
        </div>
      </div>
    );
  }

  const selectedCountry = countries.find(c => c.code === form.country);

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-bold text-primary mb-8">{t("checkout.checkout")}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border p-6">
              <div className="flex gap-2 mb-6">
                <button onClick={() => setStep(1)} className={`px-4 py-2 rounded-full text-sm ${step === 1 ? "bg-gold text-white" : "bg-cream"}`}>
                  1. {t("checkout.information") || "Information"}
                </button>
                <button onClick={() => setStep(2)} className={`px-4 py-2 rounded-full text-sm ${step === 2 ? "bg-gold text-white" : "bg-cream"}`}>
                  2. {t("checkout.confirmation") || "Confirmation"}
                </button>
              </div>

              {step === 1 && (
                <form onSubmit={e => { e.preventDefault(); setStep(2); }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">{t("checkout.fullName")} *</label>
                    <input type="text" required value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder={locale === "ar" ? "أدخل اسمك الكامل" : "Enter your full name"} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t("checkout.phone")} *</label>
                    <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder={settings?.phone_code ? `${settings.phone_code} XXX XXX XXX` : "+212 6XX XXX XXX"} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{locale === "ar" ? "الدولة" : "Country"} *</label>
                    <select required value={form.country} onChange={e => setForm({ ...form, country: e.target.value, city: "" })} className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50">
                      {countries.map(c => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {locale === "ar" ? c.nameAr : c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t("checkout.city")} *</label>
                    <input type="text" required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder={locale === "ar" ? "أدخل اسم المدينة" : "Enter city name"} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t("checkout.address")} *</label>
                    <textarea required rows={3} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder={locale === "ar" ? "الحي، الشارع، المبنى، الشقة..." : "District, street, building, apartment..."} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">{t("checkout.notes") || "Notes (optional)"}</label>
                    <textarea rows={2} value={form.deliveryNotes} onChange={e => setForm({ ...form, deliveryNotes: e.target.value })} className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder={locale === "ar" ? "أي ملاحظات خاصة بالطلب" : "Any special notes for the order"} />
                  </div>
                  <button type="submit" className="btn-luxury btn-luxury-primary w-full">{t("checkout.next") || "Next"}</button>
                </form>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="bg-cream rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">{t("checkout.fullName")}:</span><span>{form.fullName}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">{t("checkout.phone")}:</span><span>{form.phone}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">{locale === "ar" ? "الدولة" : "Country"}:</span><span>{selectedCountry ? (locale === "ar" ? selectedCountry.nameAr : selectedCountry.name) : form.country}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">{t("checkout.city")}:</span><span>{form.city}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">{t("checkout.address")}:</span><span>{form.address}</span></div>
                    {form.deliveryNotes && <div className="flex justify-between"><span className="text-muted-foreground">{t("checkout.notes")}:</span><span>{form.deliveryNotes}</span></div>}
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">{t("checkout.orderSummary")}:</h3>
                    <div className="space-y-2">
                      {items.map((item: CartItem) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.product?.title} × {item.quantity}</span>
                          <span className="text-gold">{formatPrice((item.variant?.price_override ?? item.product?.price ?? 0) * item.quantity, currencySymbol)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="btn-luxury btn-luxury-secondary flex-1" disabled={isSubmitting}>{t("checkout.edit") || "Edit"}</button>
                    <button onClick={handleSubmit} className="btn-luxury btn-luxury-primary flex-1" disabled={isSubmitting}>
                      {isSubmitting ? (locale === "ar" ? "جاري التأكيد..." : "Processing...") : t("checkout.placeOrder")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="glass luxury-border rounded-xl p-6 sticky top-24">
              <h2 className="text-lg font-bold text-primary mb-4">{t("checkout.orderSummary")}</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>{t("checkout.products") || "Products"} ({items.reduce((s: number, i: CartItem) => s + i.quantity, 0)})</span>
                  <span>{formatPrice(subtotal, currencySymbol)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("checkout.shipping")}</span>
                  <span className={shipping === 0 ? "text-green-600" : ""}>{shipping === 0 ? t("checkout.free") : formatPrice(shipping, currencySymbol)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg">
                  <span>{t("cart.total")}</span>
                  <span className="text-gold">{formatPrice(total, currencySymbol)}</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded-lg text-sm text-green-700 flex items-center gap-2">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                {t("checkout.codInfo")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}