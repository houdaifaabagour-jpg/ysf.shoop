import { getCart } from "@/features/cart/actions";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/get-session";
import { CheckoutClient } from "./checkout-client";
import type { CartItem } from "@/types/database";

export const metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login?redirect=/checkout");

  const cart = await getCart();
  const items = cart?.items as CartItem[] | undefined;
  if (!items?.length) redirect("/cart");

  const subtotal = items.reduce(
    (sum: number, item) => sum + (item.product?.price ?? 0) * item.quantity,
    0,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <div className="mt-8">
        <CheckoutClient items={items} baseSubtotal={subtotal} />
      </div>
    </div>
  );
}
