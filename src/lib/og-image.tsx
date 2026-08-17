import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

/**
 * Static hex values rather than the CSS token layer — ImageResponse renders
 * through Satori, a standalone layout engine with no access to the page's
 * runtime stylesheet or [data-theme], so a share-preview card can't "follow"
 * the viewer's theme; it always renders the dark palette (Bible §4.3) as one
 * deliberate, consistent brand card. System-ui font rather than self-hosted
 * Archivo: Satori needs raw font binary data, which next/font's build
 * pipeline doesn't expose, and fetching a font at request time trades
 * reliability for a marginal gain on a 1200x630 card (see DECISIONS.md).
 */
const BG = "#000000";
const FG = "#f4f0e8";
const WEDGE = "#ee8322";

function PageLabel({ children }: { children: string }) {
  return (
    <div
      style={{
        display: "flex",
        fontSize: 28,
        letterSpacing: 6,
        textTransform: "uppercase",
        color: FG,
        fontWeight: 600,
      }}
    >
      {children}
    </div>
  );
}

function Wordmark() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          fontSize: 140,
          fontWeight: 800,
          letterSpacing: -4,
          textTransform: "uppercase",
          color: FG,
          lineHeight: 0.9,
        }}
      >
        Talon
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 24,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: FG,
          opacity: 0.7,
          marginTop: 12,
        }}
      >
        Production House
      </div>
    </div>
  );
}

/**
 * One designed 1200x630 card (token colors, the wedge motif from
 * Footer.tsx, heavy tracked caps) reused by every static page's
 * opengraph-image.tsx — not an auto-generated screenshot, per the brief.
 */
export function renderOgImage(pageLabel: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: BG,
          padding: "64px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            backgroundColor: WEDGE,
            opacity: 0.9,
            clipPath: "polygon(0% 28%, 100% 52%, 100% 74%, 0% 48%)",
          }}
        />
        <PageLabel>{pageLabel}</PageLabel>
        <Wordmark />
      </div>
    ),
    { ...OG_SIZE },
  );
}

/**
 * Same brand card (wordmark, wedge accent, tracked-caps label), composited
 * over a real Cloudinary photo instead of flat black — for pages that have
 * one genuine representative image (Stills, Studio) rather than a generic
 * card, per Google/social's preference for real photos in og:image /
 * primaryImageOfPage. Satori/ImageResponse has no next/image pipeline, so
 * the photo is fetched at request time via a plain `<img src>` — verified
 * against this project's real Cloudinary delivery URLs (dev server request
 * + network log), not assumed. Two scrims (top for the label, bottom for
 * the wordmark, both plain black-to-transparent linear-gradients — one of
 * the few gradient forms Satori supports) keep text legible over an
 * arbitrary photo; the wedge shrinks from a full-bleed diagonal band to a
 * thin accent stripe so it reads as a brand mark, not a shape fighting the
 * photo for the frame.
 */
export function renderOgImageWithPhoto(pageLabel: string, photoUrl: string) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          backgroundColor: BG,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Satori/ImageResponse has no next/image runtime; this is the only way to composite a remote photo. */}
        <img
          src={photoUrl}
          alt=""
          width={OG_SIZE.width}
          height={OG_SIZE.height}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "42%",
            display: "flex",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.75), rgba(0,0,0,0))",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "58%",
            display: "flex",
            background: "linear-gradient(to top, rgba(0,0,0,0.92), rgba(0,0,0,0))",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "-4%",
            right: "-4%",
            bottom: "26%",
            height: "88px",
            display: "flex",
            backgroundColor: WEDGE,
            opacity: 0.88,
            clipPath: "polygon(0% 24%, 100% 0%, 100% 62%, 0% 86%)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "64px",
            position: "relative",
          }}
        >
          <PageLabel>{pageLabel}</PageLabel>
          <Wordmark />
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
