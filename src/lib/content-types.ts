/**
 * Content types for the JSON content layer (Bible §8 / wireframes.html).
 * Field structure and character budgets are taken directly from the
 * wireframes' annotations. See DECISIONS.md "Content layer (Step 6)" for
 * judgment calls made where the wireframes and brief didn't fully agree.
 */

export type VideoCategory = "Commercial" | "Music Video" | "Documentary" | "Brand Film";

export interface Credit {
  /** [8–22 ch] e.g. "Direction", "Cinematography" */
  role: string;
  /** [8–28 ch] */
  name: string;
}

export interface VideoProject {
  slug: string;
  /** [18–48 ch] */
  title: string;
  /** [8–28 ch] */
  client: string;
  /** 4-digit year */
  year: number;
  /** Delivery format / aspect ratio, e.g. "16:9 · 4K" — distinct from `category` (see DECISIONS.md) */
  format: string;
  /** [5–8 ch], e.g. "04:12" */
  runtime: string;
  /** Talon's own role on the project, [8–22 ch] */
  role: string;
  /** 4–10 rows */
  credits: Credit[];
  /** [300–600 ch] */
  synopsis: string;
  /** Filter category — matches the wireframe's TYPE filter chips, [6–14 ch] */
  category: VideoCategory;
  /** Hand-picked Home-page highlight (Phase 3). Selection AND ordering both
   * come from this flag plus the array's own order — no separate order field. */
  featured?: boolean;
  /** Bunny Stream video GUID */
  bunnyVideoId: string;
  /** Cloudinary public id */
  posterImageId: string;
  /** Cloudinary public ids, 2–3 stills per the wireframes */
  stillImageIds: string[];
}

export interface PhotoSeries {
  slug: string;
  /** [12–30 ch] */
  title: string;
  /** Curatorial one-liner, [60–110 ch] */
  statement: string;
  /** Cloudinary public ids. Images carry no captions (Bible §3.4). */
  imageIds: string[];
}

export interface StudioRateRow {
  /** [10–24 ch] */
  item: string;
  /** [6–10 ch], e.g. "₹3,500" */
  price: string;
}

export interface StudioSpaceSpecs {
  /** [20–40 ch] */
  dimensions: string;
  /** [20–40 ch] */
  cycWall: string;
  /** [20–40 ch] */
  power: string;
  /** [20–40 ch] */
  sound: string;
  /** 6–10 rows, each [20–44 ch] */
  gripAndLighting: string[];
  /** [20–44 ch] */
  amenities: string;
}

export interface ClientLogo {
  /** [4–24 ch], used as alt text */
  name: string;
  /** Cloudinary public id, monochrome-treatable SVG/PNG */
  logoId: string;
}

export interface StudioSpace {
  slug: string;
  /** [12–24 ch] */
  name: string;
  /** [16–32 ch], e.g. "Indiranagar, Bengaluru" */
  location: string;
  heroImageId: string;
  galleryImageIds: string[];
  specs: StudioSpaceSpecs;
  rates: {
    hourly: StudioRateRow;
    halfDay: StudioRateRow;
    fullDay: StudioRateRow;
    /** 1+ add-ons */
    equipmentAddOns: StudioRateRow[];
  };
  /** [60–120 ch] */
  terms: string;
  /** [20–34 ch], e.g. "Message us with your date" */
  whatsappCtaText: string;
}
