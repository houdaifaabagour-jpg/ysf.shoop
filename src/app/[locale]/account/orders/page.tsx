import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth/get-session";
import { redirect } from "next/navigation";
import { formatPrice } from "@/lib/format";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ysf.shoop";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const meta: Record<string, { title: string; description: string }> = {
    en: { title: "My Orders", description: "View your order history" },
    ar: { title: "طلباتي", description: "عرض سجل طلباتك" },
    fr: { title: "Mes commandes", description: "Voir votre historique de commandes" },
    es: { title: "Mis pedidos", description: "Ver tu historial de pedidos" },
  };
  const m = meta[locale] || meta.en;
  return { title: m.title, description: m.description, alternates: { canonical: `${siteUrl}/${locale}/account/orders` } };
}

export default async function OrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getSession();
  if (!session?.user) redirect(`/${locale}/login`);

  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("customer_id", session.user.id)
    .order("created_at", { ascending: false });

  const statusMap: Record<string, string> = {
    pending_confirmation: "قيد الانتظار", confirmed: "مؤكد", packed: "تم التجهيز",
    shipped: "تم الشحن", delivered: "تم التوصيل", refused: "مرفوض", returned: "مرجع", cancelled: "ملغي"
  };

  return (
    <div className="min-h-screen bg-warm">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-6">
          <Link href={`/${locale}/account`} className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
            {locale === "ar" ? "العودة" : "Back"}
          </Link>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-primary">{locale === "ar" ? "طلباتي" : "My Orders"}</h1>

        {!orders?.length && (
          <div className="mt-10 text-center">
            <p className="text-sm text-muted-foreground">{locale === "ar" ? "لا توجد طلبات بعد." : "No orders yet."}</p>
            <Link href={`/${locale}/shop`} className="mt-4 inline-block btn-luxury btn-luxury-primary">
              {locale === "ar" ? "ابدأ التسوق" : "Start shopping"}
            </Link>
          </div>
        )}

        <div className="mt-6 space-y-3">
          {orders?.map((order) => (
            <div key={order.id} className="bg-white rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-primary">{locale === "ar" ? "طلب" : "Order"} #{order.id.slice(0, 8)}</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    order.status === "delivered" ? "bg-success/10 text-success" : 
                    order.status === "cancelled" || order.status === "refused" || order.status === "returned" ? "bg-danger/10 text-danger" : 
                    "bg-primary/10 text-primary"
                  }`}>
                    {statusMap[order.status] || order.status.replace(/_/g, " ")}
                  </span>
                </div>
                <span className="text-sm font-semibold text-primary">
                  {formatPrice(Number(order.total))}
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")} &middot; {order.items?.length ?? 0} {locale === "ar" ? "منتجات" : "items"}
                </p>
                <Link href={`/${locale}/track-order/${order.id}`} className="text-xs text-primary font-medium hover:text-primary-light transition-colors">
                  {locale === "ar" ? "تتبع الطلب" : "Track order"}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
