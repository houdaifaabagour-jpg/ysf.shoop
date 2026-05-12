"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

export default function CheckoutCancelPage() {
  const t = useTranslations("checkout");

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
      <div className="mb-6 text-5xl">&#10007;</div>
      <h1 className="text-2xl font-bold text-danger">{t("orderCancel")}</h1>
      <p className="mt-4 text-muted-foreground">
        Your order was cancelled.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/checkout"
          className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary-light"
        >
          {t("backToCart")}
        </Link>
        <Link
          href="/shop"
          className="rounded-lg border border-border px-6 py-3 text-sm font-medium hover:bg-muted"
        >
          {t("continueShopping")}
        </Link>
      </div>
    </div>
  );
}
