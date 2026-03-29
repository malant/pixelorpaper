# Performance, SEO & Analytics Optimization Guide

## Overview

Your UNFRAMED storefront has been enhanced with comprehensive performance optimizations, SEO improvements, and analytics integration. This document outlines all changes and how to configure them.

---

## 1. Analytics Integration (Google Analytics 4)

### What was added:

- **GA4 Script Integration**: Automatic Google Analytics 4 tracking
- **Web Vitals Monitoring**: Core Web Vitals metrics (LCP, FCP, CLS, TTFB, INP)
- **E-commerce Events**: Product views, add-to-cart, and purchase tracking
- **Conversion Tracking**: Automatic tracking on checkout success page

### How to enable:

1. Create a Google Analytics 4 property for your website
2. Get your **Measurement ID** (format: `G-XXXXXXXXXX`)
3. Add to your `.env.local`:
   ```env
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```
4. Redeploy the application

### Files created/modified:

- `src/components/analytics.tsx` - GA4 script and event tracking functions
- `src/components/web-vitals.tsx` - Web Vitals performance monitoring
- `src/components/product-view-tracker.tsx` - Product view tracking
- `src/components/purchase-tracker.tsx` - Conversion tracking
- `src/app/layout.tsx` - GA4 initialization in root layout
- `src/components/product-purchase-panel.tsx` - Add-to-cart event tracking
- `src/components/checkout-success-content.tsx` - Purchase conversion tracking

### Tracked Events:

1. **Page Views** - Automatically tracked on every page
2. **Web Vitals** - LCP, FCP, CLS, TTFB, INP metrics
3. **Product Views** - When users view product pages
4. **Add to Cart** - When users add prints or downloads
5. **Purchases** - When checkout is successful

---

## 2. SEO Improvements

### Structured Data Enhancements:

- **Product Pages**: Added comprehensive Product schema with pricing and availability
- **Breadcrumb Navigation**: Added BreadcrumbList schema for better navigation clarity
- **Organization Schema**: New Organization schema on homepage with company info and contact points
- **WebSite Schema**: Search action schema for site search functionality

### Metadata & Resource Hints:

- **Preconnect/DNS Prefetch**: Added for R2 image CDN for faster image loading
- **Security Headers**: Implemented X-Content-Type-Options, X-Frame-Options, X-XSS-Protection
- **Robots Metadata**: Optimized Google-specific metadata (max-snippet, max-image-preview)

### Files modified:

- `src/app/page.tsx` - Homepage with Organization and WebSite schema
- `src/app/product/[id]/page.tsx` - Product and Breadcrumb schema
- `src/app/layout.tsx` - Resource hints and metadata optimization
- `src/app/robots.ts` - Already optimized
- `src/app/sitemap.ts` - Already optimized

---

## 3. Performance Optimizations

### Caching Strategy:

- **Image CDN Preconnection**: R2 bucket preconnected for faster image delivery
- **Production Logging**: Console logs removed in production build (only in development)
- **Font Optimization**: Already using `display: "swap"` and `preload: false`
- **Lazy Loading**: Images lazy-loaded except first product in gallery

### Code Quality:

- **Debug Logging**: Added conditional logging in `src/lib/catalog.ts` - only logs in development
- **Type Safety**: Improved TypeScript types across analytics components

### Optimizations implemented:

1. ✅ Removed all console.logs from production builds via `debugLog()` helper
2. ✅ Added DNS prefetch and preconnect to R2 image CDN
3. ✅ Enforced lazy loading on gallery images
4. ✅ Maintained async image decoding
5. ✅ Cache headers on API endpoints (no-store for catalog recovery)

### Files modified:

- `src/lib/catalog.ts` - Added debugLog() for development-only logging
- `src/app/layout.tsx` - Added DNS prefetch/preconnect resource hints
- `src/middleware.ts` - Removed (deprecated in Next.js 16)

---

## 4. Web Vitals & Performance Monitoring

### Tracked Metrics:

- **LCP (Largest Contentful Paint)**: How long until main content appears
- **FCP (First Contentful Paint)**: How long until any content appears
- **CLS (Cumulative Layout Shift)**: Visual stability as page loads
- **TTFB (Time to First Byte)**: Server response time
- **INP (Interaction to Next Paint)**: Responsiveness to user input

### How to view in Analytics:

1. Go to Google Analytics → Explore → Create custom reports
2. Add dimensions like `metric_name` (CLS, FCP, etc.)
3. Add metrics like `metric_value` to see average scores
4. Filter by page to track performance per route

---

## 5. E-commerce Conversion Tracking

### Purchase Tracking Setup:

1. GA4 automatically captures purchase events when checkout succeeds
2. Each purchase event includes:
   - Transaction ID (Stripe session ID)
   - List of purchased items (name, price, quantity)
   - Total transaction value
   - Currency (GBP)

### How to verify:

1. Make a test purchase
2. Go to Google Analytics → Monetization → Transactions
3. You should see your transaction within 24-48 hours

### Add-to-Cart Tracking:

- Tracked automatically when users click "Add print" or "Add download"
- View in Google Analytics → Engagement → Conversions

---

## 6. Configuration Checklist

### Required for full functionality:

- [ ] Add `NEXT_PUBLIC_GA_ID` environment variable (Google Analytics 4 Measurement ID)
- [ ] Verify R2 environment variables are set (already configured)
- [ ] Redeploy application after adding GA_ID

### Optional configurations:

- Analytics goals/conversions in Google Analytics
- Custom dashboards in GA4 for e-commerce metrics
- Conversion value adjustments if pricing changes

### Current environment variables:

```env
# Analytics (ADD THIS)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Existing (already configured)
NEXT_PUBLIC_SITE_URL=https://pixelorpaper.co.uk
NEXT_PUBLIC_IMAGE_BASE_URL=https://pub-b000034b4d0a4300a99ec3ffdae75820.r2.dev
R2_S3_ENDPOINT=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=base44-images
R2_PUBLIC_PREVIEW_PREFIX=previews
R2_PRIVATE_ORIGINAL_PREFIX=originals
```

---

## 7. Monitoring & Debugging

### Development Mode:

```bash
npm run dev
```

Console logs will show all catalog loading details and R2 operations.

### Production Mode:

```bash
npm run build
npm run start
```

Console logs are automatically suppressed, but analytics events are captured.

### Checking Analytics:

1. **Real-time events**: Google Analytics → Realtime
2. **Web Vitals**: Check `src/components/web-vitals.tsx` events
3. **E-commerce**: Monetization → Products/Transactions
4. **Audience**: See who's viewing products and making purchases

---

## 8. Performance Targets

### Recommended Core Web Vitals:

- **LCP**: < 2.5 seconds (Good)
- **FCP**: < 1.8 seconds (Good)
- **CLS**: < 0.1 (Good)
- **TTFB**: < 0.6 seconds (Good)
- **INP**: < 200ms (Good)

### Monitor your metrics:

1. Google Analytics → Reports → Web Vitals
2. Or use Google PageSpeed Insights
3. Target "Good" thresholds for all metrics

---

## 9. Next Steps

### Recommended improvements:

1. ✅ **Analytics**: Add `NEXT_PUBLIC_GA_ID` and redeploy
2. **SEO**: Monitor rankings with Google Search Console
3. **A/B Testing**: Set up GA4 experiments for checkout optimization
4. **Alerts**: Configure GA4 alerts for metrics below thresholds
5. **Reports**: Create custom reports for business stakeholders

### Optional enhancements:

- Add heatmap tracking with Hotjar
- Add conversion funnels in GA4
- Implement custom event goals
- Set up audience segments (returning visitors, purchasers)

---

## 10. Technical Details

### New Dependencies:

- `web-vitals@^4.2.3` - Web performance metrics library

### Modified Files:

- `package.json` - Added web-vitals dependency
- `src/app/layout.tsx` - GA4 initialization, resource hints
- `src/app/page.tsx` - Organization and WebSite schema
- `src/app/product/[id]/page.tsx` - Product and Breadcrumb schema
- `src/components/product-purchase-panel.tsx` - Add-to-cart tracking
- `src/components/checkout-success-content.tsx` - Purchase tracking
- `src/lib/catalog.ts` - Debug logging

### New Files:

- `src/components/analytics.tsx` - GA4 integration
- `src/components/web-vitals.tsx` - Web Vitals monitoring
- `src/components/product-view-tracker.tsx` - Product view tracking
- `src/components/purchase-tracker.tsx` - conversion tracking

---

## Troubleshooting

### GA4 not showing data:

1. Verify `NEXT_PUBLIC_GA_ID` is correct
2. Check Google Analytics dashboard for property setup
3. Wait 24-48 hours for initial data processing
4. Use Real-Time reports to verify events are firing

### Web Vitals not appearing:

1. Check browser console for errors
2. Ensure web-vitals package is installed (`npm list web-vitals`)
3. Rebuild and redeploy the application

### Structured data validation:

1. Use Google Structured Data Testing Tool
2. Test URLs like: https://pixelorpaper.co.uk/product/[id]
3. Verify schema appears in Search Console

---

## Support & Questions

For more information:

- [Google Analytics 4 Setup](https://support.google.com/analytics/answer/10089681)
- [Web Vitals Guide](https://web.dev/vitals/)
- [Schema.org Documentation](https://schema.org/)
- [Next.js Performance](https://nextjs.org/learn/seo/performance)
