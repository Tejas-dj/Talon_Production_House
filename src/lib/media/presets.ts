/**
 * Cloudinary transform presets — the single place Phase 3 composes an image
 * URL from. Components request a preset by name; nobody hand-builds a
 * transformation string. Presets hold only crop/gravity/aspect-ratio
 * geometry; quality, format, and width are always appended once by the
 * caller (cloudinaryUrl / CloudinaryImage's loader) so they're never
 * duplicated and width can stay dynamic for next/image's responsive srcset.
 */

export type CloudinaryPreset = {
  /** Cloudinary geometry transform, e.g. "c_fill,g_auto,ar_16:9" */
  transform: string;
  /** Sizes attribute to pair with next/image, informational for callers */
  sizes?: string;
};

export const CLOUDINARY_PRESETS = {
  /** Video index / home teaser thumbnails: wide crop, faces/subject-aware */
  thumbnail: {
    transform: "c_fill,g_auto,ar_16:9",
    sizes: "(min-width: 1120px) 50vw, 100vw",
  },
  /** Project detail stills and photography grid images */
  gallery: {
    transform: "c_fill,g_auto",
    sizes: "(min-width: 768px) 50vw, 100vw",
  },
  /** Full-bleed hero / studio lead image */
  hero: {
    transform: "c_fill,g_auto",
    sizes: "100vw",
  },
  /** Bunny/video poster frames rendered through Cloudinary — mobile sizes
      halved because the 16:9 landscape poster in a portrait viewport is
      object-cover'd with ~3.8x upscaling regardless; 640px vs 1080px is
      invisible behind the scrim, but ~50% fewer bytes on throttled 4G. */
  poster: {
    transform: "c_fill,g_auto,ar_16:9",
    sizes: "(max-width: 768px) 50vw, 100vw",
  },
  /** Lightbox: near-original quality, capped width for bandwidth. The image
      sits in a box bounded by max-h-[80vh]/max-w-[85vw] (object-contain), so
      it's never actually 100vw — 1882px is where 85vw alone would already
      exceed the 1600px cap. Keeping this accurate (rather than the naive
      "100vw") keeps the requested width small on big/retina screens, and
      keeps it a small, predictable set of widths so Cloudinary's cache and
      the Lightbox's own neighbor-preload land on the same URL. */
  lightbox: {
    transform: "c_limit",
    sizes: "(min-width: 1882px) 1600px, 85vw",
  },
  /** Forced portrait crop (matches the aspect-[3/4] slot it's used in)
      regardless of source orientation — Work overlay Stills preview carousel,
      StillsHero's curated fan, StudioGallery's 1-2 image layout. */
  portraitCard: {
    transform: "c_fill,g_auto,ar_3:4",
    sizes: "33vw",
  },
  /** Open Graph / Twitter card crop for project detail pages: fixed 1200x630 */
  ogImage: {
    transform: "c_fill,g_auto,ar_1200:630",
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
    transform: "c_limit",
    sizes: undefined,
  },
} as const satisfies Record<string, CloudinaryPreset>;

export type CloudinaryPresetName = keyof typeof CLOUDINARY_PRESETS;

/**
 * Builds a full Cloudinary delivery URL for a public id under a given
 * preset. For one-off use outside <CloudinaryImage> (e.g. a video poster
 * URL handed to Bunny, or an Open Graph image); components rendering an
 * actual <img>/<Image> should prefer <CloudinaryImage> so next/image still
 * gets a responsive srcset.
 */
export function cloudinaryUrl(
  publicId: string,
  preset: CloudinaryPresetName,
  width: number,
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new Error(
      "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set — see .env.example and Step 7 of AGENTS.md.",
    );
  }
  const { transform } = CLOUDINARY_PRESETS[preset];
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transform},q_auto,f_auto,w_${width}/${publicId}`;
}

/**
 * Tiny blurred stand-in for a Lightbox image: ~32px wide, blurred, low
 * quality. Deliberately not a named preset — quality/blur are baked into
 * the transform because this URL is never reused for anything but a
 * placeholder, unlike the presets above where the caller always appends
 * quality/width itself. Small enough that Cloudinary generates it fast even
 * on a cold cache, so it can stand in while the full-res image (which can
 * take a couple of seconds to derive the first time anyone requests that
 * exact size from the source photo) loads in behind it.
 */
export function cloudinaryBlurPlaceholder(publicId: string): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new Error(
      "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set — see .env.example and Step 7 of AGENTS.md.",
    );
  }
  return `https://res.cloudinary.com/${cloudName}/image/upload/c_limit,w_32,e_blur:1500,q_auto:low,f_auto/${publicId}`;
}
