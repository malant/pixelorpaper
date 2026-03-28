import type { NextConfig } from "next";

const imageBaseUrl = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];

if (imageBaseUrl) {
  try {
    const url = new URL(imageBaseUrl);
    const basePath = url.pathname.replace(/\/$/, "");
    const pathname = basePath ? `${basePath}/**` : "/**";

    remotePatterns.push({
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port,
      pathname,
    });
  } catch {
    // Ignore invalid URLs so local image fallback still works.
  }
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns,
  },
};

export default nextConfig;
