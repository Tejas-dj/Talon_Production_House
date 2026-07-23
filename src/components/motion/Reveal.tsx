"use client";

import { motion, useReducedMotion } from "framer-motion";
import { rise, riseReduced } from "@/lib/motion";

type RevealProps = {
  children: React.ReactNode;
  /** Position within a staggered group — feeds Bible §7's irregular stagger sequence. */
  index?: number;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * The one implementation of P1 Rise for grouped/scroll-triggered reveals —
 * section headings, index items, gallery images, rate rows (Bible §7). Picks
 * `rise` vs. the reduced-motion fallback via `useReducedMotion`, fires once
 * per element on viewport entry (threshold 0.2), and threads `index` through
 * as Framer Motion's `custom` so `rise`'s dynamic variant can compute this
 * item's stagger delay (see src/lib/motion.ts).
 */
export function Reveal({ children, index = 0, className, style }: RevealProps) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={style}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={reducedMotion ? riseReduced : rise}
    >
      {children}
    </motion.div>
  );
}
