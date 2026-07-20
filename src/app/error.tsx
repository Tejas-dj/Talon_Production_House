"use client";

import Link from "next/link";
import { useEffect } from "react";
import { CONTACT_LINKS } from "@/lib/site";

const contactEmail = CONTACT_LINKS.find((c) => c.label === "Email")!.handle;

/* Route-level error boundary — the header/footer/theme system are still
   intact around this (only the page content failed to render), so it's
   styled through the normal token layer rather than global-error.tsx's
   fully static fallback. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-site flex min-h-[60vh] flex-col justify-center pt-8 pb-8">
      <p className="type-meta text-muted">Error</p>
      <h1 className="type-display mt-2">Something Broke</h1>
      <p className="type-body text-muted mt-4 max-w-[50ch]">
        This page didn&apos;t load correctly. You can try again, or reach us directly at{" "}
        <a href={`mailto:${contactEmail}`} className="underline underline-offset-2">
          {contactEmail}
        </a>
        .
      </p>
      <div className="mt-6 flex flex-wrap gap-4">
        <button type="button" onClick={() => reset()} className="btn type-meta px-4 py-2">
          Try again
        </button>
        <Link href="/" className="link-draw type-meta inline-flex items-center">
          Back to home →
        </Link>
      </div>
    </div>
  );
}
