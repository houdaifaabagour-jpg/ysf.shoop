import type { Metadata } from "next";
import { getSession, getProfile } from "@/lib/auth/get-session";
import { logout } from "@/features/account/actions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatPrice } from "@/lib/format";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ysf.shoop";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<string, string> = { en: "My Account", ar: "حسابي", fr: "Mon Compte", es: "Mi Cuenta" };
  return { title: titles[locale] || titles.en, alternates: { canonical: `${siteUrl}/${locale}/account` } };
}

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
    <div className="min-h-screen bg-warm">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary mb-8">{locale === "ar" ? "حسابي" : "My Account"}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div className="bg-white rounded-xl p-6">
            <h2 className="text-sm font-semibold text-primary mb-4">{locale === "ar" ? "الملف الشخصي" : "Profile"}</h2>
            <div className="space-y-3 text-sm">
              <div><span className="text-muted-foreground">{locale === "ar" ? "الاسم:" : "Name:"}</span> <span className="font-medium text-primary">{profile.full_name}</span></div>
              <div><span className="text-muted-foreground">{locale === "ar" ? "البريد:" : "Email:"}</span> <span className="font-medium text-primary">{profile.email}</span></div>
              {profile.phone && <div><span className="text-muted-foreground">{locale === "ar" ? "الهاتف:" : "Phone:"}</span> <span className="font-medium text-primary">{profile.phone}</span></div>}
            </div>
            <form action={logout}>
              <input type="hidden" name="locale" value={locale} />
              <button type="submit" className="mt-6 text-sm text-danger hover:text-danger/80 transition-colors cursor-pointer">{locale === "ar" ? "تسجيل الخروج" : "Log out"}</button>
            </form>
          </div>

          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-primary">{locale === "ar" ? "طلباتي الأخيرة" : "Recent Orders"}</h2>
              <Link href={`/${locale}/account/orders`} className="text-xs text-muted-foreground hover:text-primary transition-colors">{locale === "ar" ? "عرض الكل" : "View all"}</Link>
            </div>

            {!orders?.length ? (
              <div className="text-center py-12 bg-white rounded-xl">
                <p className="text-sm text-muted-foreground mb-4">{locale === "ar" ? "لا توجد طلبات بعد" : "No orders yet"}</p>
                <Link href={`/${locale}/shop`} className="btn-luxury btn-luxury-primary">{locale === "ar" ? "تسوق الآن" : "Shop now"}</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map(order => {
                  const itemCount = order.items?.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0) ?? 0;
                  const statusMap: Record<string, string> = locale === "ar" ? {
                    pending_confirmation: "قيد الانتظار", confirmed: "مؤكد", packed: "تم التجهيز",
                    shipped: "تم الشحن", delivered: "تم التوصيل", refused: "مرفوض", returned: "مرجع", cancelled: "ملغي"
                  } : {
                    pending_confirmation: "Pending", confirmed: "Confirmed", packed: "Packed",
                    shipped: "Shipped", delivered: "Delivered", refused: "Refused", returned: "Returned", cancelled: "Cancelled"
                  };
                  return (
                    <div key={order.id} className="bg-white rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-semibold text-primary">#{order.id.slice(0, 8)}</span>
                          <span className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US")}</span>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === "delivered" ? "bg-success/10 text-success" : 
                          order.status === "cancelled" || order.status === "refused" || order.status === "returned" ? "bg-danger/10 text-danger" : 
                          "bg-primary/10 text-primary"
                        }`}>
                          {statusMap[order.status] || order.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{itemCount} {locale === "ar" ? "منتجات" : "items"}</span>
                        <span className="text-sm font-semibold text-primary">{formatPrice(Number(order.total))}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href={`/${locale}/account/orders`} className="bg-white rounded-xl p-5 text-center hover:shadow-card-hover transition-all">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
            </div>
            <div className="text-sm font-medium text-primary">{locale === "ar" ? "طلباتي" : "My Orders"}</div>
          </Link>
          <Link href={`/${locale}/account/wishlist`} className="bg-white rounded-xl p-5 text-center hover:shadow-card-hover transition-all">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            </div>
            <div className="text-sm font-medium text-primary">{locale === "ar" ? "المفضلة" : "Wishlist"}</div>
          </Link>
          <Link href={`/${locale}/shop`} className="bg-white rounded-xl p-5 text-center hover:shadow-card-hover transition-all">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
              <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            </div>
            <div className="text-sm font-medium text-primary">{locale === "ar" ? "متابعة التسوق" : "Continue Shopping"}</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
