"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";

type MarqueeProps = {
  children: ReactNode;
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
  /** Scroll axis — horizontal (default, translateX) or vertical (translateY). */
  direction?: "horizontal" | "vertical";
  /** Reverses scroll direction (right-to-left / bottom-to-top). */
  reverse?: boolean;
};

export function Marquee({
  children,
  speed = 40,
  pauseOnHover = true,
  className = "",
  direction = "horizontal",
  reverse = false,
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(20);
  const [prefersReduced, setPrefersReduced] = useState(false);
  const vertical = direction === "vertical";

  useEffect(() => {
    setPrefersReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const single = track.firstElementChild as HTMLElement | null;
    if (!single) return;
    const size = vertical ? single.offsetHeight : single.offsetWidth;
    if (size > 0) setDuration(size / speed);
  }, [speed, vertical]);

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <div
        ref={trackRef}
        className={`marquee-track flex ${vertical ? "h-max flex-col" : "w-max"} ${
          reverse ? "marquee-track-reverse" : ""
        } ${vertical ? "marquee-track-vertical" : ""} ${
          pauseOnHover ? "marquee-hover-pause" : ""
        }`}
        style={
          prefersReduced
            ? { animation: "none" }
            : { animationDuration: `${duration}s` }
        }
      >
        <div className={`flex shrink-0 ${vertical ? "flex-col" : ""}`}>{children}</div>
        <div className={`flex shrink-0 ${vertical ? "flex-col" : ""}`}>{children}</div>
      </div>
    </div>
  );
}
