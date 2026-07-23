import type { Metadata } from "next";
import { Reveal } from "@/components/motion/Reveal";
import { SplitText } from "@/components/motion/SplitText";
import { TiltCard } from "@/components/motion/TiltCard";

const DESCRIPTION =
  "Meet the team behind Talon Production House — the people shaping every frame, every project, every decision.";

export const metadata: Metadata = {
  title: "The Team",
  description: DESCRIPTION,
  alternates: { canonical: "/team" },
  openGraph: {
    title: "The Team — Talon Production House",
    description: DESCRIPTION,
    url: "/team",
  },
  twitter: {
    title: "The Team — Talon Production House",
    description: DESCRIPTION,
  },
};

const LEADERS = [
  {
    name: "Pratham Raje Urs",
    title: "Founder, CEO & Managing Director",
    bio: "Pratham founded Talon Production House with a singular vision — build a production company where craft comes before convenience. From concept through final delivery, he oversees every project with the conviction that the work itself is the only portfolio that matters.",
    portraitPlaceholder: "PRU",
  },
  {
    name: "Vikram Adithya Reddy",
    title: "Chief Operating Officer",
    bio: "Vikram brings operational clarity to the creative process. He ensures that every shoot runs on time, every rental is seamless, and every client interaction reflects the standard the studio was built on — no shortcuts, no surprises.",
    portraitPlaceholder: "VAR",
  },
] as const;

export default function TeamPage() {
  return (
    <div>
      <header className="container-site pt-8 pb-6">
        <SplitText as="h1" className="type-display">The Team</SplitText>
        <Reveal>
          <p className="type-subhead text-muted mt-4 max-w-[55ch]">
            The people behind the lens, the decisions, and the standard.
          </p>
        </Reveal>
      </header>

      <div className="hairline" />

      {LEADERS.map((leader, i) => (
        <section key={leader.name}>
          <div className="container-site grid grid-cols-1 gap-6 py-7 md:grid-cols-12 md:gap-gutter">
            {/* Portrait area with 3D tilt */}
            <div
              className={`md:col-span-5 ${
                i % 2 === 1 ? "md:col-start-8 md:row-start-1" : ""
              }`}
            >
              <TiltCard className="aspect-[3/4] overflow-hidden">
                <Reveal index={0} className="h-full w-full">
                  <div className="flex h-full w-full items-center justify-center bg-surface" data-tilt-portrait>
                    <span
                      className="select-none text-muted opacity-20"
                      style={{ fontSize: "clamp(4rem, 10vw, 8rem)", fontWeight: 800, fontStretch: "125%", letterSpacing: "-0.02em" }}
                    >
                      {leader.portraitPlaceholder}
                    </span>
                  </div>
                </Reveal>
              </TiltCard>
            </div>

            {/* Text block */}
            <div
              className={`flex flex-col justify-end md:col-span-6 ${
                i % 2 === 1 ? "md:col-start-1 md:row-start-1" : "md:col-start-7"
              }`}
            >
              <Reveal index={1}>
                <p className="type-meta text-muted">{leader.title}</p>
              </Reveal>
              <Reveal index={2}>
                <h2 className="type-headline mt-3">{leader.name}</h2>
              </Reveal>
              <Reveal index={3}>
                <p className="type-body text-muted mt-4 max-w-[50ch]">
                  {leader.bio}
                </p>
              </Reveal>
            </div>
          </div>

          <div className="hairline" />
        </section>
      ))}
    </div>
  );
}
