"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { X, Upload, Link, GripVertical, Trash2, Loader2, ImagePlus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  uploadProductImage,
  addImageByUrl,
  deleteProductImage,
  updateImageAlt,
  reorderImages,
} from "@/features/admin/product-image-actions";
import { getStorageUrl } from "@/lib/storage/client";

interface ImageItem {
  id: string;
  url: string;
  alt: string | null;
  sort_order: number;
}

interface ProductImageManagerProps {
  productId: string;
  productTitle: string;
  onClose: () => void;
}

export function ProductImageManager({ productId, productTitle, onClose }: ProductImageManagerProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);

  const supabase = createClient();

  const loadImages = useCallback(async () => {
    const { data } = await supabase
      .from("product_images")
      .select("id, url, alt, sort_order")
      .eq("product_id", productId)
      .order("sort_order", { ascending: true });
    if (data) setImages(data);
    setLoading(false);
  }, [supabase, productId]);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      setLoading(true);
      const { data } = await supabase
        .from("product_images")
        .select("id, url, alt, sort_order")
        .eq("product_id", productId)
        .order("sort_order", { ascending: true });
      if (!cancelled && data) setImages(data);
      if (!cancelled) setLoading(false);
    }
    init();
    return () => { cancelled = true; };
  }, [supabase, productId]);

  const displayUrl = (img: ImageItem) => getStorageUrl(img.url) || "";

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) { setError(`${file.name}: exceeds 5MB limit`); continue; }
      const fd = new FormData();
      fd.append("file", file);
      const result = await uploadProductImage(productId, fd);
      if (result.error) { setError(result.error); break; }
    }
    await loadImages();
    setUploading(false);
  };

  const handleUrlAdd = async () => {
    if (!urlInput.startsWith("https")) { setError("URL must start with https://"); return; }
    setUploading(true);
    setError(null);
    const fd = new FormData();
    fd.append("url", urlInput);
    const result = await addImageByUrl(productId, fd);
    if (result.error) { setError(result.error); }
    else { setUrlInput(""); await loadImages(); }
    setUploading(false);
  };

  const handleDelete = async (imageId: string) => {
    setError(null);
    const result = await deleteProductImage(imageId);
    if (result.error) { setError(result.error); return; }
    setImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleAltChange = async (imageId: string, alt: string) => {
    const fd = new FormData();
    fd.append("alt", alt);
    await updateImageAlt(imageId, fd);
  };

  const handleDragStart = (index: number) => { setDragIndex(index); };
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const reordered = [...images];
    const [item] = reordered.splice(dragIndex, 1);
    reordered.splice(index, 0, item);
    setImages(reordered);
    setDragIndex(index);
  };
  const handleDragEnd = async () => {
    setDragIndex(null);
    const items = images.map((img, i) => ({ id: img.id, sort_order: i }));
    await reorderImages(items);
  };

  const handleDropOnZone = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOverZone = (e: React.DragEvent) => { e.preventDefault(); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold text-primary">Manage Images: {productTitle}</h2>
          <button onClick={onClose} className="rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 py-4">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">{error}</div>
          )}

          <div className="mb-4 flex gap-1 rounded-xl bg-muted/50 p-1">
            <button
              onClick={() => setTab("upload")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                tab === "upload" ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Upload className="h-4 w-4" /> Upload
            </button>
            <button
              onClick={() => setTab("url")}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                tab === "url" ? "bg-white text-primary shadow-sm" : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Link className="h-4 w-4" /> URL
            </button>
          </div>

          {tab === "upload" ? (
            <div
              ref={dropRef}
              onDrop={handleDropOnZone}
              onDragOver={handleDragOverZone}
              className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/20 px-6 py-10 transition-colors hover:border-gold/50 hover:bg-gold/5"
              onClick={() => fileInputRef.current?.click()}
            >
              <ImagePlus className="mb-3 h-10 w-10 text-muted-foreground" />
              <p className="text-sm font-medium text-primary">Drop images here or click to browse</p>
              <p className="mt-1 text-xs text-muted-foreground">JPEG, PNG, WebP, AVIF — max 5MB each</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
              />
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 rounded-lg border border-border px-4 py-2.5 text-sm focus:border-gold focus:outline-none"
                onKeyDown={(e) => e.key === "Enter" && handleUrlAdd()}
              />
              <button
                onClick={handleUrlAdd}
                disabled={uploading || !urlInput}
                className="rounded-lg bg-gold px-4 py-2.5 text-sm font-medium text-white hover:bg-gold/90 transition-colors disabled:opacity-50"
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
              </button>
            </div>
          )}
        </div>

        <div className="border-t border-border px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : images.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No images yet. Upload or add a URL above.</p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {images.map((img, index) => (
                <div
                  key={img.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`group relative overflow-hidden rounded-xl border bg-white transition-all ${
                    dragIndex === index ? "border-gold shadow-lg opacity-50 scale-105" : "border-border hover:border-gold/30"
                  }`}
                >
                  <div className="relative aspect-square bg-muted">
                    <img
                      src={displayUrl(img)}
                      alt={img.alt || ""}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute left-1 top-1 cursor-grab rounded-lg bg-white/80 p-1 text-muted-foreground opacity-0 shadow-sm transition-opacity group-hover:opacity-100 active:cursor-grabbing">
                      <GripVertical className="h-4 w-4" />
                    </div>
                    <button
                      onClick={() => handleDelete(img.id)}
                      className="absolute right-1 top-1 rounded-lg bg-white/80 p-1.5 text-red-600 opacity-0 shadow-sm transition-opacity hover:bg-red-600 hover:text-white group-hover:opacity-100"
                      title="Delete image"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <input
                    defaultValue={img.alt || ""}
                    placeholder="Alt text"
                    onBlur={(e) => handleAltChange(img.id, e.target.value)}
                    className="w-full border-t border-border px-2.5 py-1.5 text-xs text-muted-foreground placeholder:text-muted-foreground/50 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-border px-6 py-4">
          <button onClick={onClose} className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary-light transition-colors">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
