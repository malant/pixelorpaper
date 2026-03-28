import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductPurchasePanel } from "@/components/product-purchase-panel";
import { ProductPageLayout } from "@/components/product-page-layout";
import { getCatalogProducts } from "@/lib/catalog";
import { resolveProductImage } from "@/lib/images";
import { getProductAltText } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const products = await getCatalogProducts();
  const product = products.find((item) => item.id === id);

  if (!product) {
    return {
      title: "Artwork Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const imageUrl = resolveProductImage(product.image);
  const pagePath = `/product/${product.id}`;

  return {
    title: `${product.title} Print`,
    description: `${product.title} by ${product.artist}. ${product.description}`,
    alternates: {
      canonical: pagePath,
    },
    openGraph: {
      title: `${product.title} | UNFRAMED`,
      description: `${product.description} Available as a fine art print.`,
      type: "website",
      url: pagePath,
      images: [
        {
          url: imageUrl,
          alt: getProductAltText(product),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | UNFRAMED`,
      description: `${product.description} Available as a fine art print.`,
      images: [imageUrl],
    },
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ category?: string; returnTo?: string }>;
}) {
  const { id } = await params;
  const { category, returnTo } = await searchParams;
  const products = await getCatalogProducts();
  const product = products.find((item) => item.id === id);

  if (!product) {
    notFound();
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const imageUrl = resolveProductImage(product.image);
  const absoluteImageUrl = imageUrl.startsWith("http")
    ? imageUrl
    : `${siteUrl}${imageUrl}`;
  const backHref = returnTo
    ? `/?category=${encodeURIComponent(category ?? "All")}#gallery-item-${encodeURIComponent(returnTo)}`
    : `/?category=${encodeURIComponent(category ?? "All")}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: [absoluteImageUrl],
    description: product.description,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "UNFRAMED",
    },
    category: product.category,
    offers: {
      "@type": "Offer",
      priceCurrency: "GBP",
      price: (product.priceCents / 100).toFixed(2),
      availability: "https://schema.org/InStock",
      url: `${siteUrl}/product/${product.id}`,
    },
  };

  return (
    <ProductPageLayout>
      <main className="mx-auto w-full max-w-5xl px-6 md:px-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Link
          href={backHref}
          className="mb-8 inline-block text-sm font-semibold text-zinc-700"
        >
          Back to gallery
        </Link>
        <article className="grid gap-8 rounded-3xl border border-zinc-200 bg-white/80 p-6 shadow-sm md:grid-cols-2">
          <div
            className="relative aspect-square overflow-hidden rounded-2xl bg-zinc-100"
            data-secure-image
          >
            <Image
              src={resolveProductImage(product.image)}
              alt={getProductAltText(product)}
              fill
              className="pointer-events-none select-none object-cover"
            />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-900/70">
              {product.artist}
            </p>
            <h1 className="mb-2 text-4xl font-bold text-zinc-900">
              {product.title}
            </h1>
            <p className="mb-1 text-sm text-zinc-600">
              Category: {product.category}
            </p>
            <p className="mb-6 text-sm text-zinc-600">
              Print size: {product.size}
            </p>
            <p className="mb-6 leading-relaxed text-zinc-700">
              {product.description}
            </p>
            <ProductPurchasePanel product={product} />
          </div>
        </article>
      </main>
    </ProductPageLayout>
  );
}
