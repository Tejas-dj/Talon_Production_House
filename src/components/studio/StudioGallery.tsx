"use client";

import { useState } from "react";
import { CloudinaryImage } from "@/components/media/CloudinaryImage";
import { Lightbox } from "@/components/media/Lightbox";
import { getPhotoAlt } from "@/lib/media/photo-alt-text";
import { Reveal } from "@/components/motion/Reveal";

type StudioGalleryProps = {
  studioName: string;
  imageIds: string[];
};

/**
 * In-grid gallery below the full-bleed lead image (asymmetry rule 3: 2+
 * media items in a section sit inside the grid, offset-narrow, not full
 * bleed). Repeating 3-slot column pattern matches the wireframe's implied
 * 4/5/3 split and stays content-resilient beyond exactly 3 images. Below 3
 * images that rhythm leaves a dead gap (it assumes a full cycle), so 1-2
 * images instead split the row evenly at a portrait aspect ratio — true to
 * the source photos rather than force-cropping them into the wider 4:3 slot.
 * Reuses the Photography Lightbox rather than building a second implementation.
 */
export function StudioGallery({ studioName, imageIds }: StudioGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const total = imageIds.length;

  return (
    <div className="container-site grid grid-cols-2 gap-3 pt-6 pb-6 md:grid-cols-12 md:gap-gutter">
      {imageIds.map((id, i) => {
        let span: string;
        if (total >= 3) {
          const slot = i % 3;
          span =
            slot === 0
              ? "md:[grid-column:1/5]"
              : slot === 1
                ? "md:[grid-column:5/10]"
                : "md:[grid-column:10/13]";
        } else if (total === 2) {
          span = i === 0 ? "md:[grid-column:1/7]" : "md:[grid-column:7/13]";
        } else {
          span = "md:[grid-column:1/13]";
        }
        const aspect = total >= 3 ? "aspect-[4/3]" : "aspect-[3/4]";

        return (
          <Reveal
            key={id}
            index={i}
            className={`relative ${aspect} ${span} overflow-hidden`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              className="absolute inset-0 text-left"
              aria-label={`Open ${studioName} view ${i + 1} of ${imageIds.length}`}
            >
              <CloudinaryImage
                id={id}
                preset={total >= 3 ? "gallery" : "portraitCard"}
                sizes="(min-width: 768px) 50vw, 100vw"
                alt={getPhotoAlt(id) ?? `${studioName}, interior view ${i + 1}`}
                fill
                loading="lazy"
                className="object-cover"
              />
            </button>
          </Reveal>
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
