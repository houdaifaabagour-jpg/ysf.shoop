import type { Metadata } from "next";
import { getSession } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ysf.shoop";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; orderId: string }> }): Promise<Metadata> {
  const { locale, orderId } = await params;
  const titles: Record<string, string> = { en: "Order Tracking", ar: "تتبع الطلب", fr: "Suivi de Commande", es: "Seguimiento de Pedido" };
  return { title: `${titles[locale] || titles.en} — ${orderId}`, alternates: { canonical: `${siteUrl}/${locale}/track-order/${orderId}` } };
}

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
    <div className="min-h-screen bg-warm">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-6">
          <Link href={`/${locale}/account/orders`} className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
            {locale === "ar" ? "العودة إلى الطلبات" : "Back to orders"}
          </Link>
        </div>

        <div className="bg-white rounded-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-primary">{locale === "ar" ? "تتبع الطلب" : "Order Tracking"}</h1>
              <p className="text-sm text-muted-foreground mt-1">#{order.id.slice(0, 8)}</p>
            </div>
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
              order.status === "delivered" ? "bg-success/10 text-success" :
              order.status === "cancelled" || order.status === "refused" || order.status === "returned" ? "bg-danger/10 text-danger" :
              "bg-primary/10 text-primary"
            }`}>
              {statusLabels[order.status] || order.status.replace(/_/g, " ")}
            </span>
          </div>

          {!["cancelled", "refused", "returned"].includes(order.status) && (
            <div className="relative">
              <div className="absolute right-[15px] top-0 bottom-0 w-px bg-border" />
              <div className="space-y-6 relative">
                {statusFlow.map((status, idx) => {
                  const done = idx <= currentIdx;
                  const active = idx === currentIdx;
                  return (
                    <div key={status} className="flex items-center gap-4 relative">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 shrink-0 ${
                        done ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                      } ${active ? "ring-4 ring-primary/20" : ""}`}>
                        {done ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        ) : idx + 1}
                      </div>
                      <div>
                        <p className={`text-sm font-medium ${done ? "text-primary" : "text-muted-foreground"}`}>
                          {statusLabels[status]}
                        </p>
                        {active && order.status_history?.length && (
                          <p className="text-xs text-muted-foreground mt-0.5">
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
          <div className="bg-white rounded-xl p-6">
            <h2 className="text-sm font-semibold text-primary mb-4">{locale === "ar" ? "تفاصيل الشحن" : "Shipping Details"}</h2>
            <div className="space-y-2.5 text-sm">
              <div className="flex gap-2"><span className="text-muted-foreground min-w-[60px]">{locale === "ar" ? "العنوان:" : "Address:"}</span><span className="text-primary">{order.shipping_address?.address as string}</span></div>
              <div className="flex gap-2"><span className="text-muted-foreground min-w-[60px]">{locale === "ar" ? "المدينة:" : "City:"}</span><span className="text-primary">{order.shipping_address?.city as string}</span></div>
              <div className="flex gap-2"><span className="text-muted-foreground min-w-[60px]">{locale === "ar" ? "البلد:" : "Country:"}</span><span className="text-primary">{order.shipping_address?.country as string}</span></div>
              <div className="flex gap-2"><span className="text-muted-foreground min-w-[60px]">{locale === "ar" ? "الهاتف:" : "Phone:"}</span><span className="text-primary">{order.phone}</span></div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6">
            <h2 className="text-sm font-semibold text-primary mb-4">{locale === "ar" ? "ملخص الطلب" : "Order Summary"}</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{locale === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
                <span className="font-medium">{formatPrice(Number(order.total - order.shipping_cost + order.discount))}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>{locale === "ar" ? "الخصم" : "Discount"}</span>
                  <span>-{formatPrice(Number(order.discount))}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">{locale === "ar" ? "الشحن" : "Shipping"}</span>
                <span>{order.shipping_cost === 0 ? (locale === "ar" ? "مجاني" : "Free") : formatPrice(Number(order.shipping_cost))}</span>
              </div>
              <div className="flex justify-between font-semibold text-primary border-t border-border pt-2 mt-2">
                <span>{locale === "ar" ? "الإجمالي" : "Total"}</span>
                <span>{formatPrice(Number(order.total))}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6">
          <h2 className="text-sm font-semibold text-primary mb-4">{locale === "ar" ? "المنتجات" : "Products"}</h2>
          <div className="space-y-3">
            {order.items?.map((item: { id: string; title: string; variant_label: string | null; quantity: number; total_price: number }) => (
              <div key={item.id} className="flex items-center justify-between gap-4 border-b border-border pb-3 last:border-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-primary">{item.title}</p>
                  {item.variant_label && <p className="text-xs text-muted-foreground mt-0.5">{item.variant_label}</p>}
                  <p className="text-xs text-muted-foreground mt-0.5">{locale === "ar" ? "الكمية:" : "Qty:"} {item.quantity}</p>
                </div>
                <span className="text-sm font-medium text-primary">{formatPrice(Number(item.total_price))}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
