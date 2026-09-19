"use client";

import Image, { type ImageProps } from "next/image";
import { IMAGE_PRESETS, type ImagePresetName } from "@/lib/media/presets";
import { r2Url } from "@/lib/r2";

type CloudinaryImageProps = Omit<ImageProps, "src" | "loader" | "sizes"> & {
  /** R2 object path (e.g. "Faces_In_Frame/Faces_In_Frame_pic_1.webp") */
  id: string;
  preset: ImagePresetName;
  sizes?: string;
};

/**
 * The only way Phase 3 should render a CDN image: pick a preset by name
 * (src/lib/media/presets.ts), never compose a URL inline. Images are served
 * directly from R2 (pre-optimized, no on-the-fly transforms), so this just
 * passes the R2 URL through to next/image with `unoptimized`.
 */
export function CloudinaryImage({ id, preset, sizes, alt, ...imageProps }: CloudinaryImageProps) {
  const presetConfig = IMAGE_PRESETS[preset];

  return (
    <Image
      src={r2Url(id)}
      alt={alt}
      sizes={sizes ?? presetConfig.sizes}
      unoptimized
      {...imageProps}
    />
  );
}
