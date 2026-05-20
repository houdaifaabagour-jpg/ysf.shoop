import { redirect } from "next/navigation";
import { StarFilledIcon, StarIcon } from "@shopify/polaris-icons";
import { requireAdmin } from "@/lib/auth/get-session";
import { getAllReviews } from "@/features/reviews/queries";
import { approveReview, deleteReview } from "@/features/reviews/actions";

export const metadata = { title: "Reviews" };

type Props = {
  searchParams: Promise<{ filter?: string; page?: string }>;
};

export default async function AdminReviewsPage({ searchParams }: Props) {
  const admin = await requireAdmin();
  if (!admin) redirect("/login");

  const { filter, page } = await searchParams;
  const approved = filter === "approved" ? true : filter === "pending" ? false : undefined;
  const pageNum = parseInt(page ?? "1", 10);

  const { reviews, count } = await getAllReviews({ approved, page: pageNum, limit: 20 });
  const totalPages = Math.ceil(count / 20);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Reviews</h1>
      </div>

      <div className="mb-4 flex gap-2 border-b border-border">
        {[
          { label: "All", value: "" },
          { label: "Pending", value: "pending" },
          { label: "Approved", value: "approved" },
        ].map((tab) => (
          <a
            key={tab.value}
            href={`/admin/reviews?filter=${tab.value}`}
            className={`px-3 py-2 text-sm font-medium ${
              (filter === tab.value || (!filter && !tab.value))
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            }`}
          >
            {tab.label}
          </a>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Product</th>
              <th className="px-3 py-2 text-left font-medium">Customer</th>
              <th className="px-3 py-2 text-left font-medium">Rating</th>
              <th className="px-3 py-2 text-left font-medium">Comment</th>
              <th className="px-3 py-2 text-left font-medium">Status</th>
              <th className="px-3 py-2 text-left font-medium">Date</th>
              <th className="px-3 py-2 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id} className="border-b border-border">
                <td className="px-3 py-3">
                  <a href={`/product/${review.product?.slug}`} className="text-primary hover:underline">
                    {review.product?.title ?? "Unknown"}
                  </a>
                </td>
                <td className="px-3 py-3">{review.profile?.full_name ?? review.profile?.email ?? "Unknown"}</td>
                <td className="px-3 py-3">
                  <span className="inline-flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) =>
                      i < review.rating ? (
                        <StarFilledIcon key={i} className="w-4 h-4 fill-yellow-500" />
                      ) : (
                        <StarIcon key={i} className="w-4 h-4 fill-muted" />
                      )
                    )}
                  </span>
                </td>
                <td className="px-3 py-3 max-w-xs truncate">{review.comment ?? "-"}</td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-block rounded px-2 py-0.5 text-xs ${
                      review.is_approved
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {review.is_approved ? "Approved" : "Pending"}
                  </span>
                </td>
                <td className="px-3 py-3">{new Date(review.created_at).toLocaleDateString()}</td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    {!review.is_approved && (
                      <form action={approveReview.bind(null, review.id)}>
                        <button className="rounded bg-green-600 px-2 py-1 text-xs text-white hover:bg-green-700">
                          Approve
                        </button>
                      </form>
                    )}
                    <form action={deleteReview.bind(null, review.id)}>
                      <button className="rounded bg-red-600 px-2 py-1 text-xs text-white hover:bg-red-700">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {reviews.length === 0 && (
          <p className="py-8 text-center text-muted-foreground">No reviews found.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/admin/reviews?page=${p}${filter ? `&filter=${filter}` : ""}`}
              className={`rounded px-3 py-1 text-sm ${
                p === pageNum ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}