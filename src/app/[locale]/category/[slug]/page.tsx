"use client";

import { use } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

const categories: Record<string, { nameAr: string; nameEn: string; descriptionAr: string; descriptionEn: string; image: string; products: Array<{ id: number; nameAr: string; nameEn: string; price: number; image: string }> }> = {
  watches: { nameAr: "الساعات", nameEn: "Watches", descriptionAr: "مجموعة فاخرة من الساعات العالمية", descriptionEn: "A luxury collection of international watches", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600", products: [{ id: 1, nameAr: "ساعة رولكس كلاسيك", nameEn: "Rolex Classic", price: 4500, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" }, { id: 3, nameAr: "ساعة أوميغا", nameEn: "Omega Seamaster", price: 6200, image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400" }, { id: 5, nameAr: "ساعة كاسيو", nameEn: "Casio G-Shock", price: 450, image: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=400" }, { id: 7, nameAr: "ساعة تيسو", nameEn: "Tissot Le Locle", price: 1800, image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400" }] },
  glasses: { nameAr: "النظارات", nameEn: "Glasses", descriptionAr: "نظارات أنيقة من أفضل العلامات", descriptionEn: "Elegant eyewear from top brands", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600", products: [{ id: 2, nameAr: "نظارة راي بان", nameEn: "Ray-Ban Wayfarer", price: 850, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400" }, { id: 6, nameAr: "نظارة فيرساتشي", nameEn: "Versace Eyewear", price: 950, image: "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400" }] },
  sunglasses: { nameAr: "نظارات شمسية", nameEn: "Sunglasses", descriptionAr: "نظارات شمسية فاخرة للحماية والأناقة", descriptionEn: "Luxury sunglasses for protection and style", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600", products: [{ id: 4, nameAr: "نظارات شمسية غوتشي", nameEn: "Gucci Sunglasses", price: 1200, image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400" }, { id: 8, nameAr: "نظارات شمسية برادا", nameEn: "Prada Sunglasses", price: 1500, image: "https://images.unsplash.com/photo-1579303974871-d5d8e3d7b2dd?w=400" }] },
};

export default function CategoryPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = use(params);
  const t = useTranslations();
  const category = categories[slug];
  const isRTL = locale === "ar";

  if (!category) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">{t("errors.notFound")}</h1>
          <Link href={`/${locale}/shop`} className="text-gold hover:underline">{t("common.continueShopping")}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="relative h-64 bg-cover bg-center" style={{ backgroundImage: `url(${category.image})` }}>
        <div className="absolute inset-0 bg-primary/70 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold">{isRTL ? category.nameAr : category.nameEn}</h1>
            <p className="mt-2">{isRTL ? category.descriptionAr : category.descriptionEn}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 text-sm text-muted-foreground">
          <Link href={`/${locale}/shop`} className="hover:text-gold">{t("nav.shop")}</Link> / <span>{isRTL ? category.nameAr : category.nameEn}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {category.products.map(product => (
            <div key={product.id} className="double-bezel group">
              <div className="bg-white luxury-border rounded-xl p-3 transition-transform duration-300 group-hover:scale-[1.02]">
                <Link href={`/${locale}/product/${product.nameEn.toLowerCase().replace(/ /g, "-")}`}>
                  <div className="aspect-square overflow-hidden rounded-lg bg-cream">
                    <img src={product.image} alt={product.nameEn} className="w-full h-full object-cover" />
                  </div>
                </Link>
                <div className="mt-3">
                  <h3 className="font-semibold text-primary text-sm">{isRTL ? product.nameAr : product.nameEn}</h3>
                  <div className="mt-1 text-gold font-bold">{product.price.toLocaleString()} ر.س</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
