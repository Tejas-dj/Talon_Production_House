import type { Metadata } from "next";
import { CloudinaryImage } from "@/components/media/CloudinaryImage";
import { StudioGallery } from "@/components/studio/StudioGallery";
import { getStudioSpace } from "@/lib/content";
import { WHATSAPP_STUDIO_MESSAGE, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Studio",
};

function SpecRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="hairline flex flex-col gap-2 p-4 first:border-t-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <dt className="type-meta text-muted shrink-0 sm:w-40">{label}</dt>
      <dd className="type-body sm:text-right">{children}</dd>
    </div>
  );
}

function RateRow({ item, price }: { item: string; price: string }) {
  return (
    <div className="hairline flex items-baseline justify-between gap-4 p-4 first:border-t-0">
      <span className="type-body">{item}</span>
      <span className="type-body shrink-0">{price}</span>
    </div>
  );
}

export default function StudioPage() {
  const studio = getStudioSpace();
  const { specs, rates } = studio;

  return (
    <div className="pb-20 md:pb-0">
      {/* Page title — statement role (Bible §6.3) */}
      <header className="container-site pt-8 pb-6">
        <h1 className="type-display">Studio</h1>
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
            <SpecRow label="Dimensions">{specs.dimensions}</SpecRow>
            <SpecRow label="Cyc Wall">{specs.cycWall}</SpecRow>
            <SpecRow label="Power">{specs.power}</SpecRow>
            <SpecRow label="Sound">{specs.sound}</SpecRow>
            <SpecRow label="Grip & Lighting">
              <ul className="flex flex-col gap-1">
                {specs.gripAndLighting.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </SpecRow>
            <SpecRow label="Amenities">{specs.amenities}</SpecRow>
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
            <RateRow item={rates.hourly.item} price={rates.hourly.price} />
            <RateRow item={rates.halfDay.item} price={rates.halfDay.price} />
            <RateRow item={rates.fullDay.item} price={rates.fullDay.price} />
            {rates.equipmentAddOns.map((row) => (
              <RateRow key={row.item} item={row.item} price={row.price} />
            ))}
          </div>
          <p className="type-small text-muted mt-4 max-w-[65ch]">{studio.terms}</p>

          {/* Desktop: inline prominent CTA. Mobile: fixed bottom bar, thumb
              reach (wireframe explicitly calls this out for mobile only). */}
          <a
            href={waLink(WHATSAPP_STUDIO_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-cta type-meta fixed inset-x-0 bottom-0 z-30 flex items-center justify-center border-x-0 border-b-0 px-4 py-4 text-center md:static md:z-auto md:mt-6 md:px-6 md:py-5"
          >
            {studio.whatsappCtaText}
          </a>
        </div>
      </section>
    </div>
  );
}
