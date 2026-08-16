#!/usr/bin/env node
/**
 * Cache warm-up: requests every image referenced in content/*.json at every
 * derived size the site can ever request it at (all next.config.ts
 * images.deviceSizes widths, crossed with every preset — src/lib/media/
 * presets.ts — that actually renders that image), plus a blur placeholder
 * for images that get one (Lightbox, Studio hero). Source photos can be
 * ~7000px; the first request for a given derived size makes Cloudinary
 * generate it from scratch (a couple of seconds), after which it's served
 * from cache in under 100ms. This script eats that first-time cost itself
 * instead of a real visitor. Safe to re-run — already-warm URLs just come
 * back fast.
 *
 * Runs automatically as a `postbuild` step on Vercel production deploys
 * (skipped on preview deploys and local `npm run build`, both of which
 * leave VERCEL_ENV unset or non-"production"). Also runnable directly:
 *
 *   node scripts/warm-cloudinary-cache.mjs
 */
import { readFileSync } from "node:fs";
import path from "node:path";

const isPostbuildHook = process.env.npm_lifecycle_event === "postbuild";
if (isPostbuildHook && process.env.VERCEL_ENV !== "production") {
  console.log(
    `Skipping Cloudinary cache warm-up (VERCEL_ENV=${process.env.VERCEL_ENV ?? "unset"}, not a production deploy).`,
  );
  process.exit(0);
}

try {
  const envPath = path.join(process.cwd(), ".env.local");
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) process.env[m[1]] ??= m[2].trim();
  }
} catch {
  // No .env.local (e.g. on Vercel, where env vars are already injected).
}

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
if (!cloudName) {
  console.error("Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME (see .env.example).");
  // As a postbuild hook this is a nice-to-have, not a build gate — never
  // fail a production deploy over a cache warm-up that couldn't start.
  process.exit(isPostbuildHook ? 0 : 1);
}

// Mirrors next.config.ts images.deviceSizes.
const WIDTHS = [640, 828, 1080, 1600, 1920, 2560];
const CONCURRENCY = 6;

// Mirrors src/lib/media/presets.ts CLOUDINARY_PRESETS transforms — keep in
// sync if a preset's crop/aspect changes there.
const PRESET_TRANSFORMS = {
  thumbnail: "c_fill,g_auto,ar_16:9",
  gallery: "c_fill,g_auto",
  hero: "c_fill,g_auto",
  poster: "c_fill,g_auto,ar_16:9",
  lightbox: "c_limit",
  portraitCard: "c_fill,g_auto,ar_3:4",
};

function derivedUrl(publicId, preset, width) {
  return `https://res.cloudinary.com/${cloudName}/image/upload/${PRESET_TRANSFORMS[preset]},q_auto,f_auto,w_${width}/${publicId}`;
}
function blurUrl(publicId) {
  return `https://res.cloudinary.com/${cloudName}/image/upload/c_limit,w_32,e_blur:1500,q_auto:low,f_auto/${publicId}`;
}

function readContent(file) {
  return JSON.parse(readFileSync(path.join(process.cwd(), "content", file), "utf8"));
}

const photography = readContent("photography.json");
const projects = readContent("projects.json");
const studioSpaces = readContent("studio.json");

const jobs = [];
const seen = new Set();

function addJob(url, key) {
  if (seen.has(key)) return;
  seen.add(key);
  jobs.push(url);
}

function addImage(publicId, presets, { blur = false } = {}) {
  if (!publicId) return;
  if (blur) addJob(blurUrl(publicId), `blur:${publicId}`);
  for (const preset of presets) {
    for (const width of WIDTHS) {
      addJob(derivedUrl(publicId, preset, width), `${preset}:${width}:${publicId}`);
    }
  }
}

// Stills page: Lightbox + the portrait fan/carousel previews.
for (const series of photography) {
  for (const id of series.imageIds) addImage(id, ["lightbox", "portraitCard"], { blur: true });
}

// Work grid thumbnails, project detail poster, and project stills gallery/lightbox.
// Projects with no posterImageId fall back to their synced Bunny-thumbnail
// copy (scripts/sync-video-posters.mjs, which runs immediately before this
// script in postbuild) — warm that derived id too, same as a curated one.
for (const project of projects) {
  const posterId = project.posterImageId ?? `talon/video-posters/${project.bunnyVideoId}`;
  addImage(posterId, ["thumbnail", "poster"]);
  for (const id of project.stillImageIds ?? [])
    addImage(id, ["gallery", "lightbox"], { blur: true });
}

// Hero showreel + Work overlay motion previews — same fallback, not "projects".
const HERO_AND_OVERLAY_VIDEO_IDS = [
  "534c8bd1-7e49-49da-aa46-866ad14ad814", // HERO_BUNNY_VIDEO_ID
  "69681521-f62b-454a-9309-ab97ccd96365", // WORK_OVERLAY_MOTION_PREVIEW_BUNNY_VIDEO_ID
  "df769e53-d283-44cf-b180-bee38189ea99", // WORK_OVERLAY_MOBILE_MOTION_BUNNY_VIDEO_ID
];
for (const videoId of HERO_AND_OVERLAY_VIDEO_IDS) {
  addImage(`talon/video-posters/${videoId}`, ["thumbnail", "poster"]);
}

// Studio hero + gallery (rendered as "gallery" or "portraitCard" depending on count).
for (const space of studioSpaces) {
  addImage(space.heroImageId, ["hero"], { blur: true });
  for (const id of space.galleryImageIds) addImage(id, ["gallery", "portraitCard"]);
}

console.log(`Warming ${jobs.length} derived images (concurrency ${CONCURRENCY})...`);

const startedAt = Date.now();
let cursor = 0;
let done = 0;
let failed = 0;

async function worker() {
  while (cursor < jobs.length) {
    const url = jobs[cursor++];
    try {
      const res = await fetch(url);
      await res.arrayBuffer();
      if (!res.ok) {
        failed++;
        console.warn(`  ! ${res.status} ${url}`);
      }
    } catch (err) {
      failed++;
      console.warn(`  ! ${err.message} ${url}`);
    }
    done++;
    if (done % 50 === 0 || done === jobs.length) {
      const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
      console.log(`  ${done}/${jobs.length} (${elapsed}s elapsed, ${failed} failed)`);
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));

const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);
console.log(`Done in ${elapsed}s — ${jobs.length - failed}/${jobs.length} succeeded.`);
// Same reasoning as the missing-cloud-name check above: a partial warm-up
// failure (a flaky request, a bad id) should never fail a production build.
if (failed > 0 && !isPostbuildHook) process.exitCode = 1;
