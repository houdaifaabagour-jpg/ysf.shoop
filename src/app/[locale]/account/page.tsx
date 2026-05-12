import { getSession, getProfile } from "@/lib/auth/get-session";
import { logout } from "@/features/account/actions";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getSession();
  const profile = await getProfile();

  if (!session?.user || !profile) {
    redirect(`/${locale}/login`);
  }

  const supabase = await (await import("@/lib/supabase/server")).createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("id, total, shipping_cost, status, created_at, items:order_items(quantity)")
    .eq("customer_id", session.user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="min-h-screen bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-bold text-primary mb-8">حسابي</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-bold mb-4">الملف الشخصي</h2>
            <div className="space-y-3 text-sm">
              <div><span className="text-muted-foreground">الاسم:</span> <span className="font-medium">{profile.full_name}</span></div>
              <div><span className="text-muted-foreground">البريد:</span> <span className="font-medium">{profile.email}</span></div>
              {profile.phone && <div><span className="text-muted-foreground">الهاتف:</span> <span className="font-medium">{profile.phone}</span></div>}
            </div>
            <form action={logout}>
              <input type="hidden" name="locale" value={locale} />
              <button type="submit" className="mt-6 text-red-500 hover:underline text-sm cursor-pointer">تسجيل الخروج</button>
            </form>
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">طلباتي الأخيرة</h2>
              <Link href={`/${locale}/account/orders`} className="text-gold hover:underline text-sm">عرض الكل</Link>
            </div>

            {!orders?.length ? (
              <div className="text-center py-12 bg-white rounded-xl border">
                <p className="text-muted-foreground mb-4">لا توجد طلبات بعد</p>
                <Link href={`/${locale}/shop`} className="btn-luxury btn-luxury-primary">تسوق الآن</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => {
                  const itemCount = order.items?.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0) ?? 0;
                  const statusMap: Record<string, string> = {
                    pending_confirmation: "قيد الانتظار", confirmed: "مؤكد", packed: "تم التجهيز",
                    shipped: "تم الشحن", delivered: "تم التوصيل", refused: "مرفوض", returned: "مرجع", cancelled: "ملغي"
                  };
                  return (
                    <div key={order.id} className="bg-white rounded-xl border p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="font-bold">#{order.id.slice(0, 8)}</span>
                          <span className="text-sm text-muted-foreground mr-2">{new Date(order.created_at).toLocaleDateString("ar-SA")}</span>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700">
                          {statusMap[order.status] || order.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{itemCount} منتجات</span>
                        <span className="font-bold text-gold">{Number(order.total).toLocaleString()} ر.س</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href={`/${locale}/account/orders`} className="bg-white rounded-xl border p-6 text-center hover:border-gold transition-colors">
            <div className="text-2xl mb-2">📦</div>
            <div className="font-semibold">طلباتي</div>
          </Link>
          <Link href={`/${locale}/account/wishlist`} className="bg-white rounded-xl border p-6 text-center hover:border-gold transition-colors">
            <div className="text-2xl mb-2">❤️</div>
            <div className="font-semibold">المفضلة</div>
          </Link>
          <Link href={`/${locale}/shop`} className="bg-white rounded-xl border p-6 text-center hover:border-gold transition-colors">
            <div className="text-2xl mb-2">🛍️</div>
            <div className="font-semibold">متابعة التسوق</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
