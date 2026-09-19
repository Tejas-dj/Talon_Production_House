import type { MetadataRoute } from "next";
import { getAllPhotoSeries, getAllProjects, getStudioSpace } from "@/lib/content";
import type { PhotoSeries } from "@/lib/content-types";
import { bunnyThumbnailUrl } from "@/lib/media/bunny";
import { cdnImageUrl } from "@/lib/media/presets";
import { SITE_URL } from "@/lib/site";
import { LEADERS } from "./team/page";

/* /styleguide is deliberately absent: internal reference, not public surface. */

/* Google only reads <image:loc> now (caption/title/geo_location/license were
   dropped from its image-sitemap support), so every entry below is a bare
   URL — the same full-resolution R2 object real visitors already load when
   they open a still, not a thumbnail invented just for the sitemap. */

function stillsImages(): string[] {
  return getAllPhotoSeries().flatMap((series) =>
    series.imageIds.map((id) => cdnImageUrl(id)),
  );
}

/* Same image URLs as stillsImages above, deliberately — reusing the identical
   CDN URL on both /work/stills and a series' own /work/stills/[slug]
   entry is the pattern Google's own image-SEO guidance recommends (consistent
   URL per image so it can be cached/reused), not a duplicate-content risk. */
function seriesImages(series: PhotoSeries): string[] {
  return series.imageIds.map((id) => cdnImageUrl(id));
}

function studioImages(): string[] {
  const studio = getStudioSpace();
  return [studio.heroImageId, ...studio.galleryImageIds].map((id) =>
    cdnImageUrl(id),
  );
}

function teamImages(): string[] {
  const portraitIds = LEADERS.map((leader) => leader.portraitId).filter(
    (id): id is string => Boolean(id),
  );
  return portraitIds.map((id) => cdnImageUrl(id));
}

/* Same fallback ProjectGrid/BunnyPlayer use for the on-page poster: a curated
   posterImageId if one exists, else Bunny's own auto-generated thumbnail —
   mirrors bunnyThumbnailUrl's own graceful-omission pattern rather than
   throwing, same as buildVideoObjectSchema in structured-data.ts. */
function projectImage(project: { posterImageId?: string; bunnyVideoId: string }): string {
  return project.posterImageId
    ? cdnImageUrl(project.posterImageId)
    : (bunnyThumbnailUrl(project.bunnyVideoId) ?? "");
}

function projectLastModified(p: { releaseDate?: string; year: number }): Date {
  if (p.releaseDate) {
    const parsed = new Date(p.releaseDate);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return new Date(`${p.year}-01-01`);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const imagesByPath: Record<string, string[]> = {
    "/work/stills": stillsImages(),
    "/studio": studioImages(),
    "/team": teamImages(),
  };

  const now = new Date();

  const staticPaths = [
    "",
    "/work/motion",
    "/work/stills",
    "/studio",
    "/team",
    "/contact",
    "/privacy",
    "/terms",
  ].map((path) => {
    const images = imagesByPath[path];
    return {
      url: `${SITE_URL}${path}`,
      lastModified: now,
      ...(images?.length ? { images } : {}),
    };
  });

  const projectPaths = getAllProjects().map((p) => ({
    url: `${SITE_URL}/work/motion/${p.slug}`,
    lastModified: projectLastModified(p),
    images: [projectImage(p)],
  }));

  const photoSeriesPaths = getAllPhotoSeries().map((s) => ({
    url: `${SITE_URL}/work/stills/${s.slug}`,
    images: seriesImages(s),
  }));

  return [...staticPaths, ...projectPaths, ...photoSeriesPaths];
}
