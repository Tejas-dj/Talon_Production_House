/**
 * Global next/image loader (wired in next.config.ts). Images are pre-optimized
 * in R2 and served directly from the CDN, so this is a pass-through: `src` is
 * already a full R2 CDN URL by the time next/image calls the loader.
 */

type LoaderParams = {
  src: string;
  width: number;
  quality?: number;
};

export default function r2Loader({ src }: LoaderParams): string {
  return src;
}
