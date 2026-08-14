"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type StudioMobileCtaProps = {
  href: string;
  children: React.ReactNode;
};

/**
 * Portaled to document.body rather than rendered in place — position:fixed
 * inside PageTransition's clip-path wrapper (template.tsx) gets trapped in
 * an isolated stacking context there, same issue SectionNavRail works
 * around for its own fixed rail: the bar's z-index only competes within
 * that wrapper, so the page Footer (a later, unwrapped sibling) paints over
 * it instead of the bar pinning above everything. Portaling escapes that
 * ancestor entirely.
 */
export function StudioMobileCta({ href, children }: StudioMobileCtaProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-cta type-meta bg-page fixed inset-x-0 bottom-0 z-30 flex items-center justify-center border-x-0 border-b-0 px-4 py-4 text-center md:hidden"
    >
      {children}
    </a>,
    document.body,
  );
}
