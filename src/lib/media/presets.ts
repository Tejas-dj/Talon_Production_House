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
  /** Bunny/video poster frames rendered through Cloudinary */
  poster: {
    transform: "c_fill,g_auto,ar_16:9",
    sizes: "100vw",
  },
  /** Lightbox: near-original quality, capped width for bandwidth */
  lightbox: {
    transform: "c_limit",
    sizes: "100vw",
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
