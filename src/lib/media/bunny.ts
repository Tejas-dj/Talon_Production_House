/**
 * Bunny Stream's own auto-generated thumbnail for a video — real and always
 * present the moment a video finishes encoding, unlike a Cloudinary poster
 * (which requires someone to have uploaded a still separately). Used as the
 * fallback poster wherever a project has no `posterImageId` yet.
 */
export function bunnyThumbnailUrl(videoId: string): string | undefined {
  const pullZone = process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE;
  if (!pullZone) return undefined;
  return `https://${pullZone}.b-cdn.net/${videoId}/thumbnail.jpg`;
}
