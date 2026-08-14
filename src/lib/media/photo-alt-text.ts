import photoAltText from "../../../content/photo-alt-text.json";

/**
 * Per-image alt text keyed by Cloudinary public id, filled in batches (see
 * content/alt-text/). Plain JSON import (not content.ts's fs loader) so this
 * is safe to use from Client Components too. Callers fall back to their own
 * generated alt when an id isn't in here yet.
 */
export function getPhotoAlt(id: string): string | undefined {
  return (photoAltText as Record<string, string>)[id];
}
