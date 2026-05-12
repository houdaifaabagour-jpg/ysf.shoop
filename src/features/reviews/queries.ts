import { createClient } from "@/lib/supabase/server";
import type { Review } from "@/types/database";

export async function getProductReviews(productId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("*, profile:profiles(id, full_name, avatar_url)")
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });
  return (data ?? []) as (Review & { profile: { id: string; full_name: string | null; avatar_url: string | null } })[];
}

export async function getAllReviews(options?: {
  approved?: boolean;
  page?: number;
  limit?: number;
}) {
  const supabase = await createClient();
  const { approved, page = 1, limit = 20 } = options ?? {};

  let query = supabase
    .from("reviews")
    .select("*, profile:profiles(id, full_name, email), product:products(id, title, slug)", { count: "exact" });

  if (approved !== undefined) {
    query = query.eq("is_approved", approved);
  }

  query = query.order("created_at", { ascending: false });

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, count } = await query;

  return {
    reviews: (data ?? []) as (Review & { profile: { id: string; full_name: string | null; email: string | null }; product: { id: string; title: string; slug: string } })[],
    count: count ?? 0,
  };
}

export async function getReviewStats(productId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("rating")
    .eq("product_id", productId)
    .eq("is_approved", true);

  const reviews = data ?? [];
  const count = reviews.length;
  const avg = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;

  return { avg: Math.round(avg * 10) / 10, count };
}

export async function hasUserReviewed(productId: string, userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("id")
    .eq("product_id", productId)
    .eq("customer_id", userId)
    .single();
  return !!data;
}