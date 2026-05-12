import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/get-session";

export const metadata = { title: "Categories" };

export default async function AdminCategoriesPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/login");
  return (
    <div>
      <h1 className="text-2xl font-bold">Categories</h1>
    </div>
  );
}