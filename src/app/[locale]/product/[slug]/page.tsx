"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";

const products = [
  { id: 1, slug: "rolex-classic", nameAr: "ساعة رولكس كلاسيك", nameEn: "Rolex Classic", price: 4500, category: "watches", descriptionAr: "ساعة رولكس كلاسيكية أنيقة مصنوعة من الفولاذ المقاوم للصدأ.", descriptionEn: "Elegant classic Rolex watch made of stainless steel.", warranty: "1 year", stock: 5, specs: { brand: "Rolex", model: "Submariner", material: "Stainless steel", diameter: "40mm", waterResist: "300m" }, images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800", "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800", "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800"] },
  { id: 2, slug: "rayban-wayfarer", nameAr: "نظارة راي بان", nameEn: "Ray-Ban Wayfarer", price: 850, category: "glasses", descriptionAr: "نظارة راي بان شهيرة بتصميم كلاسيكي.", descriptionEn: "Famous Ray-Ban sunglasses with classic design.", warranty: "6 months", stock: 12, specs: { brand: "Ray-Ban", model: "Wayfarer", material: "Plastic", width: "54mm", uv: "UV400" }, images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800", "https://images.unsplash.com/photo-1577803645773-f96470509666?w=800"] },
  { id: 3, slug: "omega-seamaster", nameAr: "ساعة أوميغا", nameEn: "Omega Seamaster", price: 6200, category: "watches", descriptionAr: "ساعة أوميغا سي ماستر للمحترفين.", descriptionEn: "Professional Omega Seamaster for diving.", warranty: "2 years", stock: 3, specs: { brand: "Omega", model: "Seamaster", material: "Titanium", diameter: "42mm", waterResist: "600m" }, images: ["https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800", "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800"] },
  { id: 4, slug: "gucci-sunglasses", nameAr: "نظارات شمسية غوتشي", nameEn: "Gucci Sunglasses", price: 1200, category: "sunglasses", descriptionAr: "نظارات غوتشي الشمسية الفاخرة.", descriptionEn: "Luxury Gucci sunglasses.", warranty: "1 year", stock: 8, specs: { brand: "Gucci", model: "GG", material: "Acetate", width: "56mm", uv: "UV400" }, images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800", "https://images.unsplash.com/photo-1574258495973-f8263bc45e47?w=800"] },
  { id: 5, slug: "casio-g-shock", nameAr: "ساعة كاسيو", nameEn: "Casio G-Shock", price: 450, category: "watches", descriptionAr: "ساعة كاسيو قوية مقاومة للصدمات.", descriptionEn: "Strong shock-resistant Casio watch.", warranty: "1 year", stock: 20, specs: { brand: "Casio", model: "G-Shock", material: "Resin", diameter: "45mm", waterResist: "200m" }, images: ["https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=800", "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800"] },
  { id: 6, slug: "versace-eyewear", nameAr: "نظارة فيرساتشي", nameEn: "Versace Eyewear", price: 950, category: "glasses", descriptionAr: "نظارة فيرساتشي الأنيقة.", descriptionEn: "Elegant Versace eyewear.", warranty: "6 months", stock: 10, specs: { brand: "Versace", model: "Medusa", material: "Plastic", width: "55mm", uv: "UV400" }, images: ["https://images.unsplash.com/photo-1577803645773-f96470509666?w=800", "https://images.unsplash.com/photo-1582142839970-2b9e04b60f65?w=800"] },
  { id: 7, slug: "tissot-le-locle", nameAr: "ساعة تيسو", nameEn: "Tissot Le Locle", price: 1800, category: "watches", descriptionAr: "ساعة تيسو سويسرية كلاسيكية.", descriptionEn: "Classic Swiss Tissot watch.", warranty: "2 years", stock: 6, specs: { brand: "Tissot", model: "Le Locle", material: "Steel", diameter: "39mm", waterResist: "100m" }, images: ["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800", "https://images.unsplash.com/photo-1455541504462-57ebb2a9cec2?w=800"] },
  { id: 8, slug: "prada-sunglasses", nameAr: "نظارات شمسية برادا", nameEn: "Prada Sunglasses", price: 1500, category: "sunglasses", descriptionAr: "نظارات برادا الشمسية الفاخرة.", descriptionEn: "Luxury Prada sunglasses.", warranty: "1 year", stock: 7, specs: { brand: "Prada", model: "Symbole", material: "Acetate", width: "57mm", uv: "UV400" }, images: ["https://images.unsplash.com/photo-1579303974871-d5d8e3d7b2dd?w=800", "https://images.unsplash.com/photo-1577803645773-f96470509666?w=800"] },
];

export default function ProductPage({ params }: { params: Promise<{ slug: string; locale: string }> & { locale: string } }) {
  const { slug, locale } = use(params);
  const t = useTranslations();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const product = products.find(p => p.slug === slug);

  useEffect(() => {
    if (product) {
      gsap.fromTo(".product-content", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
    }
  }, [product]);

  const addToCart = () => {
    if (!product) return;
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item: { id: number }) => item.id === product.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ id: product.id, name: locale === "ar" ? product.nameAr : product.nameEn, nameEn: product.nameEn, price: product.price, quantity, image: product.images[0] });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    alert(locale === "ar" ? "تمت إضافة المنتج للسلة!" : "Product added to cart!");
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">{t("errors.notFound")}</h1>
          <Link href={`/${locale}/shop`} className="text-gold hover:underline">{t("common.continueShopping")}</Link>
        </div>
      </div>
    );
  }

  const isRTL = locale === "ar";

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <nav className="flex gap-2 text-sm text-muted-foreground mb-8">
          <Link href={`/${locale}/shop`} className="hover:text-gold">{t("nav.shop")}</Link>
          <span>/</span>
          <span>{isRTL ? product.nameAr : product.nameEn}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 product-content">
          <div>
            <div className="double-bezel">
              <div className="relative overflow-hidden rounded-xl bg-white luxury-border p-4">
                <img src={product.images[selectedImage]} alt={product.nameEn} className="w-full aspect-square object-cover rounded-lg" />
                <div className="absolute top-4 right-4 bg-gold text-white text-sm px-3 py-1 rounded-full">{t("common.newest")}</div>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              {product.images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImage(i)}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === i ? "border-gold" : "border-transparent"}`}>
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="inline-block bg-gold/10 text-gold text-sm px-3 py-1 rounded-full mb-4">{t(`common.${product.category}`)}</span>
            <h1 className="text-3xl font-bold text-primary">{isRTL ? product.nameAr : product.nameEn}</h1>
            <p className="text-lg text-muted-foreground mt-1">{product.nameEn}</p>

            <div className="mt-6 text-4xl font-bold text-gold">{product.price.toLocaleString()} ر.س</div>

            <div className="mt-6 space-y-2 text-sm">
              <div className="flex gap-2 text-muted-foreground"><span>{t("product.brand") || "Brand"}:</span><span className="text-primary">{product.specs.brand}</span></div>
              <div className="flex gap-2 text-muted-foreground"><span>{t("product.model") || "Model"}:</span><span className="text-primary">{product.specs.model}</span></div>
              <div className="flex gap-2 text-muted-foreground"><span>{t("product.material") || "Material"}:</span><span className="text-primary">{product.specs.material}</span></div>
              <div className="flex gap-2 text-muted-foreground"><span>{t("product.stock") || "Stock"}:</span><span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>{product.stock > 0 ? `${t("product.inStock")} (${product.stock})` : t("product.outOfStock")}</span></div>
            </div>

            <p className="mt-6 text-muted-foreground">{isRTL ? product.descriptionAr : product.descriptionEn}</p>

            <div className="mt-6 flex items-center gap-4">
              <input type="number" min="1" max={product.stock} value={quantity} onChange={e => setQuantity(Number(e.target.value))}
                className="w-20 px-3 py-2 border rounded-lg text-center" />
              <button onClick={addToCart} className="flex-1 btn-luxury btn-luxury-primary">
                {t("product.addToCart")}
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 p-4 bg-white rounded-lg border">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                <div><div className="text-xs text-muted-foreground">{t("product.shipping") || "Shipping"}</div><div className="text-sm font-medium">{t("checkout.free")}</div></div>
              </div>
              <div className="flex items-center gap-2 p-4 bg-white rounded-lg border">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                <div><div className="text-xs text-muted-foreground">{t("product.warranty") || "Warranty"}</div><div className="text-sm font-medium">{product.warranty}</div></div>
              </div>
              <div className="flex items-center gap-2 p-4 bg-white rounded-lg border">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                <div><div className="text-xs text-muted-foreground">{t("product.returns") || "Returns"}</div><div className="text-sm font-medium">{t("product.days14") || "14 days"}</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
