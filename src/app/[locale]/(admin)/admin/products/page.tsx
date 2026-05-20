import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/features/catalog/queries";
import { ProductsClient } from "./products-client";

export const metadata = { title: "Boutique Products" };

export default async function AdminProductsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/login");

  const supabase = await createClient();

  // Fetch products with categories, images, and variants (stock)
  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(name), images:product_images(url, alt, sort_order), variants:product_variants(stock)")
    .order("created_at", { ascending: false });

  const categories = await getCategories();

  // Fetch currency symbol setting
  const { data: symbolData } = await supabase
    .from("store_settings")
    .select("value")
    .eq("key", "currency_symbol")
    .maybeSingle();
  const currencySymbol = (symbolData?.value as string) || "ر.س";

  return (
    <ProductsClient 
      initialProducts={products || []} 
      categories={categories} 
      currencySymbol={currencySymbol}
      locale="ar" // Layout handles local direction, we can default "ar" or pass a fallback
    />
  );
}
