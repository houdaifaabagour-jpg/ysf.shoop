"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export function CheckoutSuccessClient() {
  const t = useTranslations("checkout");
  const { locale } = useParams();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center sm:px-6">
      <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center">
        <CheckCircle className="w-8 h-8 text-success" />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-primary">{t("thankYou")}</h1>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{t("orderPlaced")}</p>
      {orderId && (
        <p className="mt-4 text-sm text-muted-foreground">
          {t("orderNumber")} <span className="font-mono font-semibold text-primary">#{orderId.slice(0, 8)}</span>
        </p>
      )}
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
        {orderId && (
          <Link href={`/${locale}/track-order/${orderId}`} className="btn-luxury btn-luxury-primary">
            {t("trackOrder")}
          </Link>
        )}
        <Link href={`/${locale}/shop`} className="btn-luxury btn-luxury-secondary">
          {t("continueShopping")}
        </Link>
      </div>
    </div>
  );
}
