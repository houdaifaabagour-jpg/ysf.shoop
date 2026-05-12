import { getProducts, getCategories } from "@/features/catalog/queries";
import { ProductCard } from "@/components/storefront/product-card";

export const metadata = { title: "Shop" };

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; sort?: string; page?: string; category?: string }>;
}) {
  const params = await searchParams;
  const page = parseInt(params.page ?? "1", 10);
  const { products, count } = await getProducts({
    search: params.search,
    sort: params.sort,
    page,
  });
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Shop</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        <a href="/shop" className="rounded-full border border-border px-4 py-1 text-sm hover:bg-muted">All</a>
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="rounded-full border border-border px-4 py-1 text-sm hover:bg-muted"
          >
            {cat.name}
          </a>
        ))}
      </div>

      <div className="mt-6 mb-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{count} products</p>
        <div className="flex gap-2 text-sm">
          <a href="?sort=newest" className="hover:underline">Newest</a>
          <a href="?sort=price_asc" className="hover:underline">Price: Low</a>
          <a href="?sort=price_desc" className="hover:underline">Price: High</a>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <p className="py-12 text-center text-muted-foreground">No products found.</p>
      )}
    </div>
  );
}
