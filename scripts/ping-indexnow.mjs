#!/usr/bin/env node
/**
 * Submits all site URLs to IndexNow (Bing, Yandex, and Google via the
 * shared IndexNow protocol) so search engines discover new or updated
 * pages immediately after a deploy instead of waiting for a crawl cycle.
 *
 * Usage:
 *   node scripts/ping-indexnow.mjs                  # submit all URLs
 *   node scripts/ping-indexnow.mjs --stills-only    # submit only /work/stills/* URLs
 *
 * The script fetches the live sitemap.xml from the production site,
 * extracts every <loc>, and POSTs them to the IndexNow API in a single
 * batch request (max 10 000 URLs per call).
 */

const SITE_URL = "https://www.talonproductionhouse.com";
const KEY = "0f7c19c2fe609e44067754fcf1e7dc99";
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/IndexNow";

const stillsOnly = process.argv.includes("--stills-only");

async function fetchSitemapUrls() {
  const res = await fetch(`${SITE_URL}/sitemap.xml`);
  if (!res.ok) throw new Error(`Failed to fetch sitemap: ${res.status}`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  return urls;
}

async function main() {
  console.log("Fetching sitemap...");
  let urls = await fetchSitemapUrls();

  if (stillsOnly) {
    urls = urls.filter((u) => u.includes("/work/stills/") && !u.endsWith("/work/stills"));
  }

  if (urls.length === 0) {
    console.log("No URLs to submit.");
    return;
  }

  console.log(`Submitting ${urls.length} URL(s) to IndexNow...`);

  const body = {
    host: new URL(SITE_URL).host,
    key: KEY,
    keyLocation: `${SITE_URL}/${KEY}.txt`,
    urlList: urls,
  };

  const res = await fetch(INDEXNOW_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });

  if (res.ok || res.status === 202) {
    console.log(`Done. IndexNow accepted ${urls.length} URL(s). (HTTP ${res.status})`);
  } else {
    const text = await res.text().catch(() => "");
    console.error(`IndexNow returned HTTP ${res.status}: ${text}`);
    process.exitCode = 1;
  }

  if (stillsOnly) {
    console.log("\nSubmitted stills URLs:");
    urls.forEach((u) => console.log(`  ${u}`));
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
