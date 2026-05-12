"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

export function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="hidden items-center md:flex">
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className="w-48 rounded-l-md border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none lg:w-64"
      />
      <button
        type="submit"
        className="rounded-r-md border border-l-0 border-border bg-muted px-3 py-2 text-muted-foreground hover:bg-muted/80"
      >
        <Search className="h-4 w-4" />
      </button>
    </form>
  );
}

export function MobileSearchButton() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setOpen(false);
      setQuery("");
    }
  }

  if (open) {
    return (
      <form onSubmit={handleSubmit} className="flex items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="w-40 rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:border-primary focus:outline-none sm:w-64"
          autoFocus
        />
        <button
          type="button"
          onClick={() => { setOpen(false); setQuery(""); }}
          className="ml-2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </form>
    );
  }

  return (
    <button
      onClick={() => setOpen(true)}
      className="rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground md:hidden"
      aria-label="Search"
    >
      <Search className="h-5 w-5" />
    </button>
  );
}