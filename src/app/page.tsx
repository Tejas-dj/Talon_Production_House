import type { Metadata } from "next";
import Link from "next/link";
import { CloudinaryImage } from "@/components/media/CloudinaryImage";
import { Hero } from "@/components/home/Hero";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectGrid } from "@/components/work/ProjectGrid";
import { getAllClientLogos, getAllProjects } from "@/lib/content";

const DESCRIPTION =
  "Video production, photography, and studio rental in Bengaluru. Real work, real space, real rates.";

export const metadata: Metadata = {
  title: { absolute: "Talon Production House" },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { title: "Talon Production House", description: DESCRIPTION, url: "/" },
  twitter: { title: "Talon Production House", description: DESCRIPTION },
};

/* Positioning line — Bible §5.2 assigns "statement paragraphs on Home" to
   type-subhead, reusing the exact copy already established as this
   project's placeholder voice in the styleguide (src/app/styleguide/page.tsx). */
const STATEMENT =
  "A production house and rentable studio floor in Bengaluru, built for finishing quality.";

export default function HomePage() {
  const allProjects = getAllProjects();
  const featured = allProjects.filter((p) => p.featured);
  const clients = getAllClientLogos();

  return (
    <div>
      {/* Hero — Bible §6.5: full-bleed video, 82vh, bottom edge clipped at
          −13° (the one diagonal permitted on the site, Home hero only). The
          clip is a percentage-based approximation of the angle, same
          precedent as Footer.tsx's wedge (see DECISIONS.md for the exact
          value and reasoning). Autoplay muted/looping via BunnyPlayer;
          subtle scroll-linked scale drift is Hero.tsx's own concern
          (Phase 4 Step 1 "hero media motion"). */}
      <Hero />

      {/* Statement — interstitial role (Bible §6.3): --space-7 top, --space-5
          bottom. Cols 1–6 intentionally empty (asymmetry rule 2). */}
      <div className="container-site grid grid-cols-1 pt-7 pb-5 md:grid-cols-12">
        <p className="type-subhead md:col-span-6 md:col-start-7">{STATEMENT}</p>
      </div>

      <div className="hairline" />

      {/* Featured projects — working role, asymmetric (not uniform), data-
          driven via the `featured` flag + JSON array order. */}
      <section className="container-site pt-6 pb-6">
        <h2 className="type-headline mb-6">Selected Work</h2>
        <ProjectGrid projects={featured} variant="featured" />
        <Link href="/work" className="link-draw type-meta mt-6 inline-block">
          All video projects →
        </Link>
      </section>

      {/* Client logos — only rendered when data exists (none yet: see
          DECISIONS.md and content/clients.json). Muted/monochrome per brief. */}
      {clients.length > 0 && (
        <>
          <div className="hairline" />
          <section className="container-site pt-6 pb-6">
            <h2 className="sr-only">Clients</h2>
            <Reveal className="flex flex-wrap items-center gap-8">
              {clients.map((c) => (
                <CloudinaryImage
                  key={c.logoId}
                  id={c.logoId}
                  preset="gallery"
                  alt={c.name}
                  width={160}
                  height={60}
                  className="h-8 w-auto object-contain grayscale"
                />
              ))}
            </Reveal>
          </section>
        </>
      )}
    </div>
  );
}
