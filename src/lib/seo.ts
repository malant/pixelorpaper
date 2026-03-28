import type { Product } from "@/types/product";

const ignoredTokens = new Set([
  "img",
  "image",
  "photo",
  "photography",
  "print",
  "prints",
  "edit",
  "final",
  "copy",
  "misc",
  "nature",
  "landscape",
  "landscapes",
  "cityscape",
  "cityscapes",
  "building",
  "buildings",
]);

function toTitleCase(value: string): string {
  return value
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function getFilenameKeywords(imagePath: string, title: string): string[] {
  const rawFileName = decodeURIComponent(imagePath.split("/").pop() ?? "");
  const noExt = rawFileName.replace(/\.[^.]+$/, "").toLowerCase();
  const titleWords = new Set(
    title
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter(Boolean),
  );

  const tokens = noExt
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .filter((token) => token.length > 2)
    .filter((token) => !/^\d+$/.test(token))
    .filter((token) => !ignoredTokens.has(token))
    .filter((token) => !titleWords.has(token));

  return Array.from(new Set(tokens))
    .slice(0, 3)
    .map((token) => toTitleCase(token));
}

export function getProductAltText(
  product: Pick<Product, "title" | "artist" | "category" | "size" | "image">,
): string {
  const fallbackKeywords = getFilenameKeywords(product.image, product.title);
  const locationHint =
    fallbackKeywords.length > 0
      ? `, featuring ${fallbackKeywords.join(", ")}`
      : "";

  return `${product.title}, ${product.category.toLowerCase()} fine art print by ${product.artist}${locationHint}, ${product.size}`;
}
