"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/get-session";
import { redirect } from "next/navigation";

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  pendingOrders: number;
  totalProducts: number;
}

export interface RecentOrder {
  id: string;
  customer_name: string | null;
  total: number;
  status: string;
  created_at: string;
}

export interface SalesByMonth {
  month: string;
  revenue: number;
}

export interface TopProduct {
  id: string;
  title: string;
  order_count: number;
}

export interface OrderStatusCount {
  status: string;
  count: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  await requireAdmin();
  if (!await requireAdmin()) redirect("/login");

  const supabase = createAdminClient();

  const [{ count: totalOrders }, { count: totalProducts }, { count: totalCustomers }] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "customer"),
  ]);

  const { data: revenueData } = await supabase
    .from("orders")
    .select("total")
    .eq("status", "delivered");
  const totalRevenue = revenueData?.reduce((sum, o) => sum + Number(o.total), 0) ?? 0;

  const { count: pendingOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending_confirmation");

  return {
    totalOrders: totalOrders ?? 0,
    totalRevenue,
    totalCustomers: totalCustomers ?? 0,
    pendingOrders: pendingOrders ?? 0,
    totalProducts: totalProducts ?? 0,
  };
}

export async function getRecentOrders(limit: number = 10): Promise<RecentOrder[]> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("orders")
    .select(`
      id,
      total,
      status,
      created_at,
      customer:profiles!customer_id(full_name)
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  return (data ?? []).map((o) => ({
    id: o.id,
    customer_name: Array.isArray(o.customer) ? (o.customer[0] as { full_name: string } | null)?.full_name ?? "Guest" : (o.customer as { full_name: string } | null)?.full_name ?? "Guest",
    total: Number(o.total),
    status: o.status,
    created_at: o.created_at,
  }));
}

export async function getSalesByMonth(months: number = 6): Promise<SalesByMonth[]> {
  const supabase = createAdminClient();

  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1).toISOString().split("T")[0];

  const { data } = await supabase
    .from("orders")
    .select("total, created_at")
    .eq("status", "delivered")
    .gte("created_at", startDate);

  const byMonth: Record<string, number> = {};
  for (let i = 0; i < months; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - months + 1 + i, 1);
    byMonth[`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`] = 0;
  }

  for (const order of data ?? []) {
    const key = order.created_at.split("T")[0].slice(0, 7);
    if (byMonth[key] !== undefined) byMonth[key] += Number(order.total);
  }

  return Object.entries(byMonth).map(([month, revenue]) => {
    const [y, m] = month.split("-");
    const label = new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleDateString("en-US", { month: "short", year: "2-digit" });
    return { month: label, revenue };
  });
}

export async function getTopProducts(limit: number = 5): Promise<TopProduct[]> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("order_items")
    .select("product_id, quantity, product:products(id, title)")
    .limit(1000);

  const tally: Record<string, { id: string; title: string; order_count: number }> = {};
  for (const item of data ?? []) {
    const p = Array.isArray(item.product) ? (item.product[0] as { id: string; title: string } | null) : (item.product as { id: string; title: string } | null);
    if (!p) continue;
    if (!tally[p.id]) tally[p.id] = { id: p.id, title: p.title, order_count: 0 };
    tally[p.id].order_count += item.quantity;
  }

  return Object.values(tally)
    .sort((a, b) => b.order_count - a.order_count)
    .slice(0, limit);
}

export async function getOrdersByStatus(): Promise<OrderStatusCount[]> {
  const supabase = createAdminClient();

  const { data } = await supabase
    .from("orders")
    .select("status");

  const tally: Record<string, number> = {};
  for (const order of data ?? []) {
    tally[order.status] = (tally[order.status] ?? 0) + 1;
  }

  return Object.entries(tally).map(([status, count]) => ({ status, count }));
}