import type { Metadata } from "next";
import { getCatalogProducts } from "@/lib/catalog";
import { Storefront } from "@/components/storefront";

// Note: R2 catalog loading is optional; will use fallback if unavailable
export const runtime = "edge";
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Fine Art Photography Prints",
  description:
    "Browse a curated catalog of fine art photography prints by Malcolm Rose across landscapes, cityscapes, buildings, nature, and miscellaneous collections.",
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
    name: "Pixel or Paper",
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
    name: "Pixel or Paper",
    legalName: "Pixel or Paper by Malcolm Rose",
    url: siteUrl,
    logo: `${siteUrl}/images/pixelorpaperLogo.png`,
    description:
      "Fine art photography prints and curated imagery by a single artist, Malcolm Rose.",
    founder: {
      "@type": "Person",
      name: "Malcolm Rose",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "support@pixelorpaper.co.uk",
      url: `${siteUrl}/contact`,
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
