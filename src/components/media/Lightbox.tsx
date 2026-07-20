"use client";

import { useEffect, useRef, useState } from "react";
import { CloudinaryImage } from "@/components/media/CloudinaryImage";
import { cloudinaryUrl } from "@/lib/media/presets";
import { useDialogBehavior } from "@/lib/use-dialog";

type LightboxProps = {
  /** Cloudinary public ids — scoped to the current series; navigation wraps within this array only. */
  images: string[];
  initialIndex: number;
  onClose: () => void;
  /** Used to build descriptive alt text and the dialog's accessible label. */
  altPrefix: string;
};

/**
 * Full-screen lightbox: keyboard (←/→/Esc), touch swipe, visible prev/next
 * buttons, a position counter, focus trap + scroll lock (useDialogBehavior),
 * and preloading of the immediate neighbor images. Built for the Photography
 * page but kept generic (plain id array + index) so it's reusable elsewhere.
 */
export function Lightbox({ images, initialIndex, onClose, altPrefix }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const total = images.length;

  useDialogBehavior({ open: true, onClose, containerRef });

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") setIndex((i) => (i - 1 + total) % total);
      if (event.key === "ArrowRight") setIndex((i) => (i + 1) % total);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [total]);

  // Preload the immediate neighbors so prev/next feels instant.
  useEffect(() => {
    [(index + 1) % total, (index - 1 + total) % total].forEach((i) => {
      const preload = new window.Image();
      preload.src = cloudinaryUrl(images[i], "lightbox", 1600);
    });
  }, [index, images, total]);

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
      aria-label={`${altPrefix} — image ${index + 1} of ${total}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-scrim p-4"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button
        type="button"
        onClick={onClose}
        className="btn type-meta absolute top-4 right-4 px-4 py-2 md:top-8 md:right-8"
      >
        Close
      </button>

      {total > 1 && (
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous image"
          className="btn type-meta absolute top-1/2 left-4 -translate-y-1/2 px-3 py-3 md:left-8"
        >
          ←
        </button>
      )}

      <div className="relative max-h-[80vh] max-w-full">
        <CloudinaryImage
          id={images[index]}
          preset="lightbox"
          alt={`${altPrefix}, photograph ${index + 1} of ${total}`}
          width={1600}
          height={1067}
          priority
          className="max-h-[80vh] w-auto max-w-[85vw] object-contain"
        />
      </div>

      {total > 1 && (
        <button
          type="button"
          onClick={goNext}
          aria-label="Next image"
          className="btn type-meta absolute top-1/2 right-4 -translate-y-1/2 px-3 py-3 md:right-8"
        >
          →
        </button>
      )}

      {total > 1 && (
        <p className="type-meta text-muted absolute bottom-4 left-1/2 -translate-x-1/2 md:bottom-8">
          {index + 1} / {total}
        </p>
      )}
    </div>
  );
}
