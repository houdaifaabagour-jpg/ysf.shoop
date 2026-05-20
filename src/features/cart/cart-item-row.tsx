"use client";

import { updateCartItem, removeCartItem } from "./actions";
import type { CartItem } from "@/types/database";
import { useTranslations } from "next-intl";
import { ProductImage } from "@/components/ui/product-image";

export function CartItemRow({ item }: { item: CartItem }) {
  const t = useTranslations("cart");
  const product = item.product;
  const variant = item.variant;
  if (!product) return null;

  const price = variant?.price_override ?? product.price;

  const handleUpdate = async (id: string, qty: number) => {
    await updateCartItem(id, qty);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const handleRemove = async (id: string) => {
    await removeCartItem(id);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  return (
    <div className="flex items-center gap-4 py-4">
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
        {product.images?.[0] ? (
          <ProductImage src={product.images[0].url} alt={product.title} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">No Img</div>
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{product.title}</p>
        {variant && <p className="text-xs text-muted-foreground">{variant.label}</p>}
        <p className="text-sm font-semibold">${price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleUpdate(item.id, item.quantity - 1)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-sm"
        >
          -
        </button>
        <span className="w-8 text-center text-sm">{item.quantity}</span>
        <button
          onClick={() => handleUpdate(item.id, item.quantity + 1)}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-sm"
        >
          +
        </button>
      </div>
      <button
        onClick={() => handleRemove(item.id)}
        className="text-sm text-danger hover:underline"
      >
        {t("remove")}
      </button>
    </div>
  );
}
