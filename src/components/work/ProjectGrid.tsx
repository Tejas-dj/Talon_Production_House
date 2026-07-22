"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { CloudinaryImage } from "@/components/media/CloudinaryImage";
import { BunnyPlayer } from "@/components/media/BunnyPlayer";
import { Reveal } from "@/components/motion/Reveal";
import { bunnyThumbnailUrl } from "@/lib/media/bunny";
import type { VideoProject } from "@/lib/content-types";

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

const FEATURED_START_TIMES: Record<string, number> = {
  "she-asked-for-sunflowers": 21,
  "the-christmas-guest": 27,
  "before-the-coffee-gets-cold": 17,
};

function VideoWithOverlay({ project }: { project: VideoProject }) {
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative aspect-video overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <BunnyPlayer
        videoId={project.bunnyVideoId}
        title={project.title}
        posterImageId={project.posterImageId}
        autoPlayMuted
        startTime={FEATURED_START_TIMES[project.slug]}
        active={inView}
        className="absolute inset-0 h-full w-full"
      />
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center transition-[opacity,background-color] duration-[240ms] ease-shift"
        style={{
          opacity: hovered ? 1 : 0,
          backgroundColor: hovered ? "rgba(23, 22, 20, 0.6)" : "transparent",
        }}
      >
        <span
          className="type-meta text-page transition-[opacity,transform] duration-[240ms] ease-shift"
          style={{
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(8px)",
          }}
        >
          View Project
        </span>
      </div>
    </div>
  );
}

type ProjectGridProps = {
  projects: VideoProject[];
  variant?: "index" | "featured";
};

export function ProjectGrid({ projects, variant = "index" }: ProjectGridProps) {
  const showNumbers = variant === "featured";

  return (
    <div className="flex flex-col">
      {projects.map((project, i) => {
        const thumbFirst = i % 2 === 0;
        const num = String(i + 1).padStart(2, "0");

        if (showNumbers) {
          return (
            <div key={project.slug}>
              <Reveal index={i}>
                <div
                  className={`grid grid-cols-1 gap-3 py-4 md:grid-cols-12 md:gap-gutter ${
                    i === 0 ? "pt-0" : ""
                  } ${thumbFirst ? "" : "md:mt-5"}`}
                >
                  {thumbFirst ? (
                    <>
                      <Link href={`/work/motion/${project.slug}`} className="md:[grid-column:1/8]">
                        <VideoWithOverlay project={project} />
                      </Link>
                      <div className="flex flex-col gap-1 self-start md:[grid-column:8/13]">
                        <span className="type-display text-muted opacity-20">{num}</span>
                        <h3 className="type-headline">{project.title}</h3>
                        <p className="type-meta text-muted">
                          {project.client} · {project.year} · {project.category}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="order-2 flex flex-col gap-1 self-end md:order-1 md:[grid-column:1/6]">
                        <span className="type-display text-muted opacity-20">{num}</span>
                        <h3 className="type-headline">{project.title}</h3>
                        <p className="type-meta text-muted">
                          {project.client} · {project.year} · {project.category}
                        </p>
                      </div>
                      <Link href={`/work/motion/${project.slug}`} className="order-1 md:order-2 md:[grid-column:6/13]">
                        <VideoWithOverlay project={project} />
                      </Link>
                    </>
                  )}
                </div>
              </Reveal>
            </div>
          );
        }

        return (
          <div key={project.slug}>
            {i > 0 && <div className="hairline" aria-hidden="true" />}
            <Reveal index={i}>
              <Link
                href={`/work/motion/${project.slug}`}
                className={`group grid grid-cols-1 gap-3 py-4 md:grid-cols-12 md:gap-gutter ${
                  i === 0 ? "pt-0" : ""
                } ${thumbFirst ? "" : "md:mt-5"}`}
              >
                {thumbFirst ? (
                  <>
                    <div className="md:[grid-column:1/8]">
                      <div className="relative aspect-video overflow-hidden">
                        <ProjectThumb
                          project={project}
                          className="scale-100 object-cover saturate-[.92] transition-[filter,transform] duration-[240ms] ease-shift group-hover:scale-[1.015] group-hover:saturate-100 group-focus-visible:scale-[1.015] group-focus-visible:saturate-100"
                        />
                      </div>
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
                    <div className="order-1 md:order-2 md:[grid-column:6/13]">
                      <div className="relative aspect-video overflow-hidden">
                        <ProjectThumb
                          project={project}
                          className="scale-100 object-cover saturate-[.92] transition-[filter,transform] duration-[240ms] ease-shift group-hover:scale-[1.015] group-hover:saturate-100 group-focus-visible:scale-[1.015] group-focus-visible:saturate-100"
                        />
                      </div>
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
