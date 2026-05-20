"use client";

import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import { XCircle } from "lucide-react";

export function CheckoutCancelClient() {
  const t = useTranslations("checkout");
  const { locale } = useParams();

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-danger/10 flex items-center justify-center">
        <XCircle className="w-8 h-8 text-danger" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-primary">{t("orderCancel")}</h1>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
        {t("cancelMessage") || "Your order was cancelled."}
      </p>
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
        <Link href={`/${locale}/checkout`} className="btn-luxury btn-luxury-primary">
          {t("backToCart")}
        </Link>
        <Link href={`/${locale}/shop`} className="btn-luxury btn-luxury-secondary">
          {t("continueShopping")}
        </Link>
      </div>
    </div>
  );
}
