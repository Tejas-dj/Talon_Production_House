#!/usr/bin/env node
/**
 * Removed as part of the Cloudinary -> R2 migration. This script used to
 * pre-warm Cloudinary's on-the-fly image transform cache for every preset/
 * width combination. R2 serves pre-optimized originals directly with no
 * on-the-fly transforms, so there's nothing left to warm. This is a no-op
 * kept only so the postbuild script doesn't break while package.json is
 * updated.
 */
process.exit(0);
