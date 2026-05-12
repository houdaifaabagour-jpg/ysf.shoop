import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/get-session";
import { getDashboardStats, getRecentOrders, getOrdersByStatus, getTopProducts } from "@/features/admin/analytics/queries";
import { SimpleBarChart } from "@/components/admin/charts/simple-bar-chart";
import Link from "next/link";

export const metadata = { title: "Admin Dashboard" };

const STATUS_COLORS: Record<string, string> = {
  pending_confirmation: "bg-amber-100 text-amber-800 border-amber-200",
  confirmed: "bg-blue-100 text-blue-800 border-blue-200",
  packed: "bg-indigo-100 text-indigo-800 border-indigo-200",
  shipped: "bg-purple-100 text-purple-800 border-purple-200",
  delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
  refused: "bg-orange-100 text-orange-800 border-orange-200",
  returned: "bg-red-100 text-red-800 border-red-200",
  cancelled: "bg-red-200 text-red-900 border-red-300",
};

const STATUS_LABELS: Record<string, string> = {
  pending_confirmation: "Pending",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  refused: "Refused",
  returned: "Returned",
  cancelled: "Cancelled",
};

function formatCurrency(val: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val);
}

function StatCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full opacity-10 blur-2xl ${accent ?? "bg-primary"}`} />
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-4xl font-bold tracking-tight text-foreground">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/login");

  const [stats, recentOrders, ordersByStatus, topProducts] = await Promise.all([
    getDashboardStats(),
    getRecentOrders(10),
    getOrdersByStatus(),
    getTopProducts(5),
  ]);

  const chartData = ordersByStatus.map((s) => ({ label: s.status, value: s.count }));
  const maxStatus = Math.max(...chartData.map((d) => d.value), 1);
  const totalOrdersChart = chartData.reduce((s, d) => s + d.value, 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">Welcome back — here&apos;s what&apos;s happening with your store.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/orders" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted/50">
            View Orders
          </Link>
          <Link href="/admin/products" className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-muted/50">
            Manage Products
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={formatCurrency(stats.totalRevenue)} sub="From delivered orders" accent="bg-emerald-500" />
        <StatCard label="Total Orders" value={stats.totalOrders.toLocaleString()} sub="All time" accent="bg-blue-500" />
        <StatCard label="Pending Orders" value={stats.pendingOrders.toLocaleString()} sub="Awaiting confirmation" accent="bg-amber-500" />
        <StatCard label="Total Customers" value={stats.totalCustomers.toLocaleString()} sub="Registered users" accent="bg-purple-500" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-border bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-border px-6 py-4">
              <h2 className="text-base font-semibold">Recent Orders</h2>
              <Link href="/admin/orders" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                View all
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">Order ID</th>
                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">Customer</th>
                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">Date</th>
                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">Total</th>
                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No orders yet</td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => {
                      const badge = STATUS_COLORS[order.status] ?? "bg-slate-100 text-slate-800 border-slate-200";
                      const label = STATUS_LABELS[order.status] ?? order.status;
                      const date = new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
                      return (
                        <tr key={order.id} className="transition-colors hover:bg-muted/30">
                          <td className="px-6 py-3.5 font-mono text-xs text-muted-foreground">#{order.id.slice(0, 8)}</td>
                          <td className="px-6 py-3.5 font-medium">{order.customer_name}</td>
                          <td className="px-6 py-3.5 text-muted-foreground">{date}</td>
                          <td className="px-6 py-3.5 font-semibold">{formatCurrency(order.total)}</td>
                          <td className="px-6 py-3.5">
                            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${badge}`}>
                              {label}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold">Top Products</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">Best sellers by order count</p>
            {topProducts.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">No product data yet.</p>
            ) : (
              <div className="mt-4 space-y-3">
                {topProducts.map((product, i) => (
                  <div key={product.id} className="flex items-center gap-4">
                    <span className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-slate-100 text-slate-600" : i === 2 ? "bg-orange-100 text-orange-700" : "bg-muted text-muted-foreground"
                    }`}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">{product.title}</p>
                    </div>
                    <span className="flex-shrink-0 text-sm font-semibold text-muted-foreground">
                      {product.order_count} sold
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold">Orders by Status</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{totalOrdersChart} total orders</p>

            {chartData.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">No order data yet.</p>
            ) : (
              <div className="mt-6 space-y-4">
                {chartData.map((item) => {
                  const pct = (item.value / maxStatus) * 100;
                  const colorClass = {
                    pending_confirmation: "bg-amber-400",
                    confirmed: "bg-blue-500",
                    packed: "bg-indigo-500",
                    shipped: "bg-purple-500",
                    delivered: "bg-emerald-500",
                    refused: "bg-orange-500",
                    returned: "bg-red-500",
                    cancelled: "bg-red-600",
                  }[item.label] ?? "bg-slate-400";
                  const badgeClass = STATUS_COLORS[item.label] ?? "bg-slate-100 text-slate-800 border-slate-200";
                  const label = STATUS_LABELS[item.label] ?? item.label;

                  return (
                    <div key={item.label}>
                      <div className="mb-1 flex items-center justify-between">
                        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${badgeClass}`}>
                          {label}
                        </span>
                        <span className="text-sm font-bold">{item.value}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full rounded-full ${colorClass} transition-all duration-700 ease-out`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-white p-6 shadow-sm">
            <h2 className="text-base font-semibold">Quick Stats</h2>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Products</span>
                <span className="font-semibold">{stats.totalProducts.toLocaleString()}</span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Avg. Order Value</span>
                <span className="font-semibold">
                  {stats.totalOrders > 0 ? formatCurrency(stats.totalRevenue / stats.totalOrders) : "$0.00"}
                </span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Conversion Rate</span>
                <span className="font-semibold">
                  {stats.totalCustomers > 0 ? ((stats.totalOrders / stats.totalCustomers) * 100).toFixed(1) : "0"}%
                </span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Fulfillment Rate</span>
                <span className="font-semibold">
                  {stats.totalOrders > 0 ? ((((stats.totalOrders - (stats.pendingOrders ?? 0)) / stats.totalOrders) * 100)).toFixed(1) : "0"}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}