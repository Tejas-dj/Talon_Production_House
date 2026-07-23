"use client";

import { useRef, useCallback, useEffect, useState, type ReactNode } from "react";

type MagneticElementProps = {
  children: ReactNode;
  /** Activation radius in pixels. */
  radius?: number;
  /** Strength of the pull (0–1). */
  strength?: number;
  className?: string;
  as?: keyof HTMLElementTagNameMap;
};

export function MagneticElement({
  children,
  radius = 80,
  strength = 0.3,
  className,
  as: Tag = "div",
}: MagneticElementProps) {
  const ref = useRef<HTMLElement>(null);
  const raf = useRef(0);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
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

    const el = ref.current;
    if (!el) return;

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        target.current.x = dx * strength;
        target.current.y = dy * strength;
      } else {
        target.current.x = 0;
        target.current.y = 0;
      }
    };

    const onMouseLeave = () => {
      target.current.x = 0;
      target.current.y = 0;
    };

    const tick = () => {
      const lerp = 0.15;
      current.current.x += (target.current.x - current.current.x) * lerp;
      current.current.y += (target.current.y - current.current.y) * lerp;

      if (Math.abs(current.current.x) > 0.01 || Math.abs(current.current.y) > 0.01) {
        el.style.transform = `translate(${current.current.x}px, ${current.current.y}px)`;
      } else if (current.current.x !== 0 || current.current.y !== 0) {
        current.current.x = 0;
        current.current.y = 0;
        el.style.transform = "";
      }

      raf.current = requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove", onMouseMove);
    el.addEventListener("mouseleave", onMouseLeave);
    raf.current = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      el.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(raf.current);
      if (el) el.style.transform = "";
    };
  }, [canHover, radius, strength]);

  return (
    // @ts-expect-error -- dynamic tag + ref typing
    <Tag ref={ref} className={className} style={{ willChange: canHover ? "transform" : undefined }}>
      {children}
    </Tag>
  );
}
