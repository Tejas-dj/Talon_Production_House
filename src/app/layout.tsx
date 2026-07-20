import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Archivo } from "next/font/google";
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
  description: "Video production, photography, and studio rental in Bengaluru.",
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
      <body className="flex min-h-svh flex-col">
        <ThemeProvider>
          <SkipLink />
          <Header />
          <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
