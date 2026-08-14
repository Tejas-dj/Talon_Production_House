import type { Metadata } from "next";
import { MagneticElement } from "@/components/motion/MagneticElement";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { LocationMap } from "@/components/studio/LocationMap";
import { StudioGallery } from "@/components/studio/StudioGallery";
import { StudioHeroImage } from "@/components/studio/StudioHeroImage";
import { StudioMobileCta } from "@/components/studio/StudioMobileCta";
import { getStudioSpace } from "@/lib/content";
import { getPhotoAlt } from "@/lib/media/photo-alt-text";
import { GOOGLE_MAPS_URL, WHATSAPP_STUDIO_MESSAGE, waLink } from "@/lib/site";
import { buildLocalBusinessSchema } from "@/lib/structured-data";

const DESCRIPTION =
  "Rent Talon's Bengaluru studio floor by the hour, half day, or full day — specs and instant WhatsApp booking.";

export const metadata: Metadata = {
  title: "Studio",
  description: DESCRIPTION,
  alternates: { canonical: "/studio" },
  openGraph: { title: "Studio — Talon Production House", description: DESCRIPTION, url: "/studio" },
  twitter: { title: "Studio — Talon Production House", description: DESCRIPTION },
};

function SpecRow({
  label,
  children,
  index,
}: {
  label: string;
  children: React.ReactNode;
  index: number;
}) {
  return (
    <Reveal
      index={index}
      className="hairline flex flex-col gap-2 p-4 first:border-t-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
    >
      <dt className="type-meta text-muted shrink-0 sm:w-[10rem]">{label}</dt>
      <dd className="type-body sm:text-right">{children}</dd>
    </Reveal>
  );
}

export default function StudioPage() {
  const studio = getStudioSpace();
  const { specs } = studio;
  const localBusinessSchema = buildLocalBusinessSchema();

  return (
    <div className="pb-7 md:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      {/* Page title — statement role (Bible §6.3) */}
      <header className="container-site pt-8 pb-6">
        <SplitText as="h1" className="type-display">Studio</SplitText>
        <p className="type-meta text-muted mt-2">{studio.location}</p>
      </header>

      {/* Lead image — inset within the page grid, breathing room on all sides */}
      <div className="container-site pb-6">
        <StudioHeroImage
          id={studio.heroImageId}
          alt={getPhotoAlt(studio.heroImageId) ?? `${studio.name}, interior view`}
        />
      </div>

      {/* Gallery — multi-media section, so in-grid not full bleed */}
      <StudioGallery studioName={studio.name} imageIds={studio.galleryImageIds} />

      <div className="hairline" />

      {/* The Space — working role, sticky section head at desktop */}
      <section className="container-site grid grid-cols-1 gap-4 pt-6 pb-6 md:grid-cols-12 md:gap-gutter">
        <div className="md:sticky md:top-(--header-height) md:[grid-column:1/5] md:self-start">
          <h2 className="type-headline">The Space</h2>
        </div>
        <div className="md:[grid-column:5/13]">
          <dl className="bg-surface">
            <SpecRow index={0} label="Backdrops">
              <div className="flex flex-col gap-3">
                {specs.backdrops.map((group) => (
                  <div key={group.label}>
                    <p className="type-meta text-muted mb-1">{group.label}</p>
                    <ul className="flex flex-col gap-1">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </SpecRow>
            <SpecRow index={1} label="Power">
              {specs.power}
            </SpecRow>
            <SpecRow index={2} label="Grip & Lighting">
              <ul className="flex flex-col gap-1">
                {specs.gripAndLighting.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </SpecRow>
            <SpecRow index={3} label="Amenities">
              {specs.amenities}
            </SpecRow>
          </dl>
        </div>
      </section>

      <div className="hairline" />

      {/* Booking — no rate card; a direct WhatsApp CTA, prominent not buried */}
      <section className="container-site grid grid-cols-1 gap-4 pt-6 pb-6 md:grid-cols-12 md:gap-gutter">
        <div className="md:sticky md:top-(--header-height) md:[grid-column:1/5] md:self-start">
          <h2 className="type-headline">Book the Studio</h2>
        </div>
        <div className="md:[grid-column:5/13]">
          <p className="type-body max-w-[50ch]">
            Hourly, half-day, and full-day sessions, with camera and lighting add-ons available.
            Message us your date for a quote.
          </p>
          <p className="type-small text-muted mt-4 max-w-[65ch]">{studio.terms}</p>

          {/* Desktop: inline prominent CTA. Mobile: fixed bottom bar, thumb
              reach (wireframe explicitly calls this out for mobile only). */}
          <MagneticElement radius={80} strength={0.2} className="hidden md:block md:mt-6">
            <a
              href={waLink(WHATSAPP_STUDIO_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-cta type-meta flex items-center justify-center px-6 py-5 text-center"
            >
              {studio.whatsappCtaText}
            </a>
          </MagneticElement>
          <StudioMobileCta href={waLink(WHATSAPP_STUDIO_MESSAGE)}>
            {studio.whatsappCtaText}
          </StudioMobileCta>
        </div>
      </section>

      <div className="hairline" />

      {/* Visit — address + an on-brand schematic map, opens the verified
          Google Business Profile listing rather than embedding it */}
      <section className="container-site grid grid-cols-1 gap-4 pt-6 pb-6 md:grid-cols-12 md:gap-gutter">
        <div className="md:sticky md:top-(--header-height) md:[grid-column:1/5] md:self-start">
          <h2 className="type-headline">Visit</h2>
        </div>
        <div className="md:[grid-column:5/13]">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:items-center">
            <div>
              <p className="type-body max-w-[38ch]">{studio.location}</p>
              <MagneticElement radius={80} strength={0.2} className="mt-4 inline-block">
                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-draw type-meta inline-flex items-center gap-2"
                >
                  Get Directions <span aria-hidden="true">→</span>
                </a>
              </MagneticElement>
            </div>
            <LocationMap label={studio.name} />
          </div>
        </div>
      </section>
    </div>
  );
}
