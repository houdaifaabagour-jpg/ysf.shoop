"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { validateCoupon } from "@/features/coupons/actions";
import { createCODOrder } from "@/features/checkout/actions";
import type { CartItem } from "@/types/database";

type CouponState = 
  | { applied: true; code: string; discount: number; couponId: string }
  | { applied: false };

interface CheckoutClientProps {
  items: CartItem[];
  baseSubtotal: number;
}

export function CheckoutClient({ items, baseSubtotal }: CheckoutClientProps) {
  const t = useTranslations("checkout");
  const [coupon, setCoupon] = useState<CouponState>({ applied: false });
  const [couponInput, setCouponInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const subtotal = coupon.applied 
    ? Math.max(0, baseSubtotal - coupon.discount)
    : baseSubtotal;

  const handleApply = async () => {
    if (!couponInput.trim()) return;
    setLoading(true);
    setError("");

    const result = await validateCoupon(couponInput, baseSubtotal);
    setLoading(false);

    if (result.success) {
      setCoupon({ 
        applied: true, 
        code: result.code, 
        discount: result.discount, 
        couponId: result.couponId 
      });
      setCouponInput("");
    } else {
      setError(t("invalidCoupon"));
    }
  };

  const handleRemove = () => {
    setCoupon({ applied: false });
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <h2 className="text-lg font-semibold">{t("shippingAddress")}</h2>
        <form action={createCODOrder} className="mt-4 space-y-4">
          <input type="hidden" name="couponId" value={coupon.applied ? coupon.couponId : ""} />
          <input type="hidden" name="discount" value={coupon.applied ? coupon.discount : 0} />
          
          <div>
            <label htmlFor="fullName" className="text-sm font-medium">{t("fullName")}</label>
            <input id="fullName" name="fullName" required className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <label htmlFor="phone" className="text-sm font-medium">{t("phone")}</label>
            <input id="phone" name="phone" type="tel" required className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <label htmlFor="address" className="text-sm font-medium">{t("address")}</label>
            <input id="address" name="address" required className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="text-sm font-medium">{t("city")}</label>
              <input id="city" name="city" required className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm" />
            </div>
            <div>
              <label htmlFor="country" className="text-sm font-medium">{t("country")}</label>
              <input id="country" name="country" required className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm" />
            </div>
          </div>
          <button type="submit" className="w-full rounded-lg bg-primary px-8 py-3 text-sm font-medium text-white hover:bg-primary-light">
            {t("placeOrder")}
          </button>
          <p className="text-center text-sm text-muted-foreground">{t("codInfo")}</p>
        </form>
      </div>

      <div>
        <h2 className="text-lg font-semibold">{t("orderSummary")}</h2>
        <div className="mt-4 space-y-3 rounded-lg border border-border p-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">{t("applyCoupon")}</label>
              {coupon.applied ? (
                <div className="mt-2 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
                  <div>
                    <span className="font-medium text-green-700">{coupon.code}</span>
                    <span className="ml-2 text-sm text-green-600">-${coupon.discount.toFixed(2)}</span>
                  </div>
                  <button type="button" onClick={handleRemove} className="text-sm text-red-600 hover:text-red-700">{t("remove")}</button>
                </div>
              ) : (
                <div className="mt-2 flex gap-2">
                  <input type="text" value={couponInput} onChange={(e) => setCouponInput(e.target.value.toUpperCase())} placeholder={t("couponPlaceholder")} className="flex-1 rounded-md border border-border px-3 py-2 text-sm uppercase" />
                  <button type="button" onClick={handleApply} disabled={loading || !couponInput.trim()} className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-secondary-light disabled:opacity-50">
                    {loading ? "..." : t("applyCoupon")}
                  </button>
                </div>
              )}
              {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </div>
          </div>

          <div className="border-t border-border pt-3 space-y-2">
            {coupon.applied && (
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{t("subtotal")}</span>
                <span>${baseSubtotal.toFixed(2)}</span>
              </div>
            )}
            {coupon.applied && (
              <div className="flex justify-between text-sm text-green-600">
                <span>{t("couponApplied")}</span>
                <span>-${coupon.discount.toFixed(2)}</span>
              </div>
            )}
            {!coupon.applied && (
              <div className="flex justify-between text-sm">
                <span>{t("subtotal")}</span>
                <span>${baseSubtotal.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold">
              <span>{t("total")}</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
