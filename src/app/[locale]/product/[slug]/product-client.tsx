"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ProductImage } from "@/components/ui/product-image";
import { Minus, Plus, ShoppingBag, Truck, Shield, RotateCcw } from "lucide-react";
import { formatPrice } from "@/lib/format";

interface ProductPageClientProps {
  params: Promise<{ slug: string; locale: string }>;
  initialProduct: {
    id: string;
    title: string;
    slug: string;
    description?: string | null;
    price: number;
    compare_at_price?: number | null;
    images: string[];
    category?: { name: string };
    specs?: Record<string, string>;
    stock?: number;
  } | null;
  relatedProducts: {
    id: string;
    slug: string;
    title: string;
    price: number;
    compare_at_price?: number | null;
    image: string;
  }[];
}

export function ProductPageClient({ params, initialProduct, relatedProducts }: ProductPageClientProps) {
  const { slug, locale } = use(params);
  const t = useTranslations();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const product = initialProduct;

  useEffect(() => {
    if (product) {
      gsap.fromTo(".product-content", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
    }
  }, [product]);

  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAdding(true);
    try {
      const { addToCart } = await import("@/features/cart/actions");
      await addToCart(product.id, undefined, quantity);
      alert(locale === "ar" ? "تمت إضافة المنتج للسلة!" : "Product added to cart!");
    } catch (e) {
      console.error(e);
      alert(locale === "ar" ? "حدث خطأ أثناء إضافة المنتج" : "Failed to add product");
    } finally {
      setIsAdding(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-warm flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-primary mb-3">{t("errors.notFound")}</h1>
          <Link href={`/${locale}/shop`} className="text-sm text-primary hover:text-primary-light underline">{t("common.continueShopping")}</Link>
        </div>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : ["/placeholder.jpg"];
  const specs = product.specs || {};

  return (
    <div className="min-h-screen bg-warm">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href={`/${locale}/shop`} className="hover:text-primary transition-colors">{t("nav.shop")}</Link>
          <span className="text-border">/</span>
          <span className="text-primary">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 product-content">
          <div>
            <div className="bg-white rounded-xl overflow-hidden">
              <div className="relative aspect-square bg-muted">
                <ProductImage src={images[selectedImage]} alt={product.title} fill className="object-cover" priority />
              </div>
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 mt-4">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors bg-muted ${selectedImage === i ? "border-primary" : "border-transparent hover:border-border"}`}>
                    <ProductImage src={img} alt={product.title} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider mb-3">{product.category?.name}</span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">{product.title}</h1>

            <div className="mt-4 text-2xl font-semibold text-primary">
              {formatPrice(product.price)}
            </div>

            <div className="mt-6 space-y-2.5 text-sm border-t border-border pt-6">
              <div className="flex gap-3"><span className="text-muted-foreground min-w-[70px]">{t("product.brand") || "Brand"}</span><span className="text-primary font-medium">{specs.brand || "-"}</span></div>
              <div className="flex gap-3"><span className="text-muted-foreground min-w-[70px]">{t("product.model") || "Model"}</span><span className="text-primary font-medium">{specs.model || "-"}</span></div>
              <div className="flex gap-3"><span className="text-muted-foreground min-w-[70px]">{t("product.material") || "Material"}</span><span className="text-primary font-medium">{specs.material || "-"}</span></div>
              <div className="flex gap-3"><span className="text-muted-foreground min-w-[70px]">{t("product.stock") || "Stock"}</span><span className={`font-medium ${(product.stock ?? 0) > 0 ? "text-success" : "text-danger"}`}>{(product.stock ?? 0) > 0 ? `${t("product.inStock")} (${product.stock})` : t("product.outOfStock")}</span></div>
            </div>

            {product.description && (
              <p className="mt-6 text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            )}

            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center border border-border rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 text-muted-foreground hover:text-primary transition-colors" aria-label="Decrease">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3 text-muted-foreground hover:text-primary transition-colors" aria-label="Increase">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button onClick={handleAddToCart} disabled={(product.stock ?? 0) === 0 || isAdding} className="btn-luxury btn-luxury-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
                <ShoppingBag className="w-5 h-5" />
                {isAdding ? (locale === "ar" ? "جاري الإضافة..." : "Adding...") : t("product.addToCart")}
              </button>
            </div>

            <div className="mt-8 flex flex-col gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-primary" />
                <span>{locale === "ar" ? "شحن مجاني للطلبات فوق 500 ر.س" : "Free shipping on orders over SAR 500"}</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <span>{locale === "ar" ? "ضمان سنة على جميع المنتجات" : "1 year warranty on all products"}</span>
              </div>
              <div className="flex items-center gap-3">
                <RotateCcw className="w-5 h-5 text-primary" />
                <span>{locale === "ar" ? "إرجاع مجاني خلال 14 يوم" : "Free returns within 14 days"}</span>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-primary mb-8">{locale === "ar" ? "منتجات مشابهة" : "Related Products"}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.slice(0, 4).map((p) => (
                <Link key={p.id} href={`/${locale}/product/${p.slug}`} className="group block">
                  <div className="card-hover bg-white rounded-xl overflow-hidden">
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <ProductImage src={p.image} alt={p.title} fill className="object-cover" />
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-primary line-clamp-2">{p.title}</h3>
                      <p className="text-sm font-semibold text-primary mt-2">{formatPrice(p.price)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}