import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";
import { updateOrderStatus } from "@/features/admin/actions";
import type { Order, OrderItem } from "@/types/database";

const ORDER_STATUSES = ["pending_confirmation", "confirmed", "packed", "shipped", "delivered", "refused", "returned", "cancelled"];

export const metadata = { title: "Orders" };

export default async function AdminOrdersPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/login");
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .order("created_at", { ascending: false });
  const typedOrders = orders as unknown as (Order & { items: OrderItem[] })[] | null;

  return (
    <div>
      <h1 className="text-2xl font-bold">Orders</h1>

      <div className="mt-6 space-y-3">
        {typedOrders?.map((order) => (
          <div key={order.id} className="rounded-lg border border-border bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-mono font-medium">#{order.id.slice(0, 8)}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>
              <span className="font-semibold">${Number(order.total).toFixed(2)}</span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span>{order.phone}</span>
              <span>&middot;</span>
              <span className="capitalize">{(order.shipping_address as Record<string, string>)?.city}</span>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs capitalize">
                {order.status.replace(/_/g, " ")}
              </span>
              {ORDER_STATUSES.map((status) => (
                <form key={status} action={updateOrderStatus.bind(null, order.id, status, "")} className="inline">
                  <button
                    type="submit"
                    className="rounded px-2 py-0.5 text-xs hover:bg-muted disabled:opacity-30"
                    disabled={status === order.status}
                  >
                    {status.replace(/_/g, " ")}
                  </button>
                </form>
              ))}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {order.items?.map((item) => (
                <span key={item.id} className="mr-3">{item.title} x{item.quantity}</span>
              ))}
            </div>
          </div>
        ))}
        {(!typedOrders || typedOrders.length === 0) && (
          <p className="text-sm text-muted-foreground">No orders yet.</p>
        )}
      </div>
    </div>
  );
}
