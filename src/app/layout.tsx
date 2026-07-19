import type { Metadata } from "next";
import { Archivo } from "next/font/google";
import { Footer } from "@/components/shell/Footer";
import { Header } from "@/components/shell/Header";
import { SkipLink } from "@/components/shell/SkipLink";
import { ThemeProvider } from "@/components/shell/ThemeProvider";
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
  title: {
    default: "Talon Production House",
    template: "%s — Talon Production House",
  },
  description: "Video production, photography, and studio rental in Bengaluru.",
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
      </body>
    </html>
  );
}
