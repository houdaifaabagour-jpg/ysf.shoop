import Link from "next/link";
import { getCart } from "@/features/cart/actions";
import { CartItemRow } from "@/features/cart/cart-item-row";
import type { CartItem } from "@/types/database";
import { getTranslations } from "next-intl/server";

export const metadata = { title: "Cart" };

export default async function CartPage() {
  const t = await getTranslations("cart");
  const cart = await getCart();
  const items = cart?.items as CartItem[] | undefined;

  if (!items || items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold">{t("yourCart")}</h1>
        <p className="mt-4 text-muted-foreground">{t("cartEmpty")}</p>
        <Link href="/shop" className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white">
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
      <h1 className="text-2xl font-bold">{t("yourCart")}</h1>

      <div className="mt-8 divide-y divide-border">
        {items.map((item) => (
          <CartItemRow key={item.id} item={item} />
        ))}
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <div className="flex items-center justify-between text-lg font-bold">
          <span>{t("subtotal")}</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("shippingAtCheckout")}
        </p>
        <Link
          href="/checkout"
          className="mt-4 inline-block w-full rounded-lg bg-primary px-8 py-3 text-center text-sm font-medium text-white hover:bg-primary-light sm:w-auto"
        >
          {t("proceedToCheckout")}
        </Link>
      </div>
    </div>
  );
}
