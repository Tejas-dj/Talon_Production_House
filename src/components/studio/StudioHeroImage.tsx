"use client";

import { useState } from "react";
import { CloudinaryImage } from "@/components/media/CloudinaryImage";

type StudioHeroImageProps = {
  id: string;
  alt: string;
};

/**
 * The hero's full-res load can take a moment even though `preload` gets the
 * request firing as early as possible. A pulsing skeleton covers the gap
 * until the full image's onLoad fires, so the hero is never a blank
 * rectangle.
 */
export function StudioHeroImage({ id, alt }: StudioHeroImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative aspect-[21/9] w-full overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-surface" aria-hidden="true" />
      )}

      <CloudinaryImage
        id={id}
        preset="hero"
        alt={alt}
        fill
        preload
        onLoad={() => setLoaded(true)}
        className={`object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
