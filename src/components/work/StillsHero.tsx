import { CloudinaryImage } from "@/components/media/CloudinaryImage";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";

const ALT = "Stills photography by Talon Production House";

/* Curated pull from Cloudinary's Talon_Production_House/Curated_Pics folder —
   a fixed hand-picked set (not editorial content), so it lives here rather
   than in content/photography.json (same precedent as ProjectStillsGallery's
   STILLS_CAROUSEL_IDS). One continuous fanned arc: rotation increases and
   rise (lift toward the row's top) grows symmetrically outward-to-inward
   from the centre card, so the row reads as a single hand-arranged sweep.
   Cards overlap via negative margin inside a centred flex row — not
   percentage-based left offsets — so the arc's true visual centre (which
   percentage math got wrong once card width stopped scaling with the
   container) always lands on the container's centre, at any viewport width. */
const ARC = [
  { id: "WhatsApp_Image_2026-08-06_at_19.47.49_xirljp", rotate: -18, rise: 0 },
  { id: "ADJ07054_yply4r_lksuto", rotate: -12, rise: 30 },
  { id: "INDYVARNA_MAY_OUTFIT-48_nblnu5_ez1nea", rotate: -6, rise: 48 },
  { id: "sakshi_pic-03_4_11zon_lcekqh", rotate: 0, rise: 54 },
  { id: "INDYVARNA_MAY_OUTFIT-9_o4h0lg_ow1qrg", rotate: 6, rise: 48 },
  { id: "INDYVARNA_MAY_OUTFIT-38_kklx8c_xsd0g2", rotate: 12, rise: 30 },
  { id: "VInita_Portfolio-7_n4zde7_vdmj6v", rotate: 18, rise: 0 },
];

/* Pure-vw sizing (not a px-heavy clamp) so the arc keeps claiming the same
   share of viewport width at any desktop size, rather than hitting a px cap
   early and leaving dead margin on wider screens. Overlap is derived from the
   resolved card width via calc(), not clamped independently — two separately
   clamped values drift apart at the floor (a fixed-px overlap next to a
   floored width over-shrinks the visible sliver of the outer cards, and at
   768px — a real device width, iPad portrait — it clipped a card fully
   off-screen). Deriving it keeps the ~18% overlap ratio (down from ~28%; less
   of each photo hidden behind its neighbour) exact at every width, including
   the floor and ceiling. */
const CARD_WIDTH = "clamp(190px, 19vw, 420px)";
const CARD_OVERLAP = `calc(0.18 * ${CARD_WIDTH})`;
// Row height derived from the same width, not a flat px guess — a fixed
// height sized for the widest case (420px cards) left ~160px of dead
// headroom above the cards at every narrower width, since the fan is
// bottom-anchored and never actually grew to fill that height.
const ROW_HEIGHT = `calc(${CARD_WIDTH} * 4 / 3 + 70px)`;

const IMG_CLASS =
  "object-cover saturate-[.92] transition-[filter,transform] duration-[240ms] ease-shift group-hover:saturate-100 group-focus-visible:saturate-100";

export function StillsHero() {
  return (
    <section className="relative overflow-hidden pt-6 pb-6">
      <div className="container-site relative z-10 mb-6">
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
        {/* Desktop / tablet: one fanned arc, cards overlapping and rotated
            outward from centre, aligned to a shared bottom baseline. A
            centred flex row (overlap via negative margin) keeps the whole
            arc's visual centre pinned to the container's centre at any
            viewport width — percentage-based left offsets couldn't do that
            once card width stopped scaling with the container. Row height
            tracks the card height (ROW_HEIGHT) so it's never taller than the
            arc actually needs, at any viewport width. */}
        <div
          className="hidden items-end justify-center md:flex"
          style={{ height: ROW_HEIGHT }}
        >
          {ARC.map((img, i) => (
            <div
              key={img.id}
              // Outer: static per-card placement (data-driven, never animated).
              // Inner: the hover lift. Splitting them means the hover
              // transform (a Tailwind class) never has to fight the outer's
              // inline transform for specificity — each element owns one.
              className="group relative shrink-0 hover:z-40"
              style={{
                width: CARD_WIDTH,
                marginLeft: i === 0 ? 0 : `calc(-1 * ${CARD_OVERLAP})`,
                transform: `translateY(-${img.rise}px) rotate(${img.rotate}deg)`,
              }}
            >
              <div className="relative aspect-[3/4] overflow-hidden transition-transform duration-[320ms] ease-shift group-hover:-translate-y-12 group-hover:scale-[1.05]">
                <CloudinaryImage
                  id={img.id}
                  preset="portraitCard"
                  alt={ALT}
                  fill
                  sizes="19vw"
                  className={IMG_CLASS}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: no room to fan seven images edge-to-edge, so it becomes a
            swipeable filmstrip instead of forcing the desktop composition to
            shrink until it's illegible. */}
        <div
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 md:hidden"
          style={{ paddingInline: "var(--margin-outer)" }}
        >
          {ARC.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-[3/4] w-[44%] shrink-0 snap-center overflow-hidden"
            >
              <CloudinaryImage
                id={img.id}
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
