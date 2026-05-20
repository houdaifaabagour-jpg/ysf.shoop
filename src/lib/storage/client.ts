const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const BUCKET = "product-images";

export function getStorageUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${path}`;
}

export function getPublicUrl(path: string): string {
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${path}`;
}

export function extractStoragePath(url: string): string | null {
  if (!url.startsWith(supabaseUrl)) return null;
  const prefix = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(prefix);
  if (idx === -1) return null;
  return url.slice(idx + prefix.length);
}

export function isStorageUrl(url: string): boolean {
  return url.startsWith(supabaseUrl) && url.includes(`/storage/v1/object/public/${BUCKET}/`);
}
