import type { Metadata } from "next";
import { Syne, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ImageSecurityWrapper } from "@/components/image-security-wrapper";
import { CartProvider } from "@/context/cart-context";
import { GoogleAnalytics } from "@/components/analytics";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { WebVitalsReporter } from "@/components/web-vitals";

const heading = Syne({
  subsets: ["latin"],
  variable: "--font-heading",
  preload: false,
  display: "swap",
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
    default: "Pixel or Paper | Fine Art Photography Prints",
    template: "%s | Pixel or Paper",
  },
  description:
    "Shop curated fine art photography prints by Malcolm Rose across landscapes, cityscapes, buildings, nature, and more.",
  keywords: [
    "fine art prints",
    "photography prints",
    "wall art",
    "landscape photography",
    "cityscape photography",
    "nature prints",
    "Pixel or Paper",
    "Malcolm Rose",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Pixel or Paper | Fine Art Photography Prints",
    description:
      "Discover curated fine art photography prints by Malcolm Rose and collect timeless imagery for your space.",
    url: "/",
    siteName: "Pixel or Paper",
    images: [
      {
        url: "/images/pixelorpaperLogo.png",
        alt: "Pixel or Paper logo",
      },
    ],
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixel or Paper | Fine Art Photography Prints",
    description:
      "Shop curated fine art photography prints by Malcolm Rose across landscapes, cityscapes, buildings, and nature.",
    images: ["/images/pixelorpaperLogo.png"],
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
  const gaId = process.env.NEXT_PUBLIC_GA_ID || "";
  const imageBaseUrl =
    process.env.NEXT_PUBLIC_IMAGE_BASE_URL ||
    "https://pub-b000034b4d0a4300a99ec3ffdae75820.r2.dev";

  return (
    <html lang="en">
      <head>
        {/* Preconnect to image CDN for faster loading */}
        <link rel="preconnect" href={imageBaseUrl} crossOrigin="anonymous" />
        <link rel="dns-prefetch" href={imageBaseUrl} />
      </head>
      <body className={`${heading.variable} ${body.variable}`}>
        <CartProvider>
          <ImageSecurityWrapper>{children}</ImageSecurityWrapper>
          <CookieConsentBanner />
          <GoogleAnalytics gaId={gaId} />
          <WebVitalsReporter />
        </CartProvider>
      </body>
    </html>
  );
}
