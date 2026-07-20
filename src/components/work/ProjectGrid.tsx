"use client";

import Link from "next/link";
import { CloudinaryImage } from "@/components/media/CloudinaryImage";
import { Reveal } from "@/components/motion/Reveal";
import { bunnyThumbnailUrl } from "@/lib/media/bunny";
import type { VideoProject } from "@/lib/content-types";

/** Poster if a real Cloudinary still exists, else Bunny Stream's own
 * auto-generated thumbnail — never a broken image for an unpublished poster. */
function ProjectThumb({ project, className }: { project: VideoProject; className: string }) {
  const alt = `${project.title}, ${project.category.toLowerCase()} for ${project.client}`;
  if (project.posterImageId) {
    return (
      <CloudinaryImage
        id={project.posterImageId}
        preset="thumbnail"
        alt={alt}
        fill
        className={className}
      />
    );
  }
  const thumb = bunnyThumbnailUrl(project.bunnyVideoId);
  if (!thumb) return null;
  // eslint-disable-next-line @next/next/no-img-element -- external Bunny CDN URL; next/image would route it through the global Cloudinary loader.
  return <img src={thumb} alt={alt} className={`absolute inset-0 h-full w-full ${className}`} />;
}

type ProjectGridProps = {
  projects: VideoProject[];
  /** "index": hairline rule between each row (Video index, dense/working).
   *  "featured": no rules, looser (Home, statement-like). */
  variant?: "index" | "featured";
};

/**
 * Asymmetric project card grid — Bible §6.4 rule 4: alternating item sides,
 * odd items offset down by --space-5. Shared by the Video index and Home's
 * featured section so the stagger logic exists exactly once. Each card
 * reveals via P1 Rise (Bible §7) as the grid scrolls into view.
 */
export function ProjectGrid({ projects, variant = "index" }: ProjectGridProps) {
  return (
    <div className="flex flex-col">
      {projects.map((project, i) => {
        const thumbFirst = i % 2 === 0;
        return (
          <div key={project.slug}>
            {variant === "index" && i > 0 && <div className="hairline" aria-hidden="true" />}
            <Reveal index={i}>
              <Link
                href={`/work/${project.slug}`}
                className={`group grid grid-cols-1 gap-3 py-4 md:grid-cols-12 md:gap-gutter ${
                  i === 0 ? "pt-0" : ""
                } ${thumbFirst ? "" : "md:mt-5"}`}
              >
                {thumbFirst ? (
                  <>
                    <div className="relative aspect-video overflow-hidden md:[grid-column:1/8]">
                      <ProjectThumb
                        project={project}
                        className="scale-100 object-cover saturate-[.92] transition-[filter,transform] duration-[240ms] ease-shift group-hover:scale-[1.015] group-hover:saturate-100 group-focus-visible:scale-[1.015] group-focus-visible:saturate-100"
                      />
                    </div>
                    <div className="flex flex-col gap-1 self-start md:[grid-column:8/13]">
                      <h3 className="type-headline">{project.title}</h3>
                      <p className="type-meta text-muted">
                        {project.client} · {project.year} · {project.category}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="order-2 flex flex-col gap-1 self-end md:order-1 md:[grid-column:1/6]">
                      <h3 className="type-headline">{project.title}</h3>
                      <p className="type-meta text-muted">
                        {project.client} · {project.year} · {project.category}
                      </p>
                    </div>
                    <div className="relative order-1 aspect-video overflow-hidden md:order-2 md:[grid-column:6/13]">
                      <ProjectThumb
                        project={project}
                        className="scale-100 object-cover saturate-[.92] transition-[filter,transform] duration-[240ms] ease-shift group-hover:scale-[1.015] group-hover:saturate-100 group-focus-visible:scale-[1.015] group-focus-visible:saturate-100"
                      />
                    </div>
                  </>
                )}
              </Link>
            </Reveal>
          </div>
        );
      })}
    </div>
  );
}
