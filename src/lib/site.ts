/* Single source for shell navigation and contact surfaces.
   Real values as of Phase 3.5 — swap them here and every surface updates. */

export const NAV_ITEMS = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "The Team", href: "/team" },
  { label: "Studio", href: "/studio" },
  { label: "Contact", href: "/contact" },
] as const;

/* Base URL for canonical links, OG/twitter `url` fields, sitemap.ts, and
   robots.ts — one source instead of the fallback repeated in each file. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/* Real WhatsApp business number, digits only (country code + number, no "+"
   or spaces) — required format for wa.me deep links. Same number the
   business shortlink https://wa.me/message/EYL4S6A5VKIRD1 resolves to;
   using the number form directly here because the shortlink drops any
   "?text=" param instead of carrying it through to the prefilled chat. */
export const WHATSAPP_NUMBER = "917075981258";

/** Builds a wa.me deep link with a correctly encoded prefilled message. */
export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/* Studio booking enquiry — brief's exact template, §Studio CTA. */
export const WHATSAPP_STUDIO_MESSAGE =
  "Hi, I found Talon Production House on your website and I'd like to enquire about studio rental. " +
  "Date: [preferred date]. Type: [photo shoot / video shoot / other]. Looking forward to hearing from you.";

/* General contact-page greeting — same channel, lower-friction message. */
export const WHATSAPP_GENERAL_MESSAGE =
  "Hi, I found Talon Production House on your website and I'd like to get in touch.";

/* Instagram first — Bible §3.2: the artist audience DMs before it emails.
   `external` drives target="_blank" rel="noopener noreferrer" on Footer and
   Contact links; mailto:/tel:/wa.me hrefs are same-tab. */
export const CONTACT_LINKS = [
  {
    label: "Instagram",
    handle: "@talon_production_house",
    href: "https://www.instagram.com/talon_production_house?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
    external: true,
  },
  {
    label: "YouTube",
    handle: "Talon Production House",
    href: "https://www.youtube.com/@talonproductionhouse",
    external: true,
  },
  { label: "Phone", handle: "+91 70759 81258", href: "tel:+917075981258", external: false },
  {
    label: "Email",
    handle: "prathamrajeurs@talonproductionhouse.com",
    href: "mailto:prathamrajeurs@talonproductionhouse.com",
    external: false,
  },
] as const;

export const CREDIT = {
  label: "CobaltKite Creatives",
  href: "#", // TODO: confirm URL
} as const;

/* Verified Google Business Profile listing — same "Share" link Maps gives
   out for the pin itself, so Get Directions opens the exact right result
   instead of a text search that could resolve to a different place. */
export const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/AN8zJB55D4doFdeL6";

/* No-API-key embed source for the Studio page iframe. Coordinates resolved
   from GOOGLE_MAPS_URL's own redirect (12.9057652, 77.588443) rather than a
   name-only text search, so the embedded pin lands on the exact verified
   listing instead of whatever a "Talon Production House" search happens to
   rank first. */
export const GOOGLE_MAPS_EMBED_SRC =
  "https://maps.google.com/maps?q=Talon+Production+House@12.9057652,77.588443&z=16&output=embed";

/* Real postal address, broken into parts so both the display string below
   and structured-data.ts's schema.org PostalAddress derive from one source
   instead of two copies drifting apart. */
export const STUDIO_ADDRESS_PARTS = {
  street: "#12, 4th Floor, 16th Cross, 20th Main, Opp. Samved School, J. P. Nagar 5th Phase",
  locality: "Bengaluru",
  region: "Karnataka",
  postalCode: "560078",
  country: "IN",
} as const;

export const STUDIO_ADDRESS =
  `${STUDIO_ADDRESS_PARTS.street}, ${STUDIO_ADDRESS_PARTS.locality} – ${STUDIO_ADDRESS_PARTS.postalCode}`;

/* Home hero background — the studio's own 24s silent showreel, uploaded to
   Bunny Stream (library 708480) specifically for this purpose. Kept separate
   from `featured` projects: it's a reel, not a client project with a
   client/synopsis/credits, so it shouldn't also render as a Work grid card. */
export const HERO_BUNNY_VIDEO_ID = "534c8bd1-7e49-49da-aa46-866ad14ad814";

/* Work overlay — right-hand panel plays this when "Motion" is hovered.
   PLACEHOLDER: reusing an existing featured project's clip until a
   purpose-shot preview is provided. */
export const WORK_OVERLAY_MOTION_PREVIEW_BUNNY_VIDEO_ID = "69681521-f62b-454a-9309-ab97ccd96365";

/* Work overlay — mobile Motion card background. Autoplays the Shazia Khan
   AD spot (see content/projects.json, slug "shazia-khan-ad") as a silent,
   looping preview instead of a static thumbnail. */
export const WORK_OVERLAY_MOBILE_MOTION_BUNNY_VIDEO_ID = "df769e53-d283-44cf-b180-bee38189ea99";
