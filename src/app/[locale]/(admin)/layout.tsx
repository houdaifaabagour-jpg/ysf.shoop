import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <AdminSidebar />
      <main className="flex-1 bg-muted/30 p-6 lg:p-8">{children}</main>
    </div>
  );
}
