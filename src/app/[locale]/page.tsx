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
      tl.fromTo(titleRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 })
        .fromTo(taglineRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.4")
        .fromTo(ctasRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, "-=0.3");
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cream via-white to-gold/5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(201,168,76,0.08),transparent_50%)]" />

      <section className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="max-w-3xl">
          <span className="inline-block rounded-full bg-gold/10 px-4 py-1.5 text-xs font-medium tracking-wider text-gold uppercase mb-6">
            {t("home.luxury")}
          </span>

          <h1 ref={titleRef} className="text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl lg:text-7xl leading-tight">
            {t("home.title")}
          </h1>

          <p ref={taglineRef} className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-xl">
            {t("home.tagline")}
          </p>

          <div ref={ctasRef} className="mt-10 flex flex-wrap gap-4">
            <Link href={`/${locale}/shop`} className="btn-luxury btn-luxury-primary">
              {t("home.shopNow")}
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link href={`/${locale}/category/watches`} className="btn-luxury btn-luxury-secondary">
              {t("home.browseWatches")}
            </Link>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8">
          {[
            { count: "50+", key: "home.statWatches" },
            { count: "30+", key: "home.statGlasses" },
            { count: "24/7", key: "home.statShipping" },
            { count: "100%", key: "home.statPayment" },
          ].map((stat, i) => (
            <div key={i} className="text-center sm:text-right" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="text-2xl font-bold text-gold sm:text-3xl">{stat.count}</div>
              <div className="mt-1 text-sm text-muted-foreground">{t(stat.key)}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
    </div>
  );
}
