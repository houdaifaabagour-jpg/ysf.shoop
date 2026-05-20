import type { Metadata } from "next";

const metaByLocale: Record<string, { title: string }> = {
  en: { title: "Cart" },
  ar: { title: "سلة التسوق" },
  fr: { title: "Panier" },
  es: { title: "Carrito" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: (metaByLocale[locale] || metaByLocale.en).title, robots: { index: false, follow: false } };
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
