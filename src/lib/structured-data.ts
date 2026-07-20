/**
 * JSON-LD builders — the single place structured data gets assembled, same
 * "one place builds this" convention as media/presets.ts and site.ts.
 * Callers embed the result via
 * <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
 */

import { getStudioSpace } from "./content";
import type { VideoProject } from "./content-types";
import { bunnyThumbnailUrl } from "./media/bunny";
import { cloudinaryUrl } from "./media/presets";
import { CONTACT_LINKS, SITE_URL } from "./site";

/** "09:45" -> "PT9M45S", "01:11:21" -> "PT1H11M21S". */
export function runtimeToIso8601(runtime: string): string {
  const parts = runtime.split(":").map(Number);
  const [hours, minutes, seconds] =
    parts.length === 3 ? parts : [0, parts[0] ?? 0, parts[1] ?? 0];
  let duration = "PT";
  if (hours) duration += `${hours}H`;
  if (minutes) duration += `${minutes}M`;
  duration += `${seconds}S`;
  return duration;
}

/**
 * LocalBusiness for the Studio page. No street address/pincode exists in
 * content — locality/region/country only, rather than inventing one. No
 * openingHoursSpecification either, for the same reason: no real hours
 * exist anywhere in content or site.ts.
 */
export function buildLocalBusinessSchema() {
  const studio = getStudioSpace();
  const phone = CONTACT_LINKS.find((c) => c.label === "Phone");

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Talon Production House",
    url: SITE_URL,
    image: cloudinaryUrl(studio.heroImageId, "hero", 1200),
    telephone: phone?.handle,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bengaluru",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
  };
}

/**
 * VideoObject for a project detail page. thumbnailUrl mirrors the same
 * posterImageId -> Cloudinary, else Bunny-thumbnail fallback already used by
 * the page's own generateMetadata. contentUrl/embedUrl are only included
 * when the Bunny pull zone is configured — mirrors bunnyThumbnailUrl's own
 * graceful-omission pattern rather than throwing.
 */
export function buildVideoObjectSchema(project: VideoProject) {
  const thumbnailUrl = project.posterImageId
    ? cloudinaryUrl(project.posterImageId, "ogImage", 1200)
    : (bunnyThumbnailUrl(project.bunnyVideoId) ?? "");

  const pullZone = process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE;
  const playbackUrl = pullZone
    ? `https://${pullZone}.b-cdn.net/${project.bunnyVideoId}/playlist.m3u8`
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: project.title,
    description: project.synopsis,
    thumbnailUrl,
    uploadDate: `${project.year}-01-01`,
    duration: runtimeToIso8601(project.runtime),
    ...(playbackUrl ? { contentUrl: playbackUrl, embedUrl: playbackUrl } : {}),
  };
}
