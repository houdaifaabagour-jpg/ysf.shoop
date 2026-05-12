"use client";

import Link from "next/link";
import type { Product } from "@/types/database";
import { addToCart } from "@/features/cart/actions";
import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShoppingBag, Heart } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const t = useTranslations("common");
  const cardRef = useRef<HTMLDivElement>(null);
  const image = product.images?.[0];
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          delay: index * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (adding) return;
    setAdding(true);
    await addToCart(product.id);
    setAdding(false);
  }

  return (
    <div ref={cardRef} className="group opacity-0">
      <div className="double-bezel p-1.5 transition-shadow hover:shadow-hover">
        <div className="double-bezel-inner overflow-hidden">
          <Link href={`/product/${product.slug}`} className="block">
            <div className="relative aspect-square overflow-hidden bg-muted">
              {image ? (
                <img
                  src={image.url}
                  alt={image.alt ?? product.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <svg className="w-12 h-12 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {hasDiscount && (
                <span className="absolute right-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-medium text-white shadow-sm">
                  {t("sale")}
                </span>
              )}

              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="absolute bottom-3 right-3 flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-sm font-medium shadow-lg opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-white disabled:opacity-50"
              >
                <ShoppingBag className="w-4 h-4" />
                {adding ? t("loading") : t("addToCart")}
              </button>
            </div>

            <div className="p-4">
              {product.category && (
                <p className="text-xs text-muted-foreground mb-1">{product.category.name}</p>
              )}

              <h3 className="text-sm font-medium text-primary line-clamp-2 group-hover:text-gold transition-colors">
                {product.title}
              </h3>

              <div className="mt-2 flex items-center gap-2">
                <span className="text-base font-bold text-gold">${product.price}</span>
                {hasDiscount && (
                  <span className="text-sm text-muted-foreground line-through">${product.compare_at_price}</span>
                )}
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}