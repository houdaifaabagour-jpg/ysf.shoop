"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { ProductCardLuxury } from "@/components/storefront/product-card-luxury";
import { getStorageUrl } from "@/lib/storage/client";

export function SearchPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale } = useParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<{ products: unknown[]; count: number } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!initialQuery) {
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(initialQuery)}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [initialQuery]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function clearSearch() {
    setQuery("");
    router.push("/search");
  }

  return (
    <div className="min-h-screen bg-warm">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full rounded-xl border border-border-light bg-white py-3.5 pl-11 pr-11 text-sm text-primary placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
              autoFocus
            />
            {query && (
              <button type="button" onClick={clearSearch} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-4 h-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              Searching...
            </div>
          </div>
        )}

        {results && !loading && (
          <>
            <p className="mb-6 text-sm text-muted-foreground">
              {results.count > 0
                ? `${results.count} result${results.count !== 1 ? "s" : ""} for "${initialQuery}"`
                : `No results for "${initialQuery}"`}
            </p>

            {results.count > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {(results.products as { id: string; slug: string; title: string; price: number; compare_at_price?: number | null; images?: { url: string; alt?: string | null }[]; category?: { name: string } }[]).map((product) => (
                  <ProductCardLuxury
                    key={product.id}
                    slug={product.slug}
                    name={product.title}
                    price={product.price}
                    compareAtPrice={product.compare_at_price}
                    image={getStorageUrl(product.images?.[0]?.url) ?? ""}
                    categoryName={product.category?.name}
                    locale={locale as string}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 text-center">
                <p className="text-sm text-muted-foreground">No products found. Try different keywords.</p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <span className="text-xs text-muted-foreground mr-1">Popular:</span>
                  {["watches", "glasses", "sunglasses", "analog"].map((suggestion) => (
                    <a
                      key={suggestion}
                      href={`/search?q=${suggestion}`}
                      className="rounded-full border border-border-light px-4 py-1.5 text-sm text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors"
                    >
                      {suggestion}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {!results && !loading && !initialQuery && (
          <div className="text-center py-20">
            <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Enter a search term to find products.</p>
          </div>
        )}
      </div>
    </div>
  );
}

