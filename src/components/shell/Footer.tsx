import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { CREDIT, CONTACT_LINKS, NAV_ITEMS, WHATSAPP_GENERAL_MESSAGE, waLink } from "@/lib/site";
import { CopyrightYear } from "@/components/shell/CopyrightYear";
import { Marquee } from "@/components/motion/Marquee";

const FOOTER_SOCIAL_ICONS: Record<string, React.ReactNode> = {
  Instagram: <FaInstagram size={18} aria-hidden="true" />,
  YouTube: <FaYoutube size={18} aria-hidden="true" />,
  WhatsApp: <FaWhatsapp size={18} aria-hidden="true" />,
  Email: <FiMail size={18} aria-hidden="true" />,
};

/* Same four destinations as the Contact page (single source: @/lib/site) —
   a shortcut for anyone who wants to reach out without leaving the page
   they're already on. */
const FOOTER_SOCIAL_LINKS = [
  CONTACT_LINKS.find((l) => l.label === "Instagram")!,
  CONTACT_LINKS.find((l) => l.label === "YouTube")!,
  { label: "WhatsApp", href: waLink(WHATSAPP_GENERAL_MESSAGE), external: true },
  CONTACT_LINKS.find((l) => l.label === "Email")!,
];

const MARQUEE_TEXT = "Production House · Bengaluru";
const MARQUEE_SEPARATOR = "   /   ";

export function Footer() {
  return (
    <footer className="hairline">
      {/* Running text marquee — inspired by Pure Cinema's "EVERY INDUSTRY. EVERY PLATFORM." strip */}
      <Marquee speed={50} className="py-3 opacity-40">
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} className="type-meta text-muted whitespace-nowrap px-4">
            {MARQUEE_TEXT}
            {MARQUEE_SEPARATOR}
          </span>
        ))}
      </Marquee>

      <div className="hairline" aria-hidden="true" />

      <div className="container-site py-8">
        <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
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

          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:gap-10">
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

            <nav aria-label="Get in touch">
              <p className="type-meta text-muted mb-3">Get in Touch</p>
              <ul className="flex items-center gap-2">
                {FOOTER_SOCIAL_LINKS.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      aria-label={item.label}
                      className="link-draw inline-flex items-center justify-center p-2"
                      {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {FOOTER_SOCIAL_ICONS[item.label]}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
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
