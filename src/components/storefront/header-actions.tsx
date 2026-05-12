"use client";

import { useState } from "react";
import Link from "next/link";
import { HeaderAuth } from "./header-auth";
import { LanguageSwitcher } from "./language-switcher";
import { Search, ShoppingBag, Menu, X, Heart } from "lucide-react";
import { useTranslations } from "next-intl";

interface HeaderActionsProps {
  user?: { id?: string; email?: string } | null;
  locale: string;
}

export function HeaderActions({ user, locale }: HeaderActionsProps) {
  const t = useTranslations("common");

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Link href={`/${locale}/account/wishlist`} className="relative p-2 rounded-full hover:bg-black/5 transition-colors" aria-label="Wishlist">
        <Heart className="w-5 h-5" />
      </Link>

      <Link href={`/${locale}/cart`} className="relative p-2 rounded-full hover:bg-black/5 transition-colors" aria-label="Cart">
        <ShoppingBag className="w-5 h-5" />
      </Link>

      <LanguageSwitcher />
      <HeaderAuth user={user} locale={locale} />
    </div>
  );
}

export function MobileMenuButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="p-2 rounded-full hover:bg-black/5 transition-colors md:hidden"
      aria-label="Menu"
    >
      {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </button>
  );
}