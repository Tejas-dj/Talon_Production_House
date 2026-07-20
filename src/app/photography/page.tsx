import type { Metadata } from "next";
import { PhotoSeriesGrid } from "@/components/work/PhotoSeriesGrid";
import { getAllPhotoSeries } from "@/lib/content";

export const metadata: Metadata = {
  title: "Photography",
};

export default function PhotographyPage() {
  const series = getAllPhotoSeries();

  return (
    <div>
      {/* Page title — statement role (Bible §6.3) */}
      <header className="container-site pt-8 pb-6">
        <h1 className="type-display">Photography</h1>
      </header>

      <div className="hairline" />

      {series.map((s, i) => {
        const headerRight = i % 2 === 1;
        return (
          <section key={s.slug} className={i > 0 ? "hairline" : undefined}>
            {/* Series intro — interstitial role (Bible §6.3): --space-7 top,
                --space-5 bottom. Header side alternates per series (wireframe). */}
            <div className="container-site grid grid-cols-1 pt-7 pb-5 md:grid-cols-12">
              <div className={headerRight ? "md:[grid-column:7/13]" : "md:[grid-column:1/5]"}>
                <h2 className="type-subhead">{s.title}</h2>
                <p className="type-body text-muted mt-2">{s.statement}</p>
                <p className="type-meta text-muted mt-3">
                  {s.imageIds.length} {s.imageIds.length === 1 ? "Image" : "Images"}
                </p>
              </div>
            </div>
            <div className="container-site pb-6">
              <PhotoSeriesGrid seriesTitle={s.title} imageIds={s.imageIds} />
            </div>
          </section>
        );
      })}
    </div>
  );
}
