import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BunnyPlayer } from "@/components/media/BunnyPlayer";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectStillsGallery } from "@/components/work/ProjectStillsGallery";
import { getAllProjects, getProjectBySlug } from "@/lib/content";
import { bunnyThumbnailUrl } from "@/lib/media/bunny";
import { cloudinaryUrl } from "@/lib/media/presets";
import { buildVideoObjectSchema } from "@/lib/structured-data";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllProjects().map((p) => ({ slug: p.slug }));
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
  const project = getProjectBySlug(slug);
  if (!project) return { title: "Project not found" };

  const description = truncateDescription(project.synopsis);
  const ogTitle = `${project.title} — Talon Production House`;
  const ogImage = project.posterImageId
    ? cloudinaryUrl(project.posterImageId, "ogImage", 1200)
    : (bunnyThumbnailUrl(project.bunnyVideoId) ?? "");

  return {
    title: project.title,
    description,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: ogTitle,
      description,
      url: `/work/${project.slug}`,
      images: [{ url: ogImage, width: 1200, height: 630, alt: project.title }],
    },
    twitter: { title: ogTitle, description, images: [ogImage] },
  };
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
  const videoObjectSchema = buildVideoObjectSchema(project);

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoObjectSchema) }}
      />

      <div className="aspect-video w-full">
        <BunnyPlayer
          videoId={project.bunnyVideoId}
          title={project.title}
          posterImageId={project.posterImageId}
          className="h-full w-full"
        />
      </div>

      <header className="container-site pt-8 pb-6">
        {/* Category tags — inspired by Pure Cinema's "Documentary / Branded Content / Campaign" treatment */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="type-meta text-muted">{project.category}</span>
          <span className="type-meta text-muted opacity-40">/</span>
          <span className="type-meta text-muted">{project.format}</span>
          <span className="type-meta text-muted opacity-40">/</span>
          <span className="type-meta text-muted">{String(project.year)}</span>
        </div>

        {/* Client name as large headline */}
        <p className="type-meta text-muted mb-2">{project.client}</p>

        {/* Quote-style project title — inspired by Pure Cinema's large quoted subtitle */}
        <h1 className="type-headline flex items-baseline gap-2">
          <span className="text-muted opacity-30" aria-hidden="true">&ldquo;</span>
          {project.title}
          <span className="text-muted opacity-30" aria-hidden="true">&rdquo;</span>
        </h1>

        <Reveal className="mt-6">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-4 sm:grid-cols-3 lg:grid-cols-6">
            <MetaField label="Client" value={project.client} />
            <MetaField label="Year" value={String(project.year)} />
            <MetaField label="Type" value={project.category} />
            <MetaField label="Format" value={project.format} />
            <MetaField label="Runtime" value={project.runtime} />
            <MetaField label="Role" value={project.role} />
          </dl>
        </Reveal>
      </header>

      <div className="hairline" />

      {/* Credits + Synopsis — structured layout inspired by Pure Cinema's "/ About the project" + "/ Credits" sections */}
      <section className="container-site grid grid-cols-1 gap-8 pt-6 pb-6 md:grid-cols-12 md:gap-gutter">
        <div className="md:[grid-column:1/5]">
          <h2 className="type-meta text-muted mb-3">/ Credits</h2>
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
          <h2 className="type-meta text-muted mb-3">/ About the Project</h2>
          <Reveal>
            <p className="type-body max-w-[70ch]">{project.synopsis}</p>
          </Reveal>
        </div>
      </section>

      {project.stillImageIds && project.stillImageIds.length > 0 && (
        <section className="container-site pb-6">
          <ProjectStillsGallery
            projectTitle={project.title}
            stillImageIds={project.stillImageIds}
          />
        </section>
      )}

      <div className="hairline" />

      <nav
        aria-label="More projects"
        className="container-site grid grid-cols-1 gap-8 pt-8 pb-8 md:grid-cols-12 md:gap-gutter"
      >
        <Link
          href={`/work/${prevProject.slug}`}
          className="link-draw block pb-1 md:[grid-column:1/6]"
        >
          <span className="type-meta text-muted mb-2 block">Previous</span>
          <span className="type-display block">{prevProject.title}</span>
        </Link>
        <Link
          href={`/work/${nextProject.slug}`}
          className="link-draw block pb-1 md:[grid-column:8/13]"
        >
          <span className="type-meta text-muted mb-2 block">Next</span>
          <span className="type-display block">{nextProject.title}</span>
        </Link>
      </nav>
    </article>
  );
}
