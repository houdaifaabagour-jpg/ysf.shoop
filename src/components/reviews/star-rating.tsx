type StarRatingProps = {
  rating: number;
  count?: number;
  size?: "sm" | "md" | "lg";
};

export function StarRating({ rating, count, size = "md" }: StarRatingProps) {
  const sizeClass = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }[size];

  return (
    <div className={`flex items-center gap-1 ${sizeClass}`}>
      <div className="flex text-yellow-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={i < Math.round(rating) ? "text-yellow-500" : "text-muted"}>
            ★
          </span>
        ))}
      </div>
      {count !== undefined && (
        <span className="text-sm text-muted-foreground">({count})</span>
      )}
    </div>
  );
}