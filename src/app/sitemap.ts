import type { MetadataRoute } from "next";
import { categories } from "@/data/categories";
import { products } from "@/data/products";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ysf.shoop";
const locales = ["en", "ar", "fr", "es"];
const staticRoutes = ["", "shop", "cart", "login", "signup", "search", "checkout", "account", "account/orders", "account/wishlist"];
const perLocaleRoutes = ["checkout/success", "checkout/cancel"];
type SitemapEntry = MetadataRoute.Sitemap[0];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    const add = (path: string, priority: number, freq: MetadataRoute.Sitemap["0"]["changeFrequency"]) => {
      entries.push({
        url: `${siteUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: freq,
        priority,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${siteUrl}/${l}${path}`]),
          ) as Record<string, string>,
        },
      });
    };

    for (const route of staticRoutes) {
      const isHome = route === "";
      add(isHome ? "" : `/${route}`, isHome ? 1.0 : 0.8, isHome ? "weekly" : "monthly");
    }

    for (const route of perLocaleRoutes) {
      add(`/${route}`, 0.3, "monthly");
    }

    for (const slug of Object.keys(categories)) {
      add(`/category/${slug}`, 0.7, "weekly");
    }

    for (const product of products) {
      add(`/product/${product.slug}`, 0.9, "monthly");
    }
  }

  return entries;
}
