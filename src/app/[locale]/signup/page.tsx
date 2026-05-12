"use client";

import { use } from "react";
import { useTranslations } from "next-intl";
import { SignupForm } from "@/features/account/signup-form";

export default function SignupPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">{t("auth.signUpTitle")}</h1>
          <p className="text-muted-foreground mt-2">{t("auth.signUpDesc") || t("auth.signUp")}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 luxury-border">
          <SignupForm locale={locale} />
        </div>
      </div>
    </div>
  );
}
