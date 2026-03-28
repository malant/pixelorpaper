import type { Metadata } from "next";
import { getCatalogProducts } from "@/lib/catalog";
import { Storefront } from "@/components/storefront";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Fine Art Photography Prints",
  description:
    "Browse a curated catalog of fine art photography prints from landscapes, cityscapes, buildings, nature, and miscellaneous collections.",
  alternates: {
    canonical: "/",
  },
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const products = await getCatalogProducts();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "UNFRAMED",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteUrl}/?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Storefront products={products} initialCategory={category} />
    </>
  );
}
