"use client";

import Link from "next/link";
import { HeaderNav } from "./header-nav";
import { HeaderActions } from "./header-actions";

interface HeaderProps {
  user?: { id?: string; email?: string } | null;
  locale?: string;
}

export function Header({ user, locale = "ar" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <div className="glass luxury-border rounded-full px-4 py-2 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href={`/${locale}`} className="text-xl font-bold tracking-tight text-primary">
              ysf.shoop
            </Link>
            <HeaderNav locale={locale} />
          </div>

          <HeaderActions user={user} locale={locale} />
        </div>
      </div>
    </header>
  );
}