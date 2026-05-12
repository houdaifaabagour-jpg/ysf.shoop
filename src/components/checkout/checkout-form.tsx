"use client";

import { useState } from "react";
import { createCODOrder } from "@/features/checkout/actions";
import type { CartItem } from "@/types/database";

interface CheckoutFormProps {
  cart: { id: string; items: CartItem[] };
}

export function CheckoutForm({ cart }: CheckoutFormProps) {
  const [couponId, setCouponId] = useState("");
  const [discount, setDiscount] = useState(0);

  const handleCouponChange = (newCouponId: string, newDiscount: number) => {
    setCouponId(newCouponId);
    setDiscount(newDiscount);
  };

  return (
    <form action={createCODOrder} className="mt-4 space-y-4">
      <input type="hidden" name="couponId" value={couponId} />
      <input type="hidden" name="discount" value={discount} />
      
      <div>
        <label htmlFor="fullName" className="text-sm font-medium">Full Name</label>
        <input
          id="fullName"
          name="fullName"
          required
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="phone" className="text-sm font-medium">Phone</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label htmlFor="address" className="text-sm font-medium">Street Address</label>
        <input
          id="address"
          name="address"
          required
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="text-sm font-medium">City</label>
          <input
            id="city"
            name="city"
            required
            className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label htmlFor="country" className="text-sm font-medium">Country</label>
          <input
            id="country"
            name="country"
            required
            className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div>
        <label htmlFor="deliveryNotes" className="text-sm font-medium">Delivery Notes (optional)</label>
        <textarea
          id="deliveryNotes"
          name="deliveryNotes"
          rows={3}
          className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-lg bg-primary px-8 py-3 text-sm font-medium text-white hover:bg-primary-light"
      >
        Place Order (Pay on Delivery)
      </button>
    </form>
  );
}