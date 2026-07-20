import Link from "next/link";
import { CONTACT_LINKS, CREDIT, NAV_ITEMS } from "@/lib/site";
import { CopyrightYear } from "@/components/shell/CopyrightYear";

/* Footer — Bible §2.3: the full-color lockup with the orange wedge appears
   here and only here, at display scale, as the closing brand moment.
   Statement-role section (§6.3): --space-8 vertical padding. */
export function Footer() {
  return (
    <footer className="hairline">
      <div className="container-site py-8">
        <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
          {/* Full-color lockup — typographic stand-in until the source vector
              is supplied; wedge descends left-high to right-low (§2.1). */}
          <div className="relative max-w-full overflow-hidden">
            <div
              className="absolute inset-0 bg-wedge [clip-path:polygon(0_22%,100%_62%,100%_86%,0_46%)]"
              aria-hidden="true"
            />
            <p className="type-display relative">Talon</p>
            <p className="type-meta relative mt-2">Production House</p>
          </div>

          <div className="flex gap-6 md:gap-7">
            <nav aria-label="Footer">
              <ul className="flex flex-col gap-2">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="link-draw type-meta">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <ul className="flex flex-col gap-2">
              {CONTACT_LINKS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="link-draw type-meta"
                    {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hairline mt-6 flex flex-wrap items-baseline justify-between gap-3 pt-3">
          <p className="type-small text-muted">
            © <CopyrightYear /> Talon Production House, Bengaluru
          </p>
          <p className="type-small text-muted">
            Site by{" "}
            <a href={CREDIT.href} className="underline underline-offset-2">
              {CREDIT.label}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
