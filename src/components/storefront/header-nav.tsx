"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

interface HeaderNavProps {
  locale: string;
}

export function HeaderNav({ locale }: HeaderNavProps) {
  const t = useTranslations("common");

  return (
    <nav className="hidden items-center gap-1 text-sm md:flex">
      <Link
        href={`/${locale}/shop`}
        className="rounded-full px-4 py-2 font-medium transition-all hover:bg-black/5 hover:text-primary"
      >
        {t("shop")}
      </Link>
      <Link
        href={`/${locale}/category/watches`}
        className="rounded-full px-4 py-2 transition-all hover:bg-black/5 hover:text-primary"
      >
        {t("watches")}
      </Link>
      <Link
        href={`/${locale}/category/glasses`}
        className="rounded-full px-4 py-2 transition-all hover:bg-black/5 hover:text-primary"
      >
        {t("glasses")}
      </Link>
    </nav>
  );
}