"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { toggleWishlist } from "@/features/wishlist/actions";
import { Heart } from "lucide-react";

interface WishlistButtonProps {
  productId: string;
  initialInWishlist?: boolean;
}

export function WishlistButton({ productId, initialInWishlist = false }: WishlistButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isWishlisted, setIsWishlisted] = useState(initialInWishlist);

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleWishlist(productId);
      if (result.success) {
        setIsWishlisted(!isWishlisted);
        router.refresh();
      } else if (result.error?.includes("logged in")) {
        router.push("/login");
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      className="rounded-lg border border-border p-2 transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Heart
        className="h-5 w-5"
        fill={isWishlisted ? "currentColor" : "none"}
      />
    </button>
  );
}

export async function WishlistButtonServer({ productId, inWishlist }: { productId: string; inWishlist: boolean }) {
  return <WishlistButton productId={productId} initialInWishlist={inWishlist} />;
}