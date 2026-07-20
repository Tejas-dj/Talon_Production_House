/* Single source for shell navigation and contact surfaces.
   Contact hrefs are placeholders until real handles arrive (Phase 3 inputs);
   swap them here and every surface updates. */

export const NAV_ITEMS = [
  { label: "Work", href: "/work" },
  { label: "Photography", href: "/photography" },
  { label: "Studio", href: "/studio" },
  { label: "Contact", href: "/contact" },
] as const;

/* Base URL for canonical links, OG/twitter `url` fields, sitemap.ts, and
   robots.ts — one source instead of the fallback repeated in each file. */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/* TODO: real WhatsApp business number, digits only (country code + number,
   no "+" or spaces), e.g. "919876543210". Phase 3 input, not yet supplied. */
export const WHATSAPP_NUMBER = "911234567890";

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
  { label: "Instagram", handle: "@talonproductionhouse", href: "https://instagram.com/talonproductionhouse", external: true }, // TODO: real handle
  { label: "YouTube", handle: "Talon Production House", href: "https://youtube.com/@talonproductionhouse", external: true }, // TODO: real channel
  { label: "Phone", handle: "+91 12345 67890", href: "tel:+911234567890", external: false }, // TODO: real number
  { label: "Email", handle: "hello@talonproductionhouse.com", href: "mailto:hello@talonproductionhouse.com", external: false }, // TODO: real address
] as const;

export const CREDIT = {
  label: "CobaltKite Creatives",
  href: "#", // TODO: confirm URL
} as const;
