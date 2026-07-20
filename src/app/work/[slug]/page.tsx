import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BunnyPlayer } from "@/components/media/BunnyPlayer";
import { ProjectStillsGallery } from "@/components/work/ProjectStillsGallery";
import { getAllProjects, getProjectBySlug } from "@/lib/content";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  return { title: project?.title ?? "Project not found" };
}

function MetaField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="type-meta text-muted">{label}</dt>
      <dd className="type-body">{value}</dd>
    </div>
  );
}

export default async function ProjectDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const projects = getAllProjects();
  const currentIndex = projects.findIndex((p) => p.slug === project.slug);
  const prevProject = projects[(currentIndex - 1 + projects.length) % projects.length];
  const nextProject = projects[(currentIndex + 1) % projects.length];

  return (
    <article>
      {/* Hero / player — full bleed, singular media element (asymmetry rule 3).
          Cinematic ratio = 16:9 (DECISIONS.md: matches the poster preset and
          each project's own `format` field). Poster→player transition lives
          inside BunnyPlayer (P3 Veil crossfade on actual playback start). */}
      <div className="aspect-video w-full">
        <BunnyPlayer
          videoId={project.bunnyVideoId}
          title={project.title}
          posterImageId={project.posterImageId}
          className="h-full w-full"
        />
      </div>

      {/* Title + data-plate metadata block — statement role (Bible §6.3),
          the page's title block. Six fields per the brief; the wireframe's
          simplified 4-field meta line is expanded to the brief's fuller list
          (documented in DECISIONS.md). */}
      <header className="container-site pt-8 pb-6">
        <h1 className="type-headline">{project.title}</h1>
        <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
          <MetaField label="Client" value={project.client} />
          <MetaField label="Year" value={String(project.year)} />
          <MetaField label="Type" value={project.category} />
          <MetaField label="Format" value={project.format} />
          <MetaField label="Runtime" value={project.runtime} />
          <MetaField label="Role" value={project.role} />
        </dl>
      </header>

      <div className="hairline" />

      {/* Credits + synopsis — working role. Cols 5–6 intentionally empty at
          desktop (asymmetry rule 2: text anchors left, media/whitespace
          drifts right). */}
      <section className="container-site grid grid-cols-1 gap-8 pt-6 pb-6 md:grid-cols-12 md:gap-gutter">
        <div className="md:[grid-column:1/5]">
          <h2 className="type-meta text-muted mb-3">Credits</h2>
          <ul className="flex flex-col">
            {project.credits.map((c) => (
              <li
                key={`${c.role}-${c.name}`}
                className="hairline flex items-baseline justify-between gap-3 py-2 first:border-t-0"
              >
                <span className="type-small text-muted">{c.role}</span>
                <span className="type-small">{c.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:[grid-column:7/13]">
          <h2 className="type-meta text-muted mb-3">Synopsis</h2>
          <p className="type-body max-w-[70ch]">{project.synopsis}</p>
        </div>
      </section>

      {/* Stills gallery — continues the working section (no rule needed
          between same-role blocks per Bible §6.3). */}
      <section className="container-site pb-6">
        <ProjectStillsGallery projectTitle={project.title} stillImageIds={project.stillImageIds} />
      </section>

      <div className="hairline" />

      {/* Previous / Next — statement role, wraps at both ends. Bible §5.2
          names "next-project link" as a type-display use case explicitly. */}
      <nav
        aria-label="More projects"
        className="container-site grid grid-cols-1 gap-8 pt-8 pb-8 md:grid-cols-12 md:gap-gutter"
      >
        <Link
          href={`/work/${prevProject.slug}`}
          className="link-draw block pb-1 md:[grid-column:1/6]"
        >
          <span className="type-meta text-muted mb-2 block">Previous</span>
          <span className="type-display block break-words">{prevProject.title}</span>
        </Link>
        <Link
          href={`/work/${nextProject.slug}`}
          className="link-draw block pb-1 md:[grid-column:8/13]"
        >
          <span className="type-meta text-muted mb-2 block">Next</span>
          <span className="type-display block break-words">{nextProject.title}</span>
        </Link>
      </nav>
    </article>
  );
}
