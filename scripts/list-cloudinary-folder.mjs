#!/usr/bin/env node
/**
 * One-off lookup: list assets in a Cloudinary folder via the Admin API so we
 * can grab public IDs + dimensions without the console. Reads creds from
 * .env.local. Not part of the app build.
 *
 * Usage: node scripts/list-cloudinary-folder.mjs "Talon_Production_House/Studio_Images"
 */
import { readFileSync } from "node:fs";
import path from "node:path";

const envPath = path.join(process.cwd(), ".env.local");
for (const line of readFileSync(envPath, "utf8").split("\n")) {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] ??= m[2].trim();
}

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const folder = process.argv[2];

if (!cloudName || !apiKey || !apiSecret || !folder) {
  console.error("Missing cloudName/apiKey/apiSecret/folder argument");
  process.exit(1);
}

const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

async function tryEndpoint(label, url) {
  console.log(`\n--- ${label} ---\n${url}`);
  const res = await fetch(url, { headers: { Authorization: `Basic ${auth}` } });
  const body = await res.json();
  if (!res.ok) {
    console.log(`HTTP ${res.status}:`, JSON.stringify(body));
    return null;
  }
  return body;
}

const byAssetFolder = await tryEndpoint(
  "by_asset_folder",
  `https://api.cloudinary.com/v1_1/${cloudName}/resources/by_asset_folder?asset_folder=${encodeURIComponent(folder)}&max_results=30`,
);

const byPrefix = await tryEndpoint(
  "prefix search",
  `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?type=upload&prefix=${encodeURIComponent(folder + "/")}&max_results=30`,
);

for (const [label, body] of [
  ["by_asset_folder", byAssetFolder],
  ["prefix", byPrefix],
]) {
  if (body?.resources?.length) {
    console.log(`\n=== ${label} results (${body.resources.length}) ===`);
    for (const r of body.resources) {
      const orientation = r.width >= r.height ? "landscape" : "portrait";
      console.log(
        `${r.public_id}  ${r.width}x${r.height}  ${orientation}  ${r.format}  ${r.secure_url}`,
      );
    }
  }
}
