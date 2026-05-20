"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth/get-session";
import { logger } from "@/lib/logging/logger";
import { randomUUID } from "crypto";

async function getCartSessionId() {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("cart_session_id")?.value;
  if (!sessionId) {
    sessionId = randomUUID();
    cookieStore.set("cart_session_id", sessionId, { maxAge: 60 * 60 * 24 * 30 }); // 30 days
  }
  return sessionId;
}

export async function addToCart(productId: string, variantId?: string, quantity = 1) {
  const supabase = await createClient();
  const session = await getSession();

  let cart;

  if (session?.user) {
    const { data } = await supabase
      .from("carts")
      .select("id")
      .eq("customer_id", session.user.id)
      .maybeSingle();
    cart = data;
  } else {
    const sessionId = await getCartSessionId();
    const { data } = await supabase
      .from("carts")
      .select("id")
      .eq("session_id", sessionId)
      .maybeSingle();
    cart = data;
  }

  if (!cart) {
    const insertData: { customer_id?: string; session_id?: string } = {};
    if (session?.user) {
      insertData.customer_id = session.user.id;
    } else {
      insertData.session_id = await getCartSessionId();
    }
    
    const { data } = await supabase
      .from("carts")
      .insert(insertData)
      .select("id")
      .single();
    cart = data;
  }

  const cartId = cart!.id;

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

  let query = supabase
    .from("carts")
    .select("*, items:cart_items(*, product:products(*), variant:product_variants(*))");

  if (session?.user) {
    query = query.eq("customer_id", session.user.id);
  } else {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get("cart_session_id")?.value;
    if (!sessionId) return null;
    query = query.eq("session_id", sessionId);
  }

  const { data: cart } = await query.maybeSingle();
  return cart;
}
