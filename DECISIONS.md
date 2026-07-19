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

## Application shell (Step 5)

- **Header nav is inline links at ≥768px, hamburger only below** (Bible §1.3's sixth opening — the one no reference site gets right). No `md:hidden`-on-desktop-nav ambiguity: the two nav renderings are mutually exclusive by breakpoint, never both mounted-and-visible.
- **`--header-height` (56px) is a new token, undocumented in the Bible** — needed so the mobile overlay panel can sit below the fixed header row without either component hardcoding the other's height inline. Recorded here since the Bible is silent on header height specifically.
- **The mobile nav overlay is always mounted; `inert` (not conditional rendering) gates interactivity.** This survived a real debugging investigation: framer-motion's `AnimatePresence`/`animate` prop reliably failed to update this element in this stack (confirmed with a debug attribute — React state and re-renders were correct, only the animation-driven style never moved), and switching to a plain CSS `opacity` transition plus `inert` sidesteps the problem entirely, since the panel's non-interactivity is set synchronously with the state change rather than depending on an animation or unmount callback completing. Verified correct via forced-completion of the CSS transition (`Animation.finish()`) and via real keyboard-driven focus-trap tests in both directions (Tab wraps last→first, Shift+Tab wraps first→last), Escape-close-with-focus-return, and body-scroll-lock/unlock — all confirmed on a production build, not just dev/HMR.
- **Footer full-color lockup and header monochrome wordmark are typographic stand-ins** (Archivo display type + a CSS `clip-path` wedge) until the client supplies the source vector logo (§2.3 asks to confirm against source vector in Phase 2) — swap point is `Header.tsx`'s `.wordmark` usage and `Footer.tsx`'s clip-path div.
- **Contact links, Instagram/YouTube/phone/email hrefs, and the CobaltKite credit URL are `#` placeholders** centralized in `src/lib/site.ts`, per the brief's list of true unknowns (real handles, WhatsApp number, etc.) — one file to update when real values arrive, not a hunt through components.
- **Skip link uses `sr-only` + `focus:not-sr-only`** rather than an off-screen-position hack, so it participates correctly in the same focus-ring styling as everything else.

## Content layer (Step 6)

- **`format` and `category` are distinct fields.** The brief lists both `format` and "category for filtering" as separate required fields, but the wireframes only show one "TYPE" label. Read `category` as the wireframe's TYPE (the four filter-chip values: Commercial / Music Video / Documentary / Brand Film) and `format` as the delivery/technical spec (aspect ratio + resolution, e.g. "16:9 · 4K") — a real, useful distinction for a production house and the only reading that doesn't make one of the two brief-listed fields redundant.
- **`role` (singular, Talon's own role on the project) is distinct from `credits` (the array of individual role:name pairs).** Same reasoning — the brief lists both by name, and the wireframe's CREDITS TABLE is clearly the array; `role` must be the separate "what did Talon do here" line implied by the brief text.
- **`content/studio.json` is an array of three `StudioSpace` entries, not one studio object with three of something else.** The brief asks for "three realistic placeholder entries each" uniformly across all three JSON files, but the wireframes and Bible describe Studio as a single page. Resolved by treating Talon as renting out three distinct bookable spaces at one location — real for a studio business, and it satisfies "three entries" literally rather than stretching one entity into an artificial triple. Phase 3 decides how the Studio page presents multiple spaces (tabs, a primary space with alternates, etc.) — Phase 2's job is just a valid, realistic content layer.
- **`PhotoSeries` has no stored `count` field.** The wireframe shows "12 IMAGES" as a label, but storing a count alongside `imageIds` invites drift the moment an image is added or removed. Phase 3 renders `imageIds.length` instead — one source of truth.
- **Validation is hand-rolled type-guard functions in `src/lib/content.ts`, not a schema library** (zod, etc.) — three small, stable shapes and one maintainer, per the brief's "simplest thing that satisfies the requirement." Each guard throws a message naming the file, the entry index, the slug (once known), and the specific missing/invalid field, so a build failure points straight at the bad entry. Validation runs once at module load (top-level `loadAndValidate` calls), so every import — including Next's static-generation pass — pays the cost once and fails loudly on the first bad entry. Verified directly: deleting a required field from `content/projects.json` fails `next build` with `content/projects.json: entry 0 "..." is missing "title"`; restoring it builds clean again.
- **The Step 6 gate (a fourth JSON object produces a working page with no code change) was verified directly**, not just by inspection: a fourth project object was added, `next build` statically generated `/work/gate-test-fourth-project` with its real title and synopsis rendered into the HTML output, and the entry was then removed.
- **`scripts/check-content-lengths.mjs` is a small dev-only utility** (not part of the build) that checks every text field in `content/*.json` against the wireframes' character budgets — run it after editing content so "realistic text at the correct lengths" stays true as entries change. `content.ts`'s build-time validation intentionally does not enforce these ranges itself: budgets are editorial guidance for Phase 3 layouts, not a structural correctness requirement, so a slightly-over-budget field should be a lint-style warning a human catches, not a failed production build.
