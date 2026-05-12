import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";
import { createCategory, deleteCategory } from "@/features/admin/actions";

export const metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/login");
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  return (
    <div>
      <h1 className="text-2xl font-bold">Categories</h1>

      <form action={createCategory} className="mt-6 rounded-lg border border-border bg-white p-4 space-y-3">
        <h2 className="font-semibold">Add Category</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input name="name" placeholder="Name" required className="rounded-md border border-border px-3 py-2 text-sm" />
          <input name="slug" placeholder="Slug" required className="rounded-md border border-border px-3 py-2 text-sm" />
          <input name="sortOrder" type="number" placeholder="Sort Order" defaultValue="0" className="rounded-md border border-border px-3 py-2 text-sm" />
        </div>
        <textarea name="description" placeholder="Description" rows={2} className="w-full rounded-md border border-border px-3 py-2 text-sm" />
        <button type="submit" className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-light">
          Create Category
        </button>
      </form>

      <div className="mt-6 space-y-2">
        {categories?.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between rounded-lg border border-border bg-white px-4 py-3">
            <div>
              <span className="text-sm font-medium">{cat.name}</span>
              <span className="ml-2 text-xs text-muted-foreground">/ {cat.slug}</span>
            </div>
            <form action={deleteCategory.bind(null, cat.id)}>
              <button type="submit" className="text-xs text-danger hover:underline">Delete</button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
