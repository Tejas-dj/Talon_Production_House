import type { Metadata } from "next";
import { CloudinaryImage } from "@/components/media/CloudinaryImage";
import { MagneticElement } from "@/components/motion/MagneticElement";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { StudioGallery } from "@/components/studio/StudioGallery";
import { getStudioSpace } from "@/lib/content";
import { WHATSAPP_STUDIO_MESSAGE, waLink } from "@/lib/site";
import { buildLocalBusinessSchema } from "@/lib/structured-data";

const DESCRIPTION =
  "Rent Talon's Bengaluru studio floor by the hour, half day, or full day — specs, rates, and instant WhatsApp booking.";

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

function RateRow({ item, price, index }: { item: string; price: string; index: number }) {
  return (
    <Reveal
      index={index}
      className="hairline flex items-baseline justify-between gap-4 p-4 first:border-t-0"
    >
      <span className="type-body">{item}</span>
      <span className="type-body shrink-0">{price}</span>
    </Reveal>
  );
}

export default function StudioPage() {
  const studio = getStudioSpace();
  const { specs, rates } = studio;
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

      {/* Lead image — full bleed, singular media element (asymmetry rule 3) */}
      <div className="aspect-[21/9] w-full">
        <CloudinaryImage
          id={studio.heroImageId}
          preset="hero"
          alt={`${studio.name}, interior view`}
          fill
          priority
          className="object-cover"
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
            <SpecRow index={0} label="Dimensions">
              {specs.dimensions}
            </SpecRow>
            <SpecRow index={1} label="Cyc Wall">
              {specs.cycWall}
            </SpecRow>
            <SpecRow index={2} label="Power">
              {specs.power}
            </SpecRow>
            <SpecRow index={3} label="Sound">
              {specs.sound}
            </SpecRow>
            <SpecRow index={4} label="Grip & Lighting">
              <ul className="flex flex-col gap-1">
                {specs.gripAndLighting.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </SpecRow>
            <SpecRow index={5} label="Amenities">
              {specs.amenities}
            </SpecRow>
          </dl>
        </div>
      </section>

      <div className="hairline" />

      {/* Rates — working role, WhatsApp CTA prominent within it (not buried) */}
      <section className="container-site grid grid-cols-1 gap-4 pt-6 pb-6 md:grid-cols-12 md:gap-gutter">
        <div className="md:sticky md:top-(--header-height) md:[grid-column:1/5] md:self-start">
          <h2 className="type-headline">Rates</h2>
        </div>
        <div className="md:[grid-column:5/13]">
          <div className="bg-surface">
            <RateRow index={0} item={rates.hourly.item} price={rates.hourly.price} />
            <RateRow index={1} item={rates.halfDay.item} price={rates.halfDay.price} />
            <RateRow index={2} item={rates.fullDay.item} price={rates.fullDay.price} />
            {rates.equipmentAddOns.map((row, i) => (
              <RateRow key={row.item} index={3 + i} item={row.item} price={row.price} />
            ))}
          </div>
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
          <a
            href={waLink(WHATSAPP_STUDIO_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-cta type-meta fixed inset-x-0 bottom-0 z-30 flex items-center justify-center border-x-0 border-b-0 px-4 py-4 text-center md:hidden"
          >
            {studio.whatsappCtaText}
          </a>
        </div>
      </section>
    </div>
  );
}
