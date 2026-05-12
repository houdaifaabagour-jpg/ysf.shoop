"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/features/account/actions";
import { ChevronDown, User, ShoppingBag, Heart, LogOut } from "lucide-react";

interface HeaderAuthProps {
  user?: { email?: string } | null;
}

export function HeaderAuth({ user }: HeaderAuthProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <Link href="/login" className="hover:text-primary-light transition-colors">
        Login
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 hover:text-primary-light transition-colors"
      >
        <User className="h-4 w-4" />
        <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-border bg-card shadow-lg">
            <div className="border-b border-border px-4 py-2">
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
            <nav className="p-2">
              <Link
                href="/account"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                onClick={() => setOpen(false)}
              >
                <User className="h-4 w-4" />
                My Account
              </Link>
              <Link
                href="/account/orders"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                onClick={() => setOpen(false)}
              >
                <ShoppingBag className="h-4 w-4" />
                Orders
              </Link>
              <Link
                href="/account/wishlist"
                className="flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                onClick={() => setOpen(false)}
              >
                <Heart className="h-4 w-4" />
                Wishlist
              </Link>
              <form action={async () => {
                await logout();
                router.push("/");
                router.refresh();
              }}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-danger hover:bg-muted transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </form>
            </nav>
          </div>
        </>
      )}
    </div>
  );
}