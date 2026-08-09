import { CloudinaryImage } from "@/components/media/CloudinaryImage";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";

const ALT = "Stills photography by Talon Production House";

/* Curated pull from Cloudinary's Talon_Production_House/Curated_Pics folder —
   a fixed hand-picked set (not editorial content), so it lives here rather
   than in content/photography.json (same precedent as ProjectStillsGallery's
   STILLS_CAROUSEL_IDS). Bookends flank the fan at the viewport edges; the fan
   cards share one width (so the row's total width stays predictable across
   breakpoints) and vary only rotation/lift, for an irregular, hand-arranged
   read rather than a uniform grid. */
const BOOKEND_LEFT = "WhatsApp_Image_2026-08-06_at_19.47.49_xirljp";
const BOOKEND_RIGHT = "VInita_Portfolio-7_n4zde7_vdmj6v";

const FAN = [
  { id: "ADJ07054_yply4r_lksuto", lift: 14, rotate: -7 },
  { id: "INDYVARNA_MAY_OUTFIT-48_nblnu5_ez1nea", lift: -4, rotate: -3 },
  { id: "ADJ06996_l13ksn_mazlaa", lift: -18, rotate: 0 },
  { id: "INDYVARNA_MAY_OUTFIT-9_o4h0lg_ow1qrg", lift: 0, rotate: 4 },
  { id: "INDYVARNA_MAY_OUTFIT-38_kklx8c_xsd0g2", lift: 10, rotate: 8 },
];

const ALL_IDS = [BOOKEND_LEFT, ...FAN.map((f) => f.id), BOOKEND_RIGHT];

const IMG_CLASS =
  "object-cover saturate-[.92] transition-[filter,transform] duration-[240ms] ease-shift group-hover:scale-[1.04] group-hover:saturate-100 group-focus-visible:scale-[1.04] group-focus-visible:saturate-100";

export function StillsHero() {
  return (
    <section className="relative overflow-hidden pt-8 pb-6">
      <div className="container-site relative z-10 mb-6 md:mb-7">
        <p className="type-meta text-muted mb-3">Photography — Bengaluru</p>
        <SplitText as="h1" className="type-display max-w-[16ch]">
          Stills
        </SplitText>
        <Reveal index={1}>
          <p className="type-subhead text-muted mt-4 max-w-[46ch]">
            Portraits, editorial, and available light — selected frames from the studio&apos;s stills work.
          </p>
        </Reveal>
      </div>

      <Reveal index={2}>
        {/* Desktop / tablet: bookends at the viewport edges, a hand-fanned row between them */}
        <div className="relative hidden h-[38vh] max-h-[440px] min-h-[280px] md:block">
          <div className="group absolute inset-y-0 left-0 w-[11%] overflow-hidden lg:w-[10%]">
            <CloudinaryImage
              id={BOOKEND_LEFT}
              preset="portraitCard"
              alt={ALT}
              fill
              sizes="11vw"
              className={IMG_CLASS}
            />
          </div>

          <div className="absolute inset-0 z-10 flex items-center justify-center gap-3 px-[13%] lg:gap-4 lg:px-[12%]">
            {FAN.map((img) => (
              <div
                key={img.id}
                className="group relative aspect-[3/4] w-[13%] shrink-0 overflow-hidden lg:w-[12%]"
                style={{ transform: `rotate(${img.rotate}deg) translateY(${img.lift}px)` }}
              >
                <CloudinaryImage
                  id={img.id}
                  preset="portraitCard"
                  alt={ALT}
                  fill
                  sizes="13vw"
                  className={IMG_CLASS}
                />
              </div>
            ))}
          </div>

          <div className="group absolute inset-y-0 right-0 w-[11%] overflow-hidden lg:w-[10%]">
            <CloudinaryImage
              id={BOOKEND_RIGHT}
              preset="portraitCard"
              alt={ALT}
              fill
              sizes="11vw"
              className={IMG_CLASS}
            />
          </div>
        </div>

        {/* Mobile: no room to fan seven images edge-to-edge, so it becomes a
            swipeable filmstrip instead of forcing the desktop composition to
            shrink until it's illegible. */}
        <div
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 md:hidden"
          style={{ paddingInline: "var(--margin-outer)" }}
        >
          {ALL_IDS.map((id) => (
            <div
              key={id}
              className="group relative aspect-[3/4] w-[44%] shrink-0 snap-center overflow-hidden"
            >
              <CloudinaryImage
                id={id}
                preset="portraitCard"
                alt={ALT}
                fill
                sizes="44vw"
                className={IMG_CLASS}
              />
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
