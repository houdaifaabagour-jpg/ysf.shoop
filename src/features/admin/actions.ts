"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/get-session";
import { productSchema, categorySchema } from "@/lib/validation/schemas";
import { logger } from "@/lib/logging/logger";

export async function createProduct(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const raw = {
    title: formData.get("title") as string,
    slug: formData.get("slug") as string,
    description: (formData.get("description") as string) || undefined,
    price: parseFloat(formData.get("price") as string),
    compareAtPrice: formData.get("compareAtPrice") ? parseFloat(formData.get("compareAtPrice") as string) : undefined,
    categoryId: (formData.get("categoryId") as string) || undefined,
    isActive: formData.get("isActive") === "true",
    isFeatured: formData.get("isFeatured") === "true",
    tags: (formData.get("tags") as string)?.split(",").map((t) => t.trim()).filter(Boolean) ?? [],
  };

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) throw new Error("Invalid product data");

  const { error } = await supabase.from("products").insert({
    title: parsed.data.title,
    slug: parsed.data.slug,
    description: parsed.data.description,
    price: parsed.data.price,
    compare_at_price: parsed.data.compareAtPrice,
    category_id: parsed.data.categoryId,
    is_active: parsed.data.isActive,
    is_featured: parsed.data.isFeatured,
    tags: parsed.data.tags,
  });

  if (error) {
    logger.error("product_create_failed", { error: error.message });
    throw new Error(error.message);
  }

  logger.info("product_created", { slug: parsed.data.slug });
  revalidatePath("/admin/products");
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const updates: Record<string, unknown> = {};
  const fields = ["title", "slug", "description", "price", "compareAtPrice", "categoryId", "isActive", "isFeatured", "tags"];

  for (const field of fields) {
    const val = formData.get(field);
    if (val !== null) updates[field] = val;
  }

  if (updates.price) updates.price = parseFloat(updates.price as string);
  if (updates.compareAtPrice) updates.compare_at_price = parseFloat(updates.compareAtPrice as string);
  if (updates.isActive) updates.is_active = updates.isActive === "true";
  if (updates.isFeatured) updates.is_featured = updates.isFeatured === "true";

  const { error } = await supabase.from("products").update(updates).eq("id", id);
  if (error) throw new Error(error.message);

  logger.info("product_updated", { id });
  revalidatePath("/admin/products");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("products").delete().eq("id", id);
  logger.info("product_deleted", { id });
  revalidatePath("/admin/products");
}

export async function updateOrderStatus(orderId: string, status: string, note?: string) {
  await requireAdmin();
  const supabase = await createClient();

  await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", orderId);
  await supabase.from("order_statuses").insert({ order_id: orderId, status, note: note ?? null });

  logger.info("order_status_updated", { orderId, status });
  revalidatePath("/admin/orders");
}

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();

  const raw = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: (formData.get("description") as string) || undefined,
    sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
    isActive: formData.get("isActive") !== "false",
  };

  const parsed = categorySchema.safeParse(raw);
  if (!parsed.success) throw new Error("Invalid category data");

  const { error } = await supabase.from("categories").insert({
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description,
    sort_order: parsed.data.sortOrder,
    is_active: parsed.data.isActive,
  });

  if (error) {
    logger.error("category_create_failed", { error: error.message });
    throw new Error(error.message);
  }

  revalidatePath("/admin/categories");
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/admin/categories");
}

export async function updateSetting(key: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const value = formData.get("value") as string;

  let parsed: unknown;
  try { parsed = JSON.parse(value); } catch { parsed = value; }

  const { error } = await supabase
    .from("store_settings")
    .upsert({ key, value: parsed as Record<string, unknown>, updated_at: new Date().toISOString() }, { onConflict: "key" });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/settings");
}
