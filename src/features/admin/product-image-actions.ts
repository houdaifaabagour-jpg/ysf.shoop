"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdmin } from "@/lib/auth/get-session";
import { logger } from "@/lib/logging/logger";
import { logAudit } from "@/lib/audit/helper";
import { extractStoragePath } from "@/lib/storage/client";

const BUCKET = "product-images";
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

type ActionResult = { error?: string; success?: boolean; image?: { id: string; url: string } };

export async function uploadProductImage(productId: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) return { error: "No file provided" };

  if (file.size > MAX_SIZE) return { error: "File exceeds 5MB limit" };
  if (!ALLOWED_TYPES.includes(file.type)) return { error: "Invalid file type. Allowed: JPEG, PNG, WebP, AVIF" };

  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const filePath = `${productId}/${fileName}`;

  const adminClient = await createAdminClient();
  const { error: uploadError } = await adminClient.storage.from(BUCKET).upload(filePath, file, {
    contentType: file.type,
    upsert: false,
  });

  if (uploadError) {
    logger.error("image_upload_failed", { error: uploadError.message, productId });
    return { error: "Failed to upload image" };
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("product_images")
    .select("sort_order")
    .eq("product_id", productId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const nextOrder = (existing?.sort_order ?? -1) + 1;
  const { data: image, error: dbError } = await supabase
    .from("product_images")
    .insert({
      product_id: productId,
      url: filePath,
      sort_order: nextOrder,
    })
    .select("id, url")
    .single();

  if (dbError) {
    await adminClient.storage.from(BUCKET).remove([filePath]);
    logger.error("image_db_insert_failed", { error: dbError.message });
    return { error: "Failed to save image record" };
  }

  logAudit("upload", "product_image", image.id, { productId, path: filePath });
  revalidatePath(`/admin/products`);
  revalidatePath(`/product/${productId}`);
  return {
    success: true,
    image: {
      id: image.id,
      url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${filePath}`,
    },
  };
}

export async function addImageByUrl(productId: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();

  const url = formData.get("url") as string | null;
  if (!url || !url.startsWith("https")) return { error: "Invalid URL. Must start with https://" };

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("product_images")
    .select("sort_order")
    .eq("product_id", productId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .single();

  const nextOrder = (existing?.sort_order ?? -1) + 1;
  const { data: image, error } = await supabase
    .from("product_images")
    .insert({
      product_id: productId,
      url,
      sort_order: nextOrder,
    })
    .select("id, url")
    .single();

  if (error) {
    logger.error("image_url_add_failed", { error: error.message });
    return { error: "Failed to add image" };
  }

  logAudit("add_url", "product_image", image.id, { productId, url });
  revalidatePath(`/admin/products`);
  return { success: true, image: { id: image.id, url } };
}

export async function deleteProductImage(imageId: string): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();

  const { data: image } = await supabase
    .from("product_images")
    .select("url, product_id")
    .eq("id", imageId)
    .single();

  if (!image) return { error: "Image not found" };

  const storagePath = extractStoragePath(image.url);
  if (storagePath) {
    const adminClient = await createAdminClient();
    await adminClient.storage.from(BUCKET).remove([storagePath]);
  }

  const { error } = await supabase.from("product_images").delete().eq("id", imageId);
  if (error) {
    logger.error("image_delete_failed", { error: error.message });
    return { error: "Failed to delete image" };
  }

  logAudit("delete", "product_image", imageId, { productId: image.product_id });
  revalidatePath(`/admin/products`);
  return { success: true };
}

export async function updateImageAlt(imageId: string, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();

  const alt = formData.get("alt") as string | null;
  const { error } = await supabase.from("product_images").update({ alt }).eq("id", imageId);

  if (error) {
    logger.error("image_alt_update_failed", { error: error.message });
    return { error: "Failed to update alt text" };
  }

  revalidatePath(`/admin/products`);
  return { success: true };
}

export async function reorderImages(items: { id: string; sort_order: number }[]): Promise<ActionResult> {
  await requireAdmin();
  const supabase = await createClient();

  for (const item of items) {
    const { error } = await supabase.from("product_images").update({ sort_order: item.sort_order }).eq("id", item.id);
    if (error) {
      logger.error("image_reorder_failed", { error: error.message });
      return { error: "Failed to reorder images" };
    }
  }

  revalidatePath(`/admin/products`);
  return { success: true };
}
