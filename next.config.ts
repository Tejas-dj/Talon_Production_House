import type { NextConfig } from "next";

/**
 * Content-Security-Policy — starts strict, loosened only where a specific
 * integration requires it (see DECISIONS.md, Phase 4 Step 3):
 * - script-src/style-src 'unsafe-inline': next-themes' blocking
 *   pre-hydration script, and next/image's inline `style` attribute on
 *   every `fill`-mode image (used throughout the media/gallery components).
 *   A nonce-based CSP would require per-request middleware, forcing dynamic
 *   rendering across a site that's otherwise fully static — out of scope
 *   for a hardening pass.
 * - script-src 'unsafe-eval' is added in development only: React/Turbopack
 *   use eval() in dev to reconstruct server error stacks in the browser.
 *   Neither React nor Next.js use eval() in production.
 * - img-src/media-src/connect-src allow the R2 CDN and Bunny's CDN
 *   (`*.b-cdn.net` covers both the pull-zone hostname used for HLS
 *   playback/thumbnails and hls.js's own segment fetches).
 * - media-src MUST include `blob:`. Every browser without native HLS
 *   (Chrome, Edge, Firefox — i.e. everything but Safari/iOS) plays through
 *   hls.js, which feeds the <video> element from a MediaSource attached via
 *   `URL.createObjectURL(...)`. Without `blob:` the element rejects that
 *   assignment with "MEDIA_ELEMENT_ERROR: Media load rejected by URL safety
 *   check" and NO video on the site ever plays — silently, since BunnyPlayer
 *   just leaves the poster up. Safari keeps working (it gets the https
 *   rendition URL directly), which is what makes this so easy to miss.
 * - worker-src allows `blob:` for the same reason: hls.js runs its
 *   transmuxer in a Worker built from a blob URL. Chrome happens to permit
 *   that under script-src's fallback, Firefox does not — there it falls back
 *   to main-thread demuxing and logs a CSP error.
 * - Vercel Analytics is served same-origin (`/_vercel/insights/*`) in
 *   production, so it needs no separate CSP domain there. In development it
 *   pulls its debug build from `va.vercel-scripts.com` instead, hence the
 *   dev-only script-src entry — without it every page load logs a CSP
 *   violation that buries the real ones.
 * - script-src/connect-src allow Google's tag loader + collect endpoint
 *   (`www.googletagmanager.com`, `*.google-analytics.com`) for GA4, and
 *   Microsoft Clarity's tag + load-balanced collect endpoints
 *   (`*.clarity.ms`, `c.bing.com` — both required per Microsoft's own CSP
 *   guidance: https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-csp).
 *   `*.clarity.ms` and `c.bing.com` are also needed in img-src: Clarity's
 *   beacon is a `c.gif` pixel (`https://c.clarity.ms/c.gif`, occasionally
 *   `https://c.bing.com/c.gif`), not just fetch/XHR — confirmed by the
 *   actual CSP violations these threw in-browser before being added here.
 *   Without these, both scripts request-block silently — no console error
 *   beyond a CSP violation, and neither dashboard ever sees data.
 * - frame-src allows Google's own map-embed domains for the Studio page's
 *   "Visit" iframe (`maps.google.com` redirects to `www.google.com/maps/…`
 *   for the actual embed, so both need to be listed).
 */
const isDev = process.env.NODE_ENV === "development";

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://*.clarity.ms https://c.bing.com${isDev ? " 'unsafe-eval' https://va.vercel-scripts.com" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' https://cdn.talonproductionhouse.com https://*.b-cdn.net https://*.clarity.ms https://c.bing.com",
  "media-src 'self' blob: https://*.b-cdn.net",
  // cdn.talonproductionhouse.com here (not just in img-src) so the
  // <link rel="preconnect"> in the root layout is allowed — preconnect/dns-prefetch
  // resource hints are governed by connect-src, not img-src.
  "connect-src 'self' https://cdn.talonproductionhouse.com https://*.b-cdn.net https://www.googletagmanager.com https://*.google-analytics.com https://*.clarity.ms https://c.bing.com",
  "font-src 'self'",
  "worker-src 'self' blob:",
  "frame-src https://www.google.com https://maps.google.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Content-Security-Policy", value: CSP },
];

const nextConfig: NextConfig = {
  // Inlines all page CSS into <style> tags instead of a render-blocking
  // <link>, eliminating the CSS request-then-render waterfall on first
  // load — worthwhile here since Tailwind's atomic output stays small.
  // Production builds only (see docs/inlineCss.md's cache trade-off note).
  experimental: {
    inlineCss: true,
  },
  images: {
    loader: "custom",
    loaderFile: "./src/lib/cloudinary-loader.ts",
    // R2 serves pre-optimized images directly — no on-the-fly transforms —
    // so Next.js/Vercel's own image optimization pipeline is unused. The
    // loaderFile above is now a pass-through and `unoptimized` skips the
    // Vercel optimizer entirely.
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "talonproductionhouse.com" }],
        destination: "https://www.talonproductionhouse.com/:path*",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
