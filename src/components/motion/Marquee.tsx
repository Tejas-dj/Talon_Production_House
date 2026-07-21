"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";

type MarqueeProps = {
  children: ReactNode;
  speed?: number;
  pauseOnHover?: boolean;
  className?: string;
};

export function Marquee({
  children,
  speed = 40,
  pauseOnHover = true,
  className = "",
}: MarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState(20);
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    setPrefersReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const single = track.firstElementChild as HTMLElement | null;
    if (!single) return;
    const w = single.offsetWidth;
    if (w > 0) setDuration(w / speed);
  }, [speed]);

  return (
    <div
      className={`overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div
        ref={trackRef}
        className={`marquee-track flex w-max ${pauseOnHover ? "marquee-hover-pause" : ""}`}
        style={
          prefersReduced
            ? { animation: "none" }
            : { animationDuration: `${duration}s` }
        }
      >
        <div className="flex shrink-0">{children}</div>
        <div className="flex shrink-0">{children}</div>
      </div>
    </div>
  );
}
