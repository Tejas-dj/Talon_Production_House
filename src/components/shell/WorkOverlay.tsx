"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { BunnyPlayer } from "@/components/media/BunnyPlayer";
import { Marquee } from "@/components/motion/Marquee";
import { StillsPreviewCarousel, STILLS_CAROUSEL_IDS } from "@/components/work/StillsPreviewCarousel";
import { ThemeToggle } from "@/components/shell/ThemeToggle";
import { useDialogBehavior } from "@/lib/use-dialog";
import { HERO_BUNNY_VIDEO_ID, WORK_OVERLAY_MOTION_PREVIEW_BUNNY_VIDEO_ID } from "@/lib/site";
import { CLOUDINARY_PRESETS } from "@/lib/media/presets";
import { bunnyThumbnailUrl } from "@/lib/media/bunny";

type WorkOverlayProps = {
  id: string;
  open: boolean;
  onClose: () => void;
};

type Hovered = "motion" | "stills" | null;

const STILLS_CARD_IMAGE = "VInita_Portfolio-7_n4zde7";

const MOTION_STRIP_IDS = [
  "DSC01254_s11rej",
  "DSC00950_ddrpto",
  "BEACH_1-19_hxysdl",
  "BEACH_1-15_xffqol",
  "IMG_9807_cmlxe0",
];
const STILLS_STRIP_IDS = STILLS_CAROUSEL_IDS[1];

function cldUrl(publicId: string, preset: keyof typeof CLOUDINARY_PRESETS, width: number): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return "";
  const { transform } = CLOUDINARY_PRESETS[preset];
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transform},q_auto,f_auto,w_${width}/${publicId}`;
}

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

  const motionThumb = bunnyThumbnailUrl(WORK_OVERLAY_MOTION_PREVIEW_BUNNY_VIDEO_ID);

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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={motionThumb || cldUrl("DSC01254_s11rej", "hero", 750)}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
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

            <div className="relative z-10 overflow-hidden border-t border-white/10">
              <Marquee speed={30} pauseOnHover={false} className="h-[72px]">
                <div className="flex gap-1 py-1 pl-1">
                  {MOTION_STRIP_IDS.map((imgId) => (
                    <div key={imgId} className="relative h-[64px] w-[86px] shrink-0 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cldUrl(imgId, "thumbnail", 200)}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </Marquee>
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cldUrl(STILLS_CARD_IMAGE, "hero", 750)}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
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

            <div className="relative z-10 overflow-hidden border-t border-white/10">
              <Marquee speed={25} pauseOnHover={false} direction="horizontal" reverse className="h-[72px]">
                <div className="flex gap-1 py-1 pl-1">
                  {STILLS_STRIP_IDS.map((imgId) => (
                    <div key={imgId} className="relative h-[64px] w-[48px] shrink-0 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cldUrl(imgId, "portraitCard", 200)}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </Marquee>
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
