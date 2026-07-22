import type { Metadata } from "next";
import Link from "next/link";
import { FilterBar } from "@/components/work/FilterBar";
import { ProjectGrid } from "@/components/work/ProjectGrid";
import { getAllProjects } from "@/lib/content";
import type { VideoCategory } from "@/lib/content-types";

const DESCRIPTION =
  "Commercials, music videos, documentaries, and brand films shot by Talon Production House in Bengaluru.";

export const metadata: Metadata = {
  title: "Motion",
  description: DESCRIPTION,
  alternates: { canonical: "/work/motion" },
  openGraph: { title: "Motion — Talon Production House", description: DESCRIPTION, url: "/work/motion" },
  twitter: { title: "Motion — Talon Production House", description: DESCRIPTION },
};

type SearchParams = { category?: string };

export default async function MotionPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { category } = await searchParams;
  const allProjects = getAllProjects();
  const categories = [...new Set(allProjects.map((p) => p.category))] as VideoCategory[];
  const filtered = category ? allProjects.filter((p) => p.category === category) : allProjects;

  return (
    <div>
      {/* Page title — statement role (Bible §6.3) */}
      <header className="container-site pt-8 pb-6">
        <h1 className="type-display">Motion</h1>
        <p className="type-meta text-muted mt-2">
          {allProjects.length} {allProjects.length === 1 ? "Project" : "Projects"}
        </p>
      </header>

      <div className="container-site pb-6">
        <FilterBar categories={categories} active={category} />
      </div>

      <div className="hairline" />

      <div className="container-site pt-6 pb-8">
        {/* Visually hidden — ProjectGrid's card titles are h3, and this page
            has no visible section heading between the h1 and the grid. */}
        <h2 className="sr-only">Projects</h2>
        {filtered.length > 0 ? (
          <ProjectGrid projects={filtered} variant="index" />
        ) : (
          <div className="py-8">
            <p className="type-subhead">
              No {category ?? "matching"} projects yet — more work is on the way.
            </p>
            <Link href="/work/motion" className="link-draw type-meta mt-4 inline-block">
              View all projects
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
