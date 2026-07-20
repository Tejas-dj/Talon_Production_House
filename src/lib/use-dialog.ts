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
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [open, onClose, containerRef]);
}
