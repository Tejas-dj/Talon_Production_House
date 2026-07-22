import { CloudinaryImage } from "@/components/media/CloudinaryImage";
import { Marquee } from "@/components/motion/Marquee";

/* PLACEHOLDER curation: a spread of existing series images, forced to a
   portrait crop via the "portraitCard" preset regardless of source
   orientation (no orientation metadata exists in content/photography.json
   to filter by) — swap for a hand-picked portrait set later. */
const COLUMNS: string[][] = [
  [
    "VInita_Portfolio-7_rb9miz",
    "IMG_9807_wrnsba",
    "shradha_team-15_jsvin2",
    "VInita_Portfolio-2_ugewxw",
    "shradha_team-04_qz0cib",
  ],
  [
    "INDYVARNA_MAY_OUTFIT-35_hdrvqn",
    "INDYVARNA_MAY_OUTFIT-32_t267zb",
    "INDYVARNA_MAY_OUTFIT-3_cmjnvr",
    "INDYVARNA_MAY_OUTFIT-29_wza4jx",
    "INDYVARNA_MAY_OUTFIT-26_ymtouc",
  ],
  [
    "DSC01254_mvwkgx",
    "DSC00950_sh6vfq",
    "BEACH_1-19_kppm1e",
    "BEACH_1-15_oytack",
    "BEACH_1-12_tslzqz",
  ],
];

const SPEEDS = [65, 50, 80];

export function StillsPreviewCarousel() {
  return (
    <div className="grid h-full grid-cols-3 gap-2 p-2" aria-hidden="true">
      {COLUMNS.map((ids, col) => (
        <Marquee
          key={col}
          direction="vertical"
          reverse={col % 2 === 1}
          speed={SPEEDS[col]}
          pauseOnHover={false}
          className="h-full"
        >
          <div className="flex flex-col gap-2">
            {ids.map((id) => (
              <div key={id} className="relative aspect-[3/4] w-full overflow-hidden">
                <CloudinaryImage
                  id={id}
                  preset="portraitCard"
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </Marquee>
      ))}
    </div>
  );
}
