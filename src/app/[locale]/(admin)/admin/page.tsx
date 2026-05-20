import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";
import { formatPrice } from "@/lib/format";
import { ShoppingBag, Tag, DollarSign, ArrowUpRight, TrendingUp, Clock, AlertCircle } from "lucide-react";

export const metadata = { title: "Admin Dashboard" };

export default async function AdminDashboardPage() {
  const t = await getTranslations("admin");
  const admin = await requireAdmin();
  if (!admin) redirect("/login");
  
  const supabase = await createClient();

  // Fetch stats
  const { count: totalOrders } = await supabase.from("orders").select("*", { count: "exact", head: true });
  const { count: totalProducts } = await supabase.from("products").select("*", { count: "exact", head: true });
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .order("created_at", { ascending: false })
    .limit(5);

  const { data: revenueData } = await supabase
    .from("orders")
    .select("total")
    .eq("status", "delivered");
  const totalRevenue = revenueData?.reduce((sum, o) => sum + Number(o.total), 0) ?? 0;

  // Fetch low stock items (< 5)
  const { data: variants } = await supabase
    .from("product_variants")
    .select("*, product:products(title)")
    .lt("stock", 5)
    .order("stock", { ascending: true })
    .limit(5);

  // Fetch currency symbol
  const { data: symbolData } = await supabase
    .from("store_settings")
    .select("value")
    .eq("key", "currency_symbol")
    .maybeSingle();
  const currencySymbol = (symbolData?.value as string) || "ر.س";

  // Status styling map
  const statusColors: Record<string, string> = {
    pending_confirmation: "bg-amber-50 text-amber-700 border-amber-200/50",
    confirmed: "bg-blue-50 text-blue-700 border-blue-200/50",
    packed: "bg-indigo-50 text-indigo-700 border-indigo-200/50",
    shipped: "bg-purple-50 text-purple-700 border-purple-200/50",
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
    refused: "bg-red-50 text-red-700 border-red-200/50",
    returned: "bg-rose-50 text-rose-700 border-rose-200/50",
    cancelled: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <div className="space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">{t("dashboard") || "Dashboard"}</h1>
          <p className="text-sm text-neutral-text-muted mt-1">Manage, analyze, and oversee your watches and glasses boutique.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-neutral-text-muted bg-neutral-warm rounded-full px-4 py-1.5 border border-neutral-border self-start sm:self-auto">
          <Clock className="w-3.5 h-3.5" />
          <span>Last updated: Just now</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 sm:grid-cols-3">
        {/* Total Orders */}
        <div className="rounded-2xl border border-neutral-border bg-white p-6 transition-all hover:shadow-card-hover group">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-neutral-text-muted">Total Orders</span>
            <div className="rounded-full bg-accent/10 p-2.5 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-primary tracking-tight">{totalOrders ?? 0}</h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-neutral-text-muted">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>Checkout and draft orders</span>
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="rounded-2xl border border-neutral-border bg-white p-6 transition-all hover:shadow-card-hover group">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-neutral-text-muted">Active Products</span>
            <div className="rounded-full bg-primary/10 p-2.5 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
              <Tag className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-primary tracking-tight">{totalProducts ?? 0}</h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-neutral-text-muted">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>In luxury catalog</span>
            </div>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="rounded-2xl border border-neutral-border bg-white p-6 transition-all hover:shadow-card-hover group">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-neutral-text-muted">Delivered Revenue</span>
            <div className="rounded-full bg-emerald-50/80 p-2.5 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-3xl font-bold text-primary tracking-tight">
              {formatPrice(totalRevenue, currencySymbol)}
            </h3>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-neutral-text-muted">
              <span className="text-emerald-600 font-semibold">100%</span>
              <span>Cash On Delivery (COD)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Recent Orders & Alerts */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Orders - 2 Columns on desktop */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-primary">Recent Orders</h2>
            <Link 
              href="/admin/orders" 
              className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-dark transition-colors"
            >
              <span>View all orders</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-hidden rounded-2xl border border-neutral-border bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-neutral-warm/80 text-xs font-bold text-primary border-b border-neutral-border">
                  <tr>
                    <th className="px-5 py-4 text-center">ID</th>
                    <th className="px-5 py-4">Customer Info</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Total Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-border-light">
                  {recentOrders?.map((order) => (
                    <tr key={order.id} className="hover:bg-neutral-warm/30 transition-colors">
                      <td className="px-5 py-4 text-center">
                        <Link href="/admin/orders" className="text-xs font-mono font-bold text-accent hover:underline">
                          #{order.id.slice(0, 8)}
                        </Link>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-primary">
                          {(order.shipping_address as Record<string, string>)?.fullName || "Guest Customer"}
                        </div>
                        <div className="text-xs text-neutral-text-muted mt-0.5">{order.phone}</div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border ${
                          statusColors[order.status] || "bg-neutral-muted text-neutral-text-muted border-neutral-border"
                        }`}>
                          {order.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-bold text-primary">
                        {formatPrice(Number(order.total), currencySymbol)}
                      </td>
                    </tr>
                  ))}
                  {(!recentOrders || recentOrders.length === 0) && (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-neutral-text-muted">
                        No orders recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Low Stock Notifications / Alerts - 1 Column on desktop */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-primary">Stock Warnings</h2>
          
          <div className="rounded-2xl border border-neutral-border bg-white p-5 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-border-light">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              <div className="text-sm font-bold text-primary">Low Stock Alerts</div>
            </div>

            <div className="space-y-3">
              {variants?.map((variant) => (
                <div key={variant.id} className="flex items-center justify-between p-3 rounded-xl bg-neutral-warm/50 border border-neutral-border-light text-xs">
                  <div className="min-w-0 pr-2">
                    <div className="font-bold text-primary truncate">
                      {variant.product?.title || "Unknown Product"}
                    </div>
                    <div className="text-neutral-text-muted mt-0.5 font-medium">
                      Model: {variant.label} ({variant.sku})
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full font-bold text-center shrink-0 ${
                    variant.stock === 0 
                      ? "bg-red-50 text-red-600 border border-red-200" 
                      : "bg-amber-50 text-amber-700 border border-amber-200"
                  }`}>
                    {variant.stock === 0 ? "Out" : `${variant.stock} left`}
                  </span>
                </div>
              ))}
              {(!variants || variants.length === 0) && (
                <p className="text-xs text-neutral-text-muted text-center py-6">
                  All systems green! No low stock warnings.
                </p>
              )}
            </div>

            <Link href="/admin/products" className="block text-center text-xs font-bold text-accent hover:text-accent-dark transition-colors pt-1">
              Manage inventory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
