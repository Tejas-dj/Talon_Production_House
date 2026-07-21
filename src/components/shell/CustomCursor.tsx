"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type CursorLabel = "" | "View" | "Open" | "nav";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const smoothPos = useRef({ x: 0, y: 0 });
  const raf = useRef(0);
  const visibleRef = useRef(false);
  const [expanded, setExpanded] = useState(false);
  const [label, setLabel] = useState<CursorLabel>("");
  const [visible, setVisible] = useState(false);
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(mql.matches);
    const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  const getLabel = useCallback((el: HTMLElement): CursorLabel => {
    const target = el.closest<HTMLElement>(
      "[data-cursor='view'], [data-cursor='open'], a, button, [role='button']"
    );
    if (!target) return "";
    const inNav = !!target.closest("header, nav");
    if (inNav) return "nav";
    if (target.matches("[data-cursor='open']")) return "Open";
    if (target.matches("[data-cursor='view'], a, button, [role='button']")) return "View";
    return "";
  }, []);

  useEffect(() => {
    if (!canHover) return;

    const onMouseMove = (e: MouseEvent) => {
      pos.current.x = e.clientX;
      pos.current.y = e.clientY;
      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }

      const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
      if (el) {
        const l = getLabel(el);
        setLabel(l);
        setExpanded(l !== "");
      } else {
        setLabel("");
        setExpanded(false);
      }
    };

    const onMouseLeave = () => {
      visibleRef.current = false;
      setVisible(false);
    };
    const onMouseEnter = () => {
      visibleRef.current = true;
      setVisible(true);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.documentElement.addEventListener("mouseleave", onMouseLeave);
    document.documentElement.addEventListener("mouseenter", onMouseEnter);

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      document.documentElement.removeEventListener("mouseenter", onMouseEnter);
    };
  }, [canHover, getLabel]);

  useEffect(() => {
    if (!canHover) return;

    const tick = () => {
      smoothPos.current.x += (pos.current.x - smoothPos.current.x) * 0.15;
      smoothPos.current.y += (pos.current.y - smoothPos.current.y) * 0.15;
      const dot = dotRef.current;
      if (dot) {
        dot.style.transform = `translate(${smoothPos.current.x}px, ${smoothPos.current.y}px) translate(-50%, -50%)`;
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [canHover]);

  if (!canHover) return null;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 9999,
        pointerEvents: "none",
        width: expanded ? 72 : 18,
        height: expanded ? 72 : 18,
        borderRadius: "50%",
        backgroundColor: "var(--text-primary)",
        mixBlendMode: "difference",
        opacity: visible ? 1 : 0,
        transition: "width 0.4s cubic-bezier(0.16, 1, 0.3, 1), height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--bg)",
          opacity: expanded ? 1 : 0,
          transition: "opacity 0.25s ease",
          whiteSpace: "nowrap",
          userSelect: "none",
        }}
      >
        {label !== "nav" ? label : ""}
      </span>
    </div>
  );
}
