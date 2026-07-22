import type { MetadataRoute } from "next";

/* Web app manifest — Bible §4.3 tokens for theme/background color; icons
   generated from the client-supplied logo (scripts/generate-logo-assets.mjs). */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Talon Production House",
    short_name: "Talon",
    description: "Motion production, stills, and studio rental in Bengaluru.",
    start_url: "/",
    display: "standalone",
    background_color: "#EDE7DC",
    theme_color: "#171614",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
