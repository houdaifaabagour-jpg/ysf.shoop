"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) { setError("كلمتا المرور غير متطابقتين"); return; }
    if (password.length < 6) { setError("كلمة المرور يجب أن تكون 6 أحرف على الأقل"); return; }
    setLoading(true);
    localStorage.setItem("user", JSON.stringify({ name, email, phone }));
    setTimeout(() => { setLoading(false); window.location.href = "/account"; }, 1000);
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">إنشاء حساب جديد</h1>
          <p className="text-muted-foreground mt-2">انضم إلينا الآن واحصل على أفضل العروض</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 luxury-border">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">الاسم الكامل</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder="محمد أحمد" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">رقم الهاتف</label>
              <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder="+966 5X XXX XXXX" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder="example@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">كلمة المرور</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder="6 أحرف على الأقل" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">تأكيد كلمة المرور</label>
              <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder="••••••••" />
            </div>
            <label className="flex items-start gap-2 text-sm text-muted-foreground">
              <input type="checkbox" required className="mt-1 rounded" />
              أوافق على <a href="#" className="text-gold hover:underline">الشروط والأحكام</a> و <a href="#" className="text-gold hover:underline">سياسة الخصوصية</a>
            </label>
            <button type="submit" disabled={loading} className="btn-luxury btn-luxury-primary w-full disabled:opacity-50">
              {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            لديك حساب بالفعل؟ <Link href="/login" className="text-gold hover:underline">سجل دخولك</Link>
          </div>
        </div>
      </div>
    </div>
  );
}