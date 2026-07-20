"use client";

import { useState } from "react";
import { CloudinaryImage } from "@/components/media/CloudinaryImage";
import { Lightbox } from "@/components/media/Lightbox";
import { Reveal } from "@/components/motion/Reveal";

type PhotoSeriesGridProps = {
  seriesTitle: string;
  imageIds: string[];
};

/**
 * Justified grid, deliberately distinct from Project Detail's stills grid: a
 * 4-item repeating pattern (vs. stills' 3-item) with genuinely varied aspect
 * ratios (portrait / wide / ultra-wide / square) rather than stills' more
 * uniform 16:9-leaning boxes. Owns its own lightbox state so navigation is
 * naturally scoped to this series' imageIds only.
 */
export function PhotoSeriesGrid({ seriesTitle, imageIds }: PhotoSeriesGridProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-gutter">
        {imageIds.map((id, i) => {
          const slot = i % 4;
          const span =
            slot === 0
              ? "md:[grid-column:1/6]"
              : slot === 1
                ? "md:mt-5 md:[grid-column:6/13]"
                : slot === 2
                  ? "md:[grid-column:2/11]"
                  : "md:[grid-column:1/5]";
          const ratio =
            slot === 0
              ? "aspect-[3/4]"
              : slot === 1
                ? "aspect-video"
                : slot === 2
                  ? "aspect-[21/9]"
                  : "aspect-square";

          return (
            <Reveal key={id} index={i} className={`relative ${ratio} ${span} overflow-hidden`}>
              <button
                type="button"
                onClick={() => setOpenIndex(i)}
                className="absolute inset-0 text-left"
                aria-label={`Open photograph ${i + 1} of ${imageIds.length} from ${seriesTitle}`}
              >
                <CloudinaryImage
                  id={id}
                  preset="gallery"
                  alt={`${seriesTitle}, photograph ${i + 1}`}
                  fill
                  loading="lazy"
                  className="object-cover"
                />
              </button>
            </Reveal>
          );
        })}
      </div>

      {openIndex !== null && (
        <Lightbox
          images={imageIds}
          initialIndex={openIndex}
          onClose={() => setOpenIndex(null)}
          altPrefix={seriesTitle}
        />
      )}
    </div>
  );
}
