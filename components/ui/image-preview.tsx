"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface ImagePreviewProps {
  src: string;
  alt?: string;
  className?: string;
  children: React.ReactNode;
}

export function ImagePreview({ src, alt = "Image Preview", className, children }: ImagePreviewProps) {
  if (!src) return <>{children}</>;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className={cn("outline-none focus:ring-0", className)}>
          {children}
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-none bg-transparent shadow-none" showCloseButton={false}>
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <div className="relative aspect-auto flex items-center justify-center">
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl transition-all duration-300 animate-in zoom-in-95"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
