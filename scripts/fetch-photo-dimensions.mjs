#!/usr/bin/env node
/**
 * Fetches original dimensions for every photography image from Cloudinary's
 * server-timing response header. Run once after updating photography.json
 * with new image IDs; output is committed so the gallery can use real
 * aspect ratios without runtime fetches.
 *
 * Usage: node scripts/fetch-photo-dimensions.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content");
const CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dhahzowek";

const photography = JSON.parse(
  readFileSync(path.join(CONTENT_DIR, "photography.json"), "utf8"),
);
const allIds = photography.flatMap((s) => s.imageIds);
const uniqueIds = [...new Set(allIds)];

console.log(
  `Fetching dimensions for ${uniqueIds.length} unique images from "${CLOUD_NAME}"...`,
);

async function getDimensions(id) {
  const url = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_1,c_limit/${id}`;
  const res = await fetch(url, { method: "HEAD" });
  if (!res.ok) {
    console.warn(`  ✗ ${id}: HTTP ${res.status}`);
    return null;
  }
  const timing = res.headers.get("server-timing") || "";
  const wMatch = timing.match(/owidth=(\d+)/);
  const hMatch = timing.match(/oheight=(\d+)/);
  if (!wMatch || !hMatch) {
    console.warn(`  ✗ ${id}: no dimensions in server-timing header`);
    return null;
  }
  return { w: parseInt(wMatch[1], 10), h: parseInt(hMatch[1], 10) };
}

const dims = {};
const BATCH = 10;
for (let i = 0; i < uniqueIds.length; i += BATCH) {
  const batch = uniqueIds.slice(i, i + BATCH);
  const results = await Promise.all(
    batch.map(async (id) => [id, await getDimensions(id)]),
  );
  for (const [id, d] of results) {
    if (d) dims[id] = d;
  }
  const done = Math.min(i + BATCH, uniqueIds.length);
  process.stdout.write(`  ${done}/${uniqueIds.length}\r`);
}

console.log();

const outPath = path.join(CONTENT_DIR, "photo-dimensions.json");
writeFileSync(outPath, JSON.stringify(dims, null, 2) + "\n");
console.log(
  `Done. Wrote ${Object.keys(dims).length}/${uniqueIds.length} entries → content/photo-dimensions.json`,
);
