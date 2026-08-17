import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StillsGallery, type StillsSection } from "@/components/work/StillsGallery";
import { getAllPhotoSeries, getPhotoSeriesBySlug } from "@/lib/content";
import { cloudinaryUrl } from "@/lib/media/presets";
import { SITE_URL } from "@/lib/site";
import { buildBreadcrumbSchema } from "@/lib/structured-data";
import photoDims from "../../../../../content/photo-dimensions.json";

/**
 * SEO-only surface: /work/stills stays the single scrolling gallery it's
 * always been. This page exists so each series gets its own crawlable URL,
 * <title>/description, and sitemap <image:loc> entries — the only path a
 * visitor takes to get here is clicking a series heading on /work/stills
 * (see the Link wrapping section.title in StillsGallery.tsx). Not in primary
 * nav on purpose.
 */

type Params = { slug: string };

const dims = photoDims as Record<string, { w: number; h: number }>;

export function generateStaticParams(): Params[] {
  return getAllPhotoSeries().map((s) => ({ slug: s.slug }));
}

function truncateDescription(text: string, maxLength = 155): string {
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength - 1);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const series = getPhotoSeriesBySlug(slug);
  if (!series) return { title: "Series not found" };

  const description = truncateDescription(series.statement);
  const ogTitle = `${series.title} — Talon Production House`;
  const ogImage = cloudinaryUrl(series.imageIds[0], "ogImage", 1200);

  return {
    title: series.title,
    description,
    alternates: { canonical: `/work/stills/${series.slug}` },
    openGraph: {
      title: ogTitle,
      description,
      url: `/work/stills/${series.slug}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: series.title }],
    },
    twitter: { title: ogTitle, description, images: [ogImage] },
  };
}

export default async function PhotoSeriesPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const series = getPhotoSeriesBySlug(slug);
  if (!series) notFound();

  const allSeries = getAllPhotoSeries();
  const currentIndex = allSeries.findIndex((s) => s.slug === series.slug);
  const prevSeries = allSeries[(currentIndex - 1 + allSeries.length) % allSeries.length];
  const nextSeries = allSeries[(currentIndex + 1) % allSeries.length];

  const section: StillsSection = {
    slug: series.slug,
    title: series.title,
    statement: series.statement,
    images: series.imageIds.map((id) => ({ id, w: dims[id]?.w ?? 3, h: dims[id]?.h ?? 4 })),
  };

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Stills", url: `${SITE_URL}/work/stills` },
    { name: series.title, url: `${SITE_URL}/work/stills/${series.slug}` },
  ]);

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <header className="container-site pt-8 pb-6">
        <p className="type-meta text-muted mb-2">Photography — Bengaluru</p>
        <h1 className="type-display max-w-[20ch]">{series.title}</h1>
        <p className="type-subhead text-muted mt-4 max-w-[60ch]">{series.statement}</p>
      </header>

      <div className="hairline" />

      <StillsGallery sections={[section]} showSectionHeader={false} altPrefix={series.title} />

      <div className="hairline" />

      <nav
        aria-label="More series"
        className="container-site grid grid-cols-1 gap-8 pt-8 pb-8 md:grid-cols-12 md:gap-gutter"
      >
        <Link
          href={`/work/stills/${prevSeries.slug}`}
          className="link-draw block pb-1 md:[grid-column:1/6]"
        >
          <span className="type-meta text-muted mb-2 block">Previous</span>
          <span className="type-display block">{prevSeries.title}</span>
        </Link>
        <Link
          href={`/work/stills/${nextSeries.slug}`}
          className="link-draw block pb-1 md:[grid-column:8/13]"
        >
          <span className="type-meta text-muted mb-2 block">Next</span>
          <span className="type-display block">{nextSeries.title}</span>
        </Link>
      </nav>
    </article>
  );
}
