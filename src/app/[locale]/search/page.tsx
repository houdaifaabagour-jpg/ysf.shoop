import type { Metadata } from "next";
import { SearchPageClient } from "./search-page-client";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ysf.shoop";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const meta: Record<string, { title: string; description: string }> = {
    en: { title: "Search", description: "Search our collection of watches and glasses" },
    ar: { title: "بحث", description: "ابحث في مجموعتنا من الساعات والنظارات" },
    fr: { title: "Recherche", description: "Rechercher dans notre collection" },
    es: { title: "Buscar", description: "Buscar en nuestra colección" },
  };
  const m = meta[locale] || meta.en;
  return { title: m.title, description: m.description, robots: { index: false, follow: true } };
}

export default function SearchPage() {
  return <SearchPageClient />;
}
