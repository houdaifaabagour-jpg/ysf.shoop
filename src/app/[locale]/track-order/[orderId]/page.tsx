import { getSession } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

const statusFlow = [
  "pending_confirmation",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
] as const;

const statusLabels: Record<string, string> = {
  pending_confirmation: "قيد الانتظار",
  confirmed: "تم التأكيد",
  packed: "تم التجهيز",
  shipped: "تم الشحن",
  delivered: "تم التوصيل",
  refused: "مرفوض",
  returned: "مرجع",
  cancelled: "ملغي",
};

export default async function TrackOrderPage({
  params,
}: {
  params: Promise<{ locale: string; orderId: string }>;
}) {
  const { locale, orderId } = await params;
  const session = await getSession();
  if (!session?.user) redirect(`/${locale}/login`);

  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*, items:order_items(*), status_history:order_statuses(*)")
    .eq("id", orderId)
    .eq("customer_id", session.user.id)
    .single();

  if (!order) redirect(`/${locale}/account/orders`);

  const currentIdx = statusFlow.indexOf(order.status as typeof statusFlow[number]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <Link href={`/${locale}/account/orders`} className="text-sm text-gold hover:underline mb-4 inline-block">
        &larr; العودة إلى الطلبات
      </Link>

      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary">تتبع الطلب</h1>
            <p className="text-sm text-muted-foreground mt-1">#{order.id.slice(0, 8)}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            order.status === "delivered" ? "bg-green-100 text-green-700" :
            order.status === "cancelled" || order.status === "refused" || order.status === "returned" ? "bg-red-100 text-red-700" :
            "bg-blue-100 text-blue-700"
          }`}>
            {statusLabels[order.status] || order.status.replace(/_/g, " ")}
          </span>
        </div>

        {!["cancelled", "refused", "returned"].includes(order.status) && (
          <div className="relative">
            <div className="absolute right-4 top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-8 relative">
              {statusFlow.map((status, idx) => {
                const done = idx <= currentIdx;
                const active = idx === currentIdx;
                return (
                  <div key={status} className="flex items-center gap-4 relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 ${
                      done ? "bg-primary text-white" : "bg-gray-100 text-gray-400"
                    } ${active ? "ring-4 ring-primary/20" : ""}`}>
                      {done ? "✓" : idx + 1}
                    </div>
                    <div>
                      <p className={`font-medium ${done ? "text-primary" : "text-gray-400"}`}>
                        {statusLabels[status]}
                      </p>
                      {active && order.status_history?.length && (
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.status_history[order.status_history.length - 1].created_at).toLocaleDateString("ar-SA")}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-bold mb-3">تفاصيل الشحن</h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">العنوان:</span> {order.shipping_address?.address as string}</p>
            <p><span className="text-muted-foreground">المدينة:</span> {order.shipping_address?.city as string}</p>
            <p><span className="text-muted-foreground">البلد:</span> {order.shipping_address?.country as string}</p>
            <p><span className="text-muted-foreground">الهاتف:</span> {order.phone}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-bold mb-3">ملخص الطلب</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">المجموع الفرعي</span>
              <span>{Number(order.total - order.shipping_cost + order.discount).toLocaleString()} ر.س</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>الخصم</span>
                <span>-{Number(order.discount).toLocaleString()} ر.س</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">الشحن</span>
              <span>{order.shipping_cost === 0 ? "مجاني" : `${Number(order.shipping_cost).toLocaleString()} ر.س`}</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-2">
              <span>الإجمالي</span>
              <span>{Number(order.total).toLocaleString()} ر.س</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6">
        <h2 className="font-bold mb-4">المنتجات</h2>
        <div className="space-y-3">
          {order.items?.map((item: { id: string; title: string; variant_label: string | null; quantity: number; total_price: number }) => (
            <div key={item.id} className="flex items-center justify-between border-b pb-3 last:border-0">
              <div>
                <p className="font-medium">{item.title}</p>
                {item.variant_label && <p className="text-xs text-muted-foreground">{item.variant_label}</p>}
                <p className="text-xs text-muted-foreground">الكمية: {item.quantity}</p>
              </div>
              <span className="font-medium">{Number(item.total_price).toLocaleString()} ر.س</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
