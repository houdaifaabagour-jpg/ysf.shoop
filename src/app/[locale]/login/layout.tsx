import type { Metadata } from "next";

const metaByLocale: Record<string, { title: string }> = {
  en: { title: "Sign In" },
  ar: { title: "تسجيل الدخول" },
  fr: { title: "Connexion" },
  es: { title: "Iniciar sesión" },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: (metaByLocale[locale] || metaByLocale.en).title, robots: { index: false, follow: false } };
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
