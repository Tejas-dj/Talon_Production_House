"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BunnyPlayer } from "@/components/media/BunnyPlayer";
import { StillsPreviewCarousel, STILLS_CAROUSEL_IDS } from "@/components/work/StillsPreviewCarousel";
import { ThemeToggle } from "@/components/shell/ThemeToggle";
import { bunnyThumbnailUrl } from "@/lib/media/bunny";
import { useDialogBehavior } from "@/lib/use-dialog";
import {
  HERO_BUNNY_VIDEO_ID,
  WORK_OVERLAY_MOBILE_MOTION_BUNNY_VIDEO_ID,
  WORK_OVERLAY_MOTION_PREVIEW_BUNNY_VIDEO_ID,
} from "@/lib/site";
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
  const [mobileActive, setMobileActive] = useState<"motion" | "stills" | null>(null);

  useDialogBehavior({ open, onClose, containerRef });

  useEffect(() => {
    if (!open) {
      setHovered(null);
      setMobileActive(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
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
  }, [open]);

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
      {/* ─── Mobile layout ─── */}
      <div className="flex flex-1 flex-col md:hidden">
        <div className="flex items-center justify-end gap-3 px-3 pt-3">
          <ThemeToggle />
          <button
            type="button"
            onClick={onClose}
            className="btn type-meta px-4 py-2"
          >
            Close
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-3">
          {/* Motion card */}
          <Link
            href="/work/motion"
            onClick={onClose}
            onTouchStart={() => setMobileActive("motion")}
            onTouchEnd={() => setMobileActive(null)}
            onTouchCancel={() => setMobileActive(null)}
            className="work-card relative flex flex-1 flex-col overflow-hidden"
            style={{
              transform: mobileActive === "motion" ? "scale(0.97)" : "scale(1)",
              transition: "transform 180ms var(--ease-shift)",
            }}
          >
            {open && (
              <div className="absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={bunnyThumbnailUrl(WORK_OVERLAY_MOBILE_MOTION_BUNNY_VIDEO_ID)}
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="work-card-scrim absolute inset-0" />

            <div className="relative z-10 mt-auto flex items-end justify-between p-4">
              <div>
                <p className="type-meta mb-1 text-[color:var(--hero-overlay-fg)] opacity-60">
                  Films & Videos
                </p>
                <p className="text-[2rem] leading-[0.92] font-extrabold tracking-[-0.02em] text-[color:var(--hero-overlay-fg)]">
                  Motion
                </p>
              </div>
              <svg
                width="24" height="24" viewBox="0 0 24 24" fill="none"
                className="text-[color:var(--hero-overlay-fg)] opacity-60"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </Link>

          {/* Stills card */}
          <Link
            href="/work/stills"
            onClick={onClose}
            onTouchStart={() => setMobileActive("stills")}
            onTouchEnd={() => setMobileActive(null)}
            onTouchCancel={() => setMobileActive(null)}
            className="work-card relative flex flex-1 flex-col overflow-hidden"
            style={{
              transform: mobileActive === "stills" ? "scale(0.97)" : "scale(1)",
              transition: "transform 180ms var(--ease-shift)",
            }}
          >
            {open && (
              <div className="absolute inset-0">
                <StillsPreviewCarousel />
              </div>
            )}
            <div className="work-card-scrim absolute inset-0" />

            <div className="relative z-10 mt-auto flex items-end justify-between p-4">
              <div>
                <p className="type-meta mb-1 text-[color:var(--hero-overlay-fg)] opacity-60">
                  Photography
                </p>
                <p className="text-[2rem] leading-[0.92] font-extrabold tracking-[-0.02em] text-[color:var(--hero-overlay-fg)]">
                  Stills
                </p>
              </div>
              <svg
                width="24" height="24" viewBox="0 0 24 24" fill="none"
                className="text-[color:var(--hero-overlay-fg)] opacity-60"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </Link>
        </div>
      </div>

      {/* ─── Desktop layout ─── */}
      <div className="relative hidden flex-1 flex-col px-8 md:flex md:w-2/5 md:flex-none">
        <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
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

      {/* Right — media preview, desktop only */}
      <div className="relative hidden flex-1 overflow-hidden md:block">
        <p className="type-meta absolute top-8 left-8 z-10 text-[color:var(--hero-overlay-fg)]">
          {hovered === "motion" ? "Motion" : hovered === "stills" ? "Stills" : "Showreel"}
        </p>
        {open && (hovered === "stills" ? (
          <StillsPreviewCarousel />
        ) : hovered === "motion" ? (
          <BunnyPlayer
            videoId={WORK_OVERLAY_MOTION_PREVIEW_BUNNY_VIDEO_ID}
            title="Motion preview"
            autoPlayMuted
            active
            maxHeight={720}
            className="h-full w-full"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- Bunny CDN thumbnail, not a local asset
          <img
            src={bunnyThumbnailUrl(HERO_BUNNY_VIDEO_ID)}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
        ))}
      </div>
    </div>
  );
}
