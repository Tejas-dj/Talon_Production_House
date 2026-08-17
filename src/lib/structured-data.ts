/**
 * JSON-LD builders — the single place structured data gets assembled, same
 * "one place builds this" convention as media/presets.ts and site.ts.
 * Callers embed the result via
 * <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
 */

import { getStudioSpace } from "./content";
import type { VideoProject } from "./content-types";
import { bunnyThumbnailUrl } from "./media/bunny";
import { cloudinaryUrl } from "./media/presets";
import { CONTACT_LINKS, GOOGLE_MAPS_URL, SITE_URL, STUDIO_ADDRESS_PARTS } from "./site";

const ORG_ID = `${SITE_URL}/#organization`;

/** "09:45" -> "PT9M45S", "01:11:21" -> "PT1H11M21S". */
export function runtimeToIso8601(runtime: string): string {
  const parts = runtime.split(":").map(Number);
  const [hours, minutes, seconds] =
    parts.length === 3 ? parts : [0, parts[0] ?? 0, parts[1] ?? 0];
  let duration = "PT";
  if (hours) duration += `${hours}H`;
  if (minutes) duration += `${minutes}M`;
  duration += `${seconds}S`;
  return duration;
}

/**
 * LocalBusiness for the Studio page. No openingHoursSpecification — no real
 * hours exist anywhere in content or site.ts, so it's omitted rather than
 * invented.
 */
export function buildLocalBusinessSchema() {
  const studio = getStudioSpace();
  const phone = CONTACT_LINKS.find((c) => c.label === "Phone");

  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/#local-business`,
    name: "Talon Production House",
    url: SITE_URL,
    image: cloudinaryUrl(studio.heroImageId, "hero", 1200),
    telephone: phone?.handle,
    address: {
      "@type": "PostalAddress",
      streetAddress: STUDIO_ADDRESS_PARTS.street,
      addressLocality: STUDIO_ADDRESS_PARTS.locality,
      addressRegion: STUDIO_ADDRESS_PARTS.region,
      postalCode: STUDIO_ADDRESS_PARTS.postalCode,
      addressCountry: STUDIO_ADDRESS_PARTS.country,
    },
    hasMap: GOOGLE_MAPS_URL,
    parentOrganization: { "@id": ORG_ID },
  };
}

/**
 * VideoObject for a project detail page. thumbnailUrl mirrors the same
 * posterImageId -> Cloudinary, else Bunny-thumbnail fallback already used by
 * the page's own generateMetadata. contentUrl/embedUrl are only included
 * when the Bunny pull zone is configured — mirrors bunnyThumbnailUrl's own
 * graceful-omission pattern rather than throwing.
 */
export function buildVideoObjectSchema(project: VideoProject) {
  const thumbnailUrl = project.posterImageId
    ? cloudinaryUrl(project.posterImageId, "ogImage", 1200)
    : (bunnyThumbnailUrl(project.bunnyVideoId) ?? "");

  const pullZone = process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE;
  const playbackUrl = pullZone
    ? `https://${pullZone}.b-cdn.net/${project.bunnyVideoId}/playlist.m3u8`
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: project.title,
    description: project.synopsis,
    thumbnailUrl,
    uploadDate: `${project.year}-01-01`,
    duration: runtimeToIso8601(project.runtime),
    ...(playbackUrl ? { contentUrl: playbackUrl, embedUrl: playbackUrl } : {}),
  };
}

/** Site-wide Organization, embedded once in the root layout. */
export function buildOrganizationSchema() {
  const phone = CONTACT_LINKS.find((c) => c.label === "Phone");
  const email = CONTACT_LINKS.find((c) => c.label === "Email");
  const instagram = CONTACT_LINKS.find((c) => c.label === "Instagram");
  const youtube = CONTACT_LINKS.find((c) => c.label === "YouTube");

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Talon Production House",
    url: SITE_URL,
    logo: `${SITE_URL}/apple-touch-icon.png`,
    description:
      "Motion production, stills, and studio rental in Bengaluru.",
    foundingDate: "2020",
    address: {
      "@type": "PostalAddress",
      streetAddress: STUDIO_ADDRESS_PARTS.street,
      addressLocality: STUDIO_ADDRESS_PARTS.locality,
      addressRegion: STUDIO_ADDRESS_PARTS.region,
      postalCode: STUDIO_ADDRESS_PARTS.postalCode,
      addressCountry: STUDIO_ADDRESS_PARTS.country,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      ...(email ? { email: email.handle } : {}),
      ...(phone ? { telephone: phone.handle } : {}),
    },
    sameAs: [instagram?.href, youtube?.href].filter(Boolean),
    knowsAbout: ["Video Production", "Photography", "Studio Rental"],
  };
}

/** OfferCatalog listing Talon's three service lines, for the home page. */
export function buildServiceCatalogSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "Talon Production House Services",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Video Production",
          serviceType: "Video Production",
          description:
            "End-to-end production including direction, cinematography, audio production, art direction, and logistics.",
          provider: { "@id": ORG_ID },
          areaServed: { "@type": "City", name: "Bengaluru" },
          url: `${SITE_URL}/work/motion`,
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Photography",
          serviceType: "Photography",
          description:
            "Portrait and product photography, from concept through post-production and delivery.",
          provider: { "@id": ORG_ID },
          areaServed: { "@type": "City", name: "Bengaluru" },
          url: `${SITE_URL}/work/stills`,
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Studio Rental",
          serviceType: "Studio Rental",
          description:
            "Cyclorama studio floor with grip and lighting, equipment rental, and styling area. Hourly, half-day, and full-day sessions.",
          provider: { "@id": ORG_ID },
          areaServed: { "@type": "City", name: "Bengaluru" },
          url: `${SITE_URL}/studio`,
        },
      },
    ],
  };
}

/**
 * ProfilePage + Person schemas for the team page. Returns an array of
 * JSON-LD objects (one ProfilePage per leader) to be serialised as a
 * single array inside one <script> tag.
 */
export function buildTeamProfileSchemas(
  leaders: ReadonlyArray<{
    name: string;
    title: string;
    bio: string;
    portraitId?: string;
  }>,
) {
  return leaders.map((leader) => {
    const slug = leader.name.toLowerCase().replace(/\s+/g, "-");
    return {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      dateModified: new Date().toISOString().split("T")[0],
      mainEntity: {
        "@type": "Person",
        "@id": `${SITE_URL}/team#${slug}`,
        name: leader.name,
        jobTitle: leader.title,
        description: leader.bio,
        worksFor: { "@id": ORG_ID },
        ...(leader.portraitId
          ? { image: cloudinaryUrl(leader.portraitId, "portraitCard", 800) }
          : {}),
      },
    };
  });
}

/** BreadcrumbList for detail pages (motion projects, stills series). */
export function buildBreadcrumbSchema(
  crumbs: ReadonlyArray<{ name: string; url: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };
}
