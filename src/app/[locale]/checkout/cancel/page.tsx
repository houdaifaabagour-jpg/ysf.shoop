import type { Metadata } from "next";
import { CheckoutCancelClient } from "./cancel-client";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ysf.shoop";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const meta: Record<string, { title: string; description: string }> = {
    en: { title: "Order Cancelled", description: "Your order has been cancelled" },
    ar: { title: "تم إلغاء الطلب", description: "تم إلغاء طلبك" },
    fr: { title: "Commande annulée", description: "Votre commande a été annulée" },
    es: { title: "Pedido cancelado", description: "Tu pedido ha sido cancelado" },
  };
  const m = meta[locale] || meta.en;
  return { title: m.title, description: m.description, robots: { index: false, follow: false } };
}

export default function CheckoutCancelPage() {
  return <CheckoutCancelClient />;
}
