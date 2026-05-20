import type { Metadata } from "next";
import { AdminSidebar } from "@/components/admin/sidebar";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: { template: "%s | Admin — ysf.shoop", default: "Admin — ysf.shoop" },
};

interface AdminLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const { locale } = await params;
  const isRTL = locale === "ar";

  return (
    <div lang={locale} dir={isRTL ? "rtl" : "ltr"}>
      <AdminSidebar locale={locale} />
      <main className={`min-h-screen bg-muted/30 p-4 pb-20 lg:pb-8 lg:p-8 ${isRTL ? "lg:mr-64" : "lg:ml-64"}`}>{children}</main>
    </div>
  );
}