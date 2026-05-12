"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup } from "@/features/account/actions";
import { useTranslations } from "next-intl";

interface SignupFormProps {
  locale: string;
}

export function SignupForm({ locale }: SignupFormProps) {
  const t = useTranslations();
  const [state, action, pending] = useActionState(signup, { error: undefined });

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">{state.error}</p>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-2">{t("checkout.fullName")}</label>
        <input id="name" name="name" type="text" required className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder={locale === "ar" ? "محمد أحمد" : "John Doe"} />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-2">{t("checkout.phone")}</label>
        <input id="phone" name="phone" type="tel" required className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder="+966 5X XXX XXXX" />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">{t("auth.email")}</label>
        <input id="email" name="email" type="email" required className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder="example@email.com" />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">{t("auth.password")}</label>
        <input id="password" name="password" type="password" required minLength={6} className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder={locale === "ar" ? "6 أحرف على الأقل" : "At least 6 characters"} />
      </div>
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">{t("auth.confirmPassword")}</label>
        <input id="confirmPassword" name="confirmPassword" type="password" required className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder="••••••••" />
      </div>
      <label className="flex items-start gap-2 text-sm text-muted-foreground">
        <input type="checkbox" required className="mt-1 rounded" />
        {locale === "ar" ? "أوافق على" : "I agree to"} <a href="#" className="text-gold hover:underline">{t("footer.terms")}</a> {locale === "ar" ? "و" : "and"} <a href="#" className="text-gold hover:underline">{t("footer.privacyPolicy")}</a>
      </label>
      <input type="hidden" name="locale" value={locale} />
      <button type="submit" disabled={pending} className="btn-luxury btn-luxury-primary w-full disabled:opacity-50">
        {pending ? t("auth.creatingAccount") : t("auth.signUp")}
      </button>
      <div className="mt-6 text-center text-sm text-muted-foreground">
        {t("auth.haveAccount")} <Link href={`/${locale}/login`} className="text-gold hover:underline">{t("auth.signInLink")}</Link>
      </div>
    </form>
  );
}
