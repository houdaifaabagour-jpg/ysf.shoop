"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth/get-session";
import { logger } from "@/lib/logging/logger";

type ActionState = { error?: string; success?: boolean };

export async function addToWishlist(productId: string): Promise<ActionState> {
  const session = await requireAuth();
  if (!session) return { error: "You must be logged in" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("wishlist_items")
    .upsert({ customer_id: session.user.id, product_id: productId }, { ignoreDuplicates: true });

  if (error) {
    logger.error("wishlist_add_failed", { error: error.message, productId });
    return { error: "Failed to add to wishlist" };
  }

  logger.info("wishlist_item_added", { productId });
  revalidatePath("/account/wishlist");
  revalidatePath("/product/[slug]");
  return { success: true };
}

export async function removeFromWishlist(productId: string): Promise<ActionState> {
  const session = await requireAuth();
  if (!session) return { error: "You must be logged in" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("wishlist_items")
    .delete()
    .eq("customer_id", session.user.id)
    .eq("product_id", productId);

  if (error) {
    logger.error("wishlist_remove_failed", { error: error.message, productId });
    return { error: "Failed to remove from wishlist" };
  }

  logger.info("wishlist_item_removed", { productId });
  revalidatePath("/account/wishlist");
  revalidatePath("/product/[slug]");
  return { success: true };
}

export async function toggleWishlist(productId: string): Promise<ActionState> {
  const session = await requireAuth();
  if (!session) return { error: "You must be logged in" };

  const supabase = await createClient();
  const { data } = await supabase
    .from("wishlist_items")
    .select("id")
    .eq("customer_id", session.user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (data) {
    const { error } = await supabase.from("wishlist_items").delete().eq("id", data.id);
    if (error) {
      logger.error("wishlist_toggle_failed", { error: error.message, productId });
      return { error: "Failed to update wishlist" };
    }
    logger.info("wishlist_item_removed", { productId });
  } else {
    const { error } = await supabase
      .from("wishlist_items")
      .insert({ customer_id: session.user.id, product_id: productId });
    if (error) {
      logger.error("wishlist_toggle_failed", { error: error.message, productId });
      return { error: "Failed to update wishlist" };
    }
    logger.info("wishlist_item_added", { productId });
  }

  revalidatePath("/account/wishlist");
  revalidatePath("/product/[slug]");
  return { success: true };
}