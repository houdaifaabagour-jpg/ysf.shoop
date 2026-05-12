import Link from "next/link";
import { getCart } from "@/features/cart/actions";
import { CartItemRow } from "@/features/cart/cart-item-row";
import type { CartItem } from "@/types/database";
import { getTranslations } from "next-intl/server";
import { ShoppingBag, ArrowLeft } from "lucide-react";

export const metadata = { title: "Cart" };

export default async function CartPage() {
  const t = await getTranslations("cart");
  const cart = await getCart();
  const items = cart?.items as CartItem[] | undefined;

  if (!items || items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <div className="mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold">{t("yourCart")}</h1>
        <p className="mt-4 text-muted-foreground">{t("cartEmpty")}</p>
        <Link href="/shop" className="mt-8 btn-luxury btn-luxury-primary">
          {t("continueShopping")}
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce(
    (sum: number, item) => sum + (item.product?.price ?? 0) * item.quantity,
    0,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-center gap-3">
        <Link href="/shop" className="p-2 rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">{t("yourCart")}</h1>
        <span className="text-sm text-muted-foreground">({items.length} منتج)</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="double-bezel p-2">
            <div className="double-bezel-inner divide-y divide-border">
              {items.map((item) => (
                <div key={item.id} className="p-4">
                  <CartItemRow item={item} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="double-bezel p-4 sticky top-24">
            <div className="double-bezel-inner p-4">
              <h2 className="text-lg font-semibold mb-4">ملخص الطلب</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("subtotal")}</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">الشحن</span>
                  <span className="text-gold text-xs bg-gold/10 px-2 py-0.5 rounded-full">مجاني</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-bold">
                  <span>{t("total")}</span>
                  <span className="text-gold text-xl">${subtotal.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="mt-6 w-full btn-luxury btn-luxury-primary py-4 text-center block"
              >
                {t("proceedToCheckout")}
              </Link>

              <p className="mt-4 text-center text-xs text-muted-foreground">
                الدفع عند الاستلام — ادفع عند وصول طلبك
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}