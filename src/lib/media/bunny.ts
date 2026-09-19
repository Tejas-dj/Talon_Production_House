/**
 * Bunny Stream's own auto-generated thumbnail for a video — real and always
 * present the moment a video finishes encoding. This pull zone has no
 * resize/Optimizer add-on, so it's always full video resolution — fine for
 * structured-data metadata, too heavy to render directly.
 */
export function bunnyThumbnailUrl(videoId: string): string | undefined {
  const pullZone = process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE;
  if (!pullZone) return undefined;
  return `https://${pullZone}.b-cdn.net/${videoId}/thumbnail.jpg`;
}
