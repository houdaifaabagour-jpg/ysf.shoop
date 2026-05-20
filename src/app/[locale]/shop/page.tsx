import type { Metadata } from "next";
import { ShopPageClient } from "./shop-client";
import { BreadcrumbSchema, ItemListSchema } from "@/components/seo/json-ld";
import { getProducts } from "@/features/catalog/queries";
import { getStoreSettings } from "@/lib/settings";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ysf.shoop";

const shopMetadataByLocale: Record<string, { title: string; description: string }> = {
  en: { title: "Shop", description: "Browse our collection of luxury watches and glasses" },
  ar: { title: "المتجر", description: "تصفح مجموعتنا من الساعات والنظارات الفاخرة" },
  fr: { title: "Boutique", description: "Parcourez notre collection de montres et lunettes de luxe" },
  es: { title: "Tienda", description: "Explore nuestra colección de relojes y gafas de lujo" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const meta = shopMetadataByLocale[locale] || shopMetadataByLocale.en;

  return {
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `${siteUrl}/${locale}/shop`,
    },
  };
}

export default async function ShopPageWrapper({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  
  const { products, count } = await getProducts({ limit: 50 });
  const settings = await getStoreSettings();

  const productsWithImages = products.map(p => ({
    ...p,
    image: p.images?.[0]?.url ?? "/placeholder.jpg",
    categoryName: p.category?.name ?? ""
  }));

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: locale === "ar" ? "المتجر" : "Shop", url: `${siteUrl}/${locale}/shop` },
        ]}
      />
      <ItemListSchema
        items={products.map((p) => ({
          name: p.title,
          url: `${siteUrl}/${locale}/product/${p.slug}`,
          image: p.images?.[0]?.url ?? "",
        }))}
      />
      <ShopPageClient 
        params={params} 
        initialProducts={productsWithImages}
        totalCount={count}
        currencySymbol={settings.currency_symbol}
      />
    </>
  );
}
