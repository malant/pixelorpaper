# UNFRAMED - Image Sales Website

A modern UNFRAMED image sales storefront built with Next.js, TypeScript, Tailwind CSS, and Stripe Checkout.

## Features

- Curated product gallery with category filtering
- Cart state with quantity controls and local storage persistence
- Mixed basket support: printed products (Digitalab size list) and original-size downloads
- Product detail pages at `/product/[id]`
- Stripe Checkout session creation via API route
- Download links generated on successful checkout for digital purchases
- Stripe webhook route for paid print-order capture (manual fulfillment workflow)
- CSV export endpoint for paid print orders: `/api/orders/prints/csv`
- Responsive design with custom typography and warm editorial styling

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Stripe SDK

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create your local environment file:

```bash
copy .env.example .env.local
```

3. Add your Stripe secret key to `.env.local`:

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_IMAGE_BASE_URL=https://pub-b000034b4d0a4300a99ec3ffdae75820.r2.dev
R2_S3_ENDPOINT=https://d6ae1ac1deda0bb0d36408fb08a0fd19.r2.cloudflarestorage.com/base44-images
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=base44-images
R2_PUBLIC_PREVIEW_PREFIX=previews
R2_PRIVATE_ORIGINAL_PREFIX=originals
DEFAULT_PRODUCT_PRICE_CENTS=2500
DEFAULT_PRODUCT_ARTIST=UNFRAMED Archive
DEFAULT_PRINT_SIZE=24 x 16 in
NEXT_PUBLIC_DOWNLOAD_PRICE_CENTS=1200
DOWNLOAD_LINK_TTL_SECONDS=86400
STRIPE_WEBHOOK_SECRET=
DIGITALAB_ORDERING_URL=https://www.digitalab.co.uk
```

4. Run development server:

```bash
npm run dev
```

5. Open `http://localhost:3000`.

## Scripts

- `npm run dev` - start local dev server
- `npm run build` - create production build
- `npm run start` - run production server
- `npm run lint` - run ESLint

## Notes

- Product images are local SVG placeholders in `public/images`. Replace with your real artwork assets.
- Checkout requires a valid Stripe test or live key.

## Cloudflare R2 Setup

If you have a Cloudflare R2 account, you can serve product images directly from it.

1. Create an R2 bucket.
2. Upload your product images (for this starter, keep the same paths as the catalog, e.g. `images/sunset-canyon.svg`).
3. Enable public access:
   - Option A: Use the R2 public bucket URL.
   - Option B (recommended): Attach a custom domain to the bucket.
4. Set `NEXT_PUBLIC_IMAGE_BASE_URL` in `.env.local` to that public URL or custom domain.

Example:

```env
NEXT_PUBLIC_IMAGE_BASE_URL=https://pub-xxxxxxxx.r2.dev
```

or

```env
NEXT_PUBLIC_IMAGE_BASE_URL=https://img.unframed.example
```

When `NEXT_PUBLIC_IMAGE_BASE_URL` is set, the app loads product images from Cloudflare R2. If it is empty, it falls back to local images in `public/images`.

## Dynamic R2 Catalog

If `R2_S3_ENDPOINT` (or `R2_ACCOUNT_ID`), `R2_ACCESS_KEY_ID`, and `R2_SECRET_ACCESS_KEY` are set, the storefront automatically lists images from your R2 bucket using the S3 API.

- Folder names are mapped to categories: Landscapes, Cityscapes, Buildings, Nature, Misc.
- Product titles are generated from file names.
- Default price, artist, and print size come from the env values above.
- If credentials are missing or listing fails, the app falls back to the local sample products.

### Public Previews + Private Originals

To serve watermarked/preview images publicly and only deliver full-resolution files after payment:

1. Upload public preview files under `R2_PUBLIC_PREVIEW_PREFIX` (default `previews/`).
2. Upload full-resolution originals under `R2_PRIVATE_ORIGINAL_PREFIX` (default `originals/`).
3. Keep matching relative paths and filenames after the prefix.

Example key pair:

- Preview: `previews/Landscapes/alpine-dawn.jpg`
- Original: `originals/Landscapes/alpine-dawn.jpg`

Catalog pages and product pages use preview files. Paid download links and print fulfillment use the original key and are delivered via short-lived signed URLs.

## Sales Model

- Prints are offered in the following sizes and prices:
  - 10" x 8" - £14.00
  - 16" x 12" - £17.94
  - 20" x 16" - £21.42
  - 30" x 20" - £31.98
  - A6 - £12.00
  - A5 - £13.00
  - A4 - £16.08
  - A3 - £17.94
  - A2 - £24.92
  - A1 - £41.00
  - A0 - £71.00
- Downloads are delivered in the original file size from your R2 source image.
- Download links are signed and expire after `DOWNLOAD_LINK_TTL_SECONDS`.

## Stripe + Digitalab Manual Fulfillment

1. Configure Stripe Checkout in `.env.local`.
2. Configure the Stripe webhook endpoint to:
   - `/api/webhooks/stripe`
3. Set `STRIPE_WEBHOOK_SECRET` in `.env.local`.
4. Place paid print orders manually in your Digitalab account (`DIGITALAB_ORDERING_URL`).
5. Export paid print orders as CSV from:
   - `/api/orders/prints/csv`
   - Optional date window: `/api/orders/prints/csv?days=30`

When `checkout.session.completed` is received and paid:

- Print items are captured for manual processing and can be exported as CSV.
- Download items are made available as signed links on the success page.
