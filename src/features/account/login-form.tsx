"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/features/account/actions";
import { useTranslations } from "next-intl";

interface LoginFormProps {
  locale: string;
}

export function LoginForm({ locale }: LoginFormProps) {
  const t = useTranslations("auth");
  const [state, action, pending] = useActionState(login, { error: undefined });

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">{state.error}</p>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">{t("email")}</label>
        <input id="email" name="email" type="email" required className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder="example@email.com" />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">{t("password")}</label>
        <input id="password" name="password" type="password" required className="w-full px-4 py-3 rounded-xl border luxury-border focus:outline-none focus:ring-2 focus:ring-gold/50" placeholder="••••••••" />
      </div>
      <input type="hidden" name="locale" value={locale} />
      <button type="submit" disabled={pending} className="btn-luxury btn-luxury-primary w-full disabled:opacity-50">
        {pending ? t("loggingIn") : t("signIn")}
      </button>
      <div className="mt-6 text-center text-sm text-muted-foreground">
        {t("noAccount")} <Link href={`/${locale}/signup`} className="text-gold hover:underline">{t("createAccount")}</Link>
      </div>
    </form>
  );
}
