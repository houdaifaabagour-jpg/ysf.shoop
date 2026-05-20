"use client";

import { useState, use } from "react";
import { useTranslations } from "next-intl";
import { ProductCardLuxury } from "@/components/storefront/product-card-luxury";
import { SlidersHorizontal } from "lucide-react";

interface ShopPageClientProps {
  params: Promise<{ locale: string }>;
  initialProducts: {
    id: string;
    slug: string;
    title: string;
    price: number;
    compare_at_price?: number | null;
    image: string;
    categoryName?: string;
  }[];
  totalCount: number;
  currencySymbol?: string;
}

export function ShopPageClient({ params, initialProducts, totalCount, currencySymbol }: ShopPageClientProps) {
  const { locale } = use(params);
  const t = useTranslations();
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [products] = useState(initialProducts);

  const filtered = products.filter((p) => category === "all" || p.categoryName?.toLowerCase() === category);
  const sorted = [...filtered].sort((a, b) => sort === "price-low" ? a.price - b.price : sort === "price-high" ? b.price - a.price : 0);

  return (
    <div className="min-h-screen bg-warm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">{t("common.shop")}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <SlidersHorizontal className="w-4 h-4" />
            <span>{sorted.length} {t("common.products") || "products"}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-10 pb-6 border-b border-border">
          {["all", "watches", "glasses", "sunglasses"].map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${category === cat ? "bg-primary text-white" : "bg-white text-primary border border-border-light hover:border-primary/30"}`}>
              {cat === "all" ? t("common.all") : t(`common.${cat}`)}
            </button>
          ))}
          <div className="ml-auto">
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="px-4 py-2 rounded-full border border-border-light bg-white text-sm text-primary font-medium focus:outline-none focus:border-primary">
              <option value="newest">{t("common.newest")}</option>
              <option value="price-low">{t("common.priceLow")}</option>
              <option value="price-high">{t("common.priceHigh")}</option>
            </select>
          </div>
        </div>

        {sorted.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">{t("common.noProductsFound")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sorted.map((product) => (
              <ProductCardLuxury
                key={product.id}
                slug={product.slug}
                name={product.title}
                price={product.price}
                compareAtPrice={product.compare_at_price}
                image={product.image}
                categoryName={product.categoryName}
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
