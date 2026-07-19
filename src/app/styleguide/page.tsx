import type { Metadata } from "next";
import { FilterChipsDemo } from "@/components/styleguide/FilterChipsDemo";
import { ThemeToggle } from "@/components/shell/ThemeToggle";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

/* The contract page for the whole build: every token from
   docs/TALON_DESIGN_BIBLE.md rendered at real size in both themes.
   Private — excluded from sitemap and navigation. */

const COLOR_TOKENS: Array<{ cssVar: string; utility: string; role: string }> = [
  { cssVar: "--bg", utility: "bg-page", role: "The page. Photography sits directly on it." },
  { cssVar: "--surface", utility: "bg-surface", role: "One step of elevation; never nested." },
  { cssVar: "--text-primary", utility: "text-primary", role: "Every character a user must read." },
  { cssVar: "--text-muted", utility: "text-muted", role: "Every character a user may skip." },
  { cssVar: "--rule", utility: "border-rule", role: "1px hairlines; the only divider." },
  { cssVar: "--accent", utility: "text-accent", role: "Active/selected state ONLY (§4.2)." },
  { cssVar: "--accent-raw", utility: "text-accent-raw", role: "Dark focus-ring source value." },
  {
    cssVar: "--focus-ring",
    utility: "outline (global)",
    role: "2px outline, 2px offset, all focus.",
  },
  {
    cssVar: "--selection-bg",
    utility: "::selection",
    role: "Text selection inverts to full contrast.",
  },
  { cssVar: "--selection-fg", utility: "::selection", role: "Selection foreground." },
  { cssVar: "--scrim", utility: "bg-scrim", role: "Behind lightbox and mobile menu." },
  { cssVar: "--disabled-fg", utility: "text-disabled", role: "Inert text; deliberately sub-AA." },
  { cssVar: "--disabled-bg", utility: "bg-disabled-bg", role: "Disabled fills share surface." },
  { cssVar: "--logo-wedge", utility: "text-wedge", role: "Footer lockup only (§2.3)." },
];

const SPACING: Array<{ token: string; px: string; cls: string }> = [
  { token: "--space-1", px: "4px", cls: "w-1" },
  { token: "--space-2", px: "8px", cls: "w-2" },
  { token: "--space-3", px: "16px", cls: "w-3" },
  { token: "--space-4", px: "24px", cls: "w-4" },
  { token: "--space-5", px: "40px", cls: "w-5" },
  { token: "--space-6", px: "64px", cls: "w-6" },
  { token: "--space-7", px: "104px", cls: "w-7" },
  { token: "--space-8", px: "168px", cls: "w-8" },
];

const MOTION: Array<{ name: string; duration: string; easing: string; applies: string }> = [
  {
    name: "P1 — Rise",
    duration: "640ms",
    easing: "cubic-bezier(0.16, 1, 0.3, 1)",
    applies: "Viewport entry: translateY(24px→0) + fade. Reduced motion: fade only, 180ms.",
  },
  {
    name: "P2 — Shift",
    duration: "240ms",
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    applies: "Hover/focus: underline draw, saturation, fill invert. Reduced motion: instant.",
  },
  {
    name: "P3 — Veil",
    duration: "320ms",
    easing: "ease-out",
    applies: "State change: theme, lightbox, menu crossfade. Reduced motion: cut (lightbox 120ms).",
  },
];

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <h2 className="type-meta text-muted">{children}</h2>;
}

function Swatch({ cssVar, utility, role }: (typeof COLOR_TOKENS)[number]) {
  return (
    <div>
      <div
        className="h-6 border border-rule"
        style={{ backgroundColor: `var(${cssVar})` }}
        aria-hidden="true"
      />
      <p className="type-meta mt-2">{cssVar}</p>
      <p className="type-small text-muted">{utility}</p>
      <p className="type-small text-muted">{role}</p>
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <div className="container-site pb-7">
      {/* Statement-role header (§6.3) */}
      <header className="flex flex-wrap items-end justify-between gap-4 pt-7 pb-6">
        <div>
          <p className="type-meta text-muted">Phase 2 · Internal reference · Not linked</p>
          <h1 className="type-display">Styleguide</h1>
        </div>
        <ThemeToggle />
      </header>

      {/* ---- COLOR ---- */}
      <section className="hairline pt-5 pb-6">
        <SectionLabel>01 · Color tokens — Bible §4.3</SectionLabel>
        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-4 lg:grid-cols-5">
          {COLOR_TOKENS.map((t) => (
            <Swatch key={t.cssVar + t.utility} {...t} />
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="bg-surface p-4">
            <p className="type-meta text-muted">Surface sample</p>
            <p className="type-body mt-2">
              Primary text on <span className="type-meta">--surface</span>, with{" "}
              <span className="text-muted">muted metadata</span> beside it.
            </p>
          </div>
          <div className="relative bg-surface p-4">
            <div className="absolute inset-0 bg-scrim" aria-hidden="true" />
            <p className="type-meta relative text-selection-fg">Scrim over surface</p>
          </div>
          <div className="p-4" style={{ backgroundColor: "var(--selection-bg)" }}>
            <p className="type-body" style={{ color: "var(--selection-fg)" }}>
              Selection colors — or drag across any text on this page.
            </p>
          </div>
        </div>
      </section>

      {/* ---- TYPE ---- */}
      <section className="hairline pt-5 pb-6">
        <SectionLabel>
          02 · Type scale — Bible §5.2 · five sizes + meta, Archivo variable
        </SectionLabel>

        <div className="mt-5 flex flex-col gap-6">
          <div>
            <p className="type-small text-muted">
              --type-display · clamp(3.25rem, 11vw, 10rem) · lh 0.92 · ls −0.02em · 800 · wdth 125%
              · caps
            </p>
            <p className="type-display">Talon</p>
          </div>
          <div>
            <p className="type-small text-muted">
              --type-headline · clamp(1.75rem, 4.5vw, 3.25rem) · lh 1.05 · ls −0.01em · 700 · wdth
              110%
            </p>
            <p className="type-headline">Monsoon Sessions, Live at the Studio</p>
          </div>
          <div>
            <p className="type-small text-muted">
              --type-subhead · clamp(1.25rem, 2.2vw, 1.625rem) · lh 1.25 · 500
            </p>
            <p className="type-subhead">
              A production house and rentable studio floor in Bengaluru, built for finishing
              quality.
            </p>
          </div>
          <div>
            <p className="type-small text-muted">
              --type-body · clamp(1rem, 1.1vw, 1.125rem) · lh 1.55 · 400
            </p>
            <p className="type-body max-w-[60ch]">
              Body copy carries spec tables, project descriptions, and rate rows. It stays at
              reading size while the display scale above it does the shouting — the ratio between
              the two is the whole identity of the site, roughly nine to one at desktop widths.
            </p>
          </div>
          <div>
            <p className="type-small text-muted">
              --type-small · clamp(0.8125rem, 0.9vw, 0.875rem) · lh 1.45 · ls 0.01em · 400
            </p>
            <p className="type-small">
              Captions, footnotes, copyright, and terms lines render at small. Shot on location in
              Yelahanka, 2026.
            </p>
          </div>
          <div>
            <p className="type-small text-muted">
              --type-meta · clamp(0.6875rem, 0.8vw, 0.75rem) · lh 1.2 · ls 0.14em · 600 · caps
            </p>
            <p className="type-meta">Production House / Bengaluru · 14 Projects · 2026</p>
          </div>
        </div>
      </section>

      {/* ---- LINKS ---- */}
      <section className="hairline pt-5 pb-6">
        <SectionLabel>03 · Link states — P2 Shift underline draw</SectionLabel>
        <div className="mt-5 flex flex-col gap-4">
          <p className="type-meta flex flex-wrap gap-6">
            <a href="#type" className="link-draw">
              Nav link, rest — hover or tab to draw
            </a>
            <a href="#type" className="link-draw" aria-current="page">
              Active link — accent, underline held
            </a>
          </p>
          <p className="type-body max-w-[60ch]">
            In-body links carry a 1px underline at rest, like{" "}
            <a href="#type" className="underline underline-offset-2">
              this reference to the rate card
            </a>
            , and keep the same focus ring as everything else.
          </p>
        </div>
      </section>

      {/* ---- BUTTONS ---- */}
      <section className="hairline pt-5 pb-6">
        <SectionLabel>04 · Button states — rest / hover / focus / active / disabled</SectionLabel>
        <div className="mt-5 flex flex-wrap items-start gap-4">
          <button type="button" className="btn type-meta px-4 py-2">
            Rest — hover me
          </button>
          <button type="button" aria-pressed="true" className="btn type-meta px-4 py-2">
            Selected (accent)
          </button>
          <button type="button" className="btn btn-cta type-meta px-4 py-2">
            CTA — hold click for pressed
          </button>
          <button type="button" disabled className="btn type-meta px-4 py-2">
            Disabled
          </button>
        </div>
        <div className="mt-5">
          <p className="type-small text-muted mb-2">
            Filter chips (live) — active is the accent state:
          </p>
          <FilterChipsDemo />
        </div>
      </section>

      {/* ---- HAIRLINE ---- */}
      <section className="hairline pt-5 pb-6">
        <SectionLabel>05 · Hairline rule — the only divider device</SectionLabel>
        <div className="hairline mt-5" />
        <div className="mt-4 flex items-stretch gap-4">
          <div className="hairline-v pl-4">
            <p className="type-small text-muted">Vertical hairline, 1px, --rule.</p>
          </div>
        </div>
      </section>

      {/* ---- SPACING ---- */}
      <section className="hairline pt-5 pb-6">
        <SectionLabel>06 · Spacing scale — Bible §6.2 · eight values, nothing between</SectionLabel>
        <div className="mt-5 flex flex-col gap-2">
          {SPACING.map((s) => (
            <div key={s.token} className="flex items-center gap-4">
              <p className="type-meta w-[7.5rem]">{s.token}</p>
              <div className={`h-3 bg-primary ${s.cls}`} aria-hidden="true" />
              <p className="type-small text-muted">{s.px}</p>
            </div>
          ))}
        </div>
        <p className="type-small text-muted mt-4 max-w-[60ch]">
          Section padding by role (§6.3): statement --space-8 / working --space-6 / interstitial
          --space-7 top + --space-5 bottom. Grid: 12 col ≥768, 4 below; gutter 24/16; outer margin
          48/32/20; max content 1600px.
        </p>
      </section>

      {/* ---- MOTION ---- */}
      <section className="hairline pt-5">
        <SectionLabel>07 · Motion — Bible §7 · three primitives, three durations</SectionLabel>
        <div className="mt-5 flex flex-col">
          {MOTION.map((m) => (
            <div
              key={m.name}
              className="hairline grid gap-2 py-4 first:border-t-0 md:grid-cols-[10rem_6rem_1fr]"
            >
              <p className="type-meta">{m.name}</p>
              <p className="type-small text-muted">{m.duration}</p>
              <p className="type-small text-muted">
                {m.easing} — {m.applies}
              </p>
            </div>
          ))}
        </div>
        <p className="type-small text-muted mt-2 max-w-[60ch]">
          Stagger sequence for grouped Rise reveals: 0 / 70 / 160 / 220 / 330ms, repeating.
        </p>
      </section>
    </div>
  );
}
