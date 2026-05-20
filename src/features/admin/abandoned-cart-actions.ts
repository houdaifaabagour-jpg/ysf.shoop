"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/get-session";
import { logger } from "@/lib/logging/logger";
import { abandonedCartEmail } from "@/lib/email/service";
import { logAudit } from "@/lib/audit/helper";

export async function sendAbandonedCartReminder(cartId: string) {
  await requireAdmin();
  const supabase = await createClient();

  const { data: carts } = await supabase.rpc("get_abandoned_carts", { hours_threshold: 24 });
  const cart = carts?.find((c: { cart_id: string }) => c.cart_id === cartId);

  if (!cart || (!cart.customer_email && !cart.session_id)) {
    return { error: "No customer email available for this cart." };
  }

  const email = cart.customer_email || cart.session_id;

  const { data: profile } = cart.customer_id
    ? await supabase.from("profiles").select("preferred_locale").eq("id", cart.customer_id).single()
    : { data: null };

  const locale = profile?.preferred_locale || "ar";

  await abandonedCartEmail(email, cart.cart_id, Number(cart.item_count), locale);

  await supabase.from("abandoned_cart_reminders").insert({
    cart_id: cart.cart_id,
    customer_email: email,
  });

  logger.info("abandoned_cart_reminder_sent", { cartId: cart.cart_id, email });
  logAudit("send_reminder", "abandoned_cart", cart.cart_id, { email, item_count: Number(cart.item_count) });
  revalidatePath("/admin/abandoned-carts");
  return { success: true };
}
