"use client";

import { useRef, useState } from "react";
import { BunnyPlayer } from "@/components/media/BunnyPlayer";
import { useDialogBehavior } from "@/lib/use-dialog";
import type { VideoProject } from "@/lib/content-types";

type ReelLightboxProps = {
  reels: VideoProject[];
  initialIndex: number;
  onClose: () => void;
};

export function ReelLightbox({ reels, initialIndex, onClose }: ReelLightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const total = reels.length;
  const reel = reels[index];

  useDialogBehavior({ open: true, onClose, containerRef });

  function goPrev() {
    setIndex((i) => (i - 1 + total) % total);
  }
  function goNext() {
    setIndex((i) => (i + 1) % total);
  }
  function onTouchStart(event: React.TouchEvent) {
    touchStartX.current = event.touches[0].clientX;
  }
  function onTouchEnd(event: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = event.changedTouches[0].clientX - touchStartX.current;
    if (delta > 50) goPrev();
    else if (delta < -50) goNext();
    touchStartX.current = null;
  }

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${reel.title} — reel ${index + 1} of ${total}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-scrim p-4"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <button
        type="button"
        onClick={onClose}
        className="btn btn-scrim type-meta absolute top-4 right-4 px-4 py-2 md:top-8 md:right-8"
      >
        Close
      </button>

      {total > 1 && (
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous reel"
          className="btn btn-scrim type-meta absolute top-1/2 left-4 -translate-y-1/2 px-3 py-3 md:left-8"
        >
          ←
        </button>
      )}

      <div className="flex flex-col items-center gap-4">
        <div className="relative aspect-[9/16] w-[min(280px,70vw)] overflow-hidden rounded-xl md:w-[320px]">
          <BunnyPlayer
            key={reel.bunnyVideoId}
            videoId={reel.bunnyVideoId}
            title={reel.title}
            posterImageId={reel.posterImageId}
            className="absolute inset-0 h-full w-full"
          />
        </div>
        <div className="text-center" style={{ color: "var(--hero-overlay-fg)" }}>
          <p className="type-headline">{reel.title}</p>
          <p className="type-meta opacity-60">
            {reel.client} · {reel.year}
          </p>
        </div>
      </div>

      {total > 1 && (
        <button
          type="button"
          onClick={goNext}
          aria-label="Next reel"
          className="btn btn-scrim type-meta absolute top-1/2 right-4 -translate-y-1/2 px-3 py-3 md:right-8"
        >
          →
        </button>
      )}

      {total > 1 && (
        <p
          className="type-meta absolute bottom-4 left-1/2 -translate-x-1/2 opacity-60 md:bottom-8"
          style={{ color: "var(--hero-overlay-fg)" }}
        >
          {index + 1} / {total}
        </p>
      )}
    </div>
  );
}
