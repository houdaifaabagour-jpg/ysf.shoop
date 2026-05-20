import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/format";
import { getCart } from "@/features/cart/actions";
import { CartItemRow } from "@/features/cart/cart-item-row";
import { CartItem } from "@/types/database";

export default async function CartPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations();
  
  const cart = await getCart();
  const items: CartItem[] = (cart?.items as CartItem[]) || [];
  
  const subtotal = items.reduce((sum: number, item: CartItem) => {
    const price = item.variant?.price_override ?? item.product?.price ?? 0;
    return sum + (price * item.quantity);
  }, 0);
  
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-warm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-primary">{t("cart.yourCart")}</h1>
          {items.length > 0 && (
            <Link href={`/${locale}/shop`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t("common.continueShopping")}
            </Link>
          )}
        </div>

        {items.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-20">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-primary mb-2">{t("cart.cartEmpty")}</h2>
            <p className="text-sm text-muted-foreground mb-8">{t("cart.cartEmpty")}</p>
            <Link href={`/${locale}/shop`} className="btn-luxury btn-luxury-primary">
              {t("common.continueShopping")}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-2 space-y-3">
              {items.map((item: CartItem) => (
                <CartItemRow key={item.id} item={item} />
              ))}
            </div>

            <div>
              <div className="bg-white rounded-xl p-6 sticky top-28">
                <h2 className="text-base font-semibold text-primary mb-5">{t("checkout.orderSummary") || "Order Summary"}</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Products</span>
                    <span className="font-medium">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("checkout.shipping") || "Shipping"}</span>
                    <span className={shipping === 0 ? "text-success font-medium" : "font-medium"}>
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-muted-foreground bg-muted p-2.5 rounded-lg">
                      Free shipping over {formatPrice(500)}
                    </p>
                  )}
                  <div className="border-t border-border pt-3 mt-3 flex justify-between">
                    <span className="font-semibold">{t("cart.total")}</span>
                    <span className="font-bold text-lg text-primary">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
                <Link href={`/${locale}/checkout`} className="btn-luxury btn-luxury-primary w-full mt-6 text-center block">
                  {t("cart.proceedToCheckout")}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
