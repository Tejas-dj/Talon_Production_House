"use client";

import { useState, useSyncExternalStore } from "react";
import { useTheme } from "@/components/shell/ThemeProvider";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const [isClapping, setIsClapping] = useState(false);

  function toggle() {
    if (isClapping) return;
    setIsClapping(true);

    setTimeout(() => {
      const next = resolvedTheme === "dark" ? "light" : "dark";
      document.documentElement.classList.add("theme-veil");
      window.setTimeout(() => {
        document.documentElement.classList.remove("theme-veil");
      }, 400);
      setTheme(next);
    }, 200);

    setTimeout(() => setIsClapping(false), 500);
  }

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className={`clap-toggle${isClapping ? " is-clapping" : ""}`}
      aria-label={
        mounted
          ? `Switch to ${isDark ? "light" : "dark"} theme`
          : "Toggle color theme"
      }
    >
      <span className="clap-top" aria-hidden="true" />
      <span className="clap-body">
        <span className="clap-field">
          <span className="clap-label">Theme</span>
          <span className="clap-value">{mounted ? (isDark ? "Dark" : "Light") : ""}</span>
        </span>
      </span>
    </button>
  );
}
