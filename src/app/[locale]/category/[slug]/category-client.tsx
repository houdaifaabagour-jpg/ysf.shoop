"use client";

import { use } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ProductImage } from "@/components/ui/product-image";
import { ProductCardLuxury } from "@/components/storefront/product-card-luxury";

interface CategoryPageClientProps {
  params: Promise<{ slug: string; locale: string }>;
  initialCategory: {
    id: string;
    name: string;
    slug: string;
    description?: string | null;
    image_url?: string | null;
  } | null;
  initialProducts: {
    id: string;
    slug: string;
    title: string;
    price: number;
    compare_at_price?: number | null;
    image: string;
  }[];
  currencySymbol?: string;
}

export function CategoryPageClient({ params, initialCategory, initialProducts, currencySymbol }: CategoryPageClientProps) {
  const { slug, locale } = use(params);
  const t = useTranslations();
  const category = initialCategory;
  const products = initialProducts;

  if (!category) {
    return (
      <div className="min-h-screen bg-warm flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-primary mb-3">{t("errors.notFound")}</h1>
          <Link href={`/${locale}/shop`} className="text-sm text-primary hover:text-primary-light underline">{t("common.continueShopping")}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm">
      <div className="relative h-48 sm:h-56 overflow-hidden">
        {category.image_url ? (
          <ProductImage src={category.image_url} alt={category.name} fill className="object-cover" priority />
        ) : (
          <div className="w-full h-full bg-primary/10" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="mx-auto max-w-7xl">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{category.name}</h1>
            {category.description && (
              <p className="mt-1.5 text-sm text-white/70 max-w-xl">{category.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">{t("common.noProductsFound")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCardLuxury
                key={product.id}
                slug={product.slug}
                name={product.title}
                price={product.price}
                compareAtPrice={product.compare_at_price}
                image={product.image}
                locale={locale}
                currencySymbol={currencySymbol}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}