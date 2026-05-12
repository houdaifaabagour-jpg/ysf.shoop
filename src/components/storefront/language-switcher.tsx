"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Globe, ChevronDown } from "lucide-react";

const locales = [
  { code: "en", label: "EN", name: "English" },
  { code: "ar", label: "عربي", name: "العربية" },
  { code: "fr", label: "FR", name: "Français" },
  { code: "es", label: "ES", name: "Español" },
];

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function switchLocale(code: string) {
    const segments = pathname.split("/");
    segments[1] = code;
    router.push(segments.join("/"));
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 hover:text-primary-light transition-colors"
        aria-label="Switch language"
      >
        <Globe className="h-4 w-4" />
        <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-40 rounded-lg border border-border bg-card shadow-lg z-50">
            <nav className="p-2">
              {locales.map((l) => (
                <button
                  key={l.code}
                  onClick={() => switchLocale(l.code)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors ${
                    l.code === locale ? "font-semibold text-primary" : ""
                  }`}
                >
                  <span>{l.label}</span>
                  <span className="text-xs text-muted-foreground">{l.name}</span>
                </button>
              ))}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
