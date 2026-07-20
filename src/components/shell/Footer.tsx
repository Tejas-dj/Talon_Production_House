import Image from "next/image";
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
          {/* Full-color lockup, at large scale — both theme variants render
              in the DOM; CSS selects which paints (globals.css), no flash. */}
          <div className="max-w-full">
            <Image
              src="/images/logo/TALON_Logo_LightTheme.svg"
              alt="Talon Production House"
              width={1050}
              height={660}
              unoptimized
              className="theme-logo-light h-[clamp(4rem,10vw,8rem)] w-auto"
            />
            <Image
              src="/images/logo/TALON_Logo_DarkTheme.svg"
              alt="Talon Production House"
              width={1050}
              height={660}
              unoptimized
              className="theme-logo-dark h-[clamp(4rem,10vw,8rem)] w-auto"
            />
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
          <p className="type-small text-muted flex flex-wrap items-baseline gap-x-4">
            <span>
              © <CopyrightYear /> Talon Production House, Bengaluru
            </span>
            <Link href="/privacy" className="link-draw">
              Privacy
            </Link>
            <Link href="/terms" className="link-draw">
              Terms
            </Link>
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
