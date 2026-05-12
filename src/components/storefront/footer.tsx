import Link from "next/link";
import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("footer");

  return (
    <footer className="border-t border-border bg-muted">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <h3 className="mb-3 text-sm font-semibold">ysf.shoop</h3>
            <p className="text-sm text-muted-foreground">
              {t("tagline")}
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold">{t("links")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/shop" className="hover:text-foreground transition-colors">All Products</Link></li>
              <li><Link href="/category/watches" className="hover:text-foreground transition-colors">Watches</Link></li>
              <li><Link href="/category/glasses" className="hover:text-foreground transition-colors">Glasses</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-semibold">{t("support")}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/account" className="hover:text-foreground transition-colors">My Account</Link></li>
              <li><Link href="/account/orders" className="hover:text-foreground transition-colors">{t("orderTracking")}</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-4 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} ysf.shoop. {t("allRightsReserved")}
        </div>
      </div>
    </footer>
  );
}
