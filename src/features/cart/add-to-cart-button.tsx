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
  return (
    <button
      onClick={() => addToCart(productId, variantId)}
      disabled={disabled}
      className="rounded-lg bg-primary px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-50"
    >
      {disabled ? "Out of Stock" : "Add to Cart"}
    </button>
  );
}
