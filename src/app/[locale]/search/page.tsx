"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<{ products: unknown[]; count: number } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    if (!initialQuery) {
      setResults(null);
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-10 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>

      {loading && <p className="text-center text-muted-foreground">Searching...</p>}

      {results && !loading && (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            {results.count > 0
              ? `${results.count} result${results.count !== 1 ? "s" : ""} for "${initialQuery}"`
              : `No results for "${initialQuery}"`}
          </p>

          {results.count > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {(results.products as { id: string; slug: string; title: string; price: number; compare_at_price?: number | null; images?: { url: string; alt?: string | null }[]; category?: { name: string } }[]).map((product) => (
                <ProductCardClient key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">No products found. Try different keywords.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <span className="text-sm text-muted-foreground">Popular:</span>
                {["watches", "glasses", "sunglasses", "analog"].map((suggestion) => (
                  <a
                    key={suggestion}
                    href={`/search?q=${suggestion}`}
                    className="rounded-full border border-border px-3 py-1 text-sm hover:bg-muted"
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
        <p className="text-center text-muted-foreground">Enter a search term to find products.</p>
      )}
    </div>
  );
}

function ProductCardClient({ product }: { product: unknown }) {
  const p = product as { id: string; slug: string; title: string; price: number; compare_at_price?: number | null; images?: { url: string; alt?: string | null }[]; category?: { name: string } };
  const image = p.images?.[0];
  const hasDiscount = p.compare_at_price && p.compare_at_price > p.price;

  return (
    <a href={`/product/${p.slug}`} className="group block">
      <div className="aspect-square overflow-hidden rounded-lg bg-muted">
        {image ? (
          <img src={image.url} alt={image.alt ?? p.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">No Image</div>
        )}
      </div>
      <div className="mt-3">
        {p.category && (
          <span className="text-xs text-muted-foreground">{p.category.name}</span>
        )}
        <h3 className="text-sm font-medium">{p.title}</h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm font-semibold">${p.price}</span>
          {hasDiscount && (
            <span className="text-sm text-muted-foreground line-through">${p.compare_at_price}</span>
          )}
        </div>
      </div>
    </a>
  );
}