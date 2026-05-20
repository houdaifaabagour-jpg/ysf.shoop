"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { 
  X, Upload, Link as LinkIcon, GripVertical, Trash2, Loader2, ImagePlus, Plus, 
  Settings, Image, Sliders, ChevronLeft, Save, PlusCircle, Check
} from "lucide-react";
import { formatPrice } from "@/lib/format";
import { updateProduct, createVariant, updateVariant, deleteVariant, updateVariantStock } from "@/features/admin/actions";
import { 
  uploadProductImage, 
  addImageByUrl, 
  deleteProductImage, 
  updateImageAlt, 
  reorderImages 
} from "@/features/admin/product-image-actions";
import { getStorageUrl } from "@/lib/storage/client";
import { useToast } from "@/components/ui/toast";

export interface ProductImage {
  id: string;
  url: string;
  alt: string | null;
  sort_order: number;
}

export interface ProductVariant {
  id: string;
  sku: string;
  label: string;
  attributes: Record<string, string>;
  price_override: number | null;
  stock: number;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
  category_id: string | null;
  is_active: boolean;
  is_featured: boolean;
  tags: string[];
  images?: ProductImage[];
  variants?: ProductVariant[];
}

interface Category {
  id: string;
  name: string;
}

interface EditProductClientProps {
  product: Product;
  categories: Category[];
  currencySymbol: string;
  locale: string;
}

export function EditProductClient({ product, categories, currencySymbol, locale }: EditProductClientProps) {
  const t = useTranslations("admin");
  const tc = useTranslations("common");
  const { showToast } = useToast();

  // Safe translation helper with automatic English fallback
  const ta = (key: string, fallback: string) => {
    try {
      const val = t(key);
      return val && val !== `admin.${key}` && val !== key ? val : fallback;
    } catch {
      return fallback;
    }
  };

  const [activeTab, setActiveTab] = useState<"info" | "media" | "variants">("info");
  const [isPending, startTransition] = useTransition();

  // General Info form state
  const [title, setTitle] = useState(product.title);
  const [slug, setSlug] = useState(product.slug);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(product.tags || []);

  // Media Manager state
  const [images, setImages] = useState<ProductImage[]>(product.images || []);
  const [mediaTab, setMediaTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Variant CRUD state
  const [variants, setVariants] = useState<ProductVariant[]>(product.variants || []);
  const [newVariant, setNewVariant] = useState({ sku: "", label: "", stock: 0, priceOverride: "", color: "", size: "" });
  const [addingVariant, setAddingVariant] = useState(false);
  const [editingVariantId, setEditingVariantId] = useState<string | null>(null);
  const [editingVariantData, setEditingVariantData] = useState({ sku: "", label: "", stock: 0, priceOverride: "", color: "", size: "" });

  // Sync state with props using efficient render-time updating to avoid ESLint useEffect warning
  const [prevProduct, setPrevProduct] = useState(product);
  if (product.id !== prevProduct.id || product.images !== prevProduct.images || product.variants !== prevProduct.variants) {
    setImages(product.images || []);
    setVariants(product.variants || []);
    setPrevProduct(product);
  }

  const isSimpleProduct = variants.length === 1;
  const simpleProductVariant = isSimpleProduct ? variants[0] : null;
  const [simpleStock, setSimpleStock] = useState(simpleProductVariant?.stock ?? 0);

  // Sync simple stock if variants state changes
  const [prevVariants, setPrevVariants] = useState(variants);
  if (variants !== prevVariants) {
    if (isSimpleProduct && variants[0]) {
      setSimpleStock(variants[0].stock);
    }
    setPrevVariants(variants);
  }

  // General Info Handlers
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(autoSlug);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleUpdateProduct = async (formData: FormData) => {
    formData.set("tags", tags.join(","));
    formData.set("isActive", formData.get("isActive") === "on" ? "true" : "false");
    formData.set("isFeatured", formData.get("isFeatured") === "on" ? "true" : "false");

    startTransition(async () => {
      try {
        await updateProduct(product.id, formData);
        showToast(ta("settingsSaved", "Product saved successfully"), "success");
      } catch (err) {
        showToast(err instanceof Error ? err.message : "Failed to update product", "error");
      }
    });
  };

  // Media Manager Handlers
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setMediaError(null);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) { setMediaError(`${file.name}: exceeds 5MB limit`); continue; }
      const fd = new FormData();
      fd.append("file", file);
      const result = await uploadProductImage(product.id, fd);
      if (result.error) { setMediaError(result.error); break; }
    }
    window.location.reload();
  };

  const handleUrlAdd = async () => {
    if (!urlInput.startsWith("https")) { setMediaError("URL must start with https://"); return; }
    setUploading(true);
    setMediaError(null);
    const fd = new FormData();
    fd.append("url", urlInput);
    const result = await addImageByUrl(product.id, fd);
    if (result.error) { setMediaError(result.error); }
    else { setUrlInput(""); window.location.reload(); }
  };

  const handleImageDelete = async (imageId: string) => {
    if (!confirm(ta("deleteConfirm", "Delete this image?"))) return;
    setMediaError(null);
    const result = await deleteProductImage(imageId);
    if (result.error) { setMediaError(result.error); return; }
    setImages(prev => prev.filter(img => img.id !== imageId));
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

  // Variant CRUD Handlers
  const handleCreateVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingVariant(true);
    const fd = new FormData();
    fd.append("sku", newVariant.sku);
    fd.append("label", newVariant.label);
    fd.append("stock", String(newVariant.stock));
    fd.append("priceOverride", newVariant.priceOverride);
    if (newVariant.color) fd.append("attribute_color", newVariant.color);
    if (newVariant.size) fd.append("attribute_size", newVariant.size);

    startTransition(async () => {
      try {
        await createVariant(product.id, fd);
        setNewVariant({ sku: "", label: "", stock: 0, priceOverride: "", color: "", size: "" });
        showToast("Variant created successfully", "success");
      } catch (err) {
        showToast(err instanceof Error ? err.message : "Failed to create variant", "error");
      } finally {
        setAddingVariant(false);
      }
    });
  };

  const handleFastStockUpdate = async (variantId: string, currentStock: number, change: number) => {
    const newStock = Math.max(0, currentStock + change);
    startTransition(async () => {
      try {
        await updateVariantStock(variantId, product.id, newStock);
        setVariants(prev => prev.map(v => v.id === variantId ? { ...v, stock: newStock } : v));
        showToast("Inventory stock updated", "success");
      } catch (err) {
        showToast(err instanceof Error ? err.message : "Failed to update stock", "error");
      }
    });
  };

  const handleDeleteVariant = async (variantId: string) => {
    if (!confirm("Are you sure you want to delete this variant? This cannot be undone.")) return;
    startTransition(async () => {
      try {
        await deleteVariant(variantId, product.id);
        setVariants(prev => prev.filter(v => v.id !== variantId));
        showToast("Variant deleted successfully", "success");
      } catch (err) {
        showToast(err instanceof Error ? err.message : "Failed to delete variant", "error");
      }
    });
  };

  const startEditVariant = (v: ProductVariant) => {
    setEditingVariantId(v.id);
    setEditingVariantData({
      sku: v.sku,
      label: v.label,
      stock: v.stock,
      priceOverride: v.price_override ? String(v.price_override) : "",
      color: v.attributes?.color || "",
      size: v.attributes?.size || "",
    });
  };

  const handleUpdateVariant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVariantId) return;
    const fd = new FormData();
    fd.append("sku", editingVariantData.sku);
    fd.append("label", editingVariantData.label);
    fd.append("stock", String(editingVariantData.stock));
    fd.append("priceOverride", editingVariantData.priceOverride);
    if (editingVariantData.color) fd.append("attribute_color", editingVariantData.color);
    if (editingVariantData.size) fd.append("attribute_size", editingVariantData.size);

    startTransition(async () => {
      try {
        await updateVariant(editingVariantId, product.id, fd);
        setEditingVariantId(null);
        showToast("Variant updated successfully", "success");
      } catch (err) {
        showToast(err instanceof Error ? err.message : "Failed to update variant", "error");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Back button and title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <Link href="/admin/products" className="rounded-full border border-neutral-border p-2 bg-white text-neutral-text-muted hover:text-primary transition-colors shrink-0">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-3xl font-bold tracking-tight text-primary truncate">{product.title}</h1>
            <p className="text-sm text-neutral-text-muted mt-1">
              {ta("editProductSub", "Configure general fields, upload media, and manage precise color/size inventory.")}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-neutral-border bg-white rounded-t-2xl px-6 pt-2 gap-4">
        {[
          { id: "info", label: ta("generalInfo", "General Info"), icon: Settings },
          { id: "media", label: ta("productImages", "Media Manager"), icon: Image },
          { id: "variants", label: ta("productStock", "Variants & Stock"), icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "info" | "media" | "variants")}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                active 
                  ? "border-accent text-accent" 
                  : "border-transparent text-neutral-text-muted hover:text-primary"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="rounded-b-2xl border-x border-b border-neutral-border bg-white p-6 shadow-sm min-h-96">
        
        {/* PANEL 1: GENERAL INFO */}
        {activeTab === "info" && (
          <form action={handleUpdateProduct} className="space-y-6 max-w-4xl">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="col-span-full">
                <label className="block text-xs font-bold text-neutral-text-muted mb-1.5">{ta("productTitle", "Product Title")} *</label>
                <input 
                  name="title" 
                  value={title} 
                  onChange={e => handleTitleChange(e.target.value)}
                  required 
                  className="w-full rounded-lg border border-neutral-border-light px-4 py-2.5 text-sm focus:border-accent focus:outline-none" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-text-muted mb-1.5">{ta("productSlug", "Slug (Auto-generated)")} *</label>
                <input 
                  name="slug" 
                  value={slug} 
                  onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "-"))}
                  required 
                  className="w-full rounded-lg border border-neutral-border-light px-4 py-2.5 text-sm bg-neutral-warm/20 text-neutral-text-muted focus:border-accent focus:outline-none" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-text-muted mb-1.5">{ta("productCategory", "Category")}</label>
                <select 
                  name="categoryId" 
                  defaultValue={product.category_id ?? ""} 
                  className="w-full rounded-lg border border-neutral-border-light px-3 py-2.5 text-sm bg-white focus:border-accent focus:outline-none"
                >
                  <option value="">{ta("selectCategory", "Select Category")}</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-text-muted mb-1.5">{ta("productPrice", "Price")} ({currencySymbol}) *</label>
                <input 
                  name="price" 
                  type="number" 
                  step="0.01" 
                  defaultValue={product.price} 
                  required 
                  className="w-full rounded-lg border border-neutral-border-light px-4 py-2.5 text-sm focus:border-accent focus:outline-none" 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-text-muted mb-1.5">{ta("compareAtPrice", "Compare At Price")} ({currencySymbol})</label>
                <input 
                  name="compareAtPrice" 
                  type="number" 
                  step="0.01" 
                  defaultValue={product.compare_at_price ?? ""} 
                  className="w-full rounded-lg border border-neutral-border-light px-4 py-2.5 text-sm focus:border-accent focus:outline-none" 
                />
              </div>

              {isSimpleProduct && (
                <div>
                  <label className="block text-xs font-bold text-neutral-text-muted mb-1.5">{ta("productStock", "Stock Quantity")} *</label>
                  <input 
                    name="stock" 
                    type="number" 
                    value={simpleStock} 
                    onChange={e => setSimpleStock(parseInt(e.target.value) || 0)}
                    required 
                    className="w-full rounded-lg border border-neutral-border-light px-4 py-2.5 text-sm focus:border-accent focus:outline-none bg-neutral-warm/10 font-bold" 
                  />
                </div>
              )}

              <div className="col-span-full">
                <label className="block text-xs font-bold text-neutral-text-muted mb-1.5">{ta("productDescription", "Description")}</label>
                <textarea 
                  name="description" 
                  defaultValue={product.description ?? ""} 
                  rows={5} 
                  className="w-full rounded-lg border border-neutral-border-light px-4 py-2.5 text-sm focus:border-accent focus:outline-none" 
                />
              </div>

              <div className="col-span-full">
                <label className="block text-xs font-bold text-neutral-text-muted mb-1.5">{ta("tags", "Interactive Tags (Press Enter)")}</label>
                <div className="flex flex-wrap gap-1.5 p-2 rounded-lg border border-neutral-border-light bg-neutral-warm/10 min-h-11">
                  {tags.map((tag, index) => (
                    <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-accent/10 border border-accent/20 px-2.5 py-0.5 text-xs font-semibold text-accent">
                      {tag}
                      <button type="button" onClick={() => removeTag(index)} className="hover:text-accent-dark transition-colors cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input 
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={handleTagKeyDown}
                    placeholder={ta("addTagPlaceholder", "Add tag...")}
                    className="flex-1 bg-transparent px-1 text-sm focus:outline-none min-w-24 py-0.5" 
                  />
                </div>
              </div>

              <div className="col-span-full flex gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-primary cursor-pointer">
                  <input type="checkbox" name="isActive" defaultChecked={product.is_active} className="rounded border-neutral-border text-primary focus:ring-accent" />
                  {ta("active", "Active in catalog")}
                </label>
                <label className="flex items-center gap-2 text-sm font-semibold text-primary cursor-pointer">
                  <input type="checkbox" name="isFeatured" defaultChecked={product.is_featured} className="rounded border-neutral-border text-primary focus:ring-accent" />
                  {ta("isFeatured", "Featured on homepage")}
                </label>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-6 border-t border-neutral-border-light">
              <button 
                type="submit" 
                disabled={isPending}
                className="btn-luxury btn-luxury-primary flex items-center justify-center gap-2 cursor-pointer"
              >
                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{ta("saveProduct", "Save Changes")}</span>
              </button>
              <Link href="/admin/products" className="text-sm font-semibold text-neutral-text-muted hover:text-primary transition-colors px-4 py-2">
                {ta("cancel", "Cancel")}
              </Link>
            </div>
          </form>
        )}

        {/* PANEL 2: INLINE MEDIA MANAGER */}
        {activeTab === "media" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-border-light pb-4">
              <div>
                <h3 className="text-base font-bold text-primary">{ta("boutiqueImageManagement", "Boutique Image Management")}</h3>
                <p className="text-xs text-neutral-text-muted mt-0.5">
                  {ta("imagesSub", "Upload new files, link image URLs, sort them with Drag & Drop, and edit Alt SEO tags.")}
                </p>
              </div>
              <div className="flex gap-1 rounded-xl bg-neutral-warm p-1 self-start md:self-auto border border-neutral-border-light">
                <button
                  onClick={() => setMediaTab("upload")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    mediaTab === "upload" ? "bg-white text-primary shadow-sm" : "text-neutral-text-muted hover:text-primary"
                  }`}
                >
                  <Upload className="h-3.5 w-3.5" /> {ta("uploadFile", "Upload File")}
                </button>
                <button
                  onClick={() => setMediaTab("url")}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    mediaTab === "url" ? "bg-white text-primary shadow-sm" : "text-neutral-text-muted hover:text-primary"
                  }`}
                >
                  <LinkIcon className="h-3.5 w-3.5" /> {ta("urlLink", "URL Link")}
                </button>
              </div>
            </div>

            {mediaError && (
              <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700 border border-red-200">{mediaError}</div>
            )}

            {mediaTab === "upload" ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-border bg-neutral-warm/10 px-6 py-8 transition-colors hover:border-accent/40 hover:bg-accent/5 text-center max-w-xl"
              >
                <ImagePlus className="mb-2 h-8 w-8 text-neutral-text-muted group-hover:text-accent transition-colors" />
                <p className="text-xs font-bold text-primary">{ta("dropzoneText", "Drag images here or click to browse")}</p>
                <p className="mt-1 text-[10px] text-neutral-text-muted">{ta("dropzoneSub", "JPEG, PNG, WebP, AVIF — max 5MB each")}</p>
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
              <div className="flex gap-2 max-w-xl">
                <input
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 rounded-lg border border-neutral-border px-4 py-2 text-sm focus:border-accent focus:outline-none"
                  onKeyDown={(e) => e.key === "Enter" && handleUrlAdd()}
                />
                <button
                  onClick={handleUrlAdd}
                  disabled={uploading || !urlInput}
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white hover:bg-accent-dark transition-colors disabled:opacity-50 flex items-center justify-center min-w-16 cursor-pointer"
                >
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
                </button>
              </div>
            )}

            {/* Images Grid */}
            <div className="border-t border-neutral-border-light pt-6">
              {images.length === 0 ? (
                <div className="py-12 text-center rounded-xl border border-neutral-border bg-neutral-warm/20">
                  <Image className="w-8 h-8 mx-auto text-neutral-text-muted/40 mb-2" />
                  <p className="text-sm text-neutral-text-muted">{ta("noImages", "No images yet. Upload files or import URLs above.")}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {images.map((img, index) => (
                    <div
                      key={img.id}
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      className={`group relative overflow-hidden rounded-xl border bg-white transition-all ${
                        dragIndex === index ? "border-accent shadow-md opacity-40 scale-105" : "border-neutral-border hover:border-accent/40"
                      }`}
                    >
                      <div className="relative aspect-square bg-neutral-warm">
                        <img
                          src={getStorageUrl(img.url) || ""}
                          alt={img.alt || ""}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute left-1.5 top-1.5 cursor-grab rounded-lg bg-white/90 p-1 text-neutral-text-muted opacity-0 shadow-sm transition-opacity group-hover:opacity-100 active:cursor-grabbing">
                          <GripVertical className="h-3.5 w-3.5" />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleImageDelete(img.id)}
                          className="absolute right-1.5 top-1.5 rounded-lg bg-white/95 p-1.5 text-red-600 opacity-0 shadow-sm transition-opacity hover:bg-red-600 hover:text-white group-hover:opacity-100 cursor-pointer"
                          title="Delete image"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <input
                        defaultValue={img.alt || ""}
                        placeholder="Alt SEO Text"
                        onBlur={(e) => handleAltChange(img.id, e.target.value)}
                        className="w-full border-t border-neutral-border px-2.5 py-1.5 text-[10px] text-neutral-text-muted placeholder:text-neutral-text-muted/40 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PANEL 3: VARIANTS & INVENTORY MANAGEMENT */}
        {activeTab === "variants" && (
          <div className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Variants table */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-base font-bold text-primary">{ta("currentModelsStock", "Current Models & Stock")}</h3>
                
                <div className="overflow-hidden rounded-xl border border-neutral-border bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-neutral-warm/50 text-xs font-bold text-primary border-b border-neutral-border">
                        <tr>
                          <th className="px-4 py-3">{ta("variantLabel", "Variant Label")}</th>
                          <th className="px-4 py-3">{ta("sku", "SKU")}</th>
                          <th className="px-4 py-3 text-center">{ta("attributes", "Attributes")}</th>
                          <th className="px-4 py-3 text-center">{ta("priceOverride", "Price Override")}</th>
                          <th className="px-4 py-3 text-center">{ta("productStock", "Stock level")}</th>
                          <th className="px-4 py-3 text-right">{ta("actions", "Actions")}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-border-light">
                        {variants.map((v) => {
                          const isEditingThis = editingVariantId === v.id;
                          return (
                            <tr key={v.id} className="hover:bg-neutral-warm/25 transition-colors">
                              {isEditingThis ? (
                                <td colSpan={6} className="p-4 bg-neutral-warm/40">
                                  <form onSubmit={handleUpdateVariant} className="grid gap-3 sm:grid-cols-5 text-xs">
                                    <div className="col-span-full font-bold text-accent mb-1">Editing Mode</div>
                                    <input 
                                      value={editingVariantData.label} 
                                      onChange={e => setEditingVariantData({ ...editingVariantData, label: e.target.value })} 
                                      placeholder="Label" 
                                      required 
                                      className="rounded-lg border border-neutral-border bg-white px-2.5 py-1.5 focus:outline-none" 
                                    />
                                    <input 
                                      value={editingVariantData.sku} 
                                      onChange={e => setEditingVariantData({ ...editingVariantData, sku: e.target.value })} 
                                      placeholder="SKU" 
                                      required 
                                      className="rounded-lg border border-neutral-border bg-white px-2.5 py-1.5 focus:outline-none" 
                                    />
                                    <input 
                                      value={editingVariantData.color} 
                                      onChange={e => setEditingVariantData({ ...editingVariantData, color: e.target.value })} 
                                      placeholder="Color Attribute" 
                                      className="rounded-lg border border-neutral-border bg-white px-2.5 py-1.5 focus:outline-none" 
                                    />
                                    <input 
                                      type="number"
                                      value={editingVariantData.priceOverride} 
                                      onChange={e => setEditingVariantData({ ...editingVariantData, priceOverride: e.target.value })} 
                                      placeholder="Override Price" 
                                      className="rounded-lg border border-neutral-border bg-white px-2.5 py-1.5 focus:outline-none" 
                                    />
                                    <div className="flex items-center gap-1 justify-end">
                                      <button type="submit" className="rounded-lg bg-primary text-white p-1.5 hover:bg-primary-light cursor-pointer">
                                        <Check className="w-4 h-4" />
                                      </button>
                                      <button type="button" onClick={() => setEditingVariantId(null)} className="rounded-lg bg-neutral-muted p-1.5 text-neutral-text-muted hover:text-primary cursor-pointer">
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </form>
                                </td>
                              ) : (
                                <>
                                  <td className="px-4 py-3.5 font-bold text-primary">{v.label}</td>
                                  <td className="px-4 py-3.5 font-mono text-xs">{v.sku}</td>
                                  <td className="px-4 py-3.5 text-center">
                                    <div className="flex justify-center gap-1">
                                      {Object.entries(v.attributes || {}).map(([k, val]) => (
                                        <span key={k} className="inline-block rounded-full bg-neutral-muted px-2 py-0.5 text-[10px] font-semibold text-neutral-text-muted">
                                          {k}: {val}
                                        </span>
                                      ))}
                                      {Object.keys(v.attributes || {}).length === 0 && <span className="text-neutral-text-muted text-xs">-</span>}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3.5 text-center font-semibold text-accent">
                                    {v.price_override ? formatPrice(v.price_override, currencySymbol) : "Default Price"}
                                  </td>
                                  <td className="px-4 py-3.5 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                      <button 
                                        type="button" 
                                        onClick={() => handleFastStockUpdate(v.id, v.stock, -1)}
                                        className="w-6 h-6 rounded-full border border-neutral-border bg-white text-neutral-text-muted hover:text-primary active:bg-neutral-warm flex items-center justify-center font-bold text-xs cursor-pointer"
                                      >
                                        -
                                      </button>
                                      <span className={`w-8 font-bold text-center text-xs ${v.stock === 0 ? "text-red-600" : v.stock < 10 ? "text-amber-600" : "text-primary"}`}>
                                        {v.stock}
                                      </span>
                                      <button 
                                        type="button" 
                                        onClick={() => handleFastStockUpdate(v.id, v.stock, 1)}
                                        className="w-6 h-6 rounded-full border border-neutral-border bg-white text-neutral-text-muted hover:text-primary active:bg-neutral-warm flex items-center justify-center font-bold text-xs cursor-pointer"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3.5 text-right">
                                    <div className="flex justify-end gap-1.5">
                                      <button 
                                        onClick={() => startEditVariant(v)}
                                        className="rounded-lg p-1.5 text-neutral-text-muted hover:text-primary hover:bg-neutral-warm transition-colors cursor-pointer"
                                        title="Edit fields"
                                      >
                                        <Settings className="w-3.5 h-3.5" />
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteVariant(v.id)}
                                        className="rounded-lg p-1.5 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                                        title="Delete model"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                </>
                              )}
                            </tr>
                          );
                        })}
                        {variants.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-4 py-8 text-center text-neutral-text-muted">
                              No models exist yet. Create the first variant on the right side.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Create Variant Form */}
              <div className="space-y-4 border-l border-neutral-border-light lg:pl-6">
                <h3 className="text-base font-bold text-primary flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-accent" /> {ta("addVariant", "Create New Model")}
                </h3>
                
                <form onSubmit={handleCreateVariant} className="rounded-xl border border-neutral-border bg-neutral-warm/25 p-4 space-y-4 shadow-sm">
                  <div>
                    <label className="block text-xs font-bold text-neutral-text-muted mb-1">{ta("variantLabel", "Model Name / Label")} *</label>
                    <input 
                      value={newVariant.label} 
                      onChange={e => setNewVariant({ ...newVariant, label: e.target.value })} 
                      placeholder="e.g., Black Dial / Gold Case" 
                      required 
                      className="w-full rounded-lg border border-neutral-border bg-white px-3.5 py-2 text-xs focus:border-accent focus:outline-none" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-text-muted mb-1">{ta("variantSku", "Unique Model SKU")} *</label>
                    <input 
                      value={newVariant.sku} 
                      onChange={e => setNewVariant({ ...newVariant, sku: e.target.value })} 
                      placeholder="e.g., SUB-BLK-GLD" 
                      required 
                      className="w-full rounded-lg border border-neutral-border bg-white px-3.5 py-2 text-xs focus:border-accent focus:outline-none" 
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-text-muted mb-1">{ta("variantColor", "Color (Attr)")}</label>
                      <input 
                        value={newVariant.color} 
                        onChange={e => setNewVariant({ ...newVariant, color: e.target.value })} 
                        placeholder="e.g., Gold" 
                        className="w-full rounded-lg border border-neutral-border bg-white px-3.5 py-2 text-xs focus:border-accent focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-text-muted mb-1">{ta("variantSize", "Size (Attr)")}</label>
                      <input 
                        value={newVariant.size} 
                        onChange={e => setNewVariant({ ...newVariant, size: e.target.value })} 
                        placeholder="e.g., 40mm" 
                        className="w-full rounded-lg border border-neutral-border bg-white px-3.5 py-2 text-xs focus:border-accent focus:outline-none" 
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-neutral-text-muted mb-1">{ta("productStock", "Initial Stock")} *</label>
                      <input 
                        type="number"
                        value={newVariant.stock} 
                        onChange={e => setNewVariant({ ...newVariant, stock: parseInt(e.target.value) || 0 })} 
                        required 
                        className="w-full rounded-lg border border-neutral-border bg-white px-3.5 py-2 text-xs focus:border-accent focus:outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-text-muted mb-1">{ta("priceOverride", "Price Override")} ({currencySymbol})</label>
                      <input 
                        type="number"
                        step="0.01"
                        value={newVariant.priceOverride} 
                        onChange={e => setNewVariant({ ...newVariant, priceOverride: e.target.value })} 
                        placeholder="Optional" 
                        className="w-full rounded-lg border border-neutral-border bg-white px-3.5 py-2 text-xs focus:border-accent focus:outline-none" 
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={addingVariant}
                    className="w-full rounded-lg bg-primary hover:bg-primary-light text-white font-bold py-2.5 text-xs transition-colors shadow-sm flex items-center justify-center gap-1 cursor-pointer"
                  >
                    {addingVariant ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                    <span>{ta("addVariant", "Add Model Variant")}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
