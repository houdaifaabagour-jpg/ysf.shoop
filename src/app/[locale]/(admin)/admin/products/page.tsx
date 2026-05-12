import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";
import { createProduct, deleteProduct } from "@/features/admin/actions";
import { getCategories } from "@/features/catalog/queries";

export const metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/login");
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(name)")
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
        </div>
        <textarea name="description" placeholder="Description" rows={3} className="w-full rounded-md border border-border px-3 py-2 text-sm" />
        <button type="submit" className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-light">
          Create Product
        </button>
      </form>

      <div className="mt-6 space-y-2">
        {products?.map((product) => (
          <div key={product.id} className="flex items-center justify-between rounded-lg border border-border bg-white px-4 py-3">
            <div>
              <span className="text-sm font-medium">{product.title}</span>
              <span className="ml-2 text-xs text-muted-foreground">${Number(product.price).toFixed(2)}</span>
              {product.category && <span className="ml-2 text-xs text-muted-foreground">{product.category.name}</span>}
            </div>
            <form action={deleteProduct.bind(null, product.id)}>
              <button type="submit" className="text-xs text-danger hover:underline">Delete</button>
            </form>
          </div>
        ))}
        {(!products || products.length === 0) && (
          <p className="text-sm text-muted-foreground">No products yet.</p>
        )}
      </div>
    </div>
  );
}
