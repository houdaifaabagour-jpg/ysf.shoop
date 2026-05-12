import type { Review } from "@/types/database";

type ReviewWithProfile = Review & {
  profile?: { id: string; full_name: string | null; avatar_url: string | null };
};

type ReviewListProps = {
  reviews: ReviewWithProfile[];
};

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review!</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < review.rating ? "text-yellow-500" : "text-muted"}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-sm font-medium">
                {review.profile?.full_name ?? "Anonymous"}
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(review.created_at).toLocaleDateString()}
            </span>
          </div>
          {review.comment && (
            <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
          )}
        </div>
      ))}
    </div>
  );
}