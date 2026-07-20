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
          {pageLabel}
        </div>
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
      </div>
    ),
    { ...OG_SIZE },
  );
}
