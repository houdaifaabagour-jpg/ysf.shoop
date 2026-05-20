import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";
import { createProduct, deleteProduct } from "@/features/admin/actions";
import { getCategories } from "@/features/catalog/queries";
import { ImageManagerButton } from "@/components/admin/image-manager-button";
import { getStorageUrl } from "@/lib/storage/client";

export const metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/login");
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(name), images:product_images(url, alt, sort_order)")
    .order("created_at", { ascending: false });
  const categories = await getCategories();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
      </div>

      <form action={createProduct} className="mt-6 rounded-lg border border-border bg-white p-4 space-y-3">
        <h2 className="font-semibold">Add Product</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="title" placeholder="Title" required className="rounded-md border border-border px-3 py-2 text-sm" />
          <input name="slug" placeholder="Slug" required className="rounded-md border border-border px-3 py-2 text-sm" />
          <input name="price" type="number" step="0.01" placeholder="Price" required className="rounded-md border border-border px-3 py-2 text-sm" />
          <input name="compareAtPrice" type="number" step="0.01" placeholder="Compare At Price" className="rounded-md border border-border px-3 py-2 text-sm" />
          <select name="categoryId" className="rounded-md border border-border px-3 py-2 text-sm">
            <option value="">No Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <input name="tags" placeholder="Tags (comma separated)" className="rounded-md border border-border px-3 py-2 text-sm" />
          <div className="col-span-full">
            <label className="mb-1 block text-xs font-medium text-muted-foreground">Product Images</label>
            <input type="file" name="images" multiple accept="image/jpeg,image/png,image/webp,image/avif" className="w-full rounded-md border border-border px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-1 file:text-xs file:text-white hover:file:bg-primary-light" />
          </div>
        </div>
        <textarea name="description" placeholder="Description" rows={3} className="w-full rounded-md border border-border px-3 py-2 text-sm" />
        <button type="submit" className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-light">
          Create Product
        </button>
      </form>

      <div className="mt-6 space-y-2">
        {products?.map((product) => {
          const images = product.images as { url: string; alt: string | null; sort_order: number }[] | undefined;
          const sorted = images?.sort((a, b) => a.sort_order - b.sort_order) ?? [];
          const thumb = sorted[0] ? getStorageUrl(sorted[0].url) : null;

          return (
            <div key={product.id} className="flex items-center justify-between rounded-lg border border-border bg-white px-4 py-3">
              <div className="flex items-center gap-3 min-w-0">
                {thumb ? (
                  <img src={thumb} alt="" className="h-10 w-10 flex-shrink-0 rounded object-cover bg-muted" />
                ) : (
                  <div className="h-10 w-10 flex-shrink-0 rounded bg-muted" />
                )}
                <div className="min-w-0">
                  <span className="text-sm font-medium truncate block">{product.title}</span>
                  <span className="text-xs text-muted-foreground">
                    ${Number(product.price).toFixed(2)}
                    {product.category && <span className="ml-2">{product.category.name}</span>}
                    <span className="ml-2">({sorted.length} image{sorted.length !== 1 ? "s" : ""})</span>
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                <ImageManagerButton productId={product.id} productTitle={product.title} />
                <Link href={`/admin/products/${product.id}`} className="text-xs text-primary hover:underline">Edit</Link>
                <form action={deleteProduct.bind(null, product.id)}>
                  <button type="submit" className="text-xs text-danger hover:underline">Delete</button>
                </form>
              </div>
            </div>
          );
        })}
        {(!products || products.length === 0) && (
          <p className="text-sm text-muted-foreground">No products yet.</p>
        )}
      </div>
    </div>
  );
}
