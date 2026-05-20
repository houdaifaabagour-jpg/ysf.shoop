"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { ProductImageManager } from "./product-image-manager";

interface ImageManagerButtonProps {
  productId: string;
  productTitle: string;
}

export function ImageManagerButton({ productId, productTitle }: ImageManagerButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-gold/30 hover:text-gold transition-colors"
      >
        <ImageIcon className="h-3.5 w-3.5" />
        Images
      </button>
      {open && <ProductImageManager productId={productId} productTitle={productTitle} onClose={() => setOpen(false)} />}
    </>
  );
}
