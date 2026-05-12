"use client";

import { useState } from "react";
import { validateCoupon } from "@/features/coupons/actions";

interface CheckoutSummaryProps {
  subtotal: number;
}

type CouponState = 
  | { applied: true; code: string; discount: number; couponId: string }
  | { applied: false };

export function CheckoutSummary({ subtotal: baseSubtotal }: CheckoutSummaryProps) {
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
      setError(result.error);
    }
  };

  const handleRemove = () => {
    setCoupon({ applied: false });
  };

  return (
    <div className="mt-4 space-y-3 rounded-lg border border-border p-4">
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium">Apply Coupon</label>
          {coupon.applied ? (
            <div className="mt-2 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
              <div>
                <span className="font-medium text-green-700">{coupon.code}</span>
                <span className="ml-2 text-sm text-green-600">
                  -${coupon.discount.toFixed(2)}
                </span>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Enter coupon code"
                className="flex-1 rounded-md border border-border px-3 py-2 text-sm uppercase"
              />
              <button
                type="button"
                onClick={handleApply}
                disabled={loading || !couponInput.trim()}
                className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-secondary-light disabled:opacity-50"
              >
                {loading ? "..." : "Apply"}
              </button>
            </div>
          )}
          {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
        </div>
      </div>

      <div className="border-t border-border pt-3 space-y-2">
        {coupon.applied && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Subtotal</span>
            <span>${baseSubtotal.toFixed(2)}</span>
          </div>
        )}
        {coupon.applied && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount ({coupon.code})</span>
            <span>-${coupon.discount.toFixed(2)}</span>
          </div>
        )}
        {!coupon.applied && (
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}