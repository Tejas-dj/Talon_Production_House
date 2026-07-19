"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/* next-themes injects a blocking inline script before hydration, so the
   stored (or system) theme paints on first render with no flash.
   attribute="data-theme" matches the token layer's [data-theme="dark"]. */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="data-theme" defaultTheme="system" enableSystem>
      {children}
    </NextThemesProvider>
  );
}
