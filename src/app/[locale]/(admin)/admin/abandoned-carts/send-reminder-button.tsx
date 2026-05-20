"use client";

import { useTransition } from "react";
import { sendAbandonedCartReminder } from "@/features/admin/abandoned-cart-actions";

export function SendReminderButton({ cartId }: { cartId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(async () => { await sendAbandonedCartReminder(cartId); })}
      disabled={isPending}
      className="text-xs font-medium text-gold hover:text-gold/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isPending ? "Sending..." : "Send Reminder"}
    </button>
  );
}
