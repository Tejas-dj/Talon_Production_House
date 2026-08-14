"use client";

import { useRef, useState, useEffect } from "react";
import { CloudinaryImage } from "@/components/media/CloudinaryImage";
import { cloudinaryBlurPlaceholder } from "@/lib/media/presets";
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
 * buttons, a position counter, focus trap + scroll lock (useDialogBehavior).
 *
 * Neighbor preloading renders the prev/next images off-screen with the
 * *exact* same <CloudinaryImage> props (preset, width, sizes) as the visible
 * one, instead of hand-building a preload URL with a guessed width — a
 * guessed width almost never matches what next/image's responsive srcset
 * actually picks at render time, so the "preload" was landing on a URL the
 * browser never reused, and prev/next paid full price anyway. Same
 * component, same props, same URL: a guaranteed cache hit on navigation.
 *
 * A blurred ~32px stand-in (cloudinaryBlurPlaceholder) covers the gap while
 * the full-res image loads — mainly for the very first image opened, before
 * any neighbor has had a chance to preload, and for whichever image a
 * Cloudinary derived size is being requested for the first time ever (cold
 * transform cache, can take a couple of seconds on these source photos).
 */
export function Lightbox({ images, initialIndex, onClose, altPrefix }: LightboxProps) {
  const [index, setIndex] = useState(initialIndex);
  const [loadedIndex, setLoadedIndex] = useState<Record<number, boolean>>({});
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

  const prevIndex = (index - 1 + total) % total;
  const nextIndex = (index + 1) % total;

  // Backdrop tuning knobs: blur strength is the backdrop-blur-{sm,md,lg,xl}
  // class below; scrim darkness is --scrim in globals.css (shared with
  // other overlays) — or append /NN (e.g. bg-scrim/90) to the className
  // here to override opacity for this dialog only.
  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${altPrefix} — image ${index + 1} of ${total}`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-scrim p-4 backdrop-blur-md"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button
        type="button"
        onClick={onClose}
        className="btn btn-scrim type-meta absolute top-4 right-4 px-4 py-2 md:top-8 md:right-8"
      >
        Close
      </button>

      {/* Prev/next dock to the bottom corners on mobile (below the frame,
          never over it — see the mobile max-h-[70vh] cap on the image below,
          which keeps a guaranteed clear strip under any aspect ratio) and
          revert to the classic side-floating position from md up, where the
          85vw-capped image never reaches the 32px-inset arrows anyway. */}
      {total > 1 && (
        <button
          type="button"
          onClick={goPrev}
          aria-label="Previous image"
          className="btn btn-scrim type-meta absolute bottom-4 left-4 z-10 px-3 py-3 md:top-1/2 md:bottom-auto md:left-8 md:-translate-y-1/2"
        >
          ←
        </button>
      )}

      <div className="relative max-h-[70vh] max-w-full md:max-h-[80vh]">
        {!loadedIndex[index] && (
          // eslint-disable-next-line @next/next/no-img-element -- deliberately bypasses next/image: a fixed tiny blurred URL, not a responsive asset.
          <img
            src={cloudinaryBlurPlaceholder(images[index])}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full max-h-[70vh] w-full max-w-[85vw] scale-105 object-contain blur-lg md:max-h-[80vh]"
          />
        )}

        <CloudinaryImage
          key={images[index]}
          id={images[index]}
          preset="lightbox"
          alt={`${altPrefix}, photograph ${index + 1} of ${total}`}
          width={1600}
          height={1067}
          preload
          onLoad={() => setLoadedIndex((prev) => ({ ...prev, [index]: true }))}
          className="relative max-h-[70vh] w-auto max-w-[85vw] object-contain md:max-h-[80vh]"
        />

        {total > 1 && (
          <CloudinaryImage
            key={`preload-${images[prevIndex]}`}
            id={images[prevIndex]}
            preset="lightbox"
            alt=""
            aria-hidden="true"
            width={1600}
            height={1067}
            loading="eager"
            fetchPriority="low"
            className="pointer-events-none absolute inset-0 opacity-0"
          />
        )}
        {total > 1 && (
          <CloudinaryImage
            key={`preload-${images[nextIndex]}`}
            id={images[nextIndex]}
            preset="lightbox"
            alt=""
            aria-hidden="true"
            width={1600}
            height={1067}
            loading="eager"
            fetchPriority="low"
            className="pointer-events-none absolute inset-0 opacity-0"
          />
        )}
      </div>

      {total > 1 && (
        <button
          type="button"
          onClick={goNext}
          aria-label="Next image"
          className="btn btn-scrim type-meta absolute bottom-4 right-4 z-10 px-3 py-3 md:top-1/2 md:bottom-auto md:right-8 md:-translate-y-1/2"
        >
          →
        </button>
      )}

      {total > 1 && (
        <p
          className="type-meta absolute bottom-4 left-1/2 z-10 -translate-x-1/2 opacity-60 md:bottom-8"
          style={{ color: "var(--hero-overlay-fg)" }}
        >
          {index + 1} / {total}
        </p>
      )}
    </div>
  );
}
