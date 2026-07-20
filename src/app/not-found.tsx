import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
};

/* On-brand 404 — Bible's display type, a short line, a way home. Nothing else. */
export default function NotFound() {
  return (
    <div className="container-site flex min-h-[60vh] flex-col justify-center pt-8 pb-8">
      <p className="type-meta text-muted">404</p>
      <h1 className="type-display mt-2">Lost the Plot</h1>
      <p className="type-body text-muted mt-4 max-w-[50ch]">
        There&apos;s nothing at this address. The page may have moved or never existed.
      </p>
      <Link href="/" className="link-draw type-meta mt-6 inline-block w-fit">
        Back to home →
      </Link>
    </div>
  );
}
