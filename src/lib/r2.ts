const R2_CDN_ORIGIN = "https://cdn.talonproductionhouse.com";

export function r2Url(objectPath: string): string {
  const segments = objectPath.split("/");
  const encoded = segments.map((s) => encodeURIComponent(s)).join("/");
  return `${R2_CDN_ORIGIN}/${encoded}`;
}
