import type { Metadata } from "next";
import Link from "next/link";
import { CloudinaryImage } from "@/components/media/CloudinaryImage";
import { Hero } from "@/components/home/Hero";
import { Reveal } from "@/components/motion/Reveal";
import { Marquee } from "@/components/motion/Marquee";
import { ProjectGrid } from "@/components/work/ProjectGrid";
import { getAllClientLogos, getAllProjects } from "@/lib/content";
import { CONTACT_LINKS, waLink, WHATSAPP_GENERAL_MESSAGE } from "@/lib/site";

const DESCRIPTION =
  "Video production, photography, and studio rental in Bengaluru. Real work, real space, real rates.";

export const metadata: Metadata = {
  title: { absolute: "Talon Production House" },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: { title: "Talon Production House", description: DESCRIPTION, url: "/" },
  twitter: { title: "Talon Production House", description: DESCRIPTION },
};

const STATEMENT =
  "A production house and rentable studio floor in Bengaluru, built for finishing quality.";

const PHILOSOPHY =
  "Tell us about what you're building, thinking, or working on — if it matters to you, it's worth starting here.";

const CAPABILITIES = {
  production: {
    label: "Production",
    items: [
      "Direction",
      "Cinematography",
      "Photography",
      "Audio Production",
      "Art Direction",
      "Logistics",
    ],
  },
  rental: {
    label: "Studio Rental",
    items: [
      "Cyclorama Studio",
      "Grip & Lighting",
      "Equipment Rental",
      "Green Room",
      "Styling Area",
      "Parking",
    ],
  },
  post: {
    label: "Post & Delivery",
    items: [
      "Film Editing",
      "Color Grading",
      "Sound Design",
      "Motion Graphics",
      "Visual Effects",
      "Distribution",
    ],
  },
} as const;

const PILLARS = [
  {
    num: "01",
    title: "Craft First",
    body: "Every frame, every cut, every grade — built to a finishing standard, not a deadline.",
  },
  {
    num: "02",
    title: "Real Space",
    body: "A studio floor you can walk into tomorrow. Equipment, crew, cyclorama — no middlemen.",
  },
  {
    num: "03",
    title: "Fair Rates",
    body: "Transparent pricing for production and rental. No surprise line items, no inflated day rates.",
  },
] as const;

export default function HomePage() {
  const allProjects = getAllProjects();
  const featured = allProjects.filter((p) => p.featured);
  const clients = getAllClientLogos();

  return (
    <div>
      {/* ── Hero ── */}
      <Hero />

      {/* ── Philosophy statement — centered, bigger typographic moment ── */}
      <section className="container-site grid grid-cols-1 pt-7 pb-6 md:grid-cols-12">
        <Reveal className="md:col-span-8 md:col-start-3">
          <p className="type-headline text-center">{STATEMENT}</p>
        </Reveal>
      </section>

      <div className="hairline" />

      {/* ── Featured projects — numbered grid with "View Project" hover ── */}
      <section className="container-site pt-6 pb-6">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="type-headline">Featured Work</h2>
          <span className="type-meta text-muted">{featured.length} Projects</span>
        </div>
        <ProjectGrid projects={featured} variant="featured" />
        <Link href="/work" className="link-draw type-meta mt-6 inline-block">
          All video projects →
        </Link>
      </section>

      {/* ── Client logo marquee ── */}
      {clients.length > 0 && (
        <>
          <div className="hairline" />
          <section className="py-6">
            <p className="type-meta text-muted container-site mb-4">A Few of Our Clients</p>
            <Marquee speed={35} className="py-3">
              {clients.map((c) => (
                <CloudinaryImage
                  key={c.logoId}
                  id={c.logoId}
                  preset="gallery"
                  alt={c.name}
                  width={160}
                  height={60}
                  className="mx-6 h-8 w-auto object-contain grayscale"
                />
              ))}
            </Marquee>
          </section>
        </>
      )}

      <div className="hairline" />

      {/* ── Capabilities — three-column breakdown ── */}
      <section className="container-site pt-6 pb-6">
        <div className="mb-6">
          <p className="type-meta text-muted mb-2">Our Capabilities</p>
          <h2 className="type-headline">How We Can Help</h2>
          <Reveal>
            <p className="type-body mt-3 max-w-[60ch]">
              From concept to final delivery — production, studio rental, and post under one roof.
            </p>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-gutter">
          {Object.values(CAPABILITIES).map((col) => (
            <Reveal key={col.label}>
              <div>
                <h3 className="type-meta mb-3 pb-2 hairline-b">{col.label}</h3>
                <ul className="flex flex-col gap-2">
                  {col.items.map((item) => (
                    <li key={item} className="type-body">{item}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="hairline" />

      {/* ── Core values as numbered pillars ── */}
      <section className="container-site pt-6 pb-6">
        <p className="type-meta text-muted mb-2">What Drives Us</p>
        <h2 className="type-headline mb-6">Core Pillars</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-gutter">
          {PILLARS.map((p) => (
            <Reveal key={p.num}>
              <div className="hairline pt-4">
                <span className="type-display text-muted opacity-15">{p.num}</span>
                <h3 className="type-subhead mt-2">{p.title}</h3>
                <p className="type-body mt-2 text-muted">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <div className="hairline" />

      {/* ── Warm contact section ── */}
      <section className="container-site grid grid-cols-1 gap-8 pt-7 pb-7 md:grid-cols-12 md:gap-gutter">
        <div className="md:[grid-column:1/7]">
          <Reveal>
            <p className="type-meta text-muted mb-3">Get in Touch</p>
            <h2 className="type-headline mb-4">Reach Out to Us</h2>
            <p className="type-subhead">{PHILOSOPHY}</p>
          </Reveal>
        </div>
        <div className="flex flex-col gap-3 self-end md:[grid-column:8/13]">
          <Reveal index={1}>
            <div className="flex flex-col gap-3">
              {CONTACT_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="link-draw type-meta flex items-baseline justify-between gap-4 py-2 hairline-b"
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <span>{link.label}</span>
                  <span className="text-muted">{link.handle}</span>
                </a>
              ))}
              <a
                href={waLink(WHATSAPP_GENERAL_MESSAGE)}
                className="link-draw type-meta flex items-baseline justify-between gap-4 py-2 hairline-b"
              >
                <span>WhatsApp</span>
                <span className="text-muted">Message us directly</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
