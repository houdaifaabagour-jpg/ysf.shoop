import Link from "next/link";
import { Heart } from "lucide-react";
import { getWishlistCount } from "@/features/wishlist/queries";
import { getSession } from "@/lib/auth/get-session";

export async function WishlistCount() {
  const session = await getSession();
  if (!session?.user) return null;

  const count = await getWishlistCount();
  if (count === 0) return null;

  return (
    <Link href="/account/wishlist" className="relative flex items-center gap-1 hover:text-primary-light transition-colors" aria-label="Wishlist">
      <Heart className="h-5 w-5" />
      <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-white">
        {count > 99 ? "99+" : count}
      </span>
    </Link>
  );
}