import type { Metadata } from "next";

const DESCRIPTION = "Terms of use for the Talon Production House website.";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: DESCRIPTION,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div>
      <header className="container-site pt-8 pb-6">
        <h1 className="type-display">Terms of Use</h1>
        <p className="type-meta text-muted mt-2">Last updated 2026</p>
      </header>

      <div className="hairline" />

      <div className="container-site flex max-w-[70ch] flex-col gap-6 pt-6 pb-8">
        <p className="type-body">
          By using this website you agree to the following terms. If you don&apos;t agree, please
          don&apos;t use the site.
        </p>

        <div>
          <h2 className="type-headline">Ownership</h2>
          <p className="type-body mt-3">
            All film, photography, text, and design on this site are the property of Talon
            Production House or used with the permission of the respective rights holders.
            Nothing here may be copied, reproduced, or reused without our written permission.
          </p>
        </div>

        <div>
          <h2 className="type-headline">No warranty</h2>
          <p className="type-body mt-3">
            This site and its content are provided as-is, without guarantees of any kind. We work
            to keep it accurate and available, but we don&apos;t promise it will be error-free or
            uninterrupted.
          </p>
        </div>

        <div>
          <h2 className="type-headline">Studio bookings</h2>
          <p className="type-body mt-3">
            Rates and terms shown on the Studio page are indicative. A booking is only confirmed
            once we&apos;ve agreed the date and received the advance, per the terms shared with you
            directly.
          </p>
        </div>

        <div>
          <h2 className="type-headline">Governing law</h2>
          <p className="type-body mt-3">
            These terms are governed by the laws of India, and any disputes fall under the
            jurisdiction of the courts in Bengaluru, Karnataka.
          </p>
        </div>
      </div>
    </div>
  );
}
