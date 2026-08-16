#!/usr/bin/env node
/**
 * Video poster sync: for every Bunny Stream video that has no curated
 * `posterImageId`, fetches Bunny's own auto-generated thumbnail.jpg
 * (server-side, with a Referer header — the pull zone has hotlink
 * protection and 403s any request without one) and uploads it into
 * Cloudinary at a deterministic public id, `talon/video-posters/{videoId}`.
 *
 * Why: Bunny's thumbnail.jpg is a fixed-resolution screenshot (this pull
 * zone has no resize/Optimizer add-on — width/height query params are
 * silently ignored) and Cloudinary's unsigned remote-fetch delivery is
 * disabled on this account, so neither CDN can resize it on the fly.
 * Landing a real copy in Cloudinary once lets every caller
 * (src/lib/media/bunny.ts's bunnyPosterCloudinaryId) route it through the
 * normal <CloudinaryImage> pipeline — responsive srcset, deviceSizes,
 * auto format/quality — same as a hand-curated posterImageId.
 *
 * Safe to re-run: skips any id that already has a Cloudinary asset, and an
 * upload failure for one video never fails the others or the build.
 *
 *   node scripts/sync-video-posters.mjs
 */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

const isPostbuildHook = process.env.npm_lifecycle_event === "postbuild";
if (isPostbuildHook && process.env.VERCEL_ENV !== "production") {
  console.log(
    `Skipping video poster sync (VERCEL_ENV=${process.env.VERCEL_ENV ?? "unset"}, not a production deploy).`,
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
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const pullZone = process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE;

if (!cloudName || !apiKey || !apiSecret || !pullZone) {
  console.error(
    "Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME / CLOUDINARY_API_KEY / CLOUDINARY_API_SECRET / NEXT_PUBLIC_BUNNY_PULL_ZONE (see .env.example).",
  );
  process.exit(isPostbuildHook ? 0 : 1);
}

// Bunny's pull zone blocks thumbnail requests with no (or a mismatched)
// Referer header. Try the configured site URL first, then fall back to the
// known-good production origin in case NEXT_PUBLIC_SITE_URL isn't set to
// match Bunny's allow-listed referrer in this environment.
const REFERER_CANDIDATES = [...new Set([process.env.NEXT_PUBLIC_SITE_URL, "https://www.talonproductionhouse.com/"].filter(Boolean))];

const CONCURRENCY = 4;

function readContent(file) {
  return JSON.parse(readFileSync(path.join(process.cwd(), "content", file), "utf8"));
}

const projects = readContent("projects.json");

// Video ids that need a synced poster: any project without a curated
// posterImageId, plus the hero/overlay ids that are never "projects"
// (src/lib/site.ts) but render exactly the same way through BunnyPlayer.
const HERO_AND_OVERLAY_IDS = [
  "534c8bd1-7e49-49da-aa46-866ad14ad814", // HERO_BUNNY_VIDEO_ID
  "69681521-f62b-454a-9309-ab97ccd96365", // WORK_OVERLAY_MOTION_PREVIEW_BUNNY_VIDEO_ID
  "df769e53-d283-44cf-b180-bee38189ea99", // WORK_OVERLAY_MOBILE_MOTION_BUNNY_VIDEO_ID
];

const videoIds = [
  ...new Set([
    ...projects.filter((p) => !p.posterImageId).map((p) => p.bunnyVideoId),
    ...HERO_AND_OVERLAY_IDS,
  ]),
];

function publicIdFor(videoId) {
  return `talon/video-posters/${videoId}`;
}

async function alreadySynced(videoId) {
  const url = `https://res.cloudinary.com/${cloudName}/image/upload/${publicIdFor(videoId)}`;
  try {
    const res = await fetch(url, { method: "HEAD" });
    return res.ok;
  } catch {
    return false;
  }
}

async function fetchBunnyThumbnail(videoId) {
  const url = `https://${pullZone}.b-cdn.net/${videoId}/thumbnail.jpg`;
  let lastStatus;
  for (const referer of REFERER_CANDIDATES) {
    const res = await fetch(url, { headers: { Referer: referer, "User-Agent": "Mozilla/5.0" } });
    if (res.ok) return Buffer.from(await res.arrayBuffer());
    lastStatus = res.status;
  }
  throw new Error(`Bunny thumbnail fetch failed (last status ${lastStatus}) for ${videoId}`);
}

async function uploadToCloudinary(videoId, bytes) {
  const publicId = publicIdFor(videoId);
  const timestamp = Math.floor(Date.now() / 1000);
  const paramsToSign = { overwrite: true, public_id: publicId, timestamp };
  const signatureBase = Object.keys(paramsToSign)
    .sort()
    .map((k) => `${k}=${paramsToSign[k]}`)
    .join("&");
  const signature = createHash("sha1").update(signatureBase + apiSecret).digest("hex");

  const form = new FormData();
  form.append("file", new Blob([bytes], { type: "image/jpeg" }), `${videoId}.jpg`);
  form.append("public_id", publicId);
  form.append("overwrite", "true");
  form.append("timestamp", String(timestamp));
  form.append("api_key", apiKey);
  form.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: form,
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(`Cloudinary upload failed: HTTP ${res.status} ${JSON.stringify(body)}`);
  }
  return body;
}

console.log(`Checking ${videoIds.length} video poster(s)...`);

let synced = 0;
let skipped = 0;
let failed = 0;
let cursor = 0;

async function worker() {
  while (cursor < videoIds.length) {
    const videoId = videoIds[cursor++];
    try {
      if (await alreadySynced(videoId)) {
        skipped++;
        continue;
      }
      const bytes = await fetchBunnyThumbnail(videoId);
      await uploadToCloudinary(videoId, bytes);
      synced++;
      console.log(`  + synced ${videoId} (${(bytes.length / 1024).toFixed(1)} KiB source)`);
    } catch (err) {
      failed++;
      console.warn(`  ! ${videoId}: ${err.message}`);
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));

console.log(`Done — ${synced} synced, ${skipped} already up to date, ${failed} failed.`);
// A poster sync failure should never fail a production deploy — BunnyPlayer
// and ProjectThumb still work without it (see src/lib/media/bunny.ts).
if (failed > 0 && !isPostbuildHook) process.exitCode = 1;
