import "server-only";

import { ListObjectsV2Command, S3Client } from "@aws-sdk/client-s3";
import { fallbackProducts } from "@/data/products";
import { createR2Client, resolveR2Config } from "@/lib/r2";
import {
  productCategories,
  type Product,
  type ProductCategory,
} from "@/types/product";

const imageExtensions = new Set([
  "jpg",
  "jpeg",
  "png",
  "webp",
  "avif",
  "gif",
  "tif",
  "tiff",
]);

const customerPriceIncreaseCents = 420;

// Cache products for 5 minutes (300,000 ms) to avoid repeated R2 calls
const CACHE_TTL_MS = 5 * 60 * 1000;
let cachedProducts: Product[] | null = null;
let cacheExpireTime = 0;

function getCachedProducts(): Product[] | null {
  if (cachedProducts && Date.now() < cacheExpireTime) {
    return cachedProducts;
  }
  cachedProducts = null;
  return null;
}

function toTitleCase(value: string): string {
  return value
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join(" ");
}

function toSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeCategory(segment: string): ProductCategory {
  const lowered = segment.toLowerCase();

  if (lowered === "landscape" || lowered === "landscapes") {
    return "Landscapes";
  }
  if (lowered === "cityscape" || lowered === "cityscapes") {
    return "Cityscapes";
  }
  if (lowered === "building" || lowered === "buildings") {
    return "Buildings";
  }
  if (lowered === "nature") {
    return "Nature";
  }

  return "Misc";
}

function keyToImagePath(key: string): string {
  return `/${key
    .split("/")
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join("/")}`;
}

function normalizePrefix(value: string): string {
  const trimmed = value.trim().replace(/^\/+/, "").replace(/\/+$/, "");
  return trimmed ? `${trimmed}/` : "";
}

export function imagePathToKey(imagePath: string): string {
  return decodeURIComponent(imagePath.replace(/^\/+/, ""));
}

function toProductFromKey(
  key: string,
  previewPrefix: string,
  originalPrefix: string,
): Product | null {
  const relativeKey =
    previewPrefix && key.startsWith(previewPrefix)
      ? key.slice(previewPrefix.length)
      : key;
  const parts = relativeKey.split("/").filter(Boolean);
  if (parts.length < 2) {
    return null;
  }

  const fileName = parts[parts.length - 1];
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (!imageExtensions.has(extension)) {
    return null;
  }

  const baseName = fileName.replace(/\.[^.]+$/, "");
  const category = normalizeCategory(parts[0]);
  const title = toTitleCase(baseName);
  const defaultPrice = Number.parseInt(
    process.env.DEFAULT_PRODUCT_PRICE_CENTS ?? "2500",
    10,
  );
  const customerPrice = Number.isFinite(defaultPrice)
    ? defaultPrice + customerPriceIncreaseCents
    : 2500 + customerPriceIncreaseCents;
  const derivedId = toSlug(key);
  const downloadKey =
    previewPrefix && originalPrefix && key.startsWith(previewPrefix)
      ? `${originalPrefix}${key.slice(previewPrefix.length)}`
      : key;

  return {
    id: derivedId || `${toSlug(category)}-${toSlug(baseName)}`,
    title,
    artist: process.env.DEFAULT_PRODUCT_ARTIST ?? "UNFRAMED Archive",
    description: `Fine art print from the ${category} collection.`,
    category,
    priceCents: customerPrice,
    image: keyToImagePath(key),
    downloadKey,
    size: process.env.DEFAULT_PRINT_SIZE ?? "24 x 16 in",
  };
}

async function listAllKeys(
  client: S3Client,
  bucket: string,
): Promise<string[]> {
  const keys: string[] = [];
  let continuationToken: string | undefined;

  do {
    const response = await client.send(
      new ListObjectsV2Command({
        Bucket: bucket,
        ContinuationToken: continuationToken,
        MaxKeys: 1000,
      }),
    );

    for (const item of response.Contents ?? []) {
      if (item.Key) {
        keys.push(item.Key);
      }
    }

    continuationToken = response.IsTruncated
      ? response.NextContinuationToken
      : undefined;
  } while (continuationToken);

  return keys;
}

export async function getCatalogProducts(): Promise<Product[]> {
  // Return cached products if available
  const cached = getCachedProducts();
  if (cached) {
    return cached;
  }

  const resolved = resolveR2Config();
  const client = createR2Client();
  const previewPrefix = normalizePrefix(
    process.env.R2_PUBLIC_PREVIEW_PREFIX ?? "",
  );
  const originalPrefix = normalizePrefix(
    process.env.R2_PRIVATE_ORIGINAL_PREFIX ?? "",
  );

  console.log(
    "[getCatalogProducts] R2 Config resolved:",
    resolved ? `✓ bucket=${resolved.bucket}` : "✗ null",
  );
  console.log("[getCatalogProducts] R2 Client created:", client ? "✓" : "✗");
  console.log(
    "[getCatalogProducts] R2 Env vars:",
    `ACCESS_KEY=${process.env.R2_ACCESS_KEY_ID ? "✓" : "✗"}, SECRET=${process.env.R2_SECRET_ACCESS_KEY ? "✓" : "✗"}, ENDPOINT=${process.env.R2_S3_ENDPOINT ? "✓" : "✗"}`,
  );

  if (!resolved || !client) {
    console.warn(
      "[getCatalogProducts] Using fallback products (R2 unavailable)",
    );
    return fallbackProducts;
  }

  try {
    // Add timeout to prevent hanging on unresponsive R2 (critical for dev/production)
    const timeoutPromise: Promise<never> = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("R2 request timeout after 3s")), 3000),
    );

    let keys: string[];
    try {
      keys = await Promise.race([
        listAllKeys(client, resolved.bucket),
        timeoutPromise,
      ]);
    } catch (timeoutOrError: unknown) {
      // R2 timing out or erroring - just use fallback
      const error = timeoutOrError as Error;
      console.warn(
        "[getCatalogProducts] R2 request failed:",
        error.message || String(error),
      );
      return fallbackProducts;
    }

    const previewKeys = previewPrefix
      ? keys.filter((key) => key.startsWith(previewPrefix))
      : keys;
    const products = previewKeys
      .map((key) => toProductFromKey(key, previewPrefix, originalPrefix))
      .filter((product): product is Product => Boolean(product))
      .sort((a, b) => {
        const categoryDiff =
          productCategories.indexOf(a.category) -
          productCategories.indexOf(b.category);
        if (categoryDiff !== 0) {
          return categoryDiff;
        }

        return a.title.localeCompare(b.title);
      });

    const seenIds = new Map<string, number>();
    const uniqueProducts = products.map((product) => {
      const current = seenIds.get(product.id) ?? 0;
      seenIds.set(product.id, current + 1);

      if (current === 0) {
        return product;
      }

      return {
        ...product,
        id: `${product.id}-${current + 1}`,
      };
    });

    const result =
      uniqueProducts.length > 0 ? uniqueProducts : fallbackProducts;

    // Cache the result with TTL
    cachedProducts = result;
    cacheExpireTime = Date.now() + CACHE_TTL_MS;

    return result;
  } catch (error) {
    console.error("Failed to load products from R2", error);
    return fallbackProducts;
  }
}
