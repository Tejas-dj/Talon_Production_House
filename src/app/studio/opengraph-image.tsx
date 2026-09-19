import { getStudioSpace } from "@/lib/content";
import { cdnImageUrl } from "@/lib/media/presets";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImageWithPhoto } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Studio | Talon Production House";

export default function Image() {
  const studio = getStudioSpace();
  const photoUrl = cdnImageUrl(studio.heroImageId);
  return renderOgImageWithPhoto("Studio", photoUrl);
}
