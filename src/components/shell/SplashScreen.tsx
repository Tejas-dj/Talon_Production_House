"use client";

import { useEffect, useState } from "react";

const HOLD_MS = 1000;
const ZOOM_MS = 4000;
const FADE_MS = 80;
const TOTAL_MS = HOLD_MS + ZOOM_MS + FADE_MS;

export function SplashScreen() {
  const [phase, setPhase] = useState<"idle" | "zoom" | "done">("idle");

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReduced || sessionStorage.getItem("splash")) {
      setPhase("done");
      return;
    }

    document.body.style.overflow = "hidden";

    const zoomTimer = setTimeout(() => setPhase("zoom"), HOLD_MS);
    const doneTimer = setTimeout(() => {
      setPhase("done");
      sessionStorage.setItem("splash", "1");
      document.body.style.overflow = "";
    }, TOTAL_MS);

    return () => {
      clearTimeout(zoomTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      className={`splash-screen${phase === "zoom" ? " splash-zoom" : ""}`}
      aria-hidden="true"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid slice"
        className="splash-svg"
      >
        <defs>
          <mask id="splash-mask">
            <rect width="1000" height="600" fill="white" />
            <g className="splash-letters">
              <text
                x="500"
                y="293"
                textAnchor="middle"
                dominantBaseline="central"
                fill="black"
                className="splash-title"
              >
                TALON
              </text>
              <text
                x="500"
                y="320"
                textAnchor="middle"
                dominantBaseline="central"
                fill="black"
                className="splash-subtitle"
              >
                PRODUCTION HOUSE
              </text>
            </g>
          </mask>
        </defs>
        <rect
          width="1000"
          height="600"
          className="splash-fill"
          mask="url(#splash-mask)"
        />
      </svg>
    </div>
  );
}
