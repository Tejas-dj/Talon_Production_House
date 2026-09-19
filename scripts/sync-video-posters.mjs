#!/usr/bin/env node
/**
 * Removed as part of the Cloudinary -> R2 migration. This script used to
 * fetch Bunny Stream's auto-generated video thumbnails and upload them into
 * Cloudinary so uncurated projects had a poster image. R2 doesn't need this
 * step (src/lib/media/bunny.ts's bunnyThumbnailUrl and the sitemap/structured
 * data/OG-image fallbacks now point straight at the Bunny thumbnail URL), so
 * this is a no-op kept only so the postbuild script doesn't break while
 * package.json is updated.
 */
process.exit(0);
