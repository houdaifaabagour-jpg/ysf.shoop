import { StarFilledIcon, StarIcon } from "@shopify/polaris-icons";

type StarRatingProps = {
  rating: number;
  count?: number;
  size?: "sm" | "md" | "lg";
};

export function StarRating({ rating, count, size = "md" }: StarRatingProps) {
  const starSize = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  }[size];

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) =>
          i < Math.round(rating) ? (
            <StarFilledIcon key={i} className={`${starSize} fill-yellow-500`} />
          ) : (
            <StarIcon key={i} className={`${starSize} fill-muted`} />
          )
        )}
      </div>
      {count !== undefined && (
        <span className="text-sm text-muted-foreground">({count})</span>
      )}
    </div>
  );
}