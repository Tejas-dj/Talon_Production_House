"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  if (reducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      ref={ref}
      initial={{ clipPath: "inset(100% 0 0 0)" }}
      animate={{ clipPath: "inset(0% 0 0 0)" }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={() => {
        // A clip-path value other than "none" — even this fully-revealed,
        // visually-no-op one — permanently makes this div the containing
        // block/stacking context for every position:fixed descendant on the
        // page, trapping their z-index locally instead of the real viewport
        // stacking order. That silently broke fixed CTAs and dialogs
        // (backdrop losing to the page Footer) sitewide. Clearing the
        // inline style once the reveal finishes removes the trap for the
        // rest of this page instance's life.
        if (ref.current) ref.current.style.clipPath = "";
      }}
    >
      {children}
    </motion.div>
  );
}
