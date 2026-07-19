/**
 * Global next/image loader (wired in next.config.ts). Handles the common
 * case — `<Image src="talon/..." />` anywhere in the app — with a sensible
 * default transform. Anything needing a specific crop/aspect ratio uses a
 * named preset from src/lib/media/presets.ts via <CloudinaryImage> instead,
 * so no component ever hand-composes a Cloudinary transformation string.
 */

type LoaderParams = {
  src: string;
  width: number;
  quality?: number;
};

export default function cloudinaryLoader({ src, width, quality }: LoaderParams): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    throw new Error(
      "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set — see .env.example and Step 7 of AGENTS.md.",
    );
  }
  const q = quality ?? "auto";
  const transform = `c_limit,q_${q},f_auto,w_${width}`;
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transform}/${src}`;
}
