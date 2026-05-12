"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface User {
  name: string;
  email: string;
  phone?: string;
}

export default function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-primary mb-4">{t("auth.pleaseLogin") || t("auth.signIn")}</h2>
          <Link href={`/${locale}/login`} className="btn-luxury btn-luxury-primary">{t("auth.signIn")}</Link>
        </div>
      </div>
    );
  }

  const orders = [
    { id: "ORD-001", date: "2026-05-10", total: 4500, status: locale === "ar" ? "تم الشحن" : "Shipped", items: 1 },
    { id: "ORD-002", date: "2026-05-05", total: 850, status: locale === "ar" ? "تم التوصيل" : "Delivered", items: 2 },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-bold text-primary mb-8">{t("account.myAccount")}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-bold mb-4">{t("account.profile") || "Profile"}</h2>
            <div className="space-y-3 text-sm">
              <div><span className="text-muted-foreground">{t("checkout.fullName")}:</span> <span className="font-medium">{user.name}</span></div>
              <div><span className="text-muted-foreground">{t("auth.email")}:</span> <span className="font-medium">{user.email}</span></div>
              {user.phone && <div><span className="text-muted-foreground">{t("checkout.phone")}:</span> <span className="font-medium">{user.phone}</span></div>}
            </div>
            <button onClick={() => { localStorage.removeItem("user"); window.location.href = `/${locale}`; }} className="mt-6 text-red-500 hover:underline text-sm">{t("auth.signOut")}</button>
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{t("account.orderHistory")}</h2>
              <Link href={`/${locale}/account/orders`} className="text-gold hover:underline text-sm">{t("account.viewAll") || t("account.viewDetails")}</Link>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border">
                <p className="text-muted-foreground mb-4">{t("account.noOrders")}</p>
                <Link href={`/${locale}/shop`} className="btn-luxury btn-luxury-primary">{t("common.continueShopping")}</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-white rounded-xl border p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="font-bold">{order.id}</span>
                        <span className="text-sm text-muted-foreground mr-2">{order.date}</span>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">{order.status}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{order.items} {t("common.productsCount", { count: "" }).replace("{count}", "")}</span>
                      <span className="font-bold text-gold">{order.total.toLocaleString()} ر.س</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href={`/${locale}/account/orders`} className="bg-white rounded-xl border p-6 text-center hover:border-gold transition-colors">
            <div className="text-2xl mb-2">📦</div>
            <div className="font-semibold">{t("account.orders")}</div>
          </Link>
          <Link href={`/${locale}/account/wishlist`} className="bg-white rounded-xl border p-6 text-center hover:border-gold transition-colors">
            <div className="text-2xl mb-2">❤️</div>
            <div className="font-semibold">{t("account.wishlist")}</div>
          </Link>
          <Link href={`/${locale}/shop`} className="bg-white rounded-xl border p-6 text-center hover:border-gold transition-colors">
            <div className="text-2xl mb-2">🛍️</div>
            <div className="font-semibold">{t("common.continueShopping")}</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
