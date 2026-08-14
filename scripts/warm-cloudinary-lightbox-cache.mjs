#!/usr/bin/env node
/**
 * One-time cache warm-up: requests every Stills photo at every width the
 * Lightbox can ever ask for (see next.config.ts images.deviceSizes), plus
 * the blur placeholder. These are ~7000px source photos — the first time
 * anyone requests a given derived size, Cloudinary has to generate it from
 * scratch (a couple of seconds); after that it's served from cache in
 * under 100ms. This script eats that first-time cost itself instead of a
 * real visitor. Safe to re-run — already-warm URLs just come back fast.
 *
 * Usage: node scripts/warm-cloudinary-lightbox-cache.mjs
 */
import { readFileSync } from "node:fs";
import path from "node:path";

const envPath = path.join(process.cwd(), ".env.local");
for (const line of readFileSync(envPath, "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] ??= m[2].trim();
}

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
if (!cloudName) {
  console.error("Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME in .env.local");
  process.exit(1);
}

// Mirrors next.config.ts images.deviceSizes — the full set of widths the
// Lightbox preset's "sizes" rule (src/lib/media/presets.ts) can resolve to.
const LIGHTBOX_WIDTHS = [640, 828, 1080, 1600, 1920, 2560];
const CONCURRENCY = 6;

const photography = JSON.parse(
  readFileSync(path.join(process.cwd(), "content/photography.json"), "utf8"),
);
const imageIds = photography.flatMap((series) => series.imageIds);

function lightboxUrl(publicId, width) {
  return `https://res.cloudinary.com/${cloudName}/image/upload/c_limit,q_auto,f_auto,w_${width}/${publicId}`;
}
function blurUrl(publicId) {
  return `https://res.cloudinary.com/${cloudName}/image/upload/c_limit,w_32,e_blur:1500,q_auto:low,f_auto/${publicId}`;
}

const jobs = imageIds.flatMap((id) => [
  blurUrl(id),
  ...LIGHTBOX_WIDTHS.map((w) => lightboxUrl(id, w)),
]);

console.log(
  `Warming ${jobs.length} derived images across ${imageIds.length} Stills photos (concurrency ${CONCURRENCY})...`,
);

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
if (failed > 0) process.exitCode = 1;
