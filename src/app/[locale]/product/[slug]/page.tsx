import { notFound } from "next/navigation";
import { getProduct } from "@/features/catalog/queries";
import { getProductReviews, getReviewStats, hasUserReviewed } from "@/features/reviews/queries";
import { AddToCartButton } from "@/features/cart/add-to-cart-button";
import { StarRating } from "@/components/reviews/star-rating";
import { ReviewList } from "@/components/reviews/review-list";
import { ReviewForm } from "@/components/reviews/review-form";
import { WishlistButtonServer } from "@/components/wishlist/wishlist-button";
import { getProfile } from "@/lib/auth/get-session";
import { isInWishlist } from "@/features/wishlist/queries";
import { logger } from "@/lib/logging/logger";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Not Found" };
  return { title: product.title };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const image = product.images?.[0];
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.price;
  const defaultVariant = product.variants?.find((v) => v.is_active);

  const [reviews, stats, profile] = await Promise.all([
    getProductReviews(product.id),
    getReviewStats(product.id),
    getProfile(),
  ]);

  let canReview = false;
  let inWishlist = false;
  if (profile) {
    canReview = !(await hasUserReviewed(product.id, profile.id));
    inWishlist = await isInWishlist(product.id);
  }

  logger.info("product_view", { productId: product.id, slug });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-lg bg-muted">
          {image ? (
            <img src={image.url} alt={image.alt ?? product.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              No Image
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{product.title}</h1>
          {product.category && (
            <p className="mt-2 text-sm text-muted-foreground">{product.category.name}</p>
          )}

          <div className="mt-4 flex items-center gap-3">
            <span className="text-2xl font-bold">${product.price}</span>
            {hasDiscount && (
              <span className="text-lg text-muted-foreground line-through">${product.compare_at_price}</span>
            )}
          </div>

          {product.description && (
            <p className="mt-4 text-muted-foreground leading-relaxed">{product.description}</p>
          )}

          {product.variants && product.variants.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium">Options</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.variants.filter((v) => v.is_active).map((variant) => (
                  <button
                    key={variant.id}
                    className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
                  >
                    {variant.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center gap-3">
            <AddToCartButton
              productId={product.id}
              variantId={defaultVariant?.id}
              disabled={!defaultVariant || defaultVariant.stock === 0}
            />
            <WishlistButtonServer productId={product.id} inWishlist={inWishlist} />
          </div>

          {defaultVariant && defaultVariant.stock <= 5 && defaultVariant.stock > 0 && (
            <p className="mt-2 text-sm text-accent">Only {defaultVariant.stock} left in stock</p>
          )}
          {defaultVariant && defaultVariant.stock === 0 && (
            <p className="mt-2 text-sm text-danger">Out of stock</p>
          )}
        </div>
      </div>

      <div className="mt-12 border-t border-border pt-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Customer Reviews</h2>
          {stats.count > 0 && (
            <div className="flex items-center gap-2">
              <StarRating rating={stats.avg} size="md" />
              <span className="text-sm text-muted-foreground">
                {stats.avg.toFixed(1)} out of 5 ({stats.count} review{stats.count !== 1 ? "s" : ""})
              </span>
            </div>
          )}
        </div>

        {profile && canReview && (
          <div className="mb-8">
            <h3 className="mb-3 text-lg font-medium">Write a Review</h3>
            <ReviewForm productId={product.id} />
          </div>
        )}

        {!profile && (
          <p className="mb-6 text-sm text-muted-foreground">
            <a href="/login" className="text-primary underline">Log in</a> to write a review.
          </p>
        )}

        {profile && !canReview && (
          <p className="mb-6 text-sm text-muted-foreground">You have already reviewed this product.</p>
        )}

        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
}
