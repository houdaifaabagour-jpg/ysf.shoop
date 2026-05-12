import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/get-session";

export interface CouponWithUsage {
  id: string;
  code: string;
  type: "fixed" | "percentage";
  value: number;
  min_order_amount: number | null;
  usage_limit: number | null;
  used_count: number;
  is_active: boolean;
  starts_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export async function getCoupons(): Promise<CouponWithUsage[]> {
  await requireAdmin();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as CouponWithUsage[];
}

export async function getCouponByCode(code: string): Promise<CouponWithUsage | null> {
  await requireAdmin();
  const supabase = await createClient();

  const { data } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase())
    .single();

  return data as CouponWithUsage | null;
}