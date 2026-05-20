"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { 
  Search, Filter, Plus, ChevronUp, Trash2, 
  ImagePlus, X, Loader2, Star, Eye, EyeOff, Tag, Layers
} from "lucide-react";
import { formatPrice } from "@/lib/format";
import { createProduct, deleteProduct, toggleProductActive, toggleProductFeatured } from "@/features/admin/actions";
import { ImageManagerButton } from "@/components/admin/image-manager-button";
import { getStorageUrl } from "@/lib/storage/client";
import { useToast } from "@/components/ui/toast";

interface ProductImage {
  url: string;
  alt: string | null;
  sort_order: number;
}

interface Product {
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
  created_at: string;
  category?: { name: string } | null;
  images?: ProductImage[];
  variants?: { stock: number }[];
}

interface Category {
  id: string;
  name: string;
}

interface ProductsClientProps {
  initialProducts: Product[];
  categories: Category[];
  currencySymbol: string;
  locale: string;
}

export function ProductsClient({ initialProducts, categories, currencySymbol, locale }: ProductsClientProps) {
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

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Search & Filters state
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStockStatus, setSelectedStockStatus] = useState("all"); // all, out, low, instock
  const [selectedActiveStatus, setSelectedActiveStatus] = useState("all"); // all, active, inactive

  // Form states
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync products state with initialProducts on prop change
  const [prevInitialProducts, setPrevInitialProducts] = useState(initialProducts);
  if (initialProducts !== prevInitialProducts) {
    setProducts(initialProducts);
    setPrevInitialProducts(initialProducts);
  }

  // Handle Title input -> Auto Slug
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove non-word characters
      .replace(/[\s_]+/g, "-") // Replace spaces with -
      .replace(/^-+|-+$/g, ""); // Trim dashes
    setSlug(autoSlug);
  };

  // Handle Tags Input
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

  // Handle Image Previews (Deferred Upload)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileList = Array.from(files);
    setSelectedFiles(prev => [...prev, ...fileList]);

    const newUrls = fileList.map(file => URL.createObjectURL(file));
    setPreviewUrls(prev => [...prev, ...newUrls]);
  };

  const removePreviewImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setPreviewUrls(previewUrls.filter((_, i) => i !== index));
  };

  // Submit Action wrapper for Create Product
  const handleCreateProduct = async (formData: FormData) => {
    formData.set("tags", tags.join(","));
    formData.set("isActive", formData.get("isActive") === "on" ? "true" : "false");
    formData.set("isFeatured", formData.get("isFeatured") === "on" ? "true" : "false");

    formData.delete("images");
    selectedFiles.forEach(file => {
      formData.append("images", file);
    });

    startTransition(async () => {
      try {
        await createProduct(formData);
        setTitle("");
        setSlug("");
        setTags([]);
        setSelectedFiles([]);
        setPreviewUrls([]);
        setIsFormOpen(false);
        showToast(locale === "ar" ? "تم إنشاء المنتج بنجاح!" : "Product created successfully!", "success");
      } catch (err) {
        showToast(err instanceof Error ? err.message : "Failed to create product", "error");
      }
    });
  };

  // Fast active state toggles
  const handleToggleActive = async (productId: string, currentStatus: boolean) => {
    startTransition(async () => {
      try {
        await toggleProductActive(productId, !currentStatus);
        setProducts(prev => 
          prev.map(p => p.id === productId ? { ...p, is_active: !currentStatus } : p)
        );
        showToast(locale === "ar" ? "تم تحديث حالة تفعيل المنتج!" : "Product active state updated!", "success");
      } catch (err) {
        showToast(err instanceof Error ? err.message : "Failed to update product state", "error");
      }
    });
  };

  const handleToggleFeatured = async (productId: string, currentStatus: boolean) => {
    startTransition(async () => {
      try {
        await toggleProductFeatured(productId, !currentStatus);
        setProducts(prev => 
          prev.map(p => p.id === productId ? { ...p, is_featured: !currentStatus } : p)
        );
        showToast(locale === "ar" ? "تم تحديث حالة المنتج المميز!" : "Product featured state updated!", "success");
      } catch (err) {
        showToast(err instanceof Error ? err.message : "Failed to update featured state", "error");
      }
    });
  };

  // Delete product handling
  const handleDeleteProduct = async (productId: string) => {
    const confirmMsg = ta("confirmDelete", "Are you sure you want to permanently delete this product and all associated images?");
    if (!confirm(confirmMsg)) return;
    startTransition(async () => {
      try {
        await deleteProduct(productId);
        setProducts(prev => prev.filter(p => p.id !== productId));
        showToast(locale === "ar" ? "تم حذف المنتج بنجاح!" : "Product deleted successfully!", "success");
      } catch (err) {
        showToast(err instanceof Error ? err.message : "Failed to delete product", "error");
      }
    });
  };

  // Calculate product stock status
  const getProductStockStatus = (p: Product) => {
    const totalStock = p.variants?.reduce((sum, v) => sum + v.stock, 0) ?? 0;
    if (p.variants && p.variants.length > 0) {
      if (totalStock === 0) return { label: ta("outOfStock", "Out of Stock"), color: "bg-red-50 text-red-700 border-red-200", value: "out" };
      if (totalStock < 10) return { label: `${ta("lowStock", "Low Stock")} (${totalStock})`, color: "bg-amber-50 text-amber-700 border-amber-200", value: "low" };
      return { label: `${ta("inStock", "In Stock")} (${totalStock})`, color: "bg-emerald-50 text-emerald-700 border-emerald-200", value: "instock" };
    }
    return { label: ta("noVariants", "No variants"), color: "bg-gray-50 text-gray-500 border-gray-200", value: "none" };
  };

  // Apply filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(search.toLowerCase()) || 
                          product.slug.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = selectedCategory ? product.category_id === selectedCategory : true;
    
    const stockStatus = getProductStockStatus(product).value;
    const matchesStock = selectedStockStatus === "all" ? true :
                         selectedStockStatus === "out" ? stockStatus === "out" :
                         selectedStockStatus === "low" ? stockStatus === "low" :
                         selectedStockStatus === "instock" ? stockStatus === "instock" : true;
    
    const matchesActive = selectedActiveStatus === "all" ? true :
                          selectedActiveStatus === "active" ? product.is_active :
                          selectedActiveStatus === "inactive" ? !product.is_active : true;

    return matchesSearch && matchesCategory && matchesStock && matchesActive;
  });

  const isRTL = locale === "ar";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">{ta("products", "Products")}</h1>
          <p className="text-sm text-neutral-text-muted mt-1">
            {ta("addProductSub", "Manage your luxury watch and glasses catalog, inventory, and images.")}
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="btn-luxury btn-luxury-primary self-start sm:self-auto flex items-center justify-center gap-2 cursor-pointer"
        >
          {isFormOpen ? <ChevronUp className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{isFormOpen ? ta("cancel", "Cancel") : ta("addProduct", "Add Product")}</span>
        </button>
      </div>

      {/* Add Product Form (Collapsible fold-down panel) */}
      {isFormOpen && (
        <div className="rounded-2xl border border-neutral-border bg-white shadow-lg overflow-hidden transition-all duration-300">
          <div className="bg-neutral-warm/50 px-6 py-4 border-b border-neutral-border-light flex justify-between items-center">
            <h2 className="text-base font-bold text-primary flex items-center gap-2">
              <Plus className="w-4 h-4 text-accent" /> {ta("addProduct", "Add New Boutique Product")}
            </h2>
            <button onClick={() => setIsFormOpen(false)} className="text-neutral-text-muted hover:text-primary transition-colors cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </div>

          <form action={handleCreateProduct} className="p-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Product Info Section */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-accent border-b border-neutral-border-light pb-1">
                  {ta("productDetails", "Product Details")}
                </h3>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="col-span-full">
                    <label className="block text-xs font-bold text-neutral-text-muted mb-1.5">{ta("productTitle", "Product Title")} *</label>
                    <input 
                      name="title" 
                      placeholder="e.g., Rolex Cosmograph Daytona" 
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
                      placeholder="rolex-cosmograph-daytona" 
                      value={slug}
                      onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, "-"))}
                      required 
                      className="w-full rounded-lg border border-neutral-border-light px-4 py-2.5 text-sm bg-neutral-warm/20 text-neutral-text-muted focus:border-accent focus:outline-none" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-text-muted mb-1.5">{ta("productCategory", "Category")}</label>
                    <select name="categoryId" className="w-full rounded-lg border border-neutral-border-light px-3 py-2.5 text-sm bg-white focus:border-accent focus:outline-none">
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
                      placeholder="1200" 
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
                      placeholder="1800" 
                      className="w-full rounded-lg border border-neutral-border-light px-4 py-2.5 text-sm focus:border-accent focus:outline-none" 
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-text-muted mb-1.5">{ta("productStock", "Stock Quantity")} *</label>
                    <input 
                      name="stock" 
                      type="number" 
                      defaultValue="0" 
                      required 
                      className="w-full rounded-lg border border-neutral-border-light px-4 py-2.5 text-sm focus:border-accent focus:outline-none" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-text-muted mb-1.5">{ta("productDescription", "Description")}</label>
                  <textarea 
                    name="description" 
                    placeholder="Describe the heritage, materials, and luxury aspects of this piece..." 
                    rows={4} 
                    className="w-full rounded-lg border border-neutral-border-light px-4 py-2.5 text-sm focus:border-accent focus:outline-none" 
                  />
                </div>

                <div className="flex gap-6 pt-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-primary cursor-pointer">
                    <input type="checkbox" name="isActive" defaultChecked className="rounded border-neutral-border text-primary focus:ring-accent" />
                    {ta("active", "Active in catalog")}
                  </label>
                  <label className="flex items-center gap-2 text-sm font-semibold text-primary cursor-pointer">
                    <input type="checkbox" name="isFeatured" className="rounded border-neutral-border text-primary focus:ring-accent" />
                    {ta("isFeatured", "Featured on homepage")}
                  </label>
                </div>
              </div>

              {/* Media and Sizing Section */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-accent border-b border-neutral-border-light pb-1 mb-4">
                    {ta("imagesSub", "Product Images (Deferred Upload)")}
                  </h3>
                  
                  {/* Dropzone */}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="group flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-border bg-neutral-warm/20 px-6 py-8 cursor-pointer transition-colors hover:border-accent/40 hover:bg-accent/5 text-center"
                  >
                    <ImagePlus className="mb-2 h-8 w-8 text-neutral-text-muted group-hover:text-accent transition-colors" />
                    <p className="text-xs font-bold text-primary">{ta("dropzoneText", "Drop product photos or click to browse")}</p>
                    <p className="mt-1 text-[10px] text-neutral-text-muted">{ta("dropzoneSub", "Recommended: Square 1:1 Aspect Ratio • JPEG/PNG/WebP • Max 5MB")}</p>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      name="images" 
                      multiple 
                      accept="image/jpeg,image/png,image/webp,image/avif" 
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                  </div>

                  {/* Previews Grid */}
                  {previewUrls.length > 0 && (
                    <div className="mt-4 grid grid-cols-4 gap-3">
                      {previewUrls.map((url, i) => (
                        <div key={url} className="group relative aspect-square rounded-lg overflow-hidden border border-neutral-border bg-neutral-warm">
                          <img src={url} alt="preview" className="h-full w-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => removePreviewImage(i)}
                            className="absolute top-1 right-1 rounded-full bg-white/80 p-1 text-red-600 shadow-sm opacity-100 sm:opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                            title="Remove image"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tags chip input */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-accent border-b border-neutral-border-light pb-1 mb-4">
                    {ta("metadataTags", "Metadata & Tags")}
                  </h3>
                  <div>
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
                        placeholder={tags.length === 0 ? ta("addTagPlaceholder", "Add tag...") : ""}
                        className="flex-1 bg-transparent px-1 text-sm focus:outline-none min-w-24 py-0.5" 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-neutral-border-light">
              <button 
                type="submit" 
                disabled={isPending}
                className="btn-luxury btn-luxury-primary flex items-center justify-center gap-2 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{tc("loading")}</span>
                  </>
                ) : (
                  <span>{ta("saveProduct", "Create Product")}</span>
                )}
              </button>
              <button 
                type="button" 
                onClick={() => setIsFormOpen(false)}
                className="text-sm font-semibold text-neutral-text-muted hover:text-primary transition-colors px-4 py-2 cursor-pointer"
              >
                {ta("cancel", "Cancel")}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Filters Section */}
      <div className="rounded-2xl border border-neutral-border bg-white p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-text-muted" />
            <input 
              type="text" 
              placeholder={ta("searchPlaceholder", "Search products...")} 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-full border border-neutral-border-light pl-10 pr-4 py-2 text-sm focus:border-accent focus:outline-none" 
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1 text-xs font-bold text-neutral-text-muted uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5" />
              <span>{ta("filters", "Filters:")}</span>
            </div>

            <select 
              value={selectedCategory} 
              onChange={e => setSelectedCategory(e.target.value)}
              className="rounded-full border border-neutral-border-light px-4 py-1.5 text-xs font-semibold bg-white focus:outline-none"
            >
              <option value="">{ta("filterByCategory", "All Categories")}</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            {/* Stock Filter */}
            <select 
              value={selectedStockStatus} 
              onChange={e => setSelectedStockStatus(e.target.value)}
              className="rounded-full border border-neutral-border-light px-4 py-1.5 text-xs font-semibold bg-white focus:outline-none"
            >
              <option value="all">{ta("filterByStock", "All Inventory")}</option>
              <option value="instock">{ta("inStock", "In Stock")}</option>
              <option value="low">{ta("lowStock", "Low Stock (< 10)")}</option>
              <option value="out">{ta("outOfStock", "Out of Stock")}</option>
            </select>

            {/* Active Status Filter */}
            <select 
              value={selectedActiveStatus} 
              onChange={e => setSelectedActiveStatus(e.target.value)}
              className="rounded-full border border-neutral-border-light px-4 py-1.5 text-xs font-semibold bg-white focus:outline-none"
            >
              <option value="all">{ta("filterByStatus", "All Statuses")}</option>
              <option value="active">{ta("active", "Active")}</option>
              <option value="inactive">{ta("inactive", "Inactive")}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products list */}
      <div className="space-y-3">
        {filteredProducts.map((product) => {
          const images = product.images as { url: string; alt: string | null; sort_order: number }[] | undefined;
          const sorted = images?.sort((a, b) => a.sort_order - b.sort_order) ?? [];
          const thumb = sorted[0] ? getStorageUrl(sorted[0].url) : null;
          const stock = getProductStockStatus(product);

          return (
            <div key={product.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-xl border border-neutral-border bg-white px-5 py-4 gap-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-4 min-w-0">
                {/* Product Thumbnail */}
                {thumb ? (
                  <img src={thumb} alt="" className="h-14 w-14 flex-shrink-0 rounded-lg object-cover bg-neutral-warm border border-neutral-border-light shadow-sm" />
                ) : (
                  <div className="h-14 w-14 flex-shrink-0 rounded-lg bg-neutral-warm border border-neutral-border-light flex items-center justify-center text-neutral-text-muted">
                    <Tag className="w-5 h-5 text-neutral-text-muted/45" />
                  </div>
                )}
                
                {/* Product Info */}
                <div className="min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary truncate block">{product.title}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${stock.color}`}>
                      {stock.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-neutral-text-muted font-medium">
                    <span className="text-accent font-bold">{formatPrice(product.price, currencySymbol)}</span>
                    {product.compare_at_price && (
                      <span className="line-through text-neutral-text-muted/60">{formatPrice(product.compare_at_price, currencySymbol)}</span>
                    )}
                    <span>&middot;</span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3" />
                      {product.category?.name || "No Category"}
                    </span>
                    <span>&middot;</span>
                    <span>{sorted.length} {ta("productImages", "Images")}</span>
                  </div>
                </div>
              </div>

              {/* Quick controls & actions */}
              <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-border-light shrink-0">
                {/* Inline toggles */}
                <div className="flex items-center gap-3 pr-2 border-r border-neutral-border-light">
                  {/* Active Toggle */}
                  <button 
                    onClick={() => handleToggleActive(product.id, product.is_active)}
                    title={product.is_active ? ta("inactive", "Mark Inactive") : ta("active", "Mark Active")}
                    className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                      product.is_active 
                        ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100" 
                        : "bg-neutral-muted text-neutral-text-muted border-neutral-border hover:bg-neutral-warm"
                    }`}
                  >
                    {product.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  {/* Featured Toggle */}
                  <button 
                    onClick={() => handleToggleFeatured(product.id, product.is_featured)}
                    title={product.is_featured ? "Remove from Featured" : "Mark as Featured"}
                    className={`p-1.5 rounded-full border transition-all cursor-pointer ${
                      product.is_featured 
                        ? "bg-amber-50 text-amber-500 border-amber-200 hover:bg-amber-100" 
                        : "bg-neutral-muted text-neutral-text-muted border-neutral-border hover:bg-neutral-warm"
                    }`}
                  >
                    <Star className={`w-4 h-4 ${product.is_featured ? "fill-amber-500" : ""}`} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <ImageManagerButton productId={product.id} productTitle={product.title} />
                  <Link 
                    href={`/admin/products/${product.id}`} 
                    className="rounded-full border border-neutral-border px-4 py-1.5 text-xs font-bold text-primary hover:bg-neutral-warm transition-colors"
                  >
                    {ta("edit", "Edit")}
                  </Link>
                  <button 
                    onClick={() => handleDeleteProduct(product.id)}
                    className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {filteredProducts.length === 0 && (
          <div className="rounded-xl border border-neutral-border bg-white py-12 text-center">
            <Tag className="w-10 h-10 mx-auto text-neutral-text-muted/40 mb-3" />
            <h3 className="text-base font-bold text-primary">{ta("noProductsFound", "No products found")}</h3>
            <p className="text-xs text-neutral-text-muted mt-1">{ta("noProductsFoundSub", "Try adjusting your filters or add a new luxury product.")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
