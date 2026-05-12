import { Header } from "@/components/storefront/header";
import { Footer } from "@/components/storefront/footer";
import { getSession } from "@/lib/auth/get-session";

export default async function StorefrontLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <>
      <Header user={session?.user} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
