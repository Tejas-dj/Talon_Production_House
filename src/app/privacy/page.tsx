import type { Metadata } from "next";
import { CONTACT_LINKS } from "@/lib/site";

const DESCRIPTION =
  "How Talon Production House handles data under India's Digital Personal Data Protection Act, 2023.";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: DESCRIPTION,
  alternates: { canonical: "/privacy" },
};

const contactEmail = CONTACT_LINKS.find((c) => c.label === "Email")!.handle;

export default function PrivacyPage() {
  return (
    <div>
      <header className="container-site pt-8 pb-6">
        <h1 className="type-display">Privacy Policy</h1>
        <p className="type-meta text-muted mt-2">Last updated 2026</p>
      </header>

      <div className="hairline" />

      <div className="container-site flex max-w-[70ch] flex-col gap-6 pt-6 pb-8">
        <p className="type-body">
          Talon Production House (&quot;Talon,&quot; &quot;we,&quot; &quot;us&quot;) operates this
          website. This policy explains what data we collect from visitors and how we handle it,
          in line with India&apos;s Digital Personal Data Protection Act, 2023 (DPDP Act).
        </p>

        <div>
          <h2 className="type-headline">What we collect</h2>
          <p className="type-body mt-3">
            This site uses Vercel Analytics to understand traffic. It is cookie-free and does not
            collect personal data — it records aggregate, anonymised counts (page views, referring
            source, rough device type) that cannot be tied back to an individual visitor. We do not
            use tracking pixels, advertising networks, or third-party analytics that build a
            profile of you.
          </p>
        </div>

        <div>
          <h2 className="type-headline">Cookies</h2>
          <p className="type-body mt-3">
            This site does not set any cookies. There is nothing to consent to and nothing stored
            on your device by us.
          </p>
        </div>

        <div>
          <h2 className="type-headline">Data you send us directly</h2>
          <p className="type-body mt-3">
            If you contact us by email, phone, or WhatsApp using the details on our Contact page,
            we hold that conversation (and any details you choose to share in it, such as a
            shoot date or budget) only to respond to your enquiry and, if you book with us, to
            deliver the work. We do not sell, rent, or share this information with third parties.
          </p>
        </div>

        <div>
          <h2 className="type-headline">Your rights</h2>
          <p className="type-body mt-3">
            Under the DPDP Act you can ask what personal data we hold about you, request a
            correction, or ask us to delete it. Write to{" "}
            <a href={`mailto:${contactEmail}`} className="underline underline-offset-2">
              {contactEmail}
            </a>{" "}
            and we will respond directly.
          </p>
        </div>

        <div>
          <h2 className="type-headline">Changes</h2>
          <p className="type-body mt-3">
            If this policy changes, the &quot;last updated&quot; date above will change with it. We will not
            reduce your rights under this policy without your consent.
          </p>
        </div>
      </div>
    </div>
  );
}
