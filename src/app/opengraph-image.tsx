import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og-image";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Talon Production House — video production, photography, and studio rental in Bengaluru";

export default function Image() {
  return renderOgImage("Production House / Bengaluru");
}
