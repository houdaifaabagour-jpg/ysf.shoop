"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [step, setStep] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", city: "", address: "", notes: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("cart");
    if (stored) setCart(JSON.parse(stored));
    setMounted(true);
  }, []);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    localStorage.removeItem("cart");
    window.dispatchEvent(new Event("cartUpdated"));
  };

  if (!mounted) return null;

  if (submitted) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-primary mb-4">تم استلام طلبك!</h1>
          <p className="text-muted-foreground mb-6">سيتم التواصل معك قريباً لتأكيد الطلب</p>
          <p className="text-sm text-muted-foreground mb-8">رقم الطلب: #{Math.random().toString(36).substring(2, 10).toUpperCase()}</p>
          <Link href="/shop" className="btn-luxury btn-luxury-primary">العودة للمتجر</Link>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-primary mb-4">السلة فارغة</h2>
          <Link href="/shop" className="btn-luxury btn-luxury-primary">تصفح المنتجات</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-bold text-primary mb-8">إتمام الطلب</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border p-6">
              <div className="flex gap-2 mb-6">
                <button onClick={() => setStep(1)} className={`px-4 py-2 rounded-full text-sm ${step === 1 ? "bg-gold text-white" : "bg-cream"}`}>1. المعلومات</button>
                <button onClick={() => setStep(2)} className={`px-4 py-2 rounded-full text-sm ${step === 2 ? "bg-gold text-white" : "bg-cream"}`}>2. التأكيد</button>
              </div>

              {step === 1 && (
                <form onSubmit={e => { e.preventDefault(); setStep(2); }} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">الاسم الكامل *</label>
                    <input type="text" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder="أدخل اسمك الكامل" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">رقم الهاتف *</label>
                    <input type="tel" required value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder="+966 5X XXX XXXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">المدينة *</label>
                    <select required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50">
                      <option value="">اختر المدينة</option>
                      <option>الرياض</option>
                      <option>جدة</option>
                      <option>الدمام</option>
                      <option>مكة المكرمة</option>
                      <option>المدينة المنورة</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">العنوان التفصيلي *</label>
                    <textarea required rows={3} value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder="الحي، الشارع، المبنى، الشقة..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">ملاحظات (اختياري)</label>
                    <textarea rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder="أي ملاحظات خاصة بالطلب" />
                  </div>
                  <button type="submit" className="btn-luxury btn-luxury-primary w-full">التالي</button>
                </form>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="bg-cream rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">الاسم:</span><span>{form.name}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">الهاتف:</span><span>{form.phone}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">المدينة:</span><span>{form.city}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">العنوان:</span><span>{form.address}</span></div>
                    {form.notes && <div className="flex justify-between"><span className="text-muted-foreground">ملاحظات:</span><span>{form.notes}</span></div>}
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-3">المنتجات:</h3>
                    <div className="space-y-2">
                      {cart.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span>{item.name} × {item.quantity}</span>
                          <span className="text-gold">{(item.price * item.quantity).toLocaleString()} ر.س</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setStep(1)} className="btn-luxury btn-luxury-secondary flex-1">تعديل</button>
                    <button onClick={handleSubmit} className="btn-luxury btn-luxury-primary flex-1">تأكيد الطلب</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="glass luxury-border rounded-xl p-6 sticky top-24">
              <h2 className="text-lg font-bold text-primary mb-4">ملخص الطلب</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span>المنتجات ({cart.reduce((s, i) => s + i.quantity, 0)})</span><span>{subtotal.toLocaleString()} ر.س</span></div>
                <div className="flex justify-between"><span>الشحن</span><span className={shipping === 0 ? "text-green-600" : ""}>{shipping === 0 ? "مجاني" : `${shipping} ر.س`}</span></div>
                <div className="border-t pt-3 flex justify-between font-bold text-lg"><span>المجموع</span><span className="text-gold">{total.toLocaleString()} ر.س</span></div>
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded-lg text-sm text-green-700 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                الدفع عند الاستلام - آمن ومضمون
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}