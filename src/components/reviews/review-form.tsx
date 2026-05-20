"use client";

import { useActionState } from "react";
import { StarFilledIcon } from "@shopify/polaris-icons";
import { submitReview } from "@/features/reviews/actions";

type ReviewFormProps = {
  productId: string;
};

const initialState = { error: "", success: false };

export function ReviewForm({ productId }: ReviewFormProps) {
  const [state, formAction, isPending] = useActionState(submitReview, initialState);

  if (state.success) {
    return (
      <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
        Thank you! Your review has been submitted and is pending approval.
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 rounded-lg border border-border p-4">
      <input type="hidden" name="productId" value={productId} />

      <div>
        <label className="block text-sm font-medium">Rating</label>
        <div className="mt-1 flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <label key={star} className="cursor-pointer">
              <input type="radio" name="rating" value={star} className="peer sr-only" required />
              <StarFilledIcon className="w-8 h-8 fill-muted peer-checked:fill-yellow-500 hover:fill-yellow-400 transition-colors" />
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="comment" className="block text-sm font-medium">
          Comment (minimum 10 characters)
        </label>
        <textarea
          id="comment"
          name="comment"
          rows={4}
          minLength={10}
          className="mt-1 block w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
          placeholder="Share your experience with this product..."
          required
        />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
      >
        {isPending ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}