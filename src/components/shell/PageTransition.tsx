"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DURATION, EASE } from "@/lib/motion";

/* Page transition wrapper — P3 Veil: incoming route fades in through the page
   background, 320ms ease-out. Rendered from app/template.tsx, which remounts
   per navigation. Reduced motion: instant cut. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={reducedMotion ? { duration: 0 } : { duration: DURATION.veil, ease: EASE.veil }}
    >
      {children}
    </motion.div>
  );
}
