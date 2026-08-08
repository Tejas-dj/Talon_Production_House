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

/* Real WhatsApp click-to-chat link (WhatsApp Business shortlink) — the
   canonical redirect target for every WhatsApp CTA on the site. */
export const WHATSAPP_LINK = "https://wa.me/message/EYL4S6A5VKIRD1";

/** Returns the site's WhatsApp deep link. Kept as a function (rather than a
   bare constant re-export) so call sites don't need to change if the link
   ever needs per-message routing again. */
export function waLink(_message: string): string {
  return WHATSAPP_LINK;
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

/* Home hero background — the studio's own 24s silent showreel, uploaded to
   Bunny Stream (library 708480) specifically for this purpose. Kept separate
   from `featured` projects: it's a reel, not a client project with a
   client/synopsis/credits, so it shouldn't also render as a Work grid card. */
export const HERO_BUNNY_VIDEO_ID = "80b37aa9-bd62-4afe-a447-175a609f7695";

/* Work overlay — right-hand panel plays this when "Motion" is hovered.
   PLACEHOLDER: reusing an existing featured project's clip until a
   purpose-shot preview is provided. */
export const WORK_OVERLAY_MOTION_PREVIEW_BUNNY_VIDEO_ID = "69681521-f62b-454a-9309-ab97ccd96365";
