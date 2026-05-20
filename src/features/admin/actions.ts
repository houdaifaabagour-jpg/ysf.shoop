"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/get-session";
import { productSchema, categorySchema } from "@/lib/validation/schemas";
import { logger } from "@/lib/logging/logger";
import { orderStatusEmail } from "@/lib/email/service";
import { logAudit } from "@/lib/audit/helper";
import { createAdminClient } from "@/lib/supabase/admin";
import { extractStoragePath } from "@/lib/storage/client";

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

  const { data: product, error } = await supabase.from("products").insert({
    title: parsed.data.title,
    slug: parsed.data.slug,
    description: parsed.data.description,
    price: parsed.data.price,
    compare_at_price: parsed.data.compareAtPrice,
    category_id: parsed.data.categoryId,
    is_active: parsed.data.isActive,
    is_featured: parsed.data.isFeatured,
    tags: parsed.data.tags,
  }).select("id").single();

  if (error || !product) {
    logger.error("product_create_failed", { error: error?.message });
    throw new Error(error?.message || "Failed to create product");
  }

  const images = formData.getAll("images") as File[];
  if (images && images.length > 0) {
    const adminClient = await createAdminClient();
    const BUCKET = "product-images";
    const MAX_SIZE = 5 * 1024 * 1024;
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    
    let sortOrder = 0;
    for (const file of images) {
      if (!file || file.size === 0 || file.size > MAX_SIZE || !ALLOWED_TYPES.includes(file.type)) {
        continue;
      }
      
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const filePath = `${product.id}/${fileName}`;
      
      const { error: uploadError } = await adminClient.storage.from(BUCKET).upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });
      
      if (!uploadError) {
        await supabase.from("product_images").insert({
          product_id: product.id,
          url: filePath,
          sort_order: sortOrder++,
        });
      } else {
        logger.error("image_upload_failed_during_create", { error: uploadError.message, productId: product.id });
      }
    }
  }

  logger.info("product_created", { slug: parsed.data.slug });
  logAudit("create", "product", product.id, { slug: parsed.data.slug, title: parsed.data.title });
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
  logAudit("update", "product", id, { updates: Object.keys(updates) });
  revalidatePath("/admin/products");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  const adminClient = await createAdminClient();

  const { data: images } = await supabase
    .from("product_images")
    .select("url")
    .eq("product_id", id);

  for (const img of images ?? []) {
    const storagePath = extractStoragePath(img.url);
    if (storagePath) {
      await adminClient.storage.from("product-images").remove([storagePath]);
    }
  }

  await supabase.from("products").delete().eq("id", id);
  logger.info("product_deleted", { id, imagesCleaned: images?.length ?? 0 });
  logAudit("delete", "product", id, { imagesCleaned: images?.length ?? 0 });
  revalidatePath("/admin/products");
}

export async function updateOrderStatus(orderId: string, status: string, note?: string) {
  await requireAdmin();
  const supabase = await createClient();

  await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", orderId);
  await supabase.from("order_statuses").insert({ order_id: orderId, status, note: note ?? null });

  const { data: order } = await supabase
    .from("orders")
    .select("customer_id")
    .eq("id", orderId)
    .single();

  if (order?.customer_id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", order.customer_id)
      .single();

    const labelMap: Record<string, string> = {
      pending_confirmation: "قيد الانتظار",
      confirmed: "مؤكد",
      packed: "قيد التجهيز",
      shipped: "تم الشحن",
      delivered: "تم التوصيل",
      refused: "مرفوض",
      returned: "مرتجع",
      cancelled: "ملغي",
    };

    if (profile?.email) {
      orderStatusEmail(orderId, profile.email, status, labelMap[status] || status, "ar");
    }
  }

  logger.info("order_status_updated", { orderId, status });
  logAudit("update_status", "order", orderId, { status, note: note ?? null });
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

  logAudit("create", "category", undefined, { slug: parsed.data.slug, name: parsed.data.name });
  revalidatePath("/admin/categories");
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  const supabase = await createClient();
  await supabase.from("categories").delete().eq("id", id);
  logAudit("delete", "category", id);
  revalidatePath("/admin/categories");
}

export async function updateSetting(key: string, formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  
  const allValues = formData.getAll("value");
  let parsed: unknown;
  
  if (allValues.length > 1) {
    parsed = allValues;
  } else {
    const single = formData.get("value") as string;
    try { parsed = JSON.parse(single); } catch { parsed = single; }
  }

  const { error } = await supabase
    .from("store_settings")
    .upsert({ key, value: parsed as Record<string, unknown>, updated_at: new Date().toISOString() }, { onConflict: "key" });

  if (error) throw new Error(error.message);
  logger.info("setting_updated", { key, value: parsed });
  logAudit("update", "setting", key, { value: parsed });
  
  const { clearSettingsCache } = await import("@/lib/settings");
  clearSettingsCache();
  
  revalidatePath("/admin/settings");
}
