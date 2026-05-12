import Link from "next/link";
import { WishlistCount } from "@/components/wishlist/wishlist-count";
import { SearchBar, MobileSearchButton } from "./search-bar";
import { HeaderNav } from "./header-nav";
import { HeaderActions } from "./header-actions";
import { getSession } from "@/lib/auth/get-session";

interface HeaderProps {
  user?: { id?: string; email?: string } | null;
}

export async function Header({ user: propUser }: HeaderProps) {
  const session = propUser ?? await getSession();

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-xl font-bold tracking-tight text-primary">
          ysf.shoop
        </Link>

        <HeaderNav />

        <div className="flex items-center gap-2 sm:gap-4">
          <MobileSearchButton />
          <SearchBar />
          <WishlistCount />
          <HeaderActions />
        </div>
      </div>
    </header>
  );
}
