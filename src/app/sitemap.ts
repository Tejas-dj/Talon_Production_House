import type { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

/* /styleguide is deliberately absent: internal reference, not public surface. */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/work/motion",
    "/work/stills",
    "/studio",
    "/team",
    "/contact",
    "/privacy",
    "/terms",
  ].map((path) => ({ url: `${SITE_URL}${path}` }));
  const projectPaths = getAllProjects().map((p) => ({ url: `${SITE_URL}/work/motion/${p.slug}` }));
  return [...staticPaths, ...projectPaths];
}
