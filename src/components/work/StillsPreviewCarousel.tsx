import { CloudinaryImage } from "@/components/media/CloudinaryImage";
import { Marquee } from "@/components/motion/Marquee";

export const STILLS_CAROUSEL_IDS: string[][] = [
  [
    "Faces_In_Frame/Faces_In_Frame_pic_1.webp",
    "Coastline_Reverie/Coastline_Reverie_pic_3.webp",
    "The_Ensemble/The_Ensemble_pic_1.webp",
    "Faces_In_Frame/Faces_In_Frame_pic_2.webp",
    "Behind_The_Hymn/Behind_The_Hymn_pic_1.webp",
  ],
  [
    "Coastline_Reverie/Coastline_Reverie_pic_5.webp",
    "Draped_In_Legacy/Draped_In_Legacy_pic_1.webp",
    "Faces_In_Frame/Faces_In_Frame_pic_7.webp",
    "Coastline_Reverie/Coastline_Reverie_pic_7.webp",
    "The_Ensemble/The_Ensemble_pic_3.webp",
  ],
  [
    "Faces_In_Frame/Faces_In_Frame_pic_9.webp",
    "Behind_The_Hymn/Behind_The_Hymn_pic_2.webp",
    "Coastline_Reverie/Coastline_Reverie_pic_1.webp",
    "Draped_In_Legacy/Draped_In_Legacy_pic_2.webp",
    "Faces_In_Frame/Faces_In_Frame_pic_8.webp",
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
