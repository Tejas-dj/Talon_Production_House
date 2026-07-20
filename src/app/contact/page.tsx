import type { Metadata } from "next";
import { CONTACT_LINKS, WHATSAPP_GENERAL_MESSAGE, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
};

function ContactRow({
  label,
  detail,
  href,
  external,
}: {
  label: string;
  detail: string;
  href: string;
  external?: boolean;
}) {
  return (
    <div className="hairline">
      <a
        href={href}
        className="link-draw flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:justify-between"
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        <span className="type-headline">{label} →</span>
        <span className="type-meta text-muted">{detail}</span>
      </a>
    </div>
  );
}

/* Blunt, typography-forward, no form (Bible §3.4: "Four links and nothing
   else. Its emptiness is the confidence.") — five links here since the
   brief also requires a WhatsApp channel the wireframe's greybox omits. */
export default function ContactPage() {
  return (
    <div>
      <header className="container-site pt-8 pb-6">
        <h1 className="type-display">Contact</h1>
      </header>

      <div className="container-site pb-8">
        {CONTACT_LINKS.map((item) => (
          <ContactRow
            key={item.label}
            label={item.label}
            detail={item.handle}
            href={item.href}
            external={item.external}
          />
        ))}
        <ContactRow
          label="WhatsApp"
          detail="Message us directly"
          href={waLink(WHATSAPP_GENERAL_MESSAGE)}
          external
        />
        <div className="hairline" aria-hidden="true" />
      </div>
    </div>
  );
}
