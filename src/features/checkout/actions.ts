"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSession, getProfile } from "@/lib/auth/get-session";
import { checkoutSchema } from "@/lib/validation/schemas";
import { logger } from "@/lib/logging/logger";

export async function createCODOrder(formData: FormData) {
  const supabase = await createClient();
  const session = await getSession();
  if (!session?.user) throw new Error("Please sign in to checkout");

  const raw = {
    fullName: formData.get("fullName") as string,
    phone: formData.get("phone") as string,
    address: formData.get("address") as string,
    city: formData.get("city") as string,
    country: formData.get("country") as string,
    deliveryNotes: (formData.get("deliveryNotes") as string) || undefined,
  };

  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    throw new Error("Invalid form data");
  }

  const { data: cart } = await supabase
    .from("carts")
    .select("*, items:cart_items(*, product:products(*), variant:product_variants(*))")
    .eq("customer_id", session.user.id)
    .single();

  if (!cart?.items?.length) throw new Error("Cart is empty");

  let total = 0;
  const orderItems: {
    product_id: string;
    variant_id: string | null;
    title: string;
    variant_label: string | null;
    quantity: number;
    unit_price: number;
    total_price: number;
  }[] = [];

  for (const item of cart.items) {
    const price = item.variant?.price_override ?? item.product?.price ?? 0;
    const lineTotal = price * item.quantity;
    total += lineTotal;

    orderItems.push({
      product_id: item.product_id,
      variant_id: item.variant_id,
      title: item.product?.title ?? "Unknown",
      variant_label: item.variant?.label ?? null,
      quantity: item.quantity,
      unit_price: price,
      total_price: lineTotal,
    });

    if (item.variant) {
      await supabase
        .from("product_variants")
        .update({ stock: item.variant.stock - item.quantity })
        .eq("id", item.variant.id);
    }
  }

  const couponId = formData.get("couponId") as string;
  const discount = formData.get("discount") ? parseFloat(formData.get("discount") as string) : 0;

  const { data: settings } = await supabase
    .from("store_settings")
    .select("value")
    .eq("key", "shipping_zones")
    .single();

  const zones = (settings?.value as { rate: number }[]) ?? [];
  const shippingCost = zones[0]?.rate ?? 9.99;

  const orderTotal = Math.max(0, total - discount);
  const finalTotal = orderTotal + shippingCost;

  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      customer_id: session.user.id,
      status: "pending_confirmation",
      total: finalTotal,
      shipping_cost: shippingCost,
      shipping_address: {
        fullName: parsed.data.fullName,
        address: parsed.data.address,
        city: parsed.data.city,
        country: parsed.data.country,
      },
      phone: parsed.data.phone,
      delivery_notes: parsed.data.deliveryNotes ?? null,
      coupon_id: couponId || null,
      discount: discount,
    })
    .select("id")
    .single();

  if (couponId) {
    await supabase.rpc("increment_coupon_usage", { p_coupon_id: couponId });
  }

  if (error) {
    logger.error("order_create_failed", { error: error.message });
    throw new Error("Failed to create order");
  }

  await supabase.from("order_items").insert(
    orderItems.map((item) => ({ ...item, order_id: order.id })),
  );

  await supabase
    .from("order_statuses")
    .insert({ order_id: order.id, status: "pending_confirmation", note: "Order placed via COD" });

  await supabase.from("cart_items").delete().eq("cart_id", cart.id);

  logger.info("order_created", { orderId: order.id, total: total + shippingCost });

  redirect(`/checkout/success?orderId=${order.id}`);
}
