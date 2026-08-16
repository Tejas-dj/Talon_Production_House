/**
 * Bunny Stream's own auto-generated thumbnail for a video — real and always
 * present the moment a video finishes encoding, unlike a Cloudinary poster
 * (which requires someone to have uploaded a still separately). This pull
 * zone has no resize/Optimizer add-on, so it's always full video resolution
 * — fine for structured-data metadata, too heavy to render directly (see
 * bunnyPosterCloudinaryId for the version actually used on-page).
 */
export function bunnyThumbnailUrl(videoId: string): string | undefined {
  const pullZone = process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE;
  if (!pullZone) return undefined;
  return `https://${pullZone}.b-cdn.net/${videoId}/thumbnail.jpg`;
}

/**
 * Cloudinary public id for a video's synced poster — a copy of Bunny's
 * thumbnail landed in Cloudinary by scripts/sync-video-posters.mjs (run on
 * every production build) so it can be rendered through <CloudinaryImage>
 * with a real responsive srcset, same as a curated `posterImageId`. Used
 * wherever a project has no `posterImageId` yet.
 */
export function bunnyPosterCloudinaryId(videoId: string): string {
  return `talon/video-posters/${videoId}`;
}
