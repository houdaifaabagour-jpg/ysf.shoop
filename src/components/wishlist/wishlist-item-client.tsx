"use client";

import { useTransition } from "react";
import Link from "next/link";
import { ProductImage } from "@/components/ui/product-image";
import { removeFromWishlist } from "@/features/wishlist/actions";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { addToCart } from "@/features/cart/actions";

interface WishlistItemClientProps {
  items: Array<{
    id: string;
    product_id: string;
    created_at: string;
    product?: {
      id: string;
      title: string;
      slug: string;
      price: number;
      compare_at_price: number | null;
      images?: Array<{ id: string; url: string; alt: string | null }>;
      variants?: Array<{ id: string; stock: number; is_active: boolean }>;
    };
  }>;
}

export function WishlistItemClient({ items }: WishlistItemClientProps) {
  const [isPending, startTransition] = useTransition();

  const handleRemove = (productId: string) => {
    startTransition(async () => {
      await removeFromWishlist(productId);
    });
  };

  const handleAddToCart = (productId: string, variantId?: string) => {
    startTransition(async () => {
      await addToCart(productId, variantId);
    });
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Heart className="h-16 w-16 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-semibold">Your wishlist is empty</h2>
        <p className="mt-2 text-sm text-muted-foreground">Save items you love by clicking the heart icon</p>
        <Link
          href="/shop"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-light transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => {
        const image = item.product?.images?.[0];
        const defaultVariant = item.product?.variants?.find((v) => v.is_active);
        const isInStock = defaultVariant && defaultVariant.stock > 0;

        return (
          <div key={item.id} className="group relative overflow-hidden rounded-lg border border-border bg-card">
            <div className="aspect-square bg-muted">
              {image ? (
                <Link href={`/product/${item.product!.slug}`}>
                  <ProductImage
                    src={image.url}
                    alt={image.alt ?? item.product!.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </Link>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}
            </div>
            <div className="p-4">
              <Link href={`/product/${item.product!.slug}`} className="line-clamp-2 font-medium hover:text-primary">
                {item.product!.title}
              </Link>
              <div className="mt-2 flex items-center gap-2">
                <span className="font-semibold">${item.product!.price.toFixed(2)}</span>
                {item.product!.compare_at_price && item.product!.compare_at_price > item.product!.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    ${item.product!.compare_at_price.toFixed(2)}
                  </span>
                )}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => handleAddToCart(item.product_id, defaultVariant?.id)}
                  disabled={!isInStock || isPending}
                  className="flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-light transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {isInStock ? "Add to Cart" : "Out of Stock"}
                </button>
                <button
                  onClick={() => handleRemove(item.product_id)}
                  disabled={isPending}
                  className="rounded-md border border-border p-2 text-muted-foreground hover:border-danger hover:text-danger transition-colors disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Remove from wishlist"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}