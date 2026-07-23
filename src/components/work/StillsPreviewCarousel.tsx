import { CloudinaryImage } from "@/components/media/CloudinaryImage";
import { Marquee } from "@/components/motion/Marquee";

export const STILLS_CAROUSEL_IDS: string[][] = [
  [
    "VInita_Portfolio-7_n4zde7",
    "IMG_9807_cmlxe0",
    "shradha_team-15_m65ytx",
    "VInita_Portfolio-2_tpuqzu",
    "shradha_team-04_oqfoyr",
  ],
  [
    "INDYVARNA_MAY_OUTFIT-35_uitdki",
    "INDYVARNA_MAY_OUTFIT-32_e0so2k",
    "INDYVARNA_MAY_OUTFIT-3_iebzbv",
    "INDYVARNA_MAY_OUTFIT-29_qbas1k",
    "INDYVARNA_MAY_OUTFIT-26_c3pgbu",
  ],
  [
    "DSC01254_s11rej",
    "DSC00950_ddrpto",
    "BEACH_1-19_hxysdl",
    "BEACH_1-15_xffqol",
    "BEACH_1-12_jaxcxw",
  ],
];

const SPEEDS = [65, 50, 80];

export function StillsPreviewCarousel() {
  return (
    <div className="grid h-full grid-cols-3 gap-2 p-2" aria-hidden="true">
      {STILLS_CAROUSEL_IDS.map((ids, col) => (
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
