import Link from "next/link";

const links = [
  { href: "/admin", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { href: "/admin/products", label: "Products", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { href: "/admin/categories", label: "Categories", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l1.121 1.121A2.25 2.25 0 0111.536 5l.621.621a2.25 2.25 0 010 3.182l-1.121 1.121A2.25 2.25 0 019.464 11.5l-.621-.621a2.25 2.25 0 010-3.182l1.121-1.121A2.25 2.25 0 0112.879 7H17M7 15h10M7 11h4" },
  { href: "/admin/orders", label: "Orders", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m3 0h3M3 16h3m3 0h3" },
  { href: "/admin/coupons", label: "Coupons", icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l1.121 1.121A2.25 2.25 0 0111.536 5l.621.621a2.25 2.25 0 010 3.182l-1.121 1.121A2.25 2.25 0 019.464 11.5l-.621-.621a2.25 2.25 0 010-3.182l1.121-1.121A2.25 2.25 0 0112.879 7H17" },
  { href: "/admin/reviews", label: "Reviews", icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" },
  { href: "/admin/settings", label: "Settings", icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" },
];

interface AdminSidebarProps {
  locale?: string;
}

export function AdminSidebar({ locale = "ar" }: AdminSidebarProps) {
  return (
    <aside className="fixed right-0 top-0 z-50 h-screen w-64 border-l border-border bg-white p-6 lg:block overflow-y-auto">
      <Link href={`/${locale}/admin`} className="mb-8 block text-lg font-bold tracking-tight text-primary">
        ysf.shoop
      </Link>
      <nav className="flex flex-col gap-1">
        {links.map((link) => (
          <Link
            key={link.href}
            href={`/${locale}${link.href}`}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium hover:bg-muted transition-all"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d={link.icon} />
            </svg>
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}