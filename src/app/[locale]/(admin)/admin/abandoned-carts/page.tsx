import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";
import { SendReminderButton } from "./send-reminder-button";

export const metadata = { title: "Abandoned Carts" };

export default async function AbandonedCartsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/login");

  const supabase = await createClient();
  const [cartsResult, remindersResult] = await Promise.all([
    supabase.rpc("get_abandoned_carts", { hours_threshold: 24 }),
    supabase.from("abandoned_cart_reminders").select("cart_id").order("sent_at", { ascending: false }),
  ]);

  const carts = cartsResult.data ?? [];
  const sentCartIds = new Set((remindersResult.data ?? []).map((r) => r.cart_id));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Abandoned Carts</h1>
          <p className="text-sm text-muted-foreground mt-1">عربات التسوق المتروكة منذ أكثر من 24 ساعة</p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Customer</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Email</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Items</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Total</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Last Updated</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(!carts || carts.length === 0) && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No abandoned carts found.</td></tr>
            )}
            {carts?.map((cart: { cart_id: string; customer_id: string | null; customer_email: string | null; customer_name: string | null; session_id: string | null; item_count: number; total_value: number; last_updated: string }) => (
              <tr key={cart.cart_id} className="border-t border-border hover:bg-muted/20">
                <td className="px-4 py-3">{cart.customer_name || "Guest"}</td>
                <td className="px-4 py-3">{cart.customer_email || cart.session_id || "—"}</td>
                <td className="px-4 py-3">{cart.item_count}</td>
                <td className="px-4 py-3 font-medium">{Number(cart.total_value).toLocaleString()} ر.س</td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                  {new Date(cart.last_updated).toLocaleString("en-SA")}
                </td>
                <td className="px-4 py-3">
                  {cart.customer_email ? (
                    sentCartIds.has(cart.cart_id)
                      ? <span className="text-xs text-green-600 font-medium">Reminder sent</span>
                      : <SendReminderButton cartId={cart.cart_id} />
                  ) : (
                    <span className="text-xs text-muted-foreground">No email</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
