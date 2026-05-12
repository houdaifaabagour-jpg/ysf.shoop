"use client";

"use action";

import { useState } from "react";
import { validateCoupon } from "@/features/coupons/actions";

type CouponState = 
  | { applied: true; code: string; discount: number; couponId: string }
  | { applied: false };

interface CheckoutCouponProps {
  subtotal: number;
  onCouponApplied: (couponId: string, discount: number, code: string) => void;
  appliedCoupon?: CouponState;
}

export function CheckoutCoupon({ subtotal, onCouponApplied, appliedCoupon }: CheckoutCouponProps) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApply = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError("");

    const result = await validateCoupon(code, subtotal);
    setLoading(false);

    if (result.success) {
      onCouponApplied(result.couponId, result.discount, result.code);
      setCode("");
    } else {
      setError(result.error);
    }
  };

  const handleRemove = () => {
    onCouponApplied("", 0, "");
  };

  if (appliedCoupon?.applied) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
        <div>
          <span className="font-medium text-green-700">{appliedCoupon.code}</span>
          <span className="ml-2 text-sm text-green-600">
            -${appliedCoupon.discount.toFixed(2)}
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
    );
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter coupon code"
          className="flex-1 rounded-md border border-border px-3 py-2 text-sm uppercase"
        />
        <button
          type="button"
          onClick={handleApply}
          disabled={loading || !code.trim()}
          className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-secondary-light disabled:opacity-50"
        >
          {loading ? "..." : "Apply"}
        </button>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}