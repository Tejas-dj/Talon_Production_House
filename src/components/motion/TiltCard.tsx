"use client";

import { useRef, useCallback, useEffect, useState, type ReactNode } from "react";

type TiltCardProps = {
  children: ReactNode;
  className?: string;
  /** Max rotation in degrees. */
  maxTilt?: number;
};

export function TiltCard({ children, className, maxTilt = 6 }: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(mql.matches);
    const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    if (!canHover) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const el = cardRef.current;
    if (!el) return;

    const portrait = el.querySelector<HTMLElement>("[data-tilt-portrait]");

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const rotateX = (0.5 - y) * maxTilt;
      const rotateY = (x - 0.5) * maxTilt;

      el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

      if (portrait) {
        portrait.style.transform = `translate(${(0.5 - x) * 12}px, ${(0.5 - y) * 12}px) scale(1.04)`;
      }
    };

    const onMouseLeave = () => {
      el.style.transform = "";
      el.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
      if (portrait) {
        portrait.style.transform = "";
        portrait.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
      }
      setTimeout(() => {
        el.style.transition = "";
        if (portrait) portrait.style.transition = "";
      }, 500);
    };

    const onMouseEnter = () => {
      el.style.transition = "none";
      if (portrait) portrait.style.transition = "none";
    };

    el.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);
    el.addEventListener("mouseenter", onMouseEnter);

    return () => {
      el.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
      el.removeEventListener("mouseenter", onMouseEnter);
      el.style.transform = "";
      if (portrait) portrait.style.transform = "";
    };
  }, [canHover, maxTilt]);

  return (
    <div ref={cardRef} className={className} style={{ willChange: canHover ? "transform" : undefined }}>
      {children}
    </div>
  );
}
