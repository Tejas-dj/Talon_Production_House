"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

type ScrollRevealTextProps = {
  children: string;
  as?: "p" | "h2" | "h3" | "span";
  className?: string;
};

function Word({ word, range, progress }: { word: string; range: [number, number]; progress: import("framer-motion").MotionValue<number> }) {
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span aria-hidden="true" style={{ opacity, display: "inline-block", marginRight: "0.3em" }}>
      {word}
    </motion.span>
  );
}

export function ScrollRevealText({ children, as: Tag = "p", className }: ScrollRevealTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "start 0.25"],
  });

  const words = children.split(" ");

  if (reducedMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <div ref={containerRef}>
      <Tag className={className} aria-label={children}>
        {words.map((word, i) => {
          const start = i / words.length;
          const end = start + 1 / words.length;
          return (
            <Word key={`${i}-${word}`} word={word} range={[start, end]} progress={scrollYProgress} />
          );
        })}
      </Tag>
    </div>
  );
}
