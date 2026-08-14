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

export function SplitText({
  children,
  as: Tag = "h1",
  className,
  charDelay = 0.04,
}: SplitTextProps) {
  const reducedMotion = useReducedMotion();
  const MotionTag = motion.create(Tag);

  const words = children.split(" ");

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
            ease: EASE.rise,
            delay: i * charDelay,
          },
        }),
      };

  let charIndex = 0;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      aria-label={children}
    >
      {words.map((word, wi) => (
        <span key={wi} style={{ display: "inline-block" }}>
          {/* Word is one nowrap unit so a line can only break between words,
              never mid-word — splitting into per-char spans loses the atomic
              word boundary a plain text node would otherwise have. */}
          <span style={{ whiteSpace: "nowrap" }} aria-hidden="true">
            {word.split("").map((char) => {
              const i = charIndex++;
              return (
                <motion.span
                  key={i}
                  custom={i}
                  variants={variants}
                  style={{ display: "inline-block" }}
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
          {wi < words.length - 1 ? " " : null}
        </span>
      ))}
    </MotionTag>
  );
}
