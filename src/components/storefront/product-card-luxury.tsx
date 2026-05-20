import Link from "next/link";
import { ProductImage } from "@/components/ui/product-image";
import { formatPrice } from "@/lib/format";

interface ProductCardLuxuryProps {
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  image: string;
  categoryName?: string;
  locale: string;
  currencySymbol?: string;
}

export function ProductCardLuxury({ slug, name, price, compareAtPrice, image, categoryName, locale, currencySymbol }: ProductCardLuxuryProps) {
  const hasDiscount = compareAtPrice != null && compareAtPrice > price;

  return (
    <Link href={`/${locale}/product/${slug}`} className="group block">
      <div className="card-hover bg-white rounded-xl overflow-hidden">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <ProductImage
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        <div className="p-4 sm:p-5">
          {categoryName && (
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider">{categoryName}</span>
          )}
          <h3 className="text-sm font-medium text-primary mt-1.5 line-clamp-2">{name}</h3>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm font-semibold text-primary">
              {formatPrice(price, currencySymbol)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(compareAtPrice!, currencySymbol)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
