"use client";

import Link from "next/link";
import type { Product } from "@/types/database";
import { addToCart } from "@/features/cart/actions";
import { useState } from "react";
import { useTranslations } from "next-intl";

export function ProductCard({ product }: { product: Product }) {
  const t = useTranslations("common");
  const image = product.images?.[0];
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const [adding, setAdding] = useState(false);

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (adding) return;
    setAdding(true);
    await addToCart(product.id);
    setAdding(false);
  }

  return (
    <Link href={`/product/${product.slug}`} className="group relative block">
      <div className="aspect-square overflow-hidden rounded-lg bg-muted">
        {image ? (
          <img src={image.url} alt={image.alt ?? product.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">{t("noImage")}</div>
        )}
        {hasDiscount && (
          <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">{t("sale")}</span>
        )}
      </div>

      {product.category && (
        <p className="mt-2 text-xs text-muted-foreground">{product.category.name}</p>
      )}
      <h3 className="text-sm font-medium">{product.title}</h3>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-sm font-semibold">${product.price}</span>
        {hasDiscount && (
          <span className="text-sm text-muted-foreground line-through">${product.compare_at_price}</span>
        )}
      </div>

      <button
        onClick={handleAddToCart}
        disabled={adding}
        className="mt-2 w-full rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100 disabled:opacity-50"
      >
        {adding ? t("loading") : t("addToCart")}
      </button>
    </Link>
  );
}
