"use client";

import { motion, useReducedMotion } from "framer-motion";
import { DURATION, EASE } from "@/lib/motion";

type SplitTextProps = {
  children: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  /** Delay per character in seconds. */
  charDelay?: number;
};

const charVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATION.rise,
      ease: EASE.rise as unknown as number[],
      delay: i * 0.04,
    },
  }),
};

const charVariantsReduced = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: { duration: DURATION.riseReduced, ease: "linear" as const, delay: i * 0.02 },
  }),
};

export function SplitText({
  children,
  as: Tag = "h1",
  className,
  charDelay = 0.04,
}: SplitTextProps) {
  const reducedMotion = useReducedMotion();
  const MotionTag = motion.create(Tag);

  const chars = children.split("");

  const variants = reducedMotion
    ? {
        hidden: { opacity: 0 },
        visible: (i: number) => ({
          opacity: 1,
          transition: { duration: DURATION.riseReduced, ease: "linear" as const, delay: i * (charDelay / 2) },
        }),
      }
    : {
        hidden: { opacity: 0, y: 24 },
        visible: (i: number) => ({
          opacity: 1,
          y: 0,
          transition: {
            duration: DURATION.rise,
            ease: EASE.rise as unknown as number[],
            delay: i * charDelay,
          },
        }),
      };

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      aria-label={children}
    >
      {chars.map((char, i) => (
        <motion.span
          key={`${i}-${char}`}
          custom={i}
          variants={variants}
          style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : undefined }}
          aria-hidden="true"
        >
          {char === " " ? " " : char}
        </motion.span>
      ))}
    </MotionTag>
  );
}
