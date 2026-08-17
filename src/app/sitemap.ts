import type { MetadataRoute } from "next";
import { getAllPhotoSeries, getAllProjects, getStudioSpace } from "@/lib/content";
import type { PhotoSeries } from "@/lib/content-types";
import { bunnyPosterCloudinaryId } from "@/lib/media/bunny";
import { cloudinaryUrl } from "@/lib/media/presets";
import { SITE_URL } from "@/lib/site";
import { LEADERS } from "./team/page";

/* /styleguide is deliberately absent: internal reference, not public surface. */

/* Google only reads <image:loc> now (caption/title/geo_location/license were
   dropped from its image-sitemap support), so every entry below is a bare
   URL. 1600 is the Lightbox preset's own width ceiling — the same
   full-resolution file real visitors already load when they open a still,
   not a thumbnail invented just for the sitemap. */
const IMAGE_WIDTH = 1600;

function stillsImages(): string[] {
  return getAllPhotoSeries().flatMap((series) =>
    series.imageIds.map((id) => cloudinaryUrl(id, "lightbox", IMAGE_WIDTH)),
  );
}

/* Same image URLs as stillsImages above, deliberately — reusing the identical
   Cloudinary URL on both /work/stills and a series' own /work/stills/[slug]
   entry is the pattern Google's own image-SEO guidance recommends (consistent
   URL per image so it can be cached/reused), not a duplicate-content risk. */
function seriesImages(series: PhotoSeries): string[] {
  return series.imageIds.map((id) => cloudinaryUrl(id, "lightbox", IMAGE_WIDTH));
}

function studioImages(): string[] {
  const studio = getStudioSpace();
  return [studio.heroImageId, ...studio.galleryImageIds].map((id) =>
    cloudinaryUrl(id, "hero", IMAGE_WIDTH),
  );
}

function teamImages(): string[] {
  const portraitIds = LEADERS.map((leader) => leader.portraitId).filter(
    (id): id is string => Boolean(id),
  );
  return portraitIds.map((id) => cloudinaryUrl(id, "portraitCard", IMAGE_WIDTH));
}

/* Same fallback ProjectGrid/BunnyPlayer use for the on-page poster: a curated
   posterImageId if one exists, else the Cloudinary copy of Bunny's
   auto-generated thumbnail that scripts/sync-video-posters.mjs lands on every
   build — so this always resolves to a real, already-rendered image. */
function projectImage(project: { posterImageId?: string; bunnyVideoId: string }): string {
  const posterId = project.posterImageId ?? bunnyPosterCloudinaryId(project.bunnyVideoId);
  return cloudinaryUrl(posterId, "poster", IMAGE_WIDTH);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const imagesByPath: Record<string, string[]> = {
    "/work/stills": stillsImages(),
    "/studio": studioImages(),
    "/team": teamImages(),
  };

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
    return { url: `${SITE_URL}${path}`, ...(images?.length ? { images } : {}) };
  });
  const projectPaths = getAllProjects().map((p) => ({
    url: `${SITE_URL}/work/motion/${p.slug}`,
    images: [projectImage(p)],
  }));

  const photoSeriesPaths = getAllPhotoSeries().map((s) => ({
    url: `${SITE_URL}/work/stills/${s.slug}`,
    images: seriesImages(s),
  }));

  return [...staticPaths, ...projectPaths, ...photoSeriesPaths];
}
