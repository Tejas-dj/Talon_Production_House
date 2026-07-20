"use client";

import { useRef, useState } from "react";
import { CloudinaryImage } from "@/components/media/CloudinaryImage";
import { useDialogBehavior } from "@/lib/use-dialog";

type ProjectStillsGalleryProps = {
  projectTitle: string;
  stillImageIds: string[];
};

/**
 * Production stills grid + a simple modal overlay (not the full Photography
 * Lightbox — the brief explicitly says a plain overlay is sufficient here).
 * Repeating 3-item asymmetric pattern (Bible §6.4 rule 4 / rule 3's
 * offset-narrow multi-media guidance) so any still count stays content-
 * resilient without per-count logic.
 */
export function ProjectStillsGallery({ projectTitle, stillImageIds }: ProjectStillsGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const open = openIndex !== null;

  useDialogBehavior({ open, onClose: () => setOpenIndex(null), containerRef: dialogRef });

  return (
    <div>
      <h2 className="type-meta text-muted mb-3">Stills</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-gutter">
        {stillImageIds.map((id, i) => {
          const slot = i % 3;
          const span =
            slot === 0
              ? "md:[grid-column:1/8]"
              : slot === 1
                ? "md:mt-5 md:[grid-column:8/13]"
                : "md:[grid-column:2/11]";
          const ratio = slot === 1 ? "aspect-[4/3]" : "aspect-video";

          return (
            <button
              key={id}
              type="button"
              onClick={() => setOpenIndex(i)}
              className={`relative ${ratio} ${span} overflow-hidden text-left`}
              aria-label={`Open still ${i + 1} of ${stillImageIds.length} from ${projectTitle}`}
            >
              <CloudinaryImage
                id={id}
                preset="gallery"
                alt={`${projectTitle} — production still ${i + 1}`}
                fill
                loading="lazy"
                className="object-cover"
              />
            </button>
          );
        })}
      </div>

      {open && openIndex !== null && (
        <div
          ref={dialogRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-scrim p-4 md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={`${projectTitle} — still ${openIndex + 1} of ${stillImageIds.length}`}
        >
          <div className="relative max-h-[85vh] max-w-full">
            <CloudinaryImage
              id={stillImageIds[openIndex]}
              preset="lightbox"
              alt={`${projectTitle} — production still ${openIndex + 1}, enlarged`}
              width={1600}
              height={1000}
              className="max-h-[85vh] w-auto max-w-[90vw] object-contain"
            />
          </div>
          <button
            type="button"
            onClick={() => setOpenIndex(null)}
            className="btn type-meta absolute top-4 right-4 px-4 py-2 md:top-8 md:right-8"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
