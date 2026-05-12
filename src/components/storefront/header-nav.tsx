"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

export function HeaderNav() {
  const t = useTranslations("common");

  return (
    <nav className="hidden items-center gap-6 text-sm md:flex">
      <Link href="/shop" className="font-medium transition-colors hover:text-primary-light">
        {t("shop")}
      </Link>
      <Link href="/category/watches" className="transition-colors hover:text-primary-light">
        {t("watches")}
      </Link>
      <Link href="/category/glasses" className="transition-colors hover:text-primary-light">
        {t("glasses")}
      </Link>
    </nav>
  );
}
