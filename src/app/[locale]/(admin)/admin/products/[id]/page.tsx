import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/get-session";
import { createClient } from "@/lib/supabase/server";
import { getCategories } from "@/features/catalog/queries";
import { EditProductClient, Product } from "./edit-product-client";

export const metadata = { title: "Edit Product" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) redirect("/login");
  const { id } = await params;

  const supabase = await createClient();
  
  // Fetch single product with images and variants
  const { data: product } = await supabase
    .from("products")
    .select("*, images:product_images(id, url, alt, sort_order), variants:product_variants(id, sku, label, attributes, price_override, stock)")
    .eq("id", id)
    .single();

  if (!product) redirect("/admin/products");

  const categories = await getCategories();

  // Fetch currency symbol setting
  const { data: symbolData } = await supabase
    .from("store_settings")
    .select("value")
    .eq("key", "currency_symbol")
    .maybeSingle();
  const currencySymbol = (symbolData?.value as string) || "ر.س";

  return (
    <EditProductClient 
      product={product as unknown as Product} 
      categories={categories} 
      currencySymbol={currencySymbol} 
      locale="ar" 
    />
  );
}
