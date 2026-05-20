import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";
import { updateProduct, deleteProduct } from "@/features/admin/actions";
import { getCategories } from "@/features/catalog/queries";

export const metadata = { title: "Edit Product" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) redirect("/login");
  const { id } = await params;

  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*, images:product_images(url, alt, sort_order)")
    .eq("id", id)
    .single();

  if (!product) redirect("/admin/products");

  const categories = await getCategories();

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/products" className="text-sm text-muted-foreground hover:text-primary">&larr; Back</Link>
        <h1 className="text-2xl font-bold">Edit Product</h1>
      </div>

      <form action={updateProduct.bind(null, id)} className="rounded-lg border border-border bg-white p-6 space-y-4 max-w-2xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input name="title" defaultValue={product.title} required className="w-full rounded-md border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input name="slug" defaultValue={product.slug} required className="w-full rounded-md border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input name="price" type="number" step="0.01" defaultValue={product.price} required className="w-full rounded-md border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Compare At Price</label>
            <input name="compareAtPrice" type="number" step="0.01" defaultValue={product.compare_at_price ?? ""} className="w-full rounded-md border border-border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select name="categoryId" defaultValue={product.category_id ?? ""} className="w-full rounded-md border border-border px-3 py-2 text-sm">
              <option value="">No Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
            <input name="tags" defaultValue={(product.tags as string[])?.join(", ") ?? ""} className="w-full rounded-md border border-border px-3 py-2 text-sm" />
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="isActive" value="true" defaultChecked={product.is_active ?? true} />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="isFeatured" value="true" defaultChecked={product.is_featured ?? false} />
              Featured
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea name="description" defaultValue={product.description ?? ""} rows={4} className="w-full rounded-md border border-border px-3 py-2 text-sm" />
        </div>
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-light">
            Save Changes
          </button>
          <Link href="/admin/products" className="text-sm text-muted-foreground hover:text-primary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}