/* Single source for shell navigation and contact surfaces.
   Contact hrefs are placeholders until real handles arrive (Phase 3 inputs);
   swap them here and every surface updates. */

export const NAV_ITEMS = [
  { label: "Work", href: "/work" },
  { label: "Photography", href: "/photography" },
  { label: "Studio", href: "/studio" },
  { label: "Contact", href: "/contact" },
] as const;

/* Instagram first — Bible §3.2: the artist audience DMs before it emails. */
export const CONTACT_LINKS = [
  { label: "Instagram", href: "#" }, // TODO: real handle
  { label: "YouTube", href: "#" }, // TODO: real channel
  { label: "Phone", href: "#" }, // TODO: tel: number
  { label: "Email", href: "#" }, // TODO: mailto: address
] as const;

export const CREDIT = {
  label: "CobaltKite Creatives",
  href: "#", // TODO: confirm URL
} as const;
