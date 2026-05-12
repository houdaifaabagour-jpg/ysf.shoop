"use client";

import { useState, useEffect, useRef, use } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";

const products = [
  { id: 1, nameAr: "ساعة رولكس كلاسيك", nameEn: "Rolex Classic", price: 4500, category: "watches", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" },
  { id: 2, nameAr: "نظارة راي بان", nameEn: "Ray-Ban Wayfarer", price: 850, category: "glasses", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400" },
  { id: 3, nameAr: "ساعة أوميغا", nameEn: "Omega Seamaster", price: 6200, category: "watches", image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400" },
  { id: 4, nameAr: "نظارات شمسية غوتشي", nameEn: "Gucci Sunglasses", price: 1200, category: "sunglasses", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400" },
  { id: 5, nameAr: "ساعة كاسيو", nameEn: "Casio G-Shock", price: 450, category: "watches", image: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=400" },
  { id: 6, nameAr: "نظارة فيرساتشي", nameEn: "Versace Eyewear", price: 950, category: "glasses", image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400" },
  { id: 7, nameAr: "ساعة تيسو", nameEn: "Tissot Le Locle", price: 1800, category: "watches", image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400" },
  { id: 8, nameAr: "نظارات شمسية برادا", nameEn: "Prada Sunglasses", price: 1500, category: "sunglasses", image: "https://images.unsplash.com/photo-1579303974871-d5d8e3d7b2dd?w=400" },
];

export default function ShopPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const getCategoryKey = (cat: string) => {
    switch (cat) {
      case "all": return t("common.all");
      case "watches": return t("common.watches");
      case "glasses": return t("common.glasses");
      case "sunglasses": return t("common.sunglasses");
      default: return cat;
    }
  };

  const getSortLabel = (sort: string) => {
    switch (sort) {
      case "default": return t("common.newest");
      case "price-low": return t("common.priceLow");
      case "price-high": return t("common.priceHigh");
      default: return sort;
    }
  };

  useEffect(() => {
    let filtered = selectedCategory === "all" ? products : products.filter(p => p.category === selectedCategory);
    if (sortBy === "price-low") filtered = [...filtered].sort((a, b) => a.price - b.price);
    if (sortBy === "price-high") filtered = [...filtered].sort((a, b) => b.price - a.price);
    setFilteredProducts(filtered);
  }, [selectedCategory, sortBy]);

  useEffect(() => {
    cardsRef.current.forEach((card, i) => {
      if (card) gsap.fromTo(card, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.5, delay: i * 0.05 });
    });
  }, [filteredProducts]);

  const categories = [
    { key: "all", label: t("common.all") },
    { key: "watches", label: t("common.watches") },
    { key: "glasses", label: t("common.glasses") },
    { key: "sunglasses", label: t("common.sunglasses") },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-bold text-primary mb-8">{t("nav.shop")}</h1>

        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map(cat => (
            <button key={cat.key} onClick={() => setSelectedCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat.key ? "bg-gold text-white" : "bg-white text-primary hover:bg-gold/10"}`}>
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          {["default", "price-low", "price-high"].map(sort => (
            <button key={sort} onClick={() => setSortBy(sort)}
              className={`px-3 py-1 rounded text-xs ${sortBy === sort ? "bg-primary text-white" : "bg-white text-muted-foreground hover:bg-primary/10"}`}>
              {getSortLabel(sort)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, i) => (
            <div key={product.id} ref={el => { if (el) cardsRef.current[i] = el; }}
              className="double-bezel group">
              <div className="relative overflow-hidden rounded-xl bg-white luxury-border p-3 transition-transform duration-300 group-hover:scale-[1.02]">
                <Link href={`/${locale}/product/${product.id}`}>
                  <div className="relative aspect-square overflow-hidden rounded-lg bg-cream">
                    <img src={product.image} alt={locale === "ar" ? product.nameAr : product.nameEn} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-gold text-white text-xs px-3 py-1 rounded-full">{t("common.newest")}</div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity bg-gold text-white px-4 py-2 rounded-lg text-sm">
                        {t("product.addToCart")}
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold text-primary">{locale === "ar" ? product.nameAr : product.nameEn}</h3>
                    <p className="text-sm text-muted-foreground">{product.nameEn}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-lg font-bold text-gold">{product.price.toLocaleString()} ر.س</span>
                      <span className="text-xs text-muted-foreground bg-gold/10 px-2 py-1 rounded">{getCategoryKey(product.category)}</span>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">{t("common.noProductsFound")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
