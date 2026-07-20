#!/usr/bin/env node
/**
 * One-off/regenerate-on-demand asset pipeline derived from the client-supplied
 * source vectors (public/images/logo/TALON_Logo_{Light,Dark}Theme.svg).
 * Not part of the build — run manually (`node scripts/generate-logo-assets.mjs`)
 * whenever the source logo files change. Produces:
 *
 *  - public/images/logo/talon-mark-{light,dark}.svg
 *    Full-color TALON + wedge (no "PRODUCTION HOUSE" subtext — illegible at
 *    header/favicon scale), tightly cropped from the supplied full lockup.
 *    Used by the Header (small scale) and as the source for the favicon set
 *    below — the wedge is the mark's most recognizable feature, so it stays
 *    in every size, not just the large Footer lockup.
 *  - public/favicon-{16x16,32x32,dark-16x16,dark-32x32}.png,
 *    public/apple-touch-icon.png, public/icon-192.png, public/icon-512.png
 *    Rendered from the same talon-mark SVGs. Light-source used for the
 *    default/light-chrome favicon, dark-source for the
 *    prefers-color-scheme:dark variant and apple-touch-icon (solid bg).
 *  - src/app/favicon.ico
 *    16+32 px PNG-in-ICO container (modern-browser-supported format).
 */
import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// TALON-word band in the shared 1050x660 source viewBox (excludes the
// "PRODUCTION HOUSE" subordinate line, which starts ~y404) — see DECISIONS.md.
const WORDMARK_BAND = { x: 0, y: 170, w: 1050, h: 225 };

function readSvg(name) {
  return readFileSync(path.join(ROOT, "public/images/logo", name), "utf8");
}

function writeOut(relPath, contents) {
  writeFileSync(path.join(ROOT, relPath), contents);
  console.log("wrote", relPath);
}

function withViewBox(svg, box) {
  let out = svg
    .replace(/width="[^"]*"/, `width="${box.w}"`)
    .replace(/height="[^"]*"/, `height="${box.h}"`);
  const vb = `viewBox="${box.x} ${box.y} ${box.w} ${box.h}"`;
  out = out.includes("viewBox") ? out.replace(/viewBox="[^"]*"/, vb) : out.replace("<svg ", `<svg ${vb} `);
  return out;
}

async function trimmedViewBox(svgBuffer, base) {
  // No density override: sharp/librsvg's default (72dpi) is what makes a
  // bare unitless width/height map 1 raster px = 1 SVG user unit, so the
  // trim offsets translate directly onto viewBox coordinates. Passing an
  // explicit density (e.g. 96) rescales the raster by density/72 first,
  // which silently breaks that 1:1 correspondence.
  const { info } = await sharp(svgBuffer).trim().toBuffer({ resolveWithObject: true });
  // trimOffsetLeft/Top are relative to `svgBuffer`'s own viewBox origin
  // (`base`), not the original file's coordinate space — add it back so the
  // returned box can be applied directly to the untouched original source.
  return {
    x: base.x - info.trimOffsetLeft,
    y: base.y - info.trimOffsetTop,
    w: info.width,
    h: info.height,
  };
}

async function buildMark(themeName, sourceFile) {
  const source = readSvg(sourceFile);
  const banded = withViewBox(source, WORDMARK_BAND);
  const box = await trimmedViewBox(Buffer.from(banded), WORDMARK_BAND);
  const tight = withViewBox(source, box);
  writeOut(`public/images/logo/talon-mark-${themeName}.svg`, tight);
  return { box, svg: tight };
}

async function buildFavicons(lightMarkSvg, darkMarkSvg) {
  const lightMark = Buffer.from(lightMarkSvg);
  const darkMark = Buffer.from(darkMarkSvg);

  async function squarePng(buf, size, background) {
    return sharp(buf, { density: 600 })
      .resize({
        width: Math.round(size * 0.86),
        height: Math.round(size * 0.86),
        fit: "contain",
        background,
      })
      .extend({
        top: Math.round(size * 0.07),
        bottom: Math.round(size * 0.07),
        left: Math.round(size * 0.07),
        right: Math.round(size * 0.07),
        background,
      })
      .png()
      .toBuffer();
  }

  const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };
  const BEIGE = { r: 0xed, g: 0xe7, b: 0xdc, alpha: 1 }; // --bg light theme

  const png16 = await squarePng(lightMark, 16, TRANSPARENT);
  const png32 = await squarePng(lightMark, 32, TRANSPARENT);
  const png16dark = await squarePng(darkMark, 16, TRANSPARENT);
  const png32dark = await squarePng(darkMark, 32, TRANSPARENT);
  const apple180 = await squarePng(lightMark, 180, BEIGE);
  const icon192 = await squarePng(lightMark, 192, TRANSPARENT);
  const icon512 = await squarePng(lightMark, 512, TRANSPARENT);

  writeOut("public/favicon-16x16.png", png16);
  writeOut("public/favicon-32x32.png", png32);
  writeOut("public/favicon-16x16-dark.png", png16dark);
  writeOut("public/favicon-32x32-dark.png", png32dark);
  writeOut("public/apple-touch-icon.png", apple180);
  writeOut("public/icon-192.png", icon192);
  writeOut("public/icon-512.png", icon512);

  // Minimal ICO container: ICONDIR + 2 ICONDIRENTRY + raw PNG payloads
  // ("PNG-in-ICO", supported by all current browsers).
  function buildIco(images) {
    const count = images.length;
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0);
    header.writeUInt16LE(1, 2);
    header.writeUInt16LE(count, 4);

    const entries = [];
    const payloads = [];
    let offset = 6 + count * 16;
    for (const { size, data } of images) {
      const entry = Buffer.alloc(16);
      entry.writeUInt8(size === 256 ? 0 : size, 0);
      entry.writeUInt8(size === 256 ? 0 : size, 1);
      entry.writeUInt8(0, 2);
      entry.writeUInt8(0, 3);
      entry.writeUInt16LE(1, 4);
      entry.writeUInt16LE(32, 6);
      entry.writeUInt32LE(data.length, 8);
      entry.writeUInt32LE(offset, 12);
      offset += data.length;
      entries.push(entry);
      payloads.push(data);
    }
    return Buffer.concat([header, ...entries, ...payloads]);
  }

  const ico = buildIco([
    { size: 16, data: png16 },
    { size: 32, data: png32 },
  ]);
  writeOut("src/app/favicon.ico", ico);
}

const light = await buildMark("light", "TALON_Logo_LightTheme.svg");
const dark = await buildMark("dark", "TALON_Logo_DarkTheme.svg");
console.log("mark viewBoxes", { light: light.box, dark: dark.box });
await buildFavicons(light.svg, dark.svg);
console.log("done");
