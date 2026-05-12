import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/get-session";
import { getWishlistItems } from "@/features/wishlist/queries";
import { WishlistItemClient } from "@/components/wishlist/wishlist-item-client";

export const metadata = { title: "My Wishlist" };

export default async function WishlistPage() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const items = await getWishlistItems();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">My Wishlist</h1>
        <p className="mt-1 text-sm text-muted-foreground">{items.length} item{items.length !== 1 ? "s" : ""}</p>
      </div>
      <WishlistItemClient items={items} />
    </div>
  );
}