"use client";

import Link from "next/link";
import { useEffect, type RefObject } from "react";
import { NAV_ITEMS } from "@/lib/site";

type MobileNavProps = {
  id: string;
  open: boolean;
  onClose: () => void;
  /* The trap cycles within the whole header (wordmark, toggle, MENU/CLOSE)
     plus this overlay, since the header stays visible above the scrim. */
  headerRef: RefObject<HTMLElement | null>;
  triggerRef: RefObject<HTMLButtonElement | null>;
  isCurrent: (href: string) => boolean;
  /** Opens the full-screen Stills/Motion overlay instead of navigating. */
  onWorkClick: () => void;
};

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileNav({
  id,
  open,
  onClose,
  headerRef,
  triggerRef,
  isCurrent,
  onWorkClick,
}: MobileNavProps) {
  /* Focus trap + escape + body scroll lock while open — cleaned up on close. */
  useEffect(() => {
    if (!open) return;
    const header = headerRef.current;
    if (!header) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;

    function focusables(): HTMLElement[] {
      return Array.from(header!.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        triggerRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !header!.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !header!.contains(active))) {
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
  }, [open, onClose, headerRef, triggerRef]);

  /* Always mounted; P3 Veil driven by a plain CSS opacity transition (320ms
     ease-out, both tokens sourced from globals.css) rather than framer-motion's
     AnimatePresence: the semantic state (inert, aria-hidden, body scroll lock)
     is set synchronously in the same render as the class change, so it never
     depends on an animation-library callback firing to be correct — simpler
     than mount/unmount tracking and provably safe if a transition is ever
     interrupted or skipped (e.g. reduced motion, which the sitewide
     prefers-reduced-motion kill switch already handles for plain CSS
     transitions with no extra branch needed here). `inert` when closed
     removes the panel from hit-testing, tab order, and the accessibility
     tree in one step. */
  return (
    <div
      id={id}
      className={`fixed inset-0 transition-opacity duration-[320ms] ease-veil md:hidden ${
        open ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden={!open}
      inert={!open}
    >
      {/* Scrim behind the menu — content under it is non-interactive (§4.4) */}
      <div className="absolute inset-0 bg-scrim" aria-hidden="true" onClick={onClose} />

      {/* Panel sits below the header row; scrim fills the rest */}
      <nav aria-label="Primary" className="hairline-b relative mt-(--header-height) bg-page">
        <ul className="container-site flex flex-col py-5">
          {NAV_ITEMS.map((item) => (
            <li key={item.href} className="hairline first:border-t-0">
              {item.href === "/work" ? (
                <button
                  type="button"
                  className="link-draw type-headline inline-block py-3"
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  aria-haspopup="dialog"
                  onClick={onWorkClick}
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className="link-draw type-headline inline-block py-3"
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  onClick={onClose}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
