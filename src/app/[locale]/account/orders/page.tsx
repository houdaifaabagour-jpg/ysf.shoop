import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth/get-session";
import { redirect } from "next/navigation";

export const metadata = { title: "My Orders" };

export default async function OrdersPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("customer_id", session.user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">My Orders</h1>

      {!orders?.length && (
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">No orders yet.</p>
          <Link href="/shop" className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
            Start Shopping
          </Link>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {orders?.map((order) => (
          <div key={order.id} className="rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">Order #{order.id.slice(0, 8)}</span>
                <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs capitalize">
                  {order.status.replace(/_/g, " ")}
                </span>
              </div>
              <span className="font-semibold">${Number(order.total).toFixed(2)}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {new Date(order.created_at).toLocaleDateString()} &middot; {order.items?.length ?? 0} items
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
