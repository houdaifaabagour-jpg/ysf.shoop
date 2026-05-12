"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface User {
  name: string;
  email: string;
  phone?: string;
}

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-primary mb-4">يرجى تسجيل الدخول</h2>
          <Link href="/login" className="btn-luxury btn-luxury-primary">تسجيل الدخول</Link>
        </div>
      </div>
    );
  }

  const orders = [
    { id: "ORD-001", date: "2026-05-10", total: 4500, status: "تم الشحن", items: 1 },
    { id: "ORD-002", date: "2026-05-05", total: 850, status: "تم التوصيل", items: 2 },
  ];

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-bold text-primary mb-8">حسابي</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-bold mb-4">الملف الشخصي</h2>
            <div className="space-y-3 text-sm">
              <div><span className="text-muted-foreground">الاسم:</span> <span className="font-medium">{user.name}</span></div>
              <div><span className="text-muted-foreground">البريد:</span> <span className="font-medium">{user.email}</span></div>
              {user.phone && <div><span className="text-muted-foreground">الهاتف:</span> <span className="font-medium">{user.phone}</span></div>}
            </div>
            <button onClick={() => { localStorage.removeItem("user"); window.location.href = "/"; }} className="mt-6 text-red-500 hover:underline text-sm">تسجيل الخروج</button>
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">طلباتي</h2>
              <Link href="/account/orders" className="text-gold hover:underline text-sm">عرض الكل</Link>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl border">
                <p className="text-muted-foreground mb-4">لا توجد طلبات سابقة</p>
                <Link href="/shop" className="btn-luxury btn-luxury-primary">تصفح المنتجات</Link>
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
                      <span className="text-sm text-muted-foreground">{order.items} منتج</span>
                      <span className="font-bold text-gold">{order.total.toLocaleString()} ر.س</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/account/orders" className="bg-white rounded-xl border p-6 text-center hover:border-gold transition-colors">
            <div className="text-2xl mb-2">📦</div>
            <div className="font-semibold">طلباتي</div>
          </Link>
          <Link href="/account/wishlist" className="bg-white rounded-xl border p-6 text-center hover:border-gold transition-colors">
            <div className="text-2xl mb-2">❤️</div>
            <div className="font-semibold">المفضلة</div>
          </Link>
          <Link href="/shop" className="bg-white rounded-xl border p-6 text-center hover:border-gold transition-colors">
            <div className="text-2xl mb-2">🛍️</div>
            <div className="font-semibold">متابعة التسوق</div>
          </Link>
        </div>
      </div>
    </div>
  );
}