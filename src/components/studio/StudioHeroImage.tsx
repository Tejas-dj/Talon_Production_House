"use client";

import { useState } from "react";
import { CloudinaryImage } from "@/components/media/CloudinaryImage";
import { cloudinaryBlurPlaceholder } from "@/lib/media/presets";

type StudioHeroImageProps = {
  id: string;
  alt: string;
};

/**
 * The hero's full-res derive can take a couple of seconds on a cold
 * Cloudinary cache (same issue documented on cloudinaryBlurPlaceholder /
 * Lightbox) even though `preload` gets the request firing as early as
 * possible. A pulsing skeleton covers the gap until the tiny blur
 * placeholder lands, then the blur covers it until the full image's onLoad
 * fires, so the hero is never a blank rectangle.
 */
export function StudioHeroImage({ id, alt }: StudioHeroImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative aspect-[21/9] w-full overflow-hidden">
      {!loaded && (
        <div className="absolute inset-0 animate-pulse bg-surface" aria-hidden="true" />
      )}

      {!loaded && (
        // eslint-disable-next-line @next/next/no-img-element -- deliberately bypasses next/image: a fixed tiny blurred URL, not a responsive asset.
        <img
          src={cloudinaryBlurPlaceholder(id)}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full scale-105 object-cover blur-lg"
        />
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
