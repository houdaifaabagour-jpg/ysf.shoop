"use client";

import Link from "next/link";
import { HeaderAuth } from "./header-auth";
import { LanguageSwitcher } from "./language-switcher";
import { useTranslations } from "next-intl";

export function HeaderActions() {
  const t = useTranslations("common");

  return (
    <>
      <Link href="/cart" className="relative transition-colors hover:text-primary-light" aria-label="Cart">
        {t("cart")}
      </Link>
      <LanguageSwitcher />
      <HeaderAuth />
    </>
  );
}
