import photoTitles from "../../../content/photo-titles.json";
import photoDescriptions from "../../../content/photo-descriptions.json";

/**
 * Per-image title/description keyed by R2 object path, filled in batches
 * (see content/seo-import/). Plain JSON import (not content.ts's fs loader)
 * so this is safe to use from Client Components too. Callers fall back to
 * their own generated value when an id isn't in here yet.
 */
export function getPhotoTitle(id: string): string | undefined {
  return (photoTitles as Record<string, string>)[id];
}

export function getPhotoDescription(id: string): string | undefined {
  return (photoDescriptions as Record<string, string>)[id];
}
