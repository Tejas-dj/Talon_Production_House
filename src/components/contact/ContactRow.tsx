"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MagneticElement } from "@/components/motion/MagneticElement";
import { Reveal } from "@/components/motion/Reveal";
import { veil } from "@/lib/motion";

type ContactRowProps = {
  label: string;
  detail: string;
  href: string;
  external?: boolean;
  index: number;
  icon: React.ReactNode;
  /** Phone/Email only — click also copies the detail text, confirmed via a P3 Veil text swap. */
  copyable?: boolean;
};

export function ContactRow({
  label,
  detail,
  href,
  external,
  index,
  icon,
  copyable,
}: ContactRowProps) {
  const [copied, setCopied] = useState(false);
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  function handleMouseMove(event: React.MouseEvent<HTMLAnchorElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    spotlightRef.current?.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
    spotlightRef.current?.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
  }

  function handleClick() {
    if (!copyable || !navigator.clipboard) return;
    navigator.clipboard
      .writeText(detail)
      .then(() => {
        setCopied(true);
        if (copyTimeout.current) clearTimeout(copyTimeout.current);
        copyTimeout.current = setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => {});
  }

  return (
    <Reveal index={index} className="hairline">
      <MagneticElement radius={80} strength={0.15} className="block">
        <a
          href={href}
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          className="link-draw group relative flex flex-col gap-2 overflow-hidden py-6 sm:flex-row sm:items-center sm:justify-between"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {/* Cursor-tracked spotlight — a flat --surface radial fill, not a
              decorative gradient; opacity-gated the same way as every other
              hover state on the site (Tailwind's group-hover, auto-scoped to
              hover-capable devices). */}
          <div
            ref={spotlightRef}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-[240ms] ease-shift group-hover:opacity-100 group-focus-visible:opacity-100"
            style={{
              background:
                "radial-gradient(220px circle at var(--spot-x, 50%) var(--spot-y, 50%), var(--surface), transparent 70%)",
            }}
          />

          <span className="type-headline relative z-1 flex items-center gap-3">
            <span className="inline-flex transition-transform duration-[240ms] ease-shift group-hover:scale-110 group-hover:text-accent group-focus-visible:scale-110 group-focus-visible:text-accent">
              {icon}
            </span>
            {label} →
          </span>

          <span className="type-meta text-muted relative z-1" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.span
                  key="copied"
                  variants={veil}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="text-accent"
                >
                  Copied
                </motion.span>
              ) : (
                <motion.span key="detail" variants={veil} initial="hidden" animate="visible" exit="exit">
                  {detail}
                </motion.span>
              )}
            </AnimatePresence>
          </span>
        </a>
      </MagneticElement>
    </Reveal>
  );
}
