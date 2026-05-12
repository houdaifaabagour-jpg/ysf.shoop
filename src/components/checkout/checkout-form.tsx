"use client";

import { useState } from "react";
import { createCODOrder } from "@/features/checkout/actions";
import type { CartItem } from "@/types/database";
import { Check, Lock } from "lucide-react";
import { useTranslations } from "next-intl";

interface CheckoutFormProps {
  cart: { id: string; items: CartItem[] };
}

export function CheckoutForm({ cart }: CheckoutFormProps) {
  const [couponId, setCouponId] = useState("");
  const [discount, setDiscount] = useState(0);
  const t = useTranslations("checkout");

  const handleCouponChange = (newCouponId: string, newDiscount: number) => {
    setCouponId(newCouponId);
    setDiscount(newDiscount);
  };

  return (
    <div className="space-y-6">
      <div className="double-bezel p-4">
        <div className="double-bezel-inner p-4">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-gold text-white text-xs flex items-center justify-center">1</span>
            معلومات الشحن
          </h3>

          <form action={createCODOrder} className="space-y-4">
            <input type="hidden" name="couponId" value={couponId} />
            <input type="hidden" name="discount" value={discount} />

            <div>
              <label htmlFor="fullName" className="text-sm font-medium block mb-1.5">{t("fullName")}</label>
              <input
                id="fullName"
                name="fullName"
                required
                className="w-full rounded-xl border border-border px-4 py-3 text-sm bg-muted/50 focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div>
              <label htmlFor="phone" className="text-sm font-medium block mb-1.5">{t("phone")}</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                className="w-full rounded-xl border border-border px-4 py-3 text-sm bg-muted/50 focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div>
              <label htmlFor="address" className="text-sm font-medium block mb-1.5">{t("address")}</label>
              <input
                id="address"
                name="address"
                required
                className="w-full rounded-xl border border-border px-4 py-3 text-sm bg-muted/50 focus:outline-none focus:border-gold transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="text-sm font-medium block mb-1.5">{t("city")}</label>
                <input
                  id="city"
                  name="city"
                  required
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm bg-muted/50 focus:outline-none focus:border-gold transition-colors"
                />
              </div>
              <div>
                <label htmlFor="country" className="text-sm font-medium block mb-1.5">{t("country")}</label>
                <input
                  id="country"
                  name="country"
                  required
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm bg-muted/50 focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="deliveryNotes" className="text-sm font-medium block mb-1.5">ملاحظات (اختياري)</label>
              <textarea
                id="deliveryNotes"
                name="deliveryNotes"
                rows={2}
                className="w-full rounded-xl border border-border px-4 py-3 text-sm bg-muted/50 focus:outline-none focus:border-gold transition-colors resize-none"
              />
            </div>

            <div className="pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Lock className="w-4 h-4" />
                <span>الدفع عند الاستلام — ادفع عند وصول طلبك</span>
              </div>

              <button
                type="submit"
                className="w-full btn-luxury btn-luxury-gold py-4 text-base"
              >
                {t("placeOrder")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}