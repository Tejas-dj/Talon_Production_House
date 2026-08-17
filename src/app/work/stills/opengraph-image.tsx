import { getAllPhotoSeries } from "@/lib/content";
import { cloudinaryUrl } from "@/lib/media/presets";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImageWithPhoto } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Stills — Talon Production House";

// First image of the first series in content/photography.json
// (Coastline Reverie) — a deterministic, content-driven pick rather than a
// subjective "best" call, and stable as series get added/reordered at the
// end of the file.
export default function Image() {
  const [firstSeries] = getAllPhotoSeries();
  const photoUrl = cloudinaryUrl(firstSeries.imageIds[0], "ogImage", 1200);
  return renderOgImageWithPhoto("Stills", photoUrl);
}
