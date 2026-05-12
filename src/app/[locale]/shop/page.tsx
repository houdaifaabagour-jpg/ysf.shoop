import { getProducts, getCategories } from "@/features/catalog/queries";
import { ProductCard } from "@/components/storefront/product-card";
import { getTranslations } from "next-intl/server";

export const metadata = { title: "Shop" };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; sort?: string; page?: string; category?: string }>;
}) {
  const params = await searchParams;
  const t = await getTranslations("common");
  const page = parseInt(params.page ?? "1", 10);
  const { products, count } = await getProducts({
    search: params.search,
    sort: params.sort,
    page,
  });
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 text-center sm:text-right">
        <h1 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">{t("allProducts")}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("productsCount", { count })}</p>
      </div>

      <div className="mb-8 flex flex-wrap justify-center gap-2 sm:justify-start">
        <a
          href="/shop"
          className="rounded-full border border-border px-4 py-1.5 text-sm transition-all hover:border-gold hover:bg-gold/5"
        >
          {t("all")}
        </a>
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="rounded-full border border-border px-4 py-1.5 text-sm transition-all hover:border-gold hover:bg-gold/5"
          >
            {cat.name}
          </a>
        ))}
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-3 text-sm">
          <a
            href="?sort=newest"
            className="rounded-full px-3 py-1.5 transition-all hover:bg-muted aria-pressed:bg-primary aria-pressed:text-white"
          >
            {t("newest")}
          </a>
          <a
            href="?sort=price_asc"
            className="rounded-full px-3 py-1.5 transition-all hover:bg-muted aria-pressed:bg-primary aria-pressed:text-white"
          >
            {t("priceLow")}
          </a>
          <a
            href="?sort=price_desc"
            className="rounded-full px-3 py-1.5 transition-all hover:bg-muted aria-pressed:bg-primary aria-pressed:text-white"
          >
            {t("priceHigh")}
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>

      {products.length === 0 && (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">{t("noProductsFound")}</p>
          <a href="/shop" className="mt-4 inline-block btn-luxury btn-luxury-secondary">
            {t("continueShopping")}
          </a>
        </div>
      )}
    </div>
  );
}