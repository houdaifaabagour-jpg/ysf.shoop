"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";

export default function Home() {
  const t = useTranslations("home");

  return (
    <div className="flex flex-1 flex-col">
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-md text-lg text-muted-foreground">
          {t("tagline")}
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/shop"
            className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-light"
          >
            {t("shopNow")}
          </Link>
          <Link
            href="/category/watches"
            className="rounded-lg border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            {t("browseWatches")}
          </Link>
          <Link
            href="/category/glasses"
            className="rounded-lg border border-border px-6 py-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            {t("browseGlasses")}
          </Link>
        </div>
      </section>
    </div>
  );
}
