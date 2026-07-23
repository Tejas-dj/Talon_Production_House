"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { BunnyPlayer } from "@/components/media/BunnyPlayer";
import { SplitText } from "@/components/motion/SplitText";
import { HERO_BUNNY_VIDEO_ID } from "@/lib/site";

/**
 * Home hero — full-bleed video, 82vh, bottom edge clipped at −13° (the one
 * diagonal permitted on the site, Bible §6.5). Hero media motion (brief's
 * Step 1, distinct from the three named primitives): an 8% scale drift over
 * the hero's own scroll range, scroll-linked rather than duration/easing
 * driven, so it has no timing curve to conflict with Bible §7. Pinned to
 * scale(1) — no transform at all — under prefers-reduced-motion.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[100vh] w-full overflow-hidden [clip-path:polygon(0_0,100%_0,100%_100%,0_90%)] -mt-(--header-height)"
    >
      <motion.div className="h-full w-full" style={reducedMotion ? undefined : { scale }}>
        <BunnyPlayer
          videoId={HERO_BUNNY_VIDEO_ID}
          title="Talon Production House showreel"
          autoPlayMuted
          className="h-full w-full"
        />
      </motion.div>
      {/* Flat scrim tint (not a gradient) for overlay text legibility */}
      <div className="bg-scrim/30 pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0">
        <div className="container-site grid h-full grid-rows-[auto_1fr_auto] pt-(--header-height) pb-6 md:grid-cols-12">
          <p className="type-meta text-hero-overlay text-right md:col-span-3 md:col-start-10">
            Production House / Bengaluru
          </p>
        </div>
      </div>
      <SplitText as="h1" className="type-display text-hero-overlay pointer-events-none absolute bottom-[10%] left-0 pl-4">
        Talon
      </SplitText>
    </section>
  );
}
