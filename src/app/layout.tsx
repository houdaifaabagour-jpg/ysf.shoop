import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { OrganizationSchema, WebSiteSchema } from "@/components/seo/json-ld";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ysf.shoop";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "ysf.shoop — Watches & Glasses", template: "%s | ysf.shoop" },
  description: "Premium watches and glasses curated for style and precision.",
  openGraph: {
    type: "website",
    siteName: "ysf.shoop",
    title: "ysf.shoop — Watches & Glasses",
    description: "Premium watches and glasses curated for style and precision.",
    locale: "en_US",
    alternateLocale: ["ar_SA", "fr_FR", "es_ES"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ysf.shoop — Watches & Glasses",
    description: "Premium watches and glasses curated for style and precision.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <OrganizationSchema />
        <WebSiteSchema />
        {children}
      </body>
    </html>
  );
}
