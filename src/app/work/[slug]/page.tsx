import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/lib/content";

/**
 * Minimal, unstyled render of every field on a VideoProject — the designed
 * layout is Phase 3's job (Bible §6.5's project-detail grid). This exists so
 * Step 6's gate holds: add a fourth object to content/projects.json and this
 * route produces a working page at its slug with no other code change.
 */

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  return { title: project?.title ?? "Project not found" };
}

export default async function ProjectDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article>
      <h1>{project.title}</h1>
      <p>
        {project.client} · {project.year} · {project.category} · {project.format} ·{" "}
        {project.runtime}
      </p>
      <p>Talon&rsquo;s role: {project.role}</p>

      <h2>Credits</h2>
      <ul>
        {project.credits.map((c) => (
          <li key={`${c.role}-${c.name}`}>
            {c.role}: {c.name}
          </li>
        ))}
      </ul>

      <h2>Synopsis</h2>
      <p>{project.synopsis}</p>

      <h2>Media (raw ids, pending Step 7 pipeline)</h2>
      <p>Bunny video id: {project.bunnyVideoId}</p>
      <p>Poster image id: {project.posterImageId}</p>
      <ul>
        {project.stillImageIds.map((id) => (
          <li key={id}>{id}</li>
        ))}
      </ul>
    </article>
  );
}
