"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/admin/products", label: "Products", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { href: "/admin/categories", label: "Categories", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l1.121 1.121A2.25 2.25 0 0111.536 5l.621.621a2.25 2.25 0 010 3.182l-1.121 1.121A2.25 2.25 0 019.464 11.5l-.621-.621a2.25 2.25 0 010-3.182l1.121-1.121A2.25 2.25 0 0112.879 7H17M7 15h10M7 11h4" },
  { href: "/admin/orders", label: "Orders", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m3 0h3M3 16h3m3 0h3" },
  { href: "/admin/coupons", label: "Coupons", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l1.121 1.121A2.25 2.25 0 0111.536 5l.621.621a2.25 2.25 0 010 3.182l-1.121 1.121A2.25 2.25 0 019.464 11.5l-.621-.621a2.25 2.25 0 010-3.182l1.121-1.121A2.25 2.25 0 0112.879 7H17" },
  { href: "/admin/emails", label: "Emails", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { href: "/admin/abandoned-carts", label: "Abandoned", icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" },
  { href: "/admin/audit-logs", label: "Audit Logs", icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { href: "/admin/reviews", label: "Reviews", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
  { href: "/admin/settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

interface AdminSidebarProps {
  locale?: string;
}

export function AdminSidebar({ locale = "ar" }: AdminSidebarProps) {
  const pathname = usePathname();

  const isLinkActive = (href: string) => {
    const fullHref = `/${locale}${href}`;
    if (href === "/admin") {
      return pathname === fullHref || pathname === `${fullHref}/`;
    }
    return pathname.startsWith(fullHref);
  };

  const isRTL = locale === "ar";

  return (
    <>
      <aside 
        className={`fixed top-0 z-50 hidden lg:block h-screen w-60 bg-neutral-warm p-5 overflow-y-auto transition-all duration-300 ${
          isRTL ? "right-0 border-l border-neutral-border" : "left-0 border-r border-neutral-border"
        }`}
      >
        <Link href={`/${locale}/admin`} className="mb-8 block text-xl font-bold tracking-tight text-primary transition-colors hover:text-accent">
          ysf.shoop <span className="text-[10px] uppercase tracking-wider text-accent font-medium px-2 py-0.5 rounded-full bg-accent/10 ml-1.5 inline-block">Admin</span>
        </Link>
        <nav className="flex flex-col gap-1">
          {links.map((link) => {
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={`/${locale}${link.href}`}
                className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-all hover:translate-x-0.5 ${
                  active 
                    ? "bg-primary text-white shadow-button-lift" 
                    : "text-neutral-text-muted hover:text-primary hover:bg-neutral-muted"
                }`}
              >
                <svg className={`w-4 h-4 shrink-0 transition-colors ${active ? "text-accent" : "text-neutral-text-muted group-hover:text-primary"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
                </svg>
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-neutral-border bg-white/95 backdrop-blur-md px-2 py-1.5 lg:hidden shadow-lg">
        {links.slice(0, 5).map((link) => {
          const active = isLinkActive(link.href);
          return (
            <Link
              key={link.href}
              href={`/${locale}${link.href}`}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 text-[10px] font-semibold transition-all ${
                active ? "text-primary scale-105" : "text-neutral-text-muted hover:text-primary"
              }`}
            >
              <svg className={`w-5 h-5 transition-colors ${active ? "text-accent" : "text-neutral-text-muted"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
              </svg>
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
