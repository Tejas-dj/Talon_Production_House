"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BunnyPlayer } from "@/components/media/BunnyPlayer";
import { StillsPreviewCarousel, STILLS_CAROUSEL_IDS } from "@/components/work/StillsPreviewCarousel";
import { ThemeToggle } from "@/components/shell/ThemeToggle";
import { useDialogBehavior } from "@/lib/use-dialog";
import { HERO_BUNNY_VIDEO_ID, WORK_OVERLAY_MOTION_PREVIEW_BUNNY_VIDEO_ID } from "@/lib/site";
import { CLOUDINARY_PRESETS } from "@/lib/media/presets";

type WorkOverlayProps = {
  id: string;
  open: boolean;
  onClose: () => void;
};

type Hovered = "motion" | "stills" | null;

export function WorkOverlay({ id, open, onClose }: WorkOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<Hovered>(null);

  useDialogBehavior({ open, onClose, containerRef });

  useEffect(() => {
    if (!open) setHovered(null);
  }, [open]);

  useEffect(() => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) return;
    const { transform } = CLOUDINARY_PRESETS.portraitCard;
    const links: HTMLLinkElement[] = [];
    for (const id of STILLS_CAROUSEL_IDS.flat()) {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.as = "image";
      link.href = `https://res.cloudinary.com/${cloudName}/image/upload/${transform},q_auto,w_640/${id}`;
      document.head.appendChild(link);
      links.push(link);
    }
    return () => links.forEach((l) => l.remove());
  }, []);

  return (
    <div
      id={id}
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Choose Stills or Motion"
      className={`bg-page fixed inset-0 z-50 flex flex-col transition-opacity duration-[320ms] ease-veil md:flex-row ${
        open ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden={!open}
      inert={!open}
    >
      {/* Left — navigation choices */}
      <div className="relative flex flex-1 flex-col px-8 py-24 md:w-2/5 md:flex-none md:px-16">
        <div className="absolute top-4 right-4 z-20 flex items-center gap-3 md:top-6 md:right-6">
          <ThemeToggle />
          <button
            type="button"
            onClick={onClose}
            className="btn type-meta px-4 py-2"
          >
            Close
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-center gap-8">
          <Link
            href="/work/motion"
            onClick={onClose}
            onMouseEnter={() => setHovered("motion")}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered("motion")}
            onBlur={() => setHovered(null)}
            className="link-draw text-[clamp(2.5rem,6.5vw,6rem)] leading-[0.92] font-extrabold tracking-[-0.02em]"
          >
            Motion
          </Link>
          <Link
            href="/work/stills"
            onClick={onClose}
            onMouseEnter={() => setHovered("stills")}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered("stills")}
            onBlur={() => setHovered(null)}
            className="link-draw text-[clamp(2.5rem,6.5vw,6rem)] leading-[0.92] font-extrabold tracking-[-0.02em]"
          >
            Stills
          </Link>
        </div>
      </div>

      {/* Right — media preview, hidden on mobile */}
      <div className="relative hidden flex-1 overflow-hidden md:block">
        <p className="type-meta absolute top-8 left-8 z-10 text-[color:var(--hero-overlay-fg)]">
          {hovered === "motion" ? "Motion" : hovered === "stills" ? "Stills" : "Showreel"}
        </p>
        {hovered === "stills" ? (
          <StillsPreviewCarousel />
        ) : (
          <BunnyPlayer
            key={hovered === "motion" ? "motion-preview" : "showreel"}
            videoId={
              hovered === "motion" ? WORK_OVERLAY_MOTION_PREVIEW_BUNNY_VIDEO_ID : HERO_BUNNY_VIDEO_ID
            }
            title={hovered === "motion" ? "Motion preview" : "Studio showreel"}
            autoPlayMuted
            active
            className="h-full w-full"
          />
        )}
      </div>
    </div>
  );
}
