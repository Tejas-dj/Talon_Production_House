import Link from "next/link";
import { CloudinaryImage } from "@/components/media/CloudinaryImage";
import type { VideoProject } from "@/lib/content-types";

type ProjectGridProps = {
  projects: VideoProject[];
  /** "index": hairline rule between each row (Video index, dense/working).
   *  "featured": no rules, looser (Home, statement-like). */
  variant?: "index" | "featured";
};

/**
 * Asymmetric project card grid — Bible §6.4 rule 4: alternating item sides,
 * odd items offset down by --space-5. Shared by the Video index and Home's
 * featured section so the stagger logic exists exactly once.
 */
export function ProjectGrid({ projects, variant = "index" }: ProjectGridProps) {
  return (
    <div className="flex flex-col">
      {projects.map((project, i) => {
        const thumbFirst = i % 2 === 0;
        return (
          <div key={project.slug}>
            {variant === "index" && i > 0 && <div className="hairline" aria-hidden="true" />}
            <Link
              href={`/work/${project.slug}`}
              className={`group grid grid-cols-1 gap-3 py-4 md:grid-cols-12 md:gap-gutter first:pt-0 ${
                thumbFirst ? "" : "md:mt-5"
              }`}
            >
              {thumbFirst ? (
                <>
                  <div className="relative aspect-video overflow-hidden md:[grid-column:1/8]">
                    <CloudinaryImage
                      id={project.posterImageId}
                      preset="thumbnail"
                      alt={`${project.title}, ${project.category.toLowerCase()} for ${project.client}`}
                      fill
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
                    <CloudinaryImage
                      id={project.posterImageId}
                      preset="thumbnail"
                      alt={`${project.title}, ${project.category.toLowerCase()} for ${project.client}`}
                      fill
                      className="scale-100 object-cover saturate-[.92] transition-[filter,transform] duration-[240ms] ease-shift group-hover:scale-[1.015] group-hover:saturate-100 group-focus-visible:scale-[1.015] group-focus-visible:saturate-100"
                    />
                  </div>
                </>
              )}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
