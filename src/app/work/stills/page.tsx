import type { Metadata } from "next";
import { EditorialGallery, type ImageEntry } from "@/components/work/EditorialGallery";
import { getAllPhotoSeries } from "@/lib/content";
import photoDims from "../../../../content/photo-dimensions.json";

const DESCRIPTION =
  "Curated stills from Talon Production House — portraits, editorial, and available-light work from Bengaluru.";

export const metadata: Metadata = {
  title: "Stills",
  description: DESCRIPTION,
  alternates: { canonical: "/work/stills" },
  openGraph: {
    title: "Stills — Talon Production House",
    description: DESCRIPTION,
    url: "/work/stills",
  },
  twitter: { title: "Stills — Talon Production House", description: DESCRIPTION },
};

const dims = photoDims as Record<string, { w: number; h: number }>;

export default function StillsPage() {
  const allImages: ImageEntry[] = getAllPhotoSeries()
    .flatMap((s) => s.imageIds)
    .map((id) => ({ id, w: dims[id]?.w ?? 3, h: dims[id]?.h ?? 4 }));

  return (
    <div>
      <header className="container-site pt-8 pb-6">
        <h1 className="type-display">Stills</h1>
      </header>
      <div className="hairline" />
      <EditorialGallery images={allImages} />
    </div>
  );
}
