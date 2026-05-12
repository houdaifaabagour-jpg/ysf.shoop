"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logout } from "@/features/account/actions";
import { ChevronDown, User, ShoppingBag, Heart, LogOut } from "lucide-react";

interface HeaderAuthProps {
  user?: { email?: string } | null;
  locale: string;
}

export function HeaderAuth({ user, locale }: HeaderAuthProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <Link href={`/${locale}/login`} className="btn-luxury btn-luxury-secondary text-sm py-2 px-4">
        تسجيل الدخول
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full px-3 py-2 hover:bg-black/5 transition-all"
      >
        <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
          <User className="w-4 h-4 text-gold" />
        </div>
      </button>
      {open && (
        <>
          <div className="fixed inset-0" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-56 double-bezel p-1.5">
            <div className="double-bezel-inner p-4">
              <div className="border-b border-border pb-3 mb-2">
                <p className="truncate text-sm font-medium">{user.email}</p>
              </div>
              <nav className="space-y-1">
                <Link
                  href={`/${locale}/account`}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-muted transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <User className="w-4 h-4 text-muted-foreground" />
                  حسابي
                </Link>
                <Link
                  href={`/${locale}/account/orders`}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-muted transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <ShoppingBag className="w-4 h-4 text-muted-foreground" />
                  الطلبات
                </Link>
                <Link
                  href={`/${locale}/account/wishlist`}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-muted transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <Heart className="w-4 h-4 text-muted-foreground" />
                  المفضلة
                </Link>
                <form action={async () => {
                  await logout();
                  router.push(`/${locale}`);
                  router.refresh();
                }}>
                  <button
                    type="submit"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-danger hover:bg-muted transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    تسجيل الخروج
                  </button>
                </form>
              </nav>
            </div>
          </div>
        </>
      )}
    </div>
  );
}