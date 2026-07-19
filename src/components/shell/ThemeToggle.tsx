"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/* Theme switcher: keyboard operable, designed focus ring via the global
   :focus-visible rule, typographic label (no icon glyphs — guardrails).
   The theme name only renders after mount because the server cannot know
   the visitor's stored/system preference. */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  function toggle() {
    const next = resolvedTheme === "dark" ? "light" : "dark";
    // P3 Veil: crossfade colors sitewide for one beat, then release.
    // The prefers-reduced-motion block zeroes this to an instant cut.
    document.documentElement.classList.add("theme-veil");
    window.setTimeout(() => {
      document.documentElement.classList.remove("theme-veil");
    }, 400);
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="btn type-meta px-4 py-2"
      aria-label={
        mounted
          ? `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`
          : "Toggle color theme"
      }
    >
      Theme{mounted ? `: ${resolvedTheme}` : ""}
    </button>
  );
}
