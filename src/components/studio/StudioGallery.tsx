"use client";

import { useState } from "react";
import { CloudinaryImage } from "@/components/media/CloudinaryImage";
import { Lightbox } from "@/components/media/Lightbox";

type StudioGalleryProps = {
  studioName: string;
  imageIds: string[];
};

/**
 * In-grid gallery below the full-bleed lead image (asymmetry rule 3: 2+
 * media items in a section sit inside the grid, offset-narrow, not full
 * bleed). Repeating 3-slot column pattern matches the wireframe's implied
 * 4/5/3 split and stays content-resilient beyond exactly 3 images. Reuses
 * the Photography Lightbox rather than building a second implementation.
 */
export function StudioGallery({ studioName, imageIds }: StudioGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="container-site grid grid-cols-2 gap-3 pt-6 pb-6 md:grid-cols-12 md:gap-gutter">
      {imageIds.map((id, i) => {
        const slot = i % 3;
        const span =
          slot === 0
            ? "md:[grid-column:1/5]"
            : slot === 1
              ? "md:[grid-column:5/10]"
              : "md:[grid-column:10/13]";

        return (
          <button
            key={id}
            type="button"
            onClick={() => setOpenIndex(i)}
            className={`relative aspect-[4/3] ${span} overflow-hidden text-left`}
            aria-label={`Open ${studioName} view ${i + 1} of ${imageIds.length}`}
          >
            <CloudinaryImage
              id={id}
              preset="gallery"
              alt={`${studioName}, interior view ${i + 1}`}
              fill
              loading="lazy"
              className="object-cover"
            />
          </button>
        );
      })}

      {openIndex !== null && (
        <Lightbox
          images={imageIds}
          initialIndex={openIndex}
          onClose={() => setOpenIndex(null)}
          altPrefix={studioName}
        />
      )}
    </div>
  );
}
