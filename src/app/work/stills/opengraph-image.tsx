import { getAllPhotoSeries } from "@/lib/content";
import { cdnImageUrl } from "@/lib/media/presets";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImageWithPhoto } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Stills | Talon Production House";

// First image of the first series in content/photography.json
// (Draped in Legacy) — a deterministic, content-driven pick rather than a
// subjective "best" call.
export default function Image() {
  const [firstSeries] = getAllPhotoSeries();
  const photoUrl = cdnImageUrl(firstSeries.imageIds[0]);
  return renderOgImageWithPhoto("Stills", photoUrl);
}
