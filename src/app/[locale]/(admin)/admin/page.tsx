import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const t = await getTranslations("admin");
  const admin = await requireAdmin();
  if (!admin) redirect("/login");
  const supabase = await createClient();

  const { count: totalOrders } = await supabase.from("orders").select("*", { count: "exact", head: true });
  const { count: totalProducts } = await supabase.from("products").select("*", { count: "exact", head: true });
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: revenueData } = await supabase
    .from("orders")
    .select("total")
    .eq("status", "delivered");
  const totalRevenue = revenueData?.reduce((sum, o) => sum + Number(o.total), 0) ?? 0;

  return (
    <div>
      <h1 className="text-2xl font-bold">{t("dashboard")}</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-white p-6">
          <p className="text-sm text-muted-foreground">{t("totalOrders")}</p>
          <p className="mt-1 text-3xl font-bold">{totalOrders ?? 0}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-6">
          <p className="text-sm text-muted-foreground">{t("products")}</p>
          <p className="mt-1 text-3xl font-bold">{totalProducts ?? 0}</p>
        </div>
        <div className="rounded-lg border border-border bg-white p-6">
          <p className="text-sm text-muted-foreground">{t("totalRevenue")}</p>
          <p className="mt-1 text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <h2 className="mt-8 text-lg font-semibold">{t("recentOrders")}</h2>
      <div className="mt-4 space-y-2">
        {recentOrders?.map((order) => (
          <div key={order.id} className="flex items-center justify-between rounded-lg border border-border bg-white px-4 py-3">
            <span className="text-sm font-mono">#{order.id.slice(0, 8)}</span>
            <span className="text-sm capitalize">{order.status.replace(/_/g, " ")}</span>
            <span className="text-sm font-semibold">${Number(order.total).toFixed(2)}</span>
          </div>
        ))}
        {(!recentOrders || recentOrders.length === 0) && (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
