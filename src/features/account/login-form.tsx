"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/features/account/actions";
import { useTranslations } from "next-intl";

export function LoginForm() {
  const t = useTranslations("auth");
  const [state, action, pending] = useActionState(login, { error: undefined });

  return (
    <form action={action} className="mt-8 space-y-4">
      {state?.error && (
        <p className="rounded-md bg-danger/10 p-3 text-sm text-danger">{state.error}</p>
      )}
      <div>
        <label htmlFor="email" className="text-sm font-medium">{t("email")}</label>
        <input id="email" name="email" type="email" required className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm" />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium">{t("password")}</label>
        <input id="password" name="password" type="password" required className="mt-1 w-full rounded-md border border-border px-3 py-2 text-sm" />
      </div>
      <button type="submit" disabled={pending} className="w-full rounded-lg bg-primary px-8 py-3 text-sm font-medium text-white hover:bg-primary-light disabled:opacity-50">
        {pending ? t("loggingIn") : t("signIn")}
      </button>
      <p className="text-center text-sm text-muted-foreground">
        {t("noAccount")} <Link href="/signup" className="text-primary hover:underline">{t("createAccount")}</Link>
      </p>
    </form>
  );
}
