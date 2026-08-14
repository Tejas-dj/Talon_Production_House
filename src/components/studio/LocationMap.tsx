import { GOOGLE_MAPS_EMBED_SRC, GOOGLE_MAPS_URL } from "@/lib/site";

type LocationMapProps = {
  label: string;
};

/**
 * Real, no-API-key Google Maps embed (GOOGLE_MAPS_EMBED_SRC). No
 * MagneticElement wrapper here on purpose — the pull effect fights an
 * iframe visitors are meant to pan/drag inside, and mousemove doesn't
 * bubble out of an iframe to the document listener anyway.
 */
export function LocationMap({ label }: LocationMapProps) {
  return (
    <div className="hairline bg-surface">
      <div className="aspect-[5/4] w-full">
        <iframe
          src={GOOGLE_MAPS_EMBED_SRC}
          title={`Map showing ${label}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0"
        />
      </div>
      <a
        href={GOOGLE_MAPS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="hairline type-meta flex items-center justify-between px-3 py-2 transition-colors duration-[240ms] ease-shift hover:bg-primary hover:text-page focus-visible:bg-primary focus-visible:text-page"
      >
        Open in Google Maps
        <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}
