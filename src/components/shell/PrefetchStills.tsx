"use client";

import { useEffect } from "react";

type Props = { urls: string[] };

export function PrefetchStills({ urls }: Props) {
  useEffect(() => {
    if (urls.length === 0) return;

    const inject = () => {
      for (const href of urls) {
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.as = "image";
        link.href = href;
        document.head.appendChild(link);
      }
    };

    if ("requestIdleCallback" in window) {
      const id = requestIdleCallback(inject, { timeout: 8000 });
      return () => cancelIdleCallback(id);
    }
    const timer = setTimeout(inject, 3000);
    return () => clearTimeout(timer);
  }, [urls]);

  return null;
}
