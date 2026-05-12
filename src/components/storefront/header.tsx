"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export function Header({ locale }: { locale: string }) {
  const t = useTranslations();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const updateCart = () => {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        try {
          const cart = JSON.parse(storedCart);
          setCartCount(cart.length);
        } catch {}
      }
    };
    updateCart();
    window.addEventListener("cartUpdated", updateCart);
    return () => window.removeEventListener("cartUpdated", updateCart);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gold/10 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <div className="glass luxury-border rounded-full px-4 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href={`/${locale}`} className="text-xl font-bold tracking-tight text-primary">
              ysf.shoop
            </Link>
            <nav className="hidden md:flex items-center gap-6 mr-4">
              <Link href={`/${locale}/shop`} className="text-sm font-medium text-primary hover:text-gold transition-colors">
                {t("nav.shop")}
              </Link>
              <Link href={`/${locale}/category/watches`} className="text-sm font-medium text-primary hover:text-gold transition-colors">
                {t("nav.watches")}
              </Link>
              <Link href={`/${locale}/category/glasses`} className="text-sm font-medium text-primary hover:text-gold transition-colors">
                {t("nav.glasses")}
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link href={`/${locale}/cart`} className="relative p-2 text-primary hover:text-gold transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link
              href={`/${locale === "en" ? "ar" : "en"}`}
              className="text-xs font-medium px-2 py-1 rounded bg-gold/10 text-gold hover:bg-gold/20 transition-colors"
            >
              {locale === "en" ? "AR" : "EN"}
            </Link>

            <Link
              href={`/${locale}/login`}
              className="text-sm font-medium bg-gold text-white px-4 py-2 rounded-lg hover:bg-gold/90 transition-colors"
            >
              {t("common.login")}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
