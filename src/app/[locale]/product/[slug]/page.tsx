"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { gsap } from "gsap";

const products = [
  { id: 1, slug: "rolex-classic", name: "ساعة رولكس كلاسيك", nameEn: "Rolex Classic", price: 4500, category: "ساعات", description: "ساعة رولكس كلاسيكية أنيقة مصنوعة من الفولاذ المقاوم للصدأ.", descriptionEn: "Elegant classic Rolex watch made of stainless steel.", warranty: "سنة واحدة", stock: 5, specs: { brand: "رولكس", model: "Submariner", material: "فولاذ مقاوم للصدأ", diameter: "40mm", waterResist: "300m" }, images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800", "https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=800", "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800"] },
  { id: 2, slug: "rayban-wayfarer", name: "نظارة راي بان", nameEn: "Ray-Ban Wayfarer", price: 850, category: "نظارات", description: "نظارة راي بان شهيرة بتصميم كلاسيكي.", descriptionEn: "Famous Ray-Ban sunglasses with classic design.", warranty: "6 أشهر", stock: 12, specs: { brand: "راي بان", model: "Wayfarer", material: "بلاستيك", width: "54mm", uv: "UV400" }, images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800", "https://images.unsplash.com/photo-1577803645773-f96470509666?w=800"] },
  { id: 3, slug: "omega-seamaster", name: "ساعة أوميغا", nameEn: "Omega Seamaster", price: 6200, category: "ساعات", description: "ساعة أوميغا سي ماستر للمحترفين.", descriptionEn: "Professional Omega Seamaster for diving.", warranty: "2 سنة", stock: 3, specs: { brand: "أوميغا", model: "Seamaster", material: "تيتانيوم", diameter: "42mm", waterResist: "600m" }, images: ["https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=800", "https://images.unsplash.com/photo-1548171915-e79a380a2a4b?w=800"] },
  { id: 4, slug: "gucci-sunglasses", name: "نظارات شمسية غوتشي", nameEn: "Gucci Sunglasses", price: 1200, category: "نظارات شمسية", description: "نظارات غوتشي الشمسية الفاخرة.", descriptionEn: "Luxury Gucci sunglasses.", warranty: "سنة واحدة", stock: 8, specs: { brand: "غوتشي", model: "GG", material: "أسيتات", width: "56mm", uv: "UV400" }, images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800", "https://images.unsplash.com/photo-1574258495973-f8263bc45e47?w=800"] },
  { id: 5, slug: "casio-g-shock", name: "ساعة كاسيو", nameEn: "Casio G-Shock", price: 450, category: "ساعات", description: "ساعة كاسيو قوية مقاومة للصدمات.", descriptionEn: "Strong shock-resistant Casio watch.", warranty: "سنة واحدة", stock: 20, specs: { brand: "كاسيو", model: "G-Shock", material: "راتنج", diameter: "45mm", waterResist: "200m" }, images: ["https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=800", "https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=800"] },
  { id: 6, slug: "versace-eyewear", name: "نظارة فيرساتشي", nameEn: "Versace Eyewear", price: 950, category: "نظارات", description: "نظارة فيرساتشي الأنيقة.", descriptionEn: "Elegant Versace eyewear.", warranty: "6 أشهر", stock: 10, specs: { brand: "فيرساتشي", model: "Medusa", material: "بلاستيك", width: "55mm", uv: "UV400" }, images: ["https://images.unsplash.com/photo-1577803645773-f96470509666?w=800", "https://images.unsplash.com/photo-1582142839970-2b9e04b60f65?w=800"] },
  { id: 7, slug: "tissot-le-locle", name: "ساعة تيسو", nameEn: "Tissot Le Locle", price: 1800, category: "ساعات", description: "ساعة تيسو سويسرية كلاسيكية.", descriptionEn: "Classic Swiss Tissot watch.", warranty: "2 سنة", stock: 6, specs: { brand: "تيسو", model: "Le Locle", material: "فولاذ", diameter: "39mm", waterResist: "100m" }, images: ["https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800", "https://images.unsplash.com/photo-1455541504462-57ebb2a9cec2?w=800"] },
  { id: 8, slug: "prada-sunglasses", name: "نظارات شمسية برادا", nameEn: "Prada Sunglasses", price: 1500, category: "نظارات شمسية", description: "نظارات برادا الشمسية الفاخرة.", descriptionEn: "Luxury Prada sunglasses.", warranty: "سنة واحدة", stock: 7, specs: { brand: "برادا", model: "Symbole", material: "أسيتات", width: "57mm", uv: "UV400" }, images: ["https://images.unsplash.com/photo-1579303974871-d5d8e3d7b2dd?w=800", "https://images.unsplash.com/photo-1577803645773-f96470509666?w=800"] },
];

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
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
      cart.push({ ...product, quantity });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    alert("تمت إضافة المنتج للسلة!");
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">المنتج غير موجود</h1>
          <Link href="/shop" className="text-gold hover:underline">العودة للمتجر</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <nav className="flex gap-2 text-sm text-muted-foreground mb-8">
          <Link href={`/${slug.includes("watches") || slug.includes("rolex") || slug.includes("omega") || slug.includes("casio") || slug.includes("tissot") ? "ar" : "ar"}/shop`} className="hover:text-gold">المتجر</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 product-content">
          <div>
            <div className="double-bezel">
              <div className="relative overflow-hidden rounded-xl bg-white luxury-border p-4">
                <img src={product.images[selectedImage]} alt={product.nameEn} className="w-full aspect-square object-cover rounded-lg" />
                <div className="absolute top-4 right-4 bg-gold text-white text-sm px-3 py-1 rounded-full">جديد</div>
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
            <span className="inline-block bg-gold/10 text-gold text-sm px-3 py-1 rounded-full mb-4">{product.category}</span>
            <h1 className="text-3xl font-bold text-primary">{product.name}</h1>
            <p className="text-lg text-muted-foreground mt-1">{product.nameEn}</p>

            <div className="mt-6 text-4xl font-bold text-gold">{product.price.toLocaleString()} ر.س</div>

            <div className="mt-6 space-y-2 text-sm">
              <div className="flex gap-2 text-muted-foreground"><span>العلامة:</span><span className="text-primary">{product.specs.brand}</span></div>
              <div className="flex gap-2 text-muted-foreground"><span>الموديل:</span><span className="text-primary">{product.specs.model}</span></div>
              <div className="flex gap-2 text-muted-foreground"><span>المادة:</span><span className="text-primary">{product.specs.material}</span></div>
              <div className="flex gap-2 text-muted-foreground"><span>المخزون:</span><span className={product.stock > 0 ? "text-green-600" : "text-red-600"}>{product.stock > 0 ? `متوفر (${product.stock})` : "غير متوفر"}</span></div>
            </div>

            <p className="mt-6 text-muted-foreground">{product.description}</p>

            <div className="mt-6 flex items-center gap-4">
              <input type="number" min="1" max={product.stock} value={quantity} onChange={e => setQuantity(Number(e.target.value))}
                className="w-20 px-3 py-2 border rounded-lg text-center" />
              <button onClick={addToCart} className="flex-1 btn-luxury btn-luxury-primary">
                أضف للسلة
              </button>
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 p-4 bg-white rounded-lg border">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                <div><div className="text-xs text-muted-foreground">توصيل</div><div className="text-sm font-medium">مجاني</div></div>
              </div>
              <div className="flex items-center gap-2 p-4 bg-white rounded-lg border">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                <div><div className="text-xs text-muted-foreground">ضمان</div><div className="text-sm font-medium">{product.warranty}</div></div>
              </div>
              <div className="flex items-center gap-2 p-4 bg-white rounded-lg border">
                <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                <div><div className="text-xs text-muted-foreground">إرجاع</div><div className="text-sm font-medium">14 يوم</div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}