import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/* /styleguide is deliberately absent: internal reference, not public surface. */
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/work", "/photography", "/studio", "/contact"].map((path) => ({
    url: `${BASE_URL}${path}`,
  }));
}
