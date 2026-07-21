"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { NAV_ITEMS } from "@/lib/site";
import { ThemeToggle } from "@/components/shell/ThemeToggle";
import { MobileNav } from "@/components/shell/MobileNav";

const SCROLL_THRESHOLD = 300;

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const veil = veilRef.current;
    if (!veil) return;

    function update() {
      const p = Math.min(1, window.scrollY / SCROLL_THRESHOLD);
      veil!.style.setProperty("--header-opacity", String(p));
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  function isCurrent(href: string) {
    return pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  }

  return (
    <header ref={headerRef} className="sticky top-0 z-40">
      <div
        ref={veilRef}
        className="header-veil relative z-10"
        data-home={pathname === "/" || undefined}
        data-menu-open={menuOpen || undefined}
      >
        <div className="container-header flex h-(--header-height) items-center justify-between">
          <Link href="/" className="relative flex items-center" aria-label="Talon Production House — home">
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
