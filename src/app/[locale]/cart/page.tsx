"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface CartItem {
  id: number;
  name: string;
  nameEn: string;
  price: number;
  quantity: number;
  category: string;
  image: string;
}

export default function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
    setMounted(true);
  }, []);

  const updateQuantity = (id: number, qty: number) => {
    if (qty < 1) return;
    const updated = cart.map(item => item.id === id ? { ...item, quantity: qty } : item);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const removeItem = (id: number) => {
    const updated = cart.filter(item => item.id !== id);
    setCart(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-bold text-primary mb-8">{t("cart.yourCart")}</h1>

        {cart.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-xl font-semibold text-primary mb-4">{t("cart.cartEmpty")}</h2>
            <p className="text-muted-foreground mb-8">{t("cart.cartEmpty")}</p>
            <Link href={`/${locale}/shop`} className="btn-luxury btn-luxury-primary">{t("common.continueShopping")}</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <div key={item.id} className="double-bezel">
                  <div className="bg-white luxury-border rounded-xl p-4">
                    <div className="flex gap-4">
                      <Link href={`/${locale}/product/${item.nameEn.toLowerCase().replace(/ /g, "-")}`} className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.nameEn} className="w-full h-full object-cover" />
                      </Link>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-primary">{locale === "ar" ? item.name : item.nameEn}</h3>
                        <p className="text-sm text-muted-foreground">{item.nameEn}</p>
                        <div className="mt-2 text-gold font-bold">{item.price.toLocaleString()} ر.س</div>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center border rounded-lg">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-cream">−</button>
                          <span className="px-3">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-cream">+</button>
                        </div>
                        <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 text-sm">{t("cart.remove")}</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="glass luxury-border rounded-xl p-6 sticky top-24">
                <h2 className="text-lg font-bold text-primary mb-4">{t("checkout.orderSummary")}</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>{t("checkout.products") || "Products"} ({cart.reduce((s, i) => s + i.quantity, 0)})</span>
                    <span>{subtotal.toLocaleString()} ر.س</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("checkout.shipping")}</span>
                    <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>{shipping === 0 ? t("checkout.free") : `${shipping} ر.س`}</span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground bg-gold/10 p-2 rounded">
                      {t("checkout.freeOver", { amount: 500 })}!
                    </p>
                  )}
                  <div className="border-t pt-3 flex justify-between font-bold text-lg">
                    <span>{t("cart.total")}</span>
                    <span className="text-gold">{total.toLocaleString()} ر.س</span>
                  </div>
                </div>
                <Link href={`/${locale}/checkout`} className="btn-luxury btn-luxury-primary w-full mt-6 text-center block">
                  {t("cart.proceedToCheckout")}
                </Link>
                <Link href={`/${locale}/shop`} className="block text-center mt-3 text-sm text-muted-foreground hover:text-gold">
                  {t("common.continueShopping")}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
