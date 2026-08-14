import type { Metadata } from "next";
import { FiMail } from "react-icons/fi";
import { MagneticElement } from "@/components/motion/MagneticElement";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { CONTACT_LINKS } from "@/lib/site";

const DESCRIPTION =
  "Talon Production House is always open to exceptional crew and creative talent in Bengaluru: directors, DPs, editors, colourists, and more. Reach out directly, no forms.";

export const metadata: Metadata = {
  title: "Careers",
  description: DESCRIPTION,
  alternates: { canonical: "/careers" },
  openGraph: {
    title: "Careers — Talon Production House",
    description: DESCRIPTION,
    url: "/careers",
  },
  twitter: { title: "Careers — Talon Production House", description: DESCRIPTION },
};

const email = CONTACT_LINKS.find((c) => c.label === "Email")!;

/* Blunt, no form — same instinct as Contact (Bible §3.4). There is no
   standing role to apply against, so the page doesn't pretend to have one;
   it states the truth and hands over one direct channel. Section follows
   Studio's left-label / right-content split (§6.5) instead of Contact's
   row list, since a single CTA needs an anchor, not a list rhythm. */
export default function CareersPage() {
  return (
    <div className="pb-7 md:pb-0">
      <header className="container-site pt-8 pb-6">
        <SplitText as="h1" className="type-display">Careers</SplitText>
        <Reveal>
          <p className="type-subhead text-muted mt-4 max-w-[55ch]">
            No open roles. Always open to the right person.
          </p>
        </Reveal>
      </header>

      <div className="hairline" />

      <section className="container-site grid grid-cols-1 gap-4 pt-6 pb-7 md:grid-cols-12 md:gap-gutter">
        <div className="md:[grid-column:1/5]">
          <h2 className="type-headline">Get in Touch</h2>
        </div>

        <div className="md:[grid-column:5/13]">
          <Reveal index={0}>
            <p className="type-body max-w-[55ch]">
              We&apos;re a small crew, and we hire the way we shoot: for craft, not headcount. If
              you&apos;re a director, DP, editor, colourist, sound designer, gaffer, or
              photographer doing the best work of your career, and you want a place that matches
              it, we want to see it.
            </p>
          </Reveal>

          <Reveal index={1} className="hidden md:mt-6 md:block">
            <MagneticElement radius={80} strength={0.2}>
              <a
                href={email.href}
                className="btn btn-cta type-meta inline-flex items-center gap-3 px-6 py-5"
              >
                <FiMail size={18} aria-hidden="true" />
                Email Us →
              </a>
            </MagneticElement>
          </Reveal>
          <a
            href={email.href}
            className="btn btn-cta type-meta bg-page fixed inset-x-0 bottom-0 z-30 flex items-center justify-center gap-3 border-x-0 border-b-0 px-4 py-4 text-center md:hidden"
          >
            <FiMail size={18} aria-hidden="true" />
            Email Us →
          </a>

          <Reveal index={2} className="mt-4">
            <p className="type-small text-muted">{email.handle}</p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
