import type { Metadata } from "next";
import { Syne, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ImageSecurityWrapper } from "@/components/image-security-wrapper";
import { CartProvider } from "@/context/cart-context";

const heading = Syne({
  subsets: ["latin"],
  variable: "--font-heading",
});

const body = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "UNFRAMED | Fine Art Photography Prints",
    template: "%s | UNFRAMED",
  },
  description:
    "Shop curated fine art photography prints across landscapes, cityscapes, buildings, nature, and more.",
  keywords: [
    "fine art prints",
    "photography prints",
    "wall art",
    "landscape photography",
    "cityscape photography",
    "nature prints",
    "UNFRAMED",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "UNFRAMED | Fine Art Photography Prints",
    description:
      "Discover curated fine art photography prints and collect timeless imagery for your space.",
    url: "/",
    siteName: "UNFRAMED",
    images: [
      {
        url: "/images/unframed-logo-editorial.svg",
        width: 720,
        height: 200,
        alt: "UNFRAMED editorial logo",
      },
    ],
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "UNFRAMED | Fine Art Photography Prints",
    description:
      "Shop curated fine art photography prints across landscapes, cityscapes, buildings, and nature.",
    images: ["/images/unframed-logo-editorial.svg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "art",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${heading.variable} ${body.variable}`}>
        <CartProvider>
          <ImageSecurityWrapper>{children}</ImageSecurityWrapper>
        </CartProvider>
      </body>
    </html>
  );
}
