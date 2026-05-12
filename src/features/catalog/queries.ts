import { createClient } from "@/lib/supabase/server";
import { getStorageUrl } from "@/lib/supabase/client";
import type { Product, Category } from "@/types/database";

function processProductImages(product: Product): Product {
  if (product.images) {
    product.images = product.images.map((img) => ({
      ...img,
      url: getStorageUrl("product-images", img.url) ?? img.url,
    }));
  }
  return product;
}

function processProducts(products: Product[]): Product[] {
  return products.map(processProductImages);
}

export async function getProducts(options?: {
  categorySlug?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  const supabase = await createClient();
  const { categorySlug, search, sort = "newest", page = 1, limit = 12 } = options ?? {};

  let query = supabase
    .from("products")
    .select("*, category:categories(*), variants:product_variants(*), images:product_images(*)", { count: "exact" })
    .eq("is_active", true);

  if (categorySlug) {
    query = query.eq("category.slug", categorySlug);
  }

  if (search) {
    const term = search.trim();
    if (term) {
      query = query.or(
        `title.ilike.%${term}%,description.ilike.%${term}%,tags.cs.{"${term}"}`
      );
    }
  }

  if (sort === "price_asc") query = query.order("price", { ascending: true });
  else if (sort === "price_desc") query = query.order("price", { ascending: false });
  else query = query.order("created_at", { ascending: false });

  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, count } = await query;
  return { products: processProducts(data ?? []), count: count ?? 0 };
}

export async function getProduct(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, category:categories(*), variants:product_variants(*), images:product_images(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  return data ? processProductImages(data as Product) : null;
}

export async function getFeaturedProducts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, images:product_images(*)")
    .eq("is_featured", true)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(8);
  return processProducts(data ?? []);
}

export async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  return (data ?? []) as Category[];
}

export async function getCategory(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();
  return data as Category | null;
}

export async function getRelatedProducts(productId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("*, images:product_images(*)")
    .eq("is_active", true)
    .neq("id", productId)
    .limit(4);
  return processProducts(data ?? []);
}
