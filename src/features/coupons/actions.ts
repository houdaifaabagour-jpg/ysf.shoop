"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/get-session";
import { couponSchema } from "@/lib/validation/schemas";
import { logger } from "@/lib/logging/logger";
import { logAudit } from "@/lib/audit/helper";

export type ActionState = { error?: string; success?: boolean };

export async function createCoupon(_prev: ActionState | null, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Unauthorized" };
  
  const supabase = await createClient();

  const raw = {
    code: (formData.get("code") as string).toUpperCase(),
    type: formData.get("type") as "fixed" | "percentage",
    value: parseFloat(formData.get("value") as string),
    minOrderAmount: formData.get("minOrderAmount") ? parseFloat(formData.get("minOrderAmount") as string) : undefined,
    usageLimit: formData.get("usageLimit") ? parseInt(formData.get("usageLimit") as string) : undefined,
    startsAt: (formData.get("startsAt") as string) || undefined,
    expiresAt: (formData.get("expiresAt") as string) || undefined,
  };

  const parsed = couponSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: "Invalid coupon data" };
  }

  const { error } = await supabase.from("coupons").insert({
    code: parsed.data.code,
    type: parsed.data.type,
    value: parsed.data.value,
    min_order_amount: parsed.data.minOrderAmount ?? null,
    usage_limit: parsed.data.usageLimit ?? null,
    starts_at: parsed.data.startsAt ? new Date(parsed.data.startsAt) : null,
    expires_at: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
    is_active: true,
  });

  if (error) {
    logger.error("coupon_create_failed", { error: error.message, code: parsed.data.code });
    return { error: error.message };
  }

  logger.info("coupon_created", { code: parsed.data.code });
  logAudit("create", "coupon", undefined, { code: parsed.data.code, type: parsed.data.type, value: parsed.data.value });
  revalidatePath("/admin/coupons");
  return { success: true };
}

export async function updateCoupon(couponId: string, _prev: ActionState | null, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  if (!admin) return { error: "Unauthorized" };
  
  const supabase = await createClient();

  const updates: Record<string, unknown> = {};

  const code = formData.get("code");
  const type = formData.get("type");
  const value = formData.get("value");
  const minOrderAmount = formData.get("minOrderAmount");
  const usageLimit = formData.get("usageLimit");
  const startsAt = formData.get("startsAt");
  const expiresAt = formData.get("expiresAt");
  const isActive = formData.get("isActive");

  if (code !== null) updates.code = (code as string).toUpperCase();
  if (type !== null) updates.type = type;
  if (value !== null) updates.value = parseFloat(value as string);
  if (minOrderAmount !== null) updates.min_order_amount = minOrderAmount ? parseFloat(minOrderAmount as string) : null;
  if (usageLimit !== null) updates.usage_limit = usageLimit ? parseInt(usageLimit as string) : null;
  if (startsAt !== null) updates.starts_at = startsAt ? new Date(startsAt as string) : null;
  if (expiresAt !== null) updates.expires_at = expiresAt ? new Date(expiresAt as string) : null;
  if (isActive !== null) updates.is_active = isActive === "true";

  const { error } = await supabase.from("coupons").update(updates).eq("id", couponId);
  if (error) {
    logger.error("coupon_update_failed", { error: error.message, couponId });
    return { error: error.message };
  }

  logger.info("coupon_updated", { couponId });
  logAudit("update", "coupon", couponId, { updates: Object.keys(updates) });
  revalidatePath("/admin/coupons");
  return { success: true };
}

export async function deleteCoupon(couponId: string) {
  const admin = await requireAdmin();
  if (!admin) throw new Error("Unauthorized");
  
  const supabase = await createClient();

  const { error } = await supabase.from("coupons").delete().eq("id", couponId);
  if (error) {
    logger.error("coupon_delete_failed", { error: error.message, couponId });
    throw new Error(error.message);
  }

  logger.info("coupon_deleted", { couponId });
  logAudit("delete", "coupon", couponId);
  revalidatePath("/admin/coupons");
}

export type ValidateCouponResult = 
  | { success: true; discount: number; couponId: string; code: string }
  | { success: false; error: string };

export async function validateCoupon(code: string, orderTotal: number): Promise<ValidateCouponResult> {
  const supabase = await createClient();

  const { data: coupon, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase())
    .single();

  if (error || !coupon) {
    return { success: false, error: "Invalid coupon code" };
  }

  if (!coupon.is_active) {
    return { success: false, error: "This coupon is no longer active" };
  }

  if (coupon.starts_at && new Date(coupon.starts_at) > new Date()) {
    return { success: false, error: "This coupon is not yet active" };
  }

  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return { success: false, error: "This coupon has expired" };
  }

  if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
    return { success: false, error: "This coupon has reached its usage limit" };
  }

  if (coupon.min_order_amount && orderTotal < coupon.min_order_amount) {
    return { success: false, error: `Minimum order amount of $${coupon.min_order_amount} required` };
  }

  let discount = 0;
  if (coupon.type === "percentage") {
    discount = (orderTotal * coupon.value) / 100;
  } else {
    discount = coupon.value;
  }

  if (discount > orderTotal) {
    discount = orderTotal;
  }

  return { success: true, discount, couponId: coupon.id, code: coupon.code };
}