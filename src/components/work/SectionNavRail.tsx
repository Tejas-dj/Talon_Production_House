"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type NavSection = { slug: string; title: string };

type Props = {
  sections: NavSection[];
  onBeforeNavigate?: (slug: string) => void;
};

function scrollToSection(slug: string, behavior: ScrollBehavior) {
  document.getElementById(slug)?.scrollIntoView({ behavior, block: "start" });
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function SectionNavRail({ sections, onBeforeNavigate }: Props) {
  const [activeSlug, setActiveSlug] = useState(sections[0]?.slug ?? "");
  const suppressObserverRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash || !sections.some((s) => s.slug === hash)) return;
    onBeforeNavigate?.(hash);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToSection(hash, prefersReducedMotion() ? "auto" : "smooth");
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (suppressObserverRef.current) return;
        const visible = entries.filter((entry) => entry.isIntersecting);
        if (visible.length === 0) return;
        const topmost = visible.reduce((a, b) =>
          a.boundingClientRect.top < b.boundingClientRect.top ? a : b,
        );
        setActiveSlug(topmost.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    sections.forEach((s) => {
      const el = document.getElementById(s.slug);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  function handleClick(slug: string) {
    suppressObserverRef.current = true;
    setActiveSlug(slug);
    onBeforeNavigate?.(slug);
    window.history.replaceState(null, "", `#${slug}`);
    requestAnimationFrame(() => {
      scrollToSection(slug, prefersReducedMotion() ? "auto" : "smooth");
    });
    window.setTimeout(() => {
      suppressObserverRef.current = false;
    }, 800);
  }

  if (sections.length < 2) return null;

  const rail = (
    <nav
      aria-label="Jump to a series"
      className="fixed top-1/2 z-30 hidden -translate-y-1/2 md:block"
      style={{ right: "var(--gutter)", mixBlendMode: "difference" }}
    >
      <ol className="flex flex-col">
        {sections.map((s, i) => (
          <li key={s.slug}>
            <button
              type="button"
              className="rail-item"
              aria-current={s.slug === activeSlug ? "true" : undefined}
              aria-label={`Jump to ${s.title}`}
              onClick={() => handleClick(s.slug)}
            >
              <span className="rail-label" aria-hidden="true">
                {s.title}
              </span>
              <span className="rail-index" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );

  // Portal into body so the nav sits at the same DOM/stacking-context level
  // as CustomCursor — position:fixed inside nested ancestors can get trapped
  // in an isolated stacking context where mix-blend-mode:difference only
  // blends against the ancestor's background, not the actual page content.
  if (!mounted) return null;
  return createPortal(rail, document.body);
}
