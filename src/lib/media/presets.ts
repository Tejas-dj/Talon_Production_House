/**
 * Image presets — the single place image URLs/sizes are composed from.
 * Components request a preset by name; nobody hand-builds a transform
 * string. R2 serves pre-optimized images directly (no on-the-fly
 * transforms), so presets now hold only the `sizes` attribute paired with
 * next/image for responsive behavior.
 */

import { r2Url } from "@/lib/r2";

export type ImagePreset = {
  /** Sizes attribute to pair with next/image, informational for callers */
  sizes?: string;
};

export const IMAGE_PRESETS = {
  /** Video index / home teaser thumbnails: wide crop, faces/subject-aware */
  thumbnail: {
    sizes: "(min-width: 1120px) 50vw, 100vw",
  },
  /** Project detail stills and photography grid images */
  gallery: {
    sizes: "(min-width: 768px) 50vw, 100vw",
  },
  /** Full-bleed hero / studio lead image */
  hero: {
    sizes: "100vw",
  },
  /** Bunny/video poster frames — mobile sizes halved because the 16:9
      landscape poster in a portrait viewport is object-cover'd with ~3.8x
      upscaling regardless; 640px vs 1080px is invisible behind the scrim,
      but ~50% fewer bytes on throttled 4G. */
  poster: {
    sizes: "(max-width: 768px) 50vw, 100vw",
  },
  /** Lightbox: near-original quality, capped width for bandwidth. The image
      sits in a box bounded by max-h-[80vh]/max-w-[85vw] (object-contain), so
      it's never actually 100vw — 1882px is where 85vw alone would already
      exceed the 1600px cap. */
  lightbox: {
    sizes: "(min-width: 1882px) 1600px, 85vw",
  },
  /** Forced portrait crop (matches the aspect-[3/4] slot it's used in)
      regardless of source orientation — Work overlay Stills preview carousel,
      StillsHero's curated fan, StudioGallery's 1-2 image layout. */
  portraitCard: {
    sizes: "33vw",
  },
  /** Open Graph / Twitter card crop for project detail pages: fixed 1200x630 */
  ogImage: {
    sizes: "1200px",
  },
  /** Home client-logo marquee: uncropped marks (no fixed aspect — logos range
      square to wide wordmarks), row height fixed at h-7 (104px) across all
      breakpoints. Each <CloudinaryImage> instance is given its own real
      per-logo `width` (content/logo-dimensions.json), so this preset
      deliberately omits `sizes`: per Next's image docs, when `sizes` is
      absent and a numeric `width` is passed, next/image treats the image as
      fixed-size and emits a plain 1x/2x srcset sized off that width, instead
      of the full viewport-scale `w`-descriptor srcset `sizes` triggers (which
      would let the browser pick a much larger source than any logo actually
      needs — that's what caused Skills Beyond Education, displayed at
      ~101px, to fetch a 640px asset). */
  clientLogo: {
    sizes: undefined,
  },
} as const satisfies Record<string, ImagePreset>;

export type ImagePresetName = keyof typeof IMAGE_PRESETS;

/**
 * Builds a full R2 CDN URL for an object path. For one-off use outside
 * <CloudinaryImage> (e.g. a video poster URL handed to Bunny, or an Open
 * Graph image); components rendering an actual <img>/<Image> should prefer
 * <CloudinaryImage> so next/image still gets a responsive srcset.
 */
export function cdnImageUrl(r2Path: string): string {
  return r2Url(r2Path);
}
