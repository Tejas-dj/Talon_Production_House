"use client";

import Image, { type ImageProps } from "next/image";
import { CLOUDINARY_PRESETS, type CloudinaryPresetName } from "@/lib/media/presets";

type CloudinaryImageProps = Omit<ImageProps, "src" | "loader" | "sizes"> & {
  /** Cloudinary public id (no leading slash, no extension) */
  id: string;
  preset: CloudinaryPresetName;
  sizes?: string;
};

/**
 * The only way Phase 3 should render a Cloudinary image: pick a preset by
 * name (src/lib/media/presets.ts), never compose a transform string inline.
 * Wraps next/image with a per-instance loader bound to the chosen preset, so
 * the responsive srcset still gets the preset's crop/aspect, not just the
 * plain default from the global loaderFile.
 */
export function CloudinaryImage({ id, preset, sizes, alt, ...imageProps }: CloudinaryImageProps) {
  const presetConfig = CLOUDINARY_PRESETS[preset];

  function loader({ width, quality }: { src: string; width: number; quality?: number }) {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) {
      throw new Error(
        "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set — see .env.example and Step 7 of AGENTS.md.",
      );
    }
    const q = quality ?? "auto";
    return `https://res.cloudinary.com/${cloudName}/image/upload/${presetConfig.transform},q_${q},w_${width}/${id}`;
  }

  return (
    <Image loader={loader} src={id} alt={alt} sizes={sizes ?? presetConfig.sizes} {...imageProps} />
  );
}
