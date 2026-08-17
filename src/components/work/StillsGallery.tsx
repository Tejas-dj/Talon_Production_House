"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CloudinaryImage } from "@/components/media/CloudinaryImage";
import { Lightbox } from "@/components/media/Lightbox";
import { getPhotoAlt } from "@/lib/media/photo-alt-text";
import { Reveal } from "@/components/motion/Reveal";
import { SectionNavRail } from "@/components/work/SectionNavRail";

/** How many series mount at a time — first batch on load, then one more
    batch each time the reader scrolls into the second-to-last loaded one,
    so the next batch is already in the DOM well before they'd notice a gap. */
const BATCH_SIZE = 3;

export type StillsImage = { id: string; w: number; h: number };

export type StillsSection = {
  slug: string;
  title: string;
  statement: string;
  images: StillsImage[];
};

type Props = {
  sections: StillsSection[];
  /** Off for a single-series detail page, whose own page header already
      shows the title/statement — avoids rendering it a second time. */
  showSectionHeader?: boolean;
  /** Lightbox aria-label / alt-text prefix. Defaults to "Stills" for the
      multi-section page; detail pages pass their series title. */
  altPrefix?: string;
};

const SIZE_SEQ = [4, 3, 7, 3, 5, 6, 3, 4, 3, 7, 5, 3, 6, 3, 4, 3, 5, 3, 8, 4];

function getColSpan(img: StillsImage, seed: number): number {
  const ratio = img.w / img.h;
  let s = SIZE_SEQ[seed % SIZE_SEQ.length];
  if (ratio < 0.8) s = Math.min(s, 5);
  else if (ratio > 1.3) s = Math.max(s, 4);
  return Math.max(3, Math.min(s, 9));
}

function rowSpanFor(colSpan: number, img: StillsImage): number {
  return Math.max(2, Math.round(colSpan * (img.h / img.w)));
}

function scaleSpan(lgSpan: number, fromCols: number, toCols: number): number {
  return Math.max(2, Math.min(Math.round(lgSpan * (toCols / fromCols)), toCols - 1));
}

export function StillsGallery({ sections, showSectionHeader = true, altPrefix = "Stills" }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(() => Math.min(BATCH_SIZE, sections.length));
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);

  const allIds = sections.flatMap((s) => s.images.map((img) => img.id));
  const visibleSections = sections.slice(0, visibleCount);
  let globalIdx = 0;

  // Watches the second-to-last mounted section — a full section of scroll
  // distance ahead of the true edge — and grows the batch when it's near
  // the viewport, so the next section is already in the DOM by the time the
  // reader would otherwise hit a gap.
  const loadMoreTriggerIndex = visibleCount - 2;
  useEffect(() => {
    if (visibleCount >= sections.length) return;
    const el = loadMoreTriggerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisibleCount((count) => Math.min(count + BATCH_SIZE, sections.length));
        }
      },
      { rootMargin: "0px 0px 800px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [visibleCount, sections.length]);

  function revealThrough(slug: string) {
    const targetIdx = sections.findIndex((s) => s.slug === slug);
    if (targetIdx === -1) return;
    setVisibleCount((count) => Math.max(count, targetIdx + 1));
  }

  return (
    <div>
      <SectionNavRail
        sections={sections.map((s) => ({ slug: s.slug, title: s.title }))}
        onBeforeNavigate={revealThrough}
      />

      {visibleSections.map((section, sIdx) => {
        const isOdd = sIdx % 2 !== 0;

        return (
          <div
            key={section.title}
            id={section.slug}
            ref={sIdx === loadMoreTriggerIndex ? loadMoreTriggerRef : undefined}
            style={{
              marginTop: sIdx === 0 ? "3rem" : "6rem",
              scrollMarginTop: "calc(var(--header-height) + 24px)",
            }}
          >
            {showSectionHeader && (
              <div className={`px-5 md:px-10 mb-6 md:mb-10 ${isOdd ? "text-right" : ""}`}>
                <Reveal>
                  <h2 className="type-headline md:whitespace-nowrap">
                    {/* Every series' own page (SEO-only surface, not in primary
                        nav) is reachable from exactly here — clicking its
                        heading on this page. */}
                    <Link href={`/work/stills/${section.slug}`} className="link-draw">
                      {section.title}
                    </Link>
                  </h2>
                </Reveal>
                <Reveal index={1}>
                  <p
                    className="type-body text-muted mt-2"
                    style={{
                      maxWidth: "44ch",
                      marginInlineStart: isOdd ? "auto" : undefined,
                    }}
                  >
                    {section.statement}
                  </p>
                </Reveal>
              </div>
            )}

            <div className="collage-grid">
              {section.images.map((img, iIdx) => {
                const thisGlobalIdx = globalIdx++;
                const lgCol = getColSpan(img, thisGlobalIdx);
                const lgRow = rowSpanFor(lgCol, img);
                const mdCol = scaleSpan(lgCol, 36, 20);
                const mdRow = rowSpanFor(mdCol, img);
                const smCol = scaleSpan(lgCol, 36, 12);
                const smRow = rowSpanFor(smCol, img);

                return (
                  <button
                    key={img.id}
                    type="button"
                    onClick={() => setOpenIndex(thisGlobalIdx)}
                    className="collage-item relative overflow-hidden"
                    style={
                      {
                        "--lg-col": lgCol,
                        "--lg-row": lgRow,
                        "--md-col": mdCol,
                        "--md-row": mdRow,
                        "--sm-col": smCol,
                        "--sm-row": smRow,
                      } as React.CSSProperties
                    }
                    aria-label={`View photograph ${thisGlobalIdx + 1} of ${allIds.length}`}
                  >
                    <CloudinaryImage
                      id={img.id}
                      preset="gallery"
                      alt={getPhotoAlt(img.id) ?? `${section.title}, photograph ${iIdx + 1}`}
                      fill
                      loading={thisGlobalIdx < 8 ? undefined : "lazy"}
                      preload={thisGlobalIdx < 4}
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {openIndex !== null && (
        <Lightbox
          images={allIds}
          initialIndex={openIndex}
          onClose={() => setOpenIndex(null)}
          altPrefix={altPrefix}
        />
      )}
    </div>
  );
}
