import type { Metadata } from "next";
import { getProduct, getRelatedProducts } from "@/features/catalog/queries";
import { ProductPageClient } from "./product-client";
import { ProductSchema, BreadcrumbSchema } from "@/components/seo/json-ld";
import { getStorageUrl } from "@/lib/storage/client";
import { getStoreSettings } from "@/lib/settings";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ysf.shoop";

export async function generateMetadata({ params }: { params: Promise<{ slug: string; locale: string }> }): Promise<Metadata> {
  const { slug, locale } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const name = product.title;
  const description = product.description ?? "";

  return {
    title: name,
    description,
    openGraph: {
      title: name,
      description,
      images: [{ url: product.images?.[0]?.url ?? "", width: 800, height: 800 }],
    },
    alternates: {
      canonical: `${siteUrl}/${locale}/product/${slug}`,
    },
  };
}

export default async function ProductPageWrapper({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const product = await getProduct(slug);
  const relatedProducts = product ? await getRelatedProducts(product.id) : [];
  const settings = await getStoreSettings();
  const currencySymbol = settings.currency_symbol || "ر.س";

  const productData = product ? {
    ...product,
    images: product.images?.map(img => getStorageUrl(img.url) || "") ?? [],
    specs: product.variants?.[0]?.attributes ?? {},
    stock: product.variants?.[0]?.stock ?? 0
  } : null;

  const relatedData = relatedProducts.map(p => ({
    ...p,
    image: getStorageUrl(p.images?.[0]?.url) ?? "/placeholder.jpg"
  }));

  return (
    <>
      {product && (
        <>
          <ProductSchema
            name={product.title}
            description={product.description ?? ""}
            price={product.price}
            currency="SAR"
            url={`${siteUrl}/${locale}/product/${product.slug}`}
            image={getStorageUrl(product.images?.[0]?.url) ?? ""}
            brand={product.category?.name}
          />
          <BreadcrumbSchema
            items={[
              { name: locale === "ar" ? "المتجر" : "Shop", url: `${siteUrl}/${locale}/shop` },
              { name: product.title, url: `${siteUrl}/${locale}/product/${product.slug}` },
            ]}
          />
        </>
      )}
      <ProductPageClient 
        params={params} 
        initialProduct={productData}
        relatedProducts={relatedData}
        currencySymbol={currencySymbol}
      />
    </>
  );
}
