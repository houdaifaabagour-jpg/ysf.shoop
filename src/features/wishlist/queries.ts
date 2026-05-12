"use server";

import { createClient } from "@/lib/supabase/server";
import { getSession } from "@/lib/auth/get-session";
import type { WishlistItem } from "@/types/database";

export async function getWishlistItems() {
  const session = await getSession();
  if (!session?.user) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("wishlist_items")
    .select("*, product:products(*, images:product_images(*))")
    .eq("customer_id", session.user.id)
    .order("created_at", { ascending: false });

  return (data ?? []) as WishlistItem[];
}

export async function isInWishlist(productId: string): Promise<boolean> {
  const session = await getSession();
  if (!session?.user) return false;

  const supabase = await createClient();
  const { data } = await supabase
    .from("wishlist_items")
    .select("id")
    .eq("customer_id", session.user.id)
    .eq("product_id", productId)
    .maybeSingle();

  return !!data;
}

export async function getWishlistCount(): Promise<number> {
  const session = await getSession();
  if (!session?.user) return 0;

  const supabase = await createClient();
  const { count } = await supabase
    .from("wishlist_items")
    .select("*", { count: "exact", head: true })
    .eq("customer_id", session.user.id);

  return count ?? 0;
}