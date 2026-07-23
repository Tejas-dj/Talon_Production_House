"use client";

import { Marquee } from "@/components/motion/Marquee";
import { Reveal } from "@/components/motion/Reveal";
import type { Testimonial } from "@/lib/content-types";

const SPEEDS = [20, 15, 18];

type Props = {
  testimonials: Testimonial[];
};

export function Testimonials({ testimonials }: Props) {
  const columns: Testimonial[][] = [[], [], []];
  testimonials.forEach((t, i) => columns[i % 3].push(t));

  return (
    <section>
      {/* ── Section header with ghosted quotation mark ── */}
      <div className="container-site pt-6 pb-4">
        <Reveal>
          <div className="relative inline-block">
            <span
              className="type-display text-muted pointer-events-none select-none absolute leading-none"
              style={{
                fontSize: "clamp(6rem, 16vw, 11rem)",
                opacity: 0.07,
                top: "-0.35em",
                left: "-0.08em",
              }}
              aria-hidden="true"
            >
              &ldquo;
            </span>
            <div className="relative">
              <p className="type-meta text-muted mb-2">Testimonials</p>
              <h2 className="type-headline">What They Say</h2>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ── Rolling credits ── */}
      <div
        className="relative overflow-hidden"
        style={{ height: 480, background: "var(--bg)" }}
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-10"
          style={{
            height: 80,
            background: "linear-gradient(to bottom, var(--bg), transparent)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10"
          style={{
            height: 80,
            background: "linear-gradient(to top, var(--bg), transparent)",
          }}
        />

        <div className="container-site h-full">
          <div className="grid h-full grid-cols-2 gap-gutter md:grid-cols-3">
            {columns.map((col, ci) => (
              <Marquee
                key={ci}
                direction="vertical"
                speed={SPEEDS[ci]}
                reverse={ci === 1}
                pauseOnHover
                className={`h-full ${ci === 2 ? "hidden md:block" : ""}`}
              >
                {col.map((t, ti) => (
                  <div key={ti} className="py-4 hairline-b">
                    <p className="type-body italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <p className="type-meta text-accent mt-2">{t.name}</p>
                    <p className="type-small text-muted">
                      {t.role}
                      {t.company ? ` — ${t.company}` : ""}
                    </p>
                  </div>
                ))}
              </Marquee>
            ))}
          </div>
        </div>
      </div>

      {/* Screen-reader accessible version */}
      <ul className="sr-only">
        {testimonials.map((t, i) => (
          <li key={i}>
            {t.quote} — {t.name}, {t.role}
            {t.company ? `, ${t.company}` : ""}
          </li>
        ))}
      </ul>
    </section>
  );
}
