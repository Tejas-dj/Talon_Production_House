"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, useSyncExternalStore } from "react";
import { NAV_ITEMS } from "@/lib/site";
import { ThemeToggle } from "@/components/shell/ThemeToggle";
import { MobileNav } from "@/components/shell/MobileNav";

function subscribeScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

/* Header states — Bible §1.3 (inline links at desktop, hamburger only below
   the mobile breakpoint) + wireframes. Resting: sits on the page. Scrolled:
   solid page fill + bottom hairline, colors moving on the P3 veil clock (no
   layout properties animate). Mobile-open: MENU becomes CLOSE, overlay below. */
export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const scrolled = useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 8,
    () => false,
  );

  function isCurrent(href: string) {
    return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  }

  return (
    <header ref={headerRef} className="sticky top-0 z-40">
      <div
        className={`relative z-10 transition-colors duration-[320ms] ease-veil ${
          menuOpen ? "bg-page" : scrolled ? "hairline-b bg-page" : "border-b border-b-transparent"
        }`}
      >
        <div className="container-header flex h-(--header-height) items-center justify-between">
          <Link href="/" className="flex items-center" aria-label="Talon Production House — home">
            {/* Full-color lockup (TALON + PRODUCTION HOUSE + wedge) — both
                theme variants render in the DOM; CSS selects which paints
                (globals.css), so there is no flash. */}
            <Image
              src="/images/logo/TALON_Logo_LightTheme.svg"
              alt=""
              width={1050}
              height={660}
              unoptimized
              priority
              className="theme-logo-light h-7 w-auto"
            />
            <Image
              src="/images/logo/TALON_Logo_DarkTheme.svg"
              alt=""
              width={1050}
              height={660}
              unoptimized
              priority
              className="theme-logo-dark h-7 w-auto"
            />
          </Link>

          <div className="flex items-center gap-4 md:gap-5">
            {/* Inline nav at desktop — never a hamburger above md */}
            <nav aria-label="Primary" className="hidden md:block">
              <ul className="flex items-center gap-5">
                {NAV_ITEMS.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="link-draw type-meta"
                      aria-current={isCurrent(item.href) ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <ThemeToggle />

            {/* Typographic trigger, not a glyph (guardrails) */}
            <button
              ref={menuButtonRef}
              type="button"
              className="btn type-meta px-4 py-2 md:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </div>

      <MobileNav
        id="mobile-nav"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        headerRef={headerRef}
        triggerRef={menuButtonRef}
        isCurrent={isCurrent}
      />
    </header>
  );
}
