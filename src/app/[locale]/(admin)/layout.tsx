import { AdminSidebar } from "@/components/admin/sidebar";

interface AdminLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function AdminLayout({ children, params }: AdminLayoutProps) {
  const { locale } = await params;

  return (
    <div lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <AdminSidebar locale={locale} />
      <main className="flex-1 bg-muted/30 p-6 lg:p-8">{children}</main>
    </div>
  );
}