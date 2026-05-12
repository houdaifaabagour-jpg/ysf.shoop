import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth/get-session";
import { redirect } from "next/navigation";

export const metadata = { title: "طلباتي" };

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
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">طلباتي</h1>

      {!orders?.length && (
        <div className="mt-8 text-center">
          <p className="text-muted-foreground">لا توجد طلبات بعد.</p>
          <Link href={`/${locale}/shop`} className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
            ابدأ التسوق
          </Link>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {orders?.map((order) => (
          <div key={order.id} className="rounded-lg border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm font-medium">طلب #{order.id.slice(0, 8)}</span>
                <span className="mr-2 rounded-full bg-muted px-2 py-0.5 text-xs">
                  {statusMap[order.status] || order.status.replace(/_/g, " ")}
                </span>
              </div>
              <span className="font-semibold">{Number(order.total).toLocaleString()} ر.س</span>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                {new Date(order.created_at).toLocaleDateString("ar-SA")} &middot; {order.items?.length ?? 0} منتجات
              </p>
              <Link href={`/${locale}/track-order/${order.id}`} className="text-xs text-gold hover:underline">
                تتبع الطلب
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
