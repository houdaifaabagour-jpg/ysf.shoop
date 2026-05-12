"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    localStorage.setItem("user", JSON.stringify({ email }));
    setTimeout(() => { setLoading(false); window.location.href = `/${locale}/account`; }, 1000);
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">{t("auth.welcomeBack") || t("auth.signIn")}</h1>
          <p className="text-muted-foreground mt-2">{t("auth.signInDesc") || t("auth.signInTitle")}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 luxury-border">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t("auth.email")}</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder="example@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t("auth.password")}</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder="••••••••" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" className="rounded" /> {t("auth.rememberMe") || "Remember me"}</label>
              <a href="#" className="text-gold hover:underline">{t("auth.forgotPassword")}</a>
            </div>
            <button type="submit" disabled={loading} className="btn-luxury btn-luxury-primary w-full disabled:opacity-50">
              {loading ? t("auth.loggingIn") : t("auth.signIn")}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {t("auth.noAccount")} <Link href={`/${locale}/signup`} className="text-gold hover:underline">{t("auth.createAccount")}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
