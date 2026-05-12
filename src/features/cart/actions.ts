"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth/get-session";
import { logger } from "@/lib/logging/logger";

export async function addToCart(productId: string, variantId?: string, quantity = 1) {
  const supabase = await createClient();
  const session = await getSession();

  let cartId: string;

  if (session?.user) {
    let { data: cart } = await supabase
      .from("carts")
      .select("id")
      .eq("customer_id", session.user.id)
      .maybeSingle();

    if (!cart) {
      const { data } = await supabase
        .from("carts")
        .insert({ customer_id: session.user.id })
        .select("id")
        .single();
      cart = data;
    }

    cartId = cart!.id;

    const { data: existing } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("cart_id", cartId)
      .eq("product_id", productId)
      .eq("variant_id", variantId ?? null)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + quantity })
        .eq("id", existing.id);
    } else {
      await supabase.from("cart_items").insert({
        cart_id: cartId,
        product_id: productId,
        variant_id: variantId ?? null,
        quantity,
      });
    }
  }

  logger.info("cart_add", { productId, variantId, quantity });
  revalidatePath("/cart");
  revalidatePath("/product/[slug]");
}

export async function updateCartItem(itemId: string, quantity: number) {
  const supabase = await createClient();
  if (quantity <= 0) {
    await supabase.from("cart_items").delete().eq("id", itemId);
  } else {
    await supabase.from("cart_items").update({ quantity }).eq("id", itemId);
  }
  revalidatePath("/cart");
}

export async function removeCartItem(itemId: string) {
  const supabase = await createClient();
  await supabase.from("cart_items").delete().eq("id", itemId);
  revalidatePath("/cart");
}

export async function getCart() {
  const supabase = await createClient();
  const session = await getSession();
  if (!session?.user) return null;

  const { data: cart } = await supabase
    .from("carts")
    .select("*, items:cart_items(*, product:products(*), variant:product_variants(*))")
    .eq("customer_id", session.user.id)
    .maybeSingle();

  return cart;
}
