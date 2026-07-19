import type { Variants } from "framer-motion";

/* Motion primitives — Bible §7. Three primitives; a fourth animation is a bug.
   Durations/easings mirror the CSS custom properties in globals.css (same §7
   table transcribed for Framer Motion — see DECISIONS.md, Step 2). */

export const DURATION = {
  rise: 0.64,
  shift: 0.24,
  veil: 0.32,
  riseReduced: 0.18,
  lightboxReduced: 0.12,
} as const;

export const EASE = {
  rise: [0.16, 1, 0.3, 1] as const, // hard launch, long settle
  shift: [0.4, 0, 0.2, 1] as const,
  veil: "easeOut" as const,
};

/* P1 — Rise: viewport entry, first entry only (viewport={{ once: true, amount: 0.2 }}). */
export const rise: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: DURATION.rise, ease: EASE.rise } },
};

/* P1 reduced-motion fallback: opacity only, 180ms linear. */
export const riseReduced: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.riseReduced, ease: "linear" } },
};

/* P3 — Veil: state-change crossfade (page transition, menu, lightbox). */
export const veil: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.veil, ease: EASE.veil } },
  exit: { opacity: 0, transition: { duration: DURATION.veil, ease: EASE.veil } },
};

/* Grouped P1 reveals stagger on this fixed irregular sequence (ms 0/70/160/
   220/330), repeating from 0 for the sixth item onward — Bible §7 Stagger. */
const STAGGER_SEQUENCE = [0, 0.07, 0.16, 0.22, 0.33] as const;

export function staggerDelay(index: number): number {
  return STAGGER_SEQUENCE[index % STAGGER_SEQUENCE.length];
}
