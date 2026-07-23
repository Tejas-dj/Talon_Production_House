import type { Metadata } from "next";
import { FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";
import { FiPhone, FiMail } from "react-icons/fi";
import { ContactRow } from "@/components/contact/ContactRow";
import { SplitText } from "@/components/motion/SplitText";
import { CONTACT_LINKS, WHATSAPP_GENERAL_MESSAGE, waLink } from "@/lib/site";

const CONTACT_ICONS: Record<string, React.ReactNode> = {
  Instagram: <FaInstagram size={24} />,
  YouTube: <FaYoutube size={24} />,
  Phone: <FiPhone size={24} />,
  Email: <FiMail size={24} />,
  WhatsApp: <FaWhatsapp size={24} />,
};

const DESCRIPTION =
  "Reach Talon Production House directly — Instagram, YouTube, phone, email, or WhatsApp. No forms.";

export const metadata: Metadata = {
  title: "Contact",
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact — Talon Production House",
    description: DESCRIPTION,
    url: "/contact",
  },
  twitter: { title: "Contact — Talon Production House", description: DESCRIPTION },
};

/* Blunt, typography-forward, no form (Bible §3.4: "Four links and nothing
   else. Its emptiness is the confidence.") — five links here since the
   brief also requires a WhatsApp channel the wireframe's greybox omits. */
export default function ContactPage() {
  return (
    <div>
      <header className="container-site pt-8 pb-6">
        <SplitText as="h1" className="type-display">Contact</SplitText>
      </header>

      <div className="container-site pb-8">
        {CONTACT_LINKS.map((item, i) => (
          <ContactRow
            key={item.label}
            index={i}
            label={item.label}
            detail={item.handle}
            href={item.href}
            external={item.external}
            icon={CONTACT_ICONS[item.label]}
            copyable={item.label === "Phone" || item.label === "Email"}
          />
        ))}
        <ContactRow
          index={CONTACT_LINKS.length}
          label="WhatsApp"
          detail="Message us directly"
          href={waLink(WHATSAPP_GENERAL_MESSAGE)}
          external
          icon={CONTACT_ICONS.WhatsApp}
        />
        <div className="hairline" aria-hidden="true" />
      </div>
    </div>
  );
}
