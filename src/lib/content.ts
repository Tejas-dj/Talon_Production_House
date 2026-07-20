import { readFileSync } from "node:fs";
import path from "node:path";
import type {
  ClientLogo,
  Credit,
  PhotoSeries,
  StudioSpace,
  VideoCategory,
  VideoProject,
} from "./content-types";

/**
 * Server-only JSON content loader with build-time validation. Next.js static
 * generation (generateStaticParams / page render) imports these functions
 * during `next build`, so a malformed entry throws here and fails the build
 * rather than shipping — this file must never be imported by a Client
 * Component. Deliberately hand-rolled type guards rather than a schema
 * library: three small, stable shapes, one maintainer (see DECISIONS.md).
 */

const CONTENT_DIR = path.join(process.cwd(), "content");
const VIDEO_CATEGORIES: VideoCategory[] = [
  "Commercial",
  "Music Video",
  "Documentary",
  "Brand Film",
  "Short Film",
];

function readJson(file: string): unknown {
  const raw = readFileSync(path.join(CONTENT_DIR, file), "utf8");
  return JSON.parse(raw);
}

function fail(file: string, index: number, message: string): never {
  throw new Error(`content/${file}: entry ${index} ${message}`);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function assertCredit(
  value: unknown,
  file: string,
  index: number,
  i: number,
): asserts value is Credit {
  const c = value as Partial<Credit> | null;
  if (!c || typeof c !== "object") fail(file, index, `credit ${i} is not an object`);
  if (!isNonEmptyString(c.role)) fail(file, index, `credit ${i} is missing "role"`);
  if (!isNonEmptyString(c.name)) fail(file, index, `credit ${i} is missing "name"`);
}

function assertVideoProject(value: unknown, index: number): asserts value is VideoProject {
  const file = "projects.json";
  const p = value as Partial<VideoProject> | null;
  if (!p || typeof p !== "object") fail(file, index, "is not an object");
  if (!isNonEmptyString(p.slug)) fail(file, index, 'is missing "slug"');
  if (!isNonEmptyString(p.title)) fail(file, index, `"${p.slug}" is missing "title"`);
  if (!isNonEmptyString(p.client)) fail(file, index, `"${p.slug}" is missing "client"`);
  if (typeof p.year !== "number") fail(file, index, `"${p.slug}" is missing a numeric "year"`);
  if (!isNonEmptyString(p.format)) fail(file, index, `"${p.slug}" is missing "format"`);
  if (!isNonEmptyString(p.runtime)) fail(file, index, `"${p.slug}" is missing "runtime"`);
  if (!isNonEmptyString(p.role)) fail(file, index, `"${p.slug}" is missing "role"`);
  if (!isNonEmptyString(p.synopsis)) fail(file, index, `"${p.slug}" is missing "synopsis"`);
  if (!p.category || !VIDEO_CATEGORIES.includes(p.category)) {
    fail(file, index, `"${p.slug}" has invalid "category" ${JSON.stringify(p.category)}`);
  }
  if (!isNonEmptyString(p.bunnyVideoId)) fail(file, index, `"${p.slug}" is missing "bunnyVideoId"`);
  if (p.posterImageId !== undefined && !isNonEmptyString(p.posterImageId)) {
    fail(file, index, `"${p.slug}" has an invalid "posterImageId"`);
  }
  if (!Array.isArray(p.credits) || p.credits.length === 0) {
    fail(file, index, `"${p.slug}" is missing "credits"`);
  }
  p.credits.forEach((c, i) => assertCredit(c, file, index, i));
  if (p.stillImageIds !== undefined) {
    if (!Array.isArray(p.stillImageIds)) {
      fail(file, index, `"${p.slug}" has an invalid "stillImageIds"`);
    }
    if (!p.stillImageIds.every(isNonEmptyString)) {
      fail(file, index, `"${p.slug}" has a non-string entry in "stillImageIds"`);
    }
  }
}

function assertPhotoSeries(value: unknown, index: number): asserts value is PhotoSeries {
  const file = "photography.json";
  const s = value as Partial<PhotoSeries> | null;
  if (!s || typeof s !== "object") fail(file, index, "is not an object");
  if (!isNonEmptyString(s.slug)) fail(file, index, 'is missing "slug"');
  if (!isNonEmptyString(s.title)) fail(file, index, `"${s.slug}" is missing "title"`);
  if (!isNonEmptyString(s.statement)) fail(file, index, `"${s.slug}" is missing "statement"`);
  if (!Array.isArray(s.imageIds) || s.imageIds.length === 0) {
    fail(file, index, `"${s.slug}" is missing "imageIds"`);
  }
  if (!s.imageIds.every(isNonEmptyString)) {
    fail(file, index, `"${s.slug}" has a non-string entry in "imageIds"`);
  }
}

function assertRateRow(value: unknown, file: string, index: number, label: string): void {
  const r = value as { item?: unknown; price?: unknown } | null;
  if (!r || typeof r !== "object") fail(file, index, `${label} is not an object`);
  if (!isNonEmptyString(r.item)) fail(file, index, `${label} is missing "item"`);
  if (!isNonEmptyString(r.price)) fail(file, index, `${label} is missing "price"`);
}

function assertStudioSpace(value: unknown, index: number): asserts value is StudioSpace {
  const file = "studio.json";
  const s = value as Partial<StudioSpace> | null;
  if (!s || typeof s !== "object") fail(file, index, "is not an object");
  if (!isNonEmptyString(s.slug)) fail(file, index, 'is missing "slug"');
  if (!isNonEmptyString(s.name)) fail(file, index, `"${s.slug}" is missing "name"`);
  if (!isNonEmptyString(s.location)) fail(file, index, `"${s.slug}" is missing "location"`);
  if (!isNonEmptyString(s.heroImageId)) fail(file, index, `"${s.slug}" is missing "heroImageId"`);
  if (!Array.isArray(s.galleryImageIds) || s.galleryImageIds.length === 0) {
    fail(file, index, `"${s.slug}" is missing "galleryImageIds"`);
  }
  const specs = s.specs as Partial<StudioSpace["specs"]> | undefined;
  if (!specs) fail(file, index, `"${s.slug}" is missing "specs"`);
  for (const key of ["dimensions", "cycWall", "power", "sound", "amenities"] as const) {
    if (!isNonEmptyString(specs[key])) fail(file, index, `"${s.slug}" specs.${key} is missing`);
  }
  if (!Array.isArray(specs.gripAndLighting) || specs.gripAndLighting.length === 0) {
    fail(file, index, `"${s.slug}" specs.gripAndLighting is missing`);
  }
  const rates = s.rates as Partial<StudioSpace["rates"]> | undefined;
  if (!rates) fail(file, index, `"${s.slug}" is missing "rates"`);
  assertRateRow(rates.hourly, file, index, `"${s.slug}" rates.hourly`);
  assertRateRow(rates.halfDay, file, index, `"${s.slug}" rates.halfDay`);
  assertRateRow(rates.fullDay, file, index, `"${s.slug}" rates.fullDay`);
  if (!Array.isArray(rates.equipmentAddOns) || rates.equipmentAddOns.length === 0) {
    fail(file, index, `"${s.slug}" rates.equipmentAddOns is missing`);
  }
  rates.equipmentAddOns.forEach((row, i) =>
    assertRateRow(row, file, index, `"${s.slug}" rates.equipmentAddOns[${i}]`),
  );
  if (!isNonEmptyString(s.terms)) fail(file, index, `"${s.slug}" is missing "terms"`);
  if (!isNonEmptyString(s.whatsappCtaText))
    fail(file, index, `"${s.slug}" is missing "whatsappCtaText"`);
}

function assertClientLogo(value: unknown, index: number): asserts value is ClientLogo {
  const file = "clients.json";
  const c = value as Partial<ClientLogo> | null;
  if (!c || typeof c !== "object") fail(file, index, "is not an object");
  if (!isNonEmptyString(c.name)) fail(file, index, 'is missing "name"');
  if (!isNonEmptyString(c.logoId)) fail(file, index, `"${c.name}" is missing "logoId"`);
}

function loadAndValidate<T>(
  file: string,
  assertItem: (value: unknown, index: number) => asserts value is T,
): T[] {
  const data = readJson(file);
  if (!Array.isArray(data))
    throw new Error(`content/${file}: expected a JSON array at the top level`);
  data.forEach((item, index) => assertItem(item, index));
  return data as T[];
}

// Validated once per process (module-level), so every import — including
// during `next build`'s static generation — pays for validation exactly once
// and fails loudly on the first bad entry.
const projects = loadAndValidate("projects.json", assertVideoProject);
const photography = loadAndValidate("photography.json", assertPhotoSeries);
const studioSpaces = loadAndValidate("studio.json", assertStudioSpace);
const clientLogos = loadAndValidate("clients.json", assertClientLogo);

export function getAllProjects(): VideoProject[] {
  return projects;
}

export function getProjectBySlug(slug: string): VideoProject | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAllPhotoSeries(): PhotoSeries[] {
  return photography;
}

export function getPhotoSeriesBySlug(slug: string): PhotoSeries | undefined {
  return photography.find((s) => s.slug === slug);
}

export function getAllStudioSpaces(): StudioSpace[] {
  return studioSpaces;
}

export function getStudioSpaceBySlug(slug: string): StudioSpace | undefined {
  return studioSpaces.find((s) => s.slug === slug);
}

/** The site currently rents a single physical space; Studio is a one-space page. */
export function getStudioSpace(): StudioSpace {
  const space = studioSpaces[0];
  if (!space) throw new Error("content/studio.json: no studio space defined");
  return space;
}

export function getAllClientLogos(): ClientLogo[] {
  return clientLogos;
}
