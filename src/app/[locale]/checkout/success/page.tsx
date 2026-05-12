"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const t = useTranslations("checkout");
  const { locale } = useParams();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <div className="mb-6 text-5xl">&#10003;</div>
      <h1 className="text-2xl font-bold text-success">{t("thankYou")}</h1>
      <p className="mt-4 text-muted-foreground">
        {t("orderPlaced")}
      </p>
      {orderId && (
        <p className="mt-2 text-sm text-muted-foreground">
          {t("orderNumber")}: <span className="font-mono font-bold text-primary">#{orderId.slice(0, 8)}</span>
        </p>
      )}
      <div className="mt-8 flex justify-center gap-4">
        <Link
          href={`/${locale}/shop`}
          className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-light"
        >
          {t("continueShopping")}
        </Link>
        {orderId && (
          <Link
            href={`/${locale}/track-order/${orderId}`}
            className="rounded-lg border border-border px-6 py-3 text-sm font-medium hover:bg-muted"
          >
            {t("trackOrder")}
          </Link>
        )}
      </div>
    </div>
  );
}
