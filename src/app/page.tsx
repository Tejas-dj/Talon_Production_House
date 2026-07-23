import type { Metadata } from "next";
import Link from "next/link";
import { FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { FiPhone, FiMail } from "react-icons/fi";
import { CloudinaryImage } from "@/components/media/CloudinaryImage";
import { Hero } from "@/components/home/Hero";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollRevealText } from "@/components/motion/ScrollRevealText";
import { Marquee } from "@/components/motion/Marquee";
import { ProjectGrid } from "@/components/work/ProjectGrid";
import { Testimonials } from "@/components/home/Testimonials";
import { getAllClientLogos, getAllProjects, getAllTestimonials } from "@/lib/content";
import { CONTACT_LINKS, waLink, WHATSAPP_GENERAL_MESSAGE } from "@/lib/site";

const CONTACT_ICONS: Record<string, React.ReactNode> = {
  Instagram: <FaInstagram size={16} />,
  YouTube: <FaYoutube size={16} />,
  Phone: <FiPhone size={16} />,
  Email: <FiMail size={16} />,
  WhatsApp: <FaWhatsapp size={16} />,
};

const DESCRIPTION =
  "Motion production, stills, and studio rental in Bengaluru. Real work, real space, real rates.";

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
      "Stills",
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

export default function HomePage() {
  const allProjects = getAllProjects();
  const featured = allProjects.filter((p) => p.featured);
  const clients = getAllClientLogos();
  const testimonials = getAllTestimonials();

  return (
    <div>
      {/* ── Hero ── */}
      <Hero />

      {/* ── Philosophy statement — scroll-driven word-by-word color reveal ── */}
      <section className="container-site grid grid-cols-1 pt-7 pb-6 md:grid-cols-12">
        <div className="md:col-span-8 md:col-start-3">
          <ScrollRevealText as="p" className="type-headline text-center">
            {STATEMENT}
          </ScrollRevealText>
        </div>
      </section>

      <div className="hairline" />

      {/* ── Featured projects — numbered grid with "View Project" hover ── */}
      <section className="container-site pt-6 pb-6">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="type-headline">Featured Work</h2>
          <span className="type-meta text-muted">{featured.length} Projects</span>
        </div>
        <ProjectGrid projects={featured} variant="featured" />
        <Link href="/work/motion" className="link-draw type-meta mt-6 inline-block">
          All motion projects →
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

      {/* ── Testimonials — rolling credits wall ── */}
      {testimonials.length > 0 && <Testimonials testimonials={testimonials} />}

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
                  className="link-draw type-meta flex items-center justify-between gap-4 py-2 hairline-b"
                  {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <span className="flex items-center gap-2">
                    {CONTACT_ICONS[link.label]}
                    {link.label}
                  </span>
                  <span className="text-muted">{link.handle}</span>
                </a>
              ))}
              <a
                href={waLink(WHATSAPP_GENERAL_MESSAGE)}
                className="link-draw type-meta flex items-center justify-between gap-4 py-2 hairline-b"
              >
                <span className="flex items-center gap-2">
                  {CONTACT_ICONS.WhatsApp}
                  WhatsApp
                </span>
                <span className="text-muted">Message us directly</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
