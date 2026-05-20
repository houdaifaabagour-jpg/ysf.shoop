import type { Metadata } from "next";
import { getCategory, getProducts } from "@/features/catalog/queries";
import { CategoryPageClient } from "./category-client";
import { BreadcrumbSchema, ItemListSchema } from "@/components/seo/json-ld";
import { getStoreSettings } from "@/lib/settings";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ysf.shoop";

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return { title: "Category Not Found" };
  }

  const name = category.name;
  const description = category.description ?? "";

  return {
    title: name,
    description,
    openGraph: {
      title: name,
      description,
      images: category.image_url ? [{ url: category.image_url }] : [],
    },
    alternates: {
      canonical: `${siteUrl}/${locale}/category/${slug}`,
    },
  };
}

export default async function CategoryPageWrapper({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const category = await getCategory(slug);
  const { products } = await getProducts({ categorySlug: slug, limit: 50 });
  const settings = await getStoreSettings();

  const productsWithImages = products.map(p => ({
    ...p,
    image: p.images?.[0]?.url ?? "/placeholder.jpg"
  }));

  return (
    <>
      {category && (
        <>
          <BreadcrumbSchema
            items={[
              { name: locale === "ar" ? "المتجر" : "Shop", url: `${siteUrl}/${locale}/shop` },
              { name: category.name, url: `${siteUrl}/${locale}/category/${slug}` },
            ]}
          />
          <ItemListSchema
            items={products.map((p) => ({
              name: p.title,
              url: `${siteUrl}/${locale}/product/${p.slug}`,
              image: p.images?.[0]?.url ?? "",
            }))}
          />
        </>
      )}
      <CategoryPageClient 
        params={params} 
        initialCategory={category}
        initialProducts={productsWithImages}
        currencySymbol={settings.currency_symbol}
      />
    </>
  );
}
