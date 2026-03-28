export function resolveProductImage(imagePath: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL?.trim();

  if (!baseUrl) {
    return imagePath;
  }

  // Keep local placeholders local, even when a remote base URL is configured.
  if (imagePath.startsWith("/images/")) {
    return imagePath;
  }

  if (/^https?:\/\//i.test(imagePath)) {
    return imagePath;
  }

  const normalizedBase = baseUrl.replace(/\/+$/, "");
  const normalizedPath = imagePath.replace(/^\/+/, "");

  return `${normalizedBase}/${normalizedPath}`;
}
