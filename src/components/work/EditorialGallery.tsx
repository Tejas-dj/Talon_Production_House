"use client";

import { useState } from "react";
import { CloudinaryImage } from "@/components/media/CloudinaryImage";
import { Lightbox } from "@/components/media/Lightbox";
import { Reveal } from "@/components/motion/Reveal";

export type ImageEntry = { id: string; w: number; h: number };

type EditorialGalleryProps = {
  images: ImageEntry[];
};

type BlockImage = ImageEntry & { idx: number };

type Block =
  | { type: "anchor"; img: BlockImage }
  | { type: "full"; img: BlockImage }
  | { type: "diptych"; a: BlockImage; b: BlockImage }
  | { type: "trio"; a: BlockImage; b: BlockImage; c: BlockImage }
  | { type: "offset"; img: BlockImage; side: 0 | 1 | 2 };

const BEATS: ("full" | "diptych" | "offset" | "trio")[] = [
  "full",
  "diptych",
  "offset",
  "full",
  "trio",
  "offset",
];

function buildBlocks(images: ImageEntry[]): Block[] {
  if (images.length === 0) return [];
  const blocks: Block[] = [{ type: "anchor", img: { ...images[0], idx: 0 } }];
  let cursor = 1;
  let beat = 0;
  let side: 0 | 1 | 2 = 0;

  while (cursor < images.length) {
    const b = BEATS[beat % BEATS.length];

    if (b === "trio" && cursor + 2 < images.length) {
      blocks.push({
        type: "trio",
        a: { ...images[cursor], idx: cursor },
        b: { ...images[cursor + 1], idx: cursor + 1 },
        c: { ...images[cursor + 2], idx: cursor + 2 },
      });
      cursor += 3;
    } else if (b === "diptych" && cursor + 1 < images.length) {
      blocks.push({
        type: "diptych",
        a: { ...images[cursor], idx: cursor },
        b: { ...images[cursor + 1], idx: cursor + 1 },
      });
      cursor += 2;
    } else if (b === "offset") {
      blocks.push({ type: "offset", img: { ...images[cursor], idx: cursor }, side });
      side = ((side + 1) % 3) as 0 | 1 | 2;
      cursor++;
    } else {
      blocks.push({ type: "full", img: { ...images[cursor], idx: cursor } });
      cursor++;
    }
    beat++;
  }
  return blocks;
}

const MAX_VH = { anchor: 85, full: 75, diptych: 60, trio: 50, offset: 70 };

function cappedWidth(w: number, h: number, maxVh: number): string {
  const ratio = w / h;
  return `min(100%, calc(${maxVh}vh * ${ratio.toFixed(4)}))`;
}

export function EditorialGallery({ images }: EditorialGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const total = images.length;
  if (total === 0) return null;

  const blocks = buildBlocks(images);
  const allIds = images.map((img) => img.id);

  function imageButton(entry: BlockImage, priority?: boolean) {
    return (
      <button
        type="button"
        onClick={() => setOpenIndex(entry.idx)}
        className="absolute inset-0 text-left"
        aria-label={`View photograph ${entry.idx + 1} of ${total}`}
      >
        <CloudinaryImage
          id={entry.id}
          preset={priority ? "hero" : "gallery"}
          alt={`Photograph ${entry.idx + 1}`}
          fill
          loading={priority ? undefined : "lazy"}
          priority={priority}
          className="object-cover"
        />
      </button>
    );
  }

  return (
    <div className="pb-6">
      {blocks.map((block, bIdx) => {
        if (block.type === "anchor") {
          return (
            <Reveal key={bIdx} className="pt-6">
              <div
                className="relative mx-auto overflow-hidden"
                style={{
                  aspectRatio: `${block.img.w} / ${block.img.h}`,
                  width: cappedWidth(block.img.w, block.img.h, MAX_VH.anchor),
                }}
              >
                {imageButton(block.img, true)}
              </div>
            </Reveal>
          );
        }

        if (block.type === "full") {
          return (
            <div key={bIdx} className="container-site pt-7">
              <Reveal>
                <div
                  className="relative mx-auto overflow-hidden"
                  style={{
                    aspectRatio: `${block.img.w} / ${block.img.h}`,
                    width: cappedWidth(block.img.w, block.img.h, MAX_VH.full),
                  }}
                >
                  {imageButton(block.img)}
                </div>
              </Reveal>
            </div>
          );
        }

        if (block.type === "diptych") {
          const rA = block.a.w / block.a.h;
          const rB = block.b.w / block.b.h;
          const sumR = rA + rB;
          return (
            <div key={bIdx} className="container-site pt-7">
              <div
                className="grid grid-cols-1 gap-5 md:gap-gutter md:[grid-template-columns:var(--cols)] mx-auto"
                style={
                  {
                    "--cols": `${rA.toFixed(4)}fr ${rB.toFixed(4)}fr`,
                    width: `min(100%, calc(${MAX_VH.diptych}vh * ${sumR.toFixed(4)}))`,
                  } as React.CSSProperties
                }
              >
                <Reveal
                  index={0}
                  className="relative overflow-hidden"
                  style={{ aspectRatio: `${block.a.w} / ${block.a.h}` }}
                >
                  {imageButton(block.a)}
                </Reveal>
                <Reveal
                  index={1}
                  className="relative overflow-hidden"
                  style={{ aspectRatio: `${block.b.w} / ${block.b.h}` }}
                >
                  {imageButton(block.b)}
                </Reveal>
              </div>
            </div>
          );
        }

        if (block.type === "trio") {
          const rA = block.a.w / block.a.h;
          const rB = block.b.w / block.b.h;
          const rC = block.c.w / block.c.h;
          const sumR = rA + rB + rC;
          return (
            <div key={bIdx} className="container-site pt-7">
              <div
                className="grid grid-cols-1 gap-5 md:gap-gutter md:[grid-template-columns:var(--cols)] mx-auto"
                style={
                  {
                    "--cols": `${rA.toFixed(4)}fr ${rB.toFixed(4)}fr ${rC.toFixed(4)}fr`,
                    width: `min(100%, calc(${MAX_VH.trio}vh * ${sumR.toFixed(4)}))`,
                  } as React.CSSProperties
                }
              >
                <Reveal
                  index={0}
                  className="relative overflow-hidden"
                  style={{ aspectRatio: `${block.a.w} / ${block.a.h}` }}
                >
                  {imageButton(block.a)}
                </Reveal>
                <Reveal
                  index={1}
                  className="relative overflow-hidden"
                  style={{ aspectRatio: `${block.b.w} / ${block.b.h}` }}
                >
                  {imageButton(block.b)}
                </Reveal>
                <Reveal
                  index={2}
                  className="relative overflow-hidden"
                  style={{ aspectRatio: `${block.c.w} / ${block.c.h}` }}
                >
                  {imageButton(block.c)}
                </Reveal>
              </div>
            </div>
          );
        }

        if (block.type === "offset") {
          const align =
            block.side === 0 ? "mr-auto" : block.side === 1 ? "mx-auto" : "ml-auto";
          return (
            <div key={bIdx} className="container-site pt-7">
              <Reveal>
                <div
                  className={`relative overflow-hidden max-w-full md:max-w-[60%] ${align}`}
                  style={{
                    aspectRatio: `${block.img.w} / ${block.img.h}`,
                    width: cappedWidth(block.img.w, block.img.h, MAX_VH.offset),
                  }}
                >
                  {imageButton(block.img)}
                </div>
              </Reveal>
            </div>
          );
        }

        return null;
      })}

      {openIndex !== null && (
        <Lightbox
          images={allIds}
          initialIndex={openIndex}
          onClose={() => setOpenIndex(null)}
          altPrefix="Photography"
        />
      )}
    </div>
  );
}
