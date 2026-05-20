import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/get-session";
import { getWishlistItems } from "@/features/wishlist/queries";
import { WishlistItemClient } from "@/components/wishlist/wishlist-item-client";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ysf.shoop";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const meta: Record<string, { title: string; description: string }> = {
    en: { title: "Wishlist", description: "Your saved items" },
    ar: { title: "المفضلة", description: "عناصرك المحفوظة" },
    fr: { title: "Liste de souhaits", description: "Vos articles sauvegardés" },
    es: { title: "Lista de deseos", description: "Tus artículos guardados" },
  };
  const m = meta[locale] || meta.en;
  return { title: m.title, description: m.description, alternates: { canonical: `${siteUrl}/${locale}/account/wishlist` } };
}

export default async function WishlistPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getSession();
  if (!session?.user) redirect(`/${locale}/login`);

  const items = await getWishlistItems();

  return (
    <div className="min-h-screen bg-warm">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="mb-6">
          <Link href={`/${locale}/account`} className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
            {locale === "ar" ? "العودة" : "Back"}
          </Link>
        </div>
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-primary">{locale === "ar" ? "المفضلة" : "Wishlist"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{items.length} {locale === "ar" ? "منتج" : "item"}{items.length !== 1 ? (locale === "ar" ? "ات" : "s") : ""}</p>
        </div>
        <WishlistItemClient items={items} />
      </div>
    </div>
  );
}
