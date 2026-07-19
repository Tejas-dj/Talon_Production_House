# DECISIONS

Running log of judgment calls made where the Design Bible and wireframes are silent. One line of reasoning each. Newest entries at the bottom of each section.

## Repository & tooling (Step 1)

- **Repo root is the existing "Talon Production House" directory.** create-next-app rejects the directory name (spaces/capitals violate npm naming), so the project was scaffolded in a temp subfolder and moved to root; the package is named `talon`.
- **Next.js 16.2.10 (latest at scaffold time), Tailwind CSS v4, npm.** Latest stable of everything the brief names; Tailwind v4's CSS-first `@theme` maps utilities directly onto the Bible's custom properties, which is exactly the semantic-token-only architecture Step 2 requires.
- **Prettier with near-default config** (double quotes, semicolons, printWidth 100) plus `eslint-config-prettier` so ESLint never fights the formatter. No Tailwind class-sorting plugin — one maintainer, low churn, not worth the dependency.
- **`npm audit` shows 2 moderate advisories** — a transitive `postcss` pinned inside Next.js itself; npm's only offered fix is downgrading Next to 9.x. Not actionable; will disappear with a future Next patch.
- **Route naming: `/work` for the video index, `/work/[slug]` for project detail.** The wireframes label the nav item WORK while the Bible says "Video index"; the nav label wins for the URL because URLs are user-facing navigation, and the page title can still read "VIDEO".

### Folder structure

```
content/            JSON content layer (projects, photography, studio) — Step 6
docs/               Phase 1 ground truth (Design Bible + wireframes), untouched
public/             static assets
src/app/            routes; globals.css holds the entire token layer
src/components/
  shell/            Header, MobileNav, Footer, SkipLink, ThemeToggle, PageTransition
  media/            BunnyPlayer and image helpers
  styleguide/       display blocks private to /styleguide
src/lib/            content types + loaders, motion primitives, media presets,
  media/            Cloudinary loader + transform presets
```

Reasoning: `src/` with `@/*` alias keeps app code separate from content and docs; components are grouped by role (shell/media/styleguide) rather than by atomic-design taxonomy because the site has one maintainer and ~a dozen components — flat and literal beats clever.

## Token layer (Step 2)

- **Tailwind's default color, radius, shadow, spacing, breakpoint, and font namespaces are reset to `initial` in `@theme`.** A stray `text-purple-500`, `rounded-lg`, or `shadow-md` now has no definition at all — the guardrails (zero radius, no shadows, no off-palette color) are enforced by the framework, not by review.
- **Utility color names differ slightly from CSS var names** (`bg-page` ← `--bg`, `text-primary` ← `--text-primary`, `text-muted`, `border-rule`, `text-accent`, …) because `bg-bg` is unreadable; the CSS custom properties keep the Bible's exact names and remain the single source.
- **Type styles are composite `@utility` classes** (`type-display` … `type-meta`) carrying size, line height, tracking, weight, width (`font-stretch` drives the wdth axis), and case in one class — Bible §5.2's "five sizes plus meta" ceiling stays enforceable because a partial style can't be assembled by hand.
- **Breakpoints are named `sm/md/lg/xl` = 480/768/1120/1440** (Tailwind convention, Bible §6.1 values, defaults above `xl` removed so a fifth breakpoint cannot appear).
- **Grid gutter and outer margin are responsive CSS vars** (`--gutter`, `--margin-outer`) switching at 768/1120 per §6.1, exposed as `gap-gutter` / `px-margin` utilities and a `container-site` utility (1600px max + outer margin).
- **Archivo via `next/font/google` with `axes: ["wdth"]`** — downloaded at build, self-hosted as one variable woff2, preloaded, with an auto-generated metric-adjusted Arial fallback; equivalent to §5.3's hand-tuned `size-adjust` overrides without maintaining numbers by hand.
- **Motion durations/easings exist as CSS vars for CSS transitions; `src/lib/motion.ts` (Step 5) transcribes the same §7 values for Framer Motion.** Two transcriptions of one Bible table, each citing §7 — accepted over a runtime `getComputedStyle` bridge, which would be fragile during SSR for no real gain at this scale.

## Styleguide (Step 3)

- **The §7 interaction vocabulary lives as global utilities (`link-draw`, `btn`, `btn-cta`), not per-component styles** — the Bible calls Shift "the site's entire hover vocabulary", so there is exactly one implementation for links and one for buttons, and Phase 3 components compose them.
- **When a selected filter chip is hovered, the selected (accent) style wins over the hover invert** — the Bible doesn't specify the combination; "where you are" information beats a transient hover effect.
- **`sitemap.ts`/`robots.ts` added now** (styleguide excluded from sitemap, disallowed in robots, `noindex` meta) so "out of the sitemap" is true from the first deploy; base URL reads `NEXT_PUBLIC_SITE_URL` with a localhost fallback.
- **The styleguide's theme toggle is an interim client component flipping `[data-theme]` directly**; Step 4 replaces it with the next-themes-backed shell toggle so there is only ever one toggle implementation shipped.

## Theme system (Step 4)

- **The Bible's P3 "root theme transition (background-color and color only)" is implemented as a temporary `.theme-veil` class** the toggle holds on `<html>` for ~400ms: during the switch every color property crossfades on the veil clock (320ms ease-out), then components return to their own timings. A permanent root-only transition would leave component colors snapping while the page fades — visibly two clocks.
- **The toggle's visible label is typographic ("Theme: light/dark")**, no icon glyph per the guardrails; the theme name renders only after mount since the server cannot know the visitor's preference (`useSyncExternalStore` mounted pattern, no hydration mismatch).
- **`suppressHydrationWarning` on `<html>` only** — required because next-themes mutates `data-theme`/`color-scheme` before hydration; scoped to the one element it affects.
