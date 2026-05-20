"use client";

import { useEffect, useRef, use } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";

export default function Hero({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const t = useTranslations();
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(titleRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.8 })
        .fromTo(taglineRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
        .fromTo(ctasRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3");
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cream via-white to-gold/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(201,168,76,0.06),transparent_50%)]" />

      <section className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center text-center py-20 sm:py-28 lg:py-32">
          <span className="inline-flex items-center rounded-full bg-primary/5 px-4 py-1.5 text-[11px] font-medium tracking-[0.15em] text-primary uppercase mb-8">
            {t("home.luxury")}
          </span>

          <h1 ref={titleRef} className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] max-w-4xl">
            {t("home.title")}
          </h1>

          <p ref={taglineRef} className="mt-6 text-base sm:text-lg text-muted-foreground max-w-lg">
            {t("home.tagline")}
          </p>

          <div ref={ctasRef} className="mt-10 flex flex-wrap justify-center gap-4">
            <Link href={`/${locale}/shop`} className="btn-luxury btn-luxury-primary">
              {t("home.shopNow")}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link href={`/${locale}/category/watches`} className="btn-luxury btn-luxury-secondary">
              {t("home.browseWatches")}
            </Link>
          </div>

          <div className="mt-16 sm:mt-20 flex flex-wrap justify-center gap-x-12 gap-y-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-gold" />
              {t("home.statWatches")}
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-gold" />
              {t("home.statGlasses")}
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-gold" />
              {t("home.statShipping")}
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-gold" />
              {t("home.statPayment")}
            </span>
          </div>
        </div>
      </section>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/15 to-transparent" />
    </div>
  );
}
