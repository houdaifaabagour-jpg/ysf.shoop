"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function SignupPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations();
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
    if (password !== confirmPassword) { setError(t("errors.passwordMismatch")); return; }
    if (password.length < 6) { setError(t("errors.passwordTooShort")); return; }
    setLoading(true);
    localStorage.setItem("user", JSON.stringify({ name, email, phone }));
    setTimeout(() => { setLoading(false); window.location.href = `/${locale}/account`; }, 1000);
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">{t("auth.signUpTitle")}</h1>
          <p className="text-muted-foreground mt-2">{t("auth.signUpDesc") || t("auth.signUp")}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 luxury-border">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t("checkout.fullName")}</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder={locale === "ar" ? "محمد أحمد" : "John Doe"} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t("checkout.phone")}</label>
              <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder="+966 5X XXX XXXX" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t("auth.email")}</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder="example@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t("auth.password")}</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder={locale === "ar" ? "6 أحرف على الأقل" : "At least 6 characters"} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t("auth.confirmPassword")}</label>
              <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder="••••••••" />
            </div>
            <label className="flex items-start gap-2 text-sm text-muted-foreground">
              <input type="checkbox" required className="mt-1 rounded" />
              {locale === "ar" ? "أوافق على" : "I agree to"} <a href="#" className="text-gold hover:underline">{t("footer.terms")}</a> {locale === "ar" ? "و" : "and"} <a href="#" className="text-gold hover:underline">{t("footer.privacyPolicy")}</a>
            </label>
            <button type="submit" disabled={loading} className="btn-luxury btn-luxury-primary w-full disabled:opacity-50">
              {loading ? t("auth.creatingAccount") : t("auth.signUp")}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            {t("auth.haveAccount")} <Link href={`/${locale}/login`} className="text-gold hover:underline">{t("auth.signInLink")}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
