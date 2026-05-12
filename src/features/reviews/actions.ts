"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAuth, requireAdmin } from "@/lib/auth/get-session";
import { reviewSchema } from "@/lib/validation/schemas";
import { logger } from "@/lib/logging/logger";

type ActionState = { error?: string; success?: boolean };

export async function submitReview(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const session = await requireAuth();
  if (!session) return { error: "You must be logged in to submit a review" };

  const raw = {
    productId: formData.get("productId") as string,
    rating: parseInt(formData.get("rating") as string),
    comment: (formData.get("comment") as string) || undefined,
  };

  const parsed = reviewSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "Invalid review data" };
  }

  const supabase = await createClient();

  const { error: existing } = await supabase
    .from("reviews")
    .select("id")
    .eq("product_id", parsed.data.productId)
    .eq("customer_id", session.user.id)
    .single();

  if (existing && existing.code !== "PGRST116") {
    logger.error("review_check_failed", { error: existing.message });
    return { error: "Unable to submit review" };
  }

  if (existing) {
    return { error: "You have already reviewed this product" };
  }

  const { error } = await supabase.from("reviews").insert({
    product_id: parsed.data.productId,
    customer_id: session.user.id,
    rating: parsed.data.rating,
    comment: parsed.data.comment?.trim() || null,
    is_approved: false,
  });

  if (error) {
    logger.error("review_submit_failed", { error: error.message, productId: parsed.data.productId });
    return { error: "Failed to submit review" };
  }

  logger.info("review_submitted", { productId: parsed.data.productId, rating: parsed.data.rating });
  revalidatePath(`/product/`);
  return { success: true };
}

export async function approveReview(reviewId: string) {
  const admin = await requireAdmin();
  if (!admin) return;

  const supabase = await createClient();
  const { error } = await supabase.from("reviews").update({ is_approved: true }).eq("id", reviewId);

  if (error) {
    logger.error("review_approve_failed", { error: error.message, reviewId });
    return;
  }

  logger.info("review_approved", { reviewId });
  revalidatePath("/admin/reviews");
}

export async function deleteReview(reviewId: string) {
  const admin = await requireAdmin();
  if (!admin) return;

  const supabase = await createClient();
  const { error } = await supabase.from("reviews").delete().eq("id", reviewId);

  if (error) {
    logger.error("review_delete_failed", { error: error.message, reviewId });
    return;
  }

  logger.info("review_deleted", { reviewId });
  revalidatePath("/admin/reviews");
}