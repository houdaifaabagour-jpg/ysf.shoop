"use client";

import { useTranslations as useNextTranslations } from "next-intl";
import { useParams } from "next/navigation";

export function useTranslations() {
  const locale = useParams().locale as string;
  const t = useNextTranslations();

  return {
    t,
    locale,
    isRTL: locale === "ar",
  };
}

export function useTranslation(key: string) {
  const { t, locale, isRTL } = useTranslations();
  return {
    label: t(key),
    locale,
    isRTL,
    all: t,
  };
}
