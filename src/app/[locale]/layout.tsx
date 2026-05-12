import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { Header } from "@/components/storefront/header";
import { Footer } from "@/components/storefront/footer";
import { isRTL } from "@/i18n/utils/config";

export default async function StorefrontLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const rtl = isRTL(locale);

  return (
    <div lang={locale} dir={rtl ? "rtl" : "ltr"}>
      <NextIntlClientProvider messages={messages}>
        <Header locale={locale} />
        <main className="flex-1">{children}</main>
        <Footer locale={locale} />
      </NextIntlClientProvider>
    </div>
  );
}