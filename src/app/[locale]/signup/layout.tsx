import type { Metadata } from "next";

const metaByLocale: Record<string, { title: string }> = {
  en: { title: "Create Account" },
  ar: { title: "إنشاء حساب" },
  fr: { title: "Créer un compte" },
  es: { title: "Crear cuenta" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: (metaByLocale[locale] || metaByLocale.en).title, robots: { index: false, follow: false } };
}

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
