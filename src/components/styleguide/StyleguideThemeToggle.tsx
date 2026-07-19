"use client";

import { useSyncExternalStore } from "react";

/* Interim toggle for the Step 3 gate: flips [data-theme] directly and mirrors
   the attribute as its state source. Replaced by the next-themes-backed shell
   ThemeToggle in Step 4. */

function subscribe(callback: () => void) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

function getSnapshot(): "light" | "dark" {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export function StyleguideThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, () => "light");

  function toggle() {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="btn type-meta px-4 py-2"
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
    >
      Theme: {theme}
    </button>
  );
}
