import type { Metadata } from "next";
import { getCatalogProducts } from "@/lib/catalog";
import { Storefront } from "@/components/storefront";

// Note: R2 catalog loading is optional; will use fallback if unavailable
export const runtime = "edge";
export const dynamic = "force-dynamic";

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
  const websiteJsonLd = {
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

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "UNFRAMED",
    url: siteUrl,
    logo: `${siteUrl}/images/unframed-logo-editorial.svg`,
    description:
      "Fine art photography prints and curated imagery for collectors.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      url: siteUrl,
    },
  };

  const jsonLdScripts = [websiteJsonLd, organizationJsonLd];

  return (
    <>
      {jsonLdScripts.map((schema, idx) => (
        <script
          key={idx}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <Storefront products={products} initialCategory={category} />
    </>
  );
}
