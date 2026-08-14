import type { Metadata } from "next";
import { StillsGallery, type StillsSection } from "@/components/work/StillsGallery";
import { StillsHero } from "@/components/work/StillsHero";
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
  const sections: StillsSection[] = getAllPhotoSeries().map((s) => ({
    slug: s.slug,
    title: s.title,
    statement: s.statement,
    images: s.imageIds.map((id) => ({ id, w: dims[id]?.w ?? 3, h: dims[id]?.h ?? 4 })),
  }));

  return (
    <div>
      <StillsHero />
      <div className="hairline" />
      <StillsGallery sections={sections} />
    </div>
  );
}
