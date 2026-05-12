import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/get-session";

export const metadata = { title: "Orders" };

export default async function AdminOrdersPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/login");
  return (
    <div>
      <h1 className="text-2xl font-bold">Orders</h1>
    </div>
  );
}