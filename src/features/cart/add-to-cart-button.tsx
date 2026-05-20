"use client";

import { addToCart } from "./actions";

export function AddToCartButton({
  productId,
  variantId,
  disabled,
}: {
  productId: string;
  variantId?: string;
  disabled?: boolean;
}) {
  const handleAdd = async () => {
    await addToCart(productId, variantId);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <button
      onClick={handleAdd}
      disabled={disabled}
      className="rounded-lg bg-primary px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-50"
    >
      {disabled ? "Out of Stock" : "Add to Cart"}
    </button>
  );
}
