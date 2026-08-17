import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { CustomCursor } from "@/components/shell/CustomCursor";
import { Footer } from "@/components/shell/Footer";
import { Header } from "@/components/shell/Header";
import { SkipLink } from "@/components/shell/SkipLink";
import { ThemeProvider } from "@/components/shell/ThemeProvider";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

/* Bible §5.1-A / §5.3: Archivo variable (wght + wdth axes), single self-hosted
   woff2 via next/font (build-time download, preload, metric-adjusted Arial
   fallback generated automatically). */
const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Talon Production House",
    template: "%s — Talon Production House",
  },
  description: "Motion production, stills, and studio rental in Bengaluru.",
  openGraph: {
    siteName: "Talon Production House",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
  },
  /* Favicon set generated from the client-supplied logo
     (scripts/generate-logo-assets.mjs) — light-source icon is the default
     (reads well on light browser chrome), dark-source variant swaps in via
     prefers-color-scheme for dark browser chrome. */
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      {
        url: "/favicon-16x16-dark.png",
        sizes: "16x16",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/favicon-32x32-dark.png",
        sizes: "32x32",
        type: "image/png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // suppressHydrationWarning: next-themes sets data-theme pre-hydration
    <html lang="en" className={archivo.variable} suppressHydrationWarning>
      <head>
        {/* Warms the connection to Cloudinary before the first image is
            requested — saves the DNS/TLS handshake (~100-300ms) off the
            very first Stills thumbnail or Lightbox open on a page load. */}
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        {process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE && (
          <>
            <link rel="preconnect" href={`https://${process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE}.b-cdn.net`} />
            <link rel="dns-prefetch" href={`https://${process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE}.b-cdn.net`} />
          </>
        )}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme")||"system";var r=t==="system"?window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light":t;document.documentElement.setAttribute("data-theme",r)}catch(e){}})()`,
          }}
        />
      </head>
      {/* overflow-x-clip lives on this inner wrapper, not on <html>/<body>
          directly — iOS Safari has a long-standing bug where any non-visible
          overflow on the html or body element breaks position:fixed
          descendants (they stop tracking the viewport and get laid out like
          position:absolute instead), which is exactly what was hiding the
          fixed-bottom mobile WhatsApp CTA on Studio. Clipping here still
          stops an off-canvas element from creating horizontal scroll,
          without ever touching html/body's own overflow. */}
      <body suppressHydrationWarning>
        <div className="flex min-h-svh flex-col overflow-x-clip">
          <ThemeProvider>
            <CustomCursor />
            <SkipLink />
            <Header />
            <main id="main" tabIndex={-1} className="flex-1 focus:outline-none -mt-(--header-height) pt-(--header-height)">
              {children}
            </main>
            <Footer />
          </ThemeProvider>
        </div>
        <Analytics />
      </body>
    </html>
  );
}
