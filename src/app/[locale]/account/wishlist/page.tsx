import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/get-session";
import { getWishlistItems } from "@/features/wishlist/queries";
import { WishlistItemClient } from "@/components/wishlist/wishlist-item-client";

export const metadata = { title: "المفضلة" };

export default async function WishlistPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const session = await getSession();
  if (!session?.user) redirect(`/${locale}/login`);

  const items = await getWishlistItems();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">المفضلة</h1>
        <p className="mt-1 text-sm text-muted-foreground">{items.length} منتج{items.length !== 1 ? "ات" : ""}</p>
      </div>
      <WishlistItemClient items={items} />
    </div>
  );
}
