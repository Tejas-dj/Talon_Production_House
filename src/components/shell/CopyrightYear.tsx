"use client";

/* Auto-updating year: the static build bakes in the build year; this corrects
   it client-side if the site crosses a New Year between deploys. */
export function CopyrightYear() {
  return <span suppressHydrationWarning>{new Date().getFullYear()}</span>;
}
