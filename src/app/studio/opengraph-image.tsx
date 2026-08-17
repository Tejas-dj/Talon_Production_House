import { getStudioSpace } from "@/lib/content";
import { cloudinaryUrl } from "@/lib/media/presets";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImageWithPhoto } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Studio — Talon Production House";

export default function Image() {
  const studio = getStudioSpace();
  const photoUrl = cloudinaryUrl(studio.heroImageId, "ogImage", 1200);
  return renderOgImageWithPhoto("Studio", photoUrl);
}
