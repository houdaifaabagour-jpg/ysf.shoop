import { createAdminClient } from "@/lib/supabase/admin";
import { logger } from "@/lib/logging/logger";

export async function logAudit(action: string, entity: string, entityId?: string, details?: Record<string, unknown>) {
  try {
    const supabase = await createAdminClient();
    const { error } = await supabase.from("audit_logs").insert({
      action,
      entity,
      entity_id: entityId ?? null,
      details: details ?? null,
    });
    if (error) logger.error("audit_log_failed", { error: error.message, action, entity });
  } catch (err) {
    logger.error("audit_log_error", { error: String(err), action, entity });
  }
}
