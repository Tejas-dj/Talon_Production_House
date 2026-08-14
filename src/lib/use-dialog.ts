"use client";

import { useEffect, type RefObject } from "react";

/**
 * Escape-to-close + focus trap + body scroll lock + focus restore, generalized
 * from the pattern proven in MobileNav.tsx (which stays on its own inline
 * implementation — different container-ref shape, already verified in
 * Phase 2, not worth refactoring). Used by the project-detail stills overlay
 * and the reusable Lightbox.
 */

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

type UseDialogBehaviorOptions = {
  open: boolean;
  onClose: () => void;
  /** The dialog's root element; focus is trapped within its focusable descendants. */
  containerRef: RefObject<HTMLElement | null>;
};

export function useDialogBehavior({ open, onClose, containerRef }: UseDialogBehaviorOptions) {
  useEffect(() => {
    if (!open) return;
    const container = containerRef.current;
    if (!container) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    function focusables(): HTMLElement[] {
      return Array.from(container!.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
    }

    // Move focus into the dialog on open rather than leaving it on the
    // trigger element, which is now behind the scrim.
    focusables()[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !container!.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !container!.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    // Scroll lock. overflow:hidden on body alone doesn't stop iOS Safari's
    // touch/rubber-band scroll, and whether body or html is the actual
    // scrolling element varies by browser — pinning body at its current
    // offset via position:fixed (the standard cross-browser-safe lock) and
    // hiding overflow on both covers it, so the page behind the dialog
    // can't shift no matter how the user tries to scroll it.
    const scrollY = window.scrollY;
    const { body, documentElement: html } = document;
    const previous = {
      bodyOverflow: body.style.overflow,
      htmlOverflow: html.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
    };
    body.style.overflow = "hidden";
    html.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.overflow = previous.bodyOverflow;
      html.style.overflow = previous.htmlOverflow;
      body.style.position = previous.bodyPosition;
      body.style.top = previous.bodyTop;
      body.style.width = previous.bodyWidth;
      window.scrollTo(0, scrollY);
      previouslyFocused?.focus();
    };
  }, [open, onClose, containerRef]);
}
