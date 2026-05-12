"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    localStorage.setItem("user", JSON.stringify({ email }));
    setTimeout(() => { setLoading(false); window.location.href = "/account"; }, 1000);
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">مرحباً بعودتك</h1>
          <p className="text-muted-foreground mt-2">سجل دخولك لمتابعة طلباتك</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 luxury-border">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">البريد الإلكتروني</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder="example@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">كلمة المرور</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder="••••••••" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> تذكرني</label>
              <a href="#" className="text-gold hover:underline">نسيت كلمة المرور؟</a>
            </div>
            <button type="submit" disabled={loading} className="btn-luxury btn-luxury-primary w-full disabled:opacity-50">
              {loading ? "جاري الدخول..." : "تسجيل الدخول"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            ليس لديك حساب؟ <Link href="/signup" className="text-gold hover:underline">سجل الآن</Link>
          </div>
        </div>
      </div>
    </div>
  );
}