import { Header } from "@/components/storefront/header";
import { Footer } from "@/components/storefront/footer";
import { getSession } from "@/lib/auth/get-session";

export default async function StorefrontLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getSession();

  return (
    <div lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <Header user={session?.user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
