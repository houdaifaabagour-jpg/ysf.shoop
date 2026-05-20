import type { Metadata } from "next";
import { CheckoutSuccessClient } from "./success-client";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ysf.shoop";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const meta: Record<string, { title: string; description: string }> = {
    en: { title: "Order Confirmed", description: "Your order has been placed successfully" },
    ar: { title: "تم تأكيد الطلب", description: "تم تقديم طلبك بنجاح" },
    fr: { title: "Commande confirmée", description: "Votre commande a été passée avec succès" },
    es: { title: "Pedido confirmado", description: "Tu pedido se ha realizado con éxito" },
  };
  const m = meta[locale] || meta.en;
  return { title: m.title, description: m.description, robots: { index: false, follow: false } };
}

export default function CheckoutSuccessPage() {
  return <CheckoutSuccessClient />;
}
