"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

gsap.registerPlugin(useGSAP);

export function Header({ locale }: { locale: string }) {
  const t = useTranslations();
  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const barTopRef = useRef<HTMLSpanElement>(null);
  const barMidRef = useRef<HTMLSpanElement>(null);
  const barBotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { getCart } = await import("@/features/cart/actions");
        const cart = await getCart();
        const count = cart?.items?.reduce((sum: number, item: { quantity: number }) => sum + item.quantity, 0) || 0;
        setCartCount(count);
      } catch (e) {
        console.error("Failed to fetch cart", e);
      }
    };
    fetchCart();
    
    // We can no longer rely purely on window 'cartUpdated' for cross-tab sync if we don't dispatch it.
    // We should keep the event listener for in-app updates.
    window.addEventListener("cartUpdated", fetchCart);
    return () => window.removeEventListener("cartUpdated", fetchCart);
  }, []);

  useGSAP(() => {
    if (mobileOpen && overlayRef.current) {
      gsap.fromTo(overlayRef.current, { opacity: 0, backdropFilter: "blur(0px)" }, { opacity: 1, backdropFilter: "blur(24px)", duration: 0.4, ease: "power3.out" });
      gsap.fromTo(linksRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out", delay: 0.15 });
    }
  }, [mobileOpen]);

  const toggleMobile = () => {
    setMobileOpen((prev) => !prev);
  };

  const navLinks = [
    { href: `/${locale}/shop`, label: t("nav.shop") },
    { href: `/${locale}/category/watches`, label: t("nav.watches") },
    { href: `/${locale}/category/glasses`, label: t("nav.glasses") },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 mt-3 sm:mt-4">
          <div className="glass luxury-border rounded-full px-3 sm:px-5 py-2 flex items-center justify-between gap-4 mx-auto max-w-5xl">
            <Link href={`/${locale}`} className="text-lg sm:text-xl font-bold tracking-tight text-primary shrink-0">
              ysf.shoop
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="px-4 py-2 rounded-full text-sm font-medium text-primary hover:bg-primary/5 transition-colors">
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <button onClick={toggleMobile} className="md:hidden relative w-8 h-8 flex items-center justify-center text-primary" aria-label="Menu">
                <span className="sr-only">{mobileOpen ? t("common.close") : t("nav.menu")}</span>
                <span ref={barTopRef} className={`absolute block h-[1.5px] w-5 bg-current transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-0" : "-translate-y-[5px]"}`} />
                <span ref={barMidRef} className={`absolute block h-[1.5px] w-5 bg-current transition-all duration-300 ${mobileOpen ? "opacity-0" : "opacity-100"}`} />
                <span ref={barBotRef} className={`absolute block h-[1.5px] w-5 bg-current transition-all duration-300 ${mobileOpen ? "-rotate-45 translate-y-0" : "translate-y-[5px]"}`} />
              </button>

              <Link href={`/${locale}/cart`} className="relative p-2 text-primary hover:text-gold transition-colors" aria-label={t("nav.cart")}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold text-white text-[10px] font-medium w-[18px] h-[18px] rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <Link
                href={`/${locale === "en" ? "ar" : "en"}`}
                className="text-[11px] font-medium px-2 py-1 rounded-full bg-gold/10 text-gold hover:bg-gold/20 transition-colors tracking-wider"
              >
                {locale === "en" ? "AR" : "EN"}
              </Link>

              <Link
                href={`/${locale}/login`}
                className="hidden sm:inline-flex text-sm font-medium bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-light transition-all hover:-translate-y-px hover:shadow-button-lift active:scale-[0.98]"
              >
                {t("common.login")}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div ref={overlayRef} className="fixed inset-0 z-30 flex items-center justify-center" style={{ backgroundColor: "rgba(253, 251, 247, 0.92)" }}>
          <nav className="flex flex-col items-center gap-2">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                ref={(el) => { linksRef.current[i] = el; }}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-2xl font-medium text-primary px-8 py-4 rounded-full hover:bg-primary/5 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              ref={(el) => { linksRef.current[navLinks.length] = el; }}
              href={`/${locale}/login`}
              onClick={() => setMobileOpen(false)}
              className="mt-4 text-lg font-medium bg-primary text-white px-10 py-3 rounded-full hover:bg-primary-light transition-all hover:-translate-y-px hover:shadow-button-lift active:scale-[0.98]"
            >
              {t("common.login")}
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
