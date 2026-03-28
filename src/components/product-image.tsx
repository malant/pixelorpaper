"use client";

import { useState } from "react";
import Image from "next/image";
import { resolveProductImage } from "@/lib/images";

interface ProductImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
  onLoad?: () => void;
}

export function ProductImage({
  src,
  alt,
  priority = false,
  className = "",
  onLoad,
}: ProductImageProps) {
  const resolvedSrc = resolveProductImage(src);
  const isSvg = resolvedSrc.endsWith(".svg");
  const isLocal = resolvedSrc.startsWith("/");
  const [imageError, setImageError] = useState(false);

  // For SVG files or local fallbacks, use a regular img tag with absolute positioning
  if (isSvg || isLocal) {
    return (
      <img
        src={resolvedSrc}
        alt={alt}
        className={`absolute inset-0 pointer-events-none select-none object-cover w-full h-full ${className}`}
        onLoad={onLoad}
        onError={() => {
          console.error(`Failed to load image: ${resolvedSrc}`);
          setImageError(true);
        }}
      />
    );
  }

  // For remote R2 images, use Next.js Image component
  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      fill
      priority={priority}
      className={`pointer-events-none select-none object-cover ${className}`}
      onLoad={onLoad}
      onError={() => {
        console.error(`Failed to load image: ${resolvedSrc}`);
        setImageError(true);
      }}
    />
  );
}
