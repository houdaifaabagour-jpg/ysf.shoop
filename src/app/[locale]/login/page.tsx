"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { LoginForm } from "@/features/account/login-form";

export default function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-warm flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-primary">{t("auth.welcomeBack") || t("auth.signIn")}</h1>
          <p className="text-sm text-muted-foreground mt-2">{t("auth.signInDesc") || t("auth.signInTitle")}</p>
        </div>

        <div className="bg-white rounded-xl p-8">
          <LoginForm locale={locale} />
        </div>
      </div>
    </div>
  );
}
