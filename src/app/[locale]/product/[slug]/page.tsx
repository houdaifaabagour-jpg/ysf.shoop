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
import { ChevronRight, ShieldCheck, Truck, RefreshCw, ShoppingBag } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Not Found" };
  return { title: product.title };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations("common");
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
      <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
        <a href="/shop" className="hover:text-primary">{t("shop")}</a>
        <ChevronRight className="w-4 h-4" />
        <span>{product.category?.name}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="double-bezel p-2">
          <div className="double-bezel-inner aspect-square overflow-hidden rounded-2xl bg-muted flex items-center justify-center">
            {image ? (
              <img src={image.url} alt={image.alt ?? product.title} className="h-full w-full object-cover" />
            ) : (
              <svg className="w-16 h-16 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
          </div>
        </div>

        <div>
          {product.category && (
            <span className="inline-block rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold mb-3">
              {product.category.name}
            </span>
          )}

          <h1 className="text-2xl font-bold tracking-tight text-primary sm:text-3xl">{product.title}</h1>

          {stats.count > 0 && (
            <div className="mt-4 flex items-center gap-3">
              <StarRating rating={stats.avg} size="md" />
              <span className="text-sm text-muted-foreground">
                {stats.avg.toFixed(1)} ({stats.count} {t("reviews")})
              </span>
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <span className="text-3xl font-bold text-gold">${product.price}</span>
            {hasDiscount && (
              <span className="text-lg text-muted-foreground line-through">${product.compare_at_price}</span>
            )}
          </div>

          {product.description && (
            <p className="mt-6 text-muted-foreground leading-relaxed">{product.description}</p>
          )}

          {product.variants && product.variants.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-medium mb-3">الخيارات</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.filter((v) => v.is_active).map((variant) => (
                  <button
                    key={variant.id}
                    className="rounded-full border border-border px-4 py-2 text-sm transition-all hover:border-gold hover:bg-gold/5"
                  >
                    {variant.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex items-center gap-4">
            <AddToCartButton
              productId={product.id}
              variantId={defaultVariant?.id}
              disabled={!defaultVariant || defaultVariant.stock === 0}
            />
            <WishlistButtonServer productId={product.id} inWishlist={inWishlist} />
          </div>

          {defaultVariant && defaultVariant.stock <= 5 && defaultVariant.stock > 0 && (
            <p className="mt-3 text-sm text-gold">باقي فقط {defaultVariant.stock} في المخزون</p>
          )}
          {defaultVariant && defaultVariant.stock === 0 && (
            <p className="mt-3 text-sm text-danger">نفذ المخزون</p>
          )}

          <div className="mt-8 space-y-3 rounded-2xl border border-border p-4">
            {[
              { icon: Truck, text: "توصيل مجاني للطلبات فوق $100" },
              { icon: ShieldCheck, text: "ضمان 12 شهراً" },
              { icon: RefreshCw, text: "إرجاع خلال 30 يوماً" },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                <Icon className="w-5 h-5 text-gold" />
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 border-t border-border pt-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{t("reviews")}</h2>
          {stats.count > 0 && (
            <div className="flex items-center gap-2">
              <StarRating rating={stats.avg} size="md" />
              <span className="text-sm text-muted-foreground">
                {stats.avg.toFixed(1)} out of 5 ({stats.count})
              </span>
            </div>
          )}
        </div>

        {profile && canReview && (
          <div className="mb-8 double-bezel p-4">
            <div className="double-bezel-inner p-4">
              <h3 className="mb-3 text-lg font-medium">اكتب تقييم</h3>
              <ReviewForm productId={product.id} />
            </div>
          </div>
        )}

        {!profile && (
          <p className="mb-6 text-sm text-muted-foreground">
            <a href="/login" className="text-gold underline">سجل دخول</a> لكتابة تقييم
          </p>
        )}

        {profile && !canReview && (
          <p className="mb-6 text-sm text-muted-foreground">لقد قيمت هذا المنتج سابقاً</p>
        )}

        <ReviewList reviews={reviews} />
      </div>
    </div>
  );
}