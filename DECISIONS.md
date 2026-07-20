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

## Media pipeline (Step 7)

- **Two layers, not one: a global `next/image` loader (`src/lib/cloudinary-loader.ts`) plus a `<CloudinaryImage>` wrapper for named presets.** The brief asks for both "a custom next/image loader pointing at Cloudinary" (singular, sitewide) and "transform presets defined in one place so Phase 3 references presets rather than composing URLs" — a single global `loaderFile` can't take a preset argument (Next only passes it `{src, width, quality}`), so the global loader handles the plain default case and `<CloudinaryImage id preset>` overrides the loader per-instance for anything needing specific crop/aspect geometry. Either path still terminates in exactly one place (`src/lib/media/presets.ts`) for the actual transform strings.
- **Presets hold only crop/gravity/aspect-ratio geometry; quality, format, and width are appended once by the caller**, never baked into a preset string — avoids duplicating `q_auto,f_auto` between a preset and the code that uses it, and keeps width fully dynamic so next/image's responsive `srcset` still works through a named preset.
- **`hls.js` only loads on browsers without native HLS support.** Safari/iOS play Bunny's HLS manifest directly via `<video src>` (native support), so `BunnyPlayer` dynamically `import()`s `hls.js` only when `canPlayType("application/vnd.apple.mpegurl")` is empty — avoids shipping the dependency to the one platform (iOS Safari) the brief specifically calls out for autoplay correctness.
- **`playsInline` + `muted` are only applied together, driven by one `autoPlayMuted` prop** — the brief's exact requirement ("playsinline and muted set correctly so autoplay works on iOS Safari") only holds for silent autoplay; a tap-to-play project-detail video is deliberately unmuted with visible controls once played, per the wireframe's "no autoplay w/ sound."
- **Bunny playback URL needs the library's pull-zone CDN hostname (`vz-xxxxxxxx-yyy.b-cdn.net`), not the numeric library id** — the brief asks for "the Bunny library id," but the pull-zone hostname is what HLS playback URLs actually require. `.env.example` documents where to find it (Stream library → API tab) and the env var is named `NEXT_PUBLIC_BUNNY_PULL_ZONE` to be unambiguous about which value it wants.
- **`.env.example` is force-included in `.gitignore`'s `.env*` blanket-ignore** (`!.env.example`) so the documentation file itself is committed while real `.env.local` values never are.
- **Gate verification (one real image via Cloudinary, one real video via Bunny, checked on a physical phone) is deferred to a later phase at the client's own instruction** — asked in chat per the brief; the client confirmed neither account exists yet and will supply the cloud name and pull-zone hostname in a future phase. The loader, presets, player component, and `.env.example` are built and pass `next build`/lint with placeholder-shaped code paths now, so Phase 3 has working infrastructure to build on; only the live-credential + physical-phone check remains, and it needs no further code once those two values arrive — set them in `.env.local` and the same components resolve real URLs immediately.

## Page construction (Phase 3)

Two questions were asked and answered before Phase 3 work began (see chat, not repeated here):
**Studio is one physical space**, not the three `StudioSpace` entries Phase 2 modeled — trimmed
`content/studio.json` to one entry (kept Cyclorama Studio). **Build against current placeholder
content** — no real Cloudinary/Bunny credentials, WhatsApp number, or social handles exist yet;
every step's gate report names the exact swap points.

- **`AGENTS.md`'s `node_modules/next/dist/docs/` instruction points at a path that doesn't exist**
  in this project's `next` package (verified with `ls`). Proceeded with the standard Next.js 16
  App Router conventions Phase 2 already used throughout, rather than inventing undocumented
  "breaking changes."
- **`VideoProject` gets a new `featured?: boolean` field.** Selection AND ordering both come from
  it plus the JSON array's own order — no separate order field, since array order already gives
  full control (simplest thing that works). All 3 placeholder projects are marked `featured` for
  now; gate report flags that Home wants 6–9 once more projects exist.
- **New `content/clients.json` (empty array) + `ClientLogo` type/loader**, following the exact
  validation pattern of the other three content files. Empty is valid input — the Home page's
  logo strip conditionally renders nothing, per the brief's own instruction for this situation.
- **`src/lib/use-dialog.ts` (new)** generalizes the focus-trap/escape/scroll-lock/focus-restore
  behavior already proven in `MobileNav.tsx` into a reusable hook, rather than writing the same
  fiddly a11y logic a third time for the stills overlay and the Photography Lightbox.
  `MobileNav.tsx` itself is left untouched — different container-ref shape, already verified in
  Phase 2, not worth the refactor risk.
- **`BunnyPlayer`'s Phase 2 TODO (poster handling was stubbed) is now implemented**: a
  `<CloudinaryImage>` sits above the `<video>` and crossfades out (P3 Veil, 320ms) once the video
  actually starts rendering frames (`onPlaying`), not merely on click/autoplay-intent — avoids a
  gap between the poster disappearing and the HLS stream having a frame ready.
- **Project detail cinematic aspect ratio = 16:9`**, matching the existing `poster` Cloudinary
  preset (`ar_16:9`) and each project's own `format` field, rather than inventing an un-Bibled
  ultra-wide crop the wireframe's greybox proportions only vaguely suggested.
- **Synopsis measure capped at `max-w-[70ch]`** — the wireframe gives a column span but no exact
  character measure; 70ch sits in the brief's own 65–75ch "readability sweet spot."
- **The metadata block became a 6-field `<dl>` data-plate** (Client/Year/Type/Format/Runtime/
  Role) instead of the wireframe's simplified 4-field single meta line — the brief's own Step 1
  text is explicit about 6 fields and says the block "must feel like a data plate, not a
  paragraph," which the wireframe's low-fidelity greybox line under-specifies. `category` reads
  as "Type" and the schema's own `format` field (aspect/resolution) reads as "Format," both shown
  since both are real, already-existing data (see Step 6 content-layer note above for why they're
  separate fields).
- **Previous/Next both render** (the brief requires both directions; the wireframe's greybox only
  shows one "next" block) — split 7/5 per the asymmetry doctrine, hairline above, wrap-around at
  both ends. Text-only, no thumbnail (brief calls a thumbnail optional; the wireframe omits it).
- **`type-display` project titles need `break-words`.** Found during 320px verification: a single
  long word (e.g. "COLLECTIVE") set at the minimum display clamp (3.25rem) with 125% width-stretch
  can exceed a mobile column's width with nowhere to wrap, causing real horizontal overflow.
  `break-words` allows a mid-word break only when unavoidable; normal-length words are unaffected.
- **Removed a `text-right` I'd initially put on the "Next" link** — Bible §6.4 rule 2 is explicit
  that *text* blocks stay left-anchored (only media is allowed to drift/offset right); right-
  aligning a text block was a rule violation on my part, caught in the same 320px pass.
- **`src/components/work/ProjectGrid.tsx` (new)** is the one implementation of the asymmetric
  card stagger (Bible §6.4 rule 4) shared by the Video index and Home's featured section, so the
  alternating-side/offset-down logic exists exactly once.
- **`SITE_URL` consolidated into `site.ts`**, replacing the `process.env.NEXT_PUBLIC_SITE_URL ??
  "http://localhost:3000"` fallback that was duplicated in `sitemap.ts` and `robots.ts`; also
  backs `layout.tsx`'s new `metadataBase` and every page's canonical URL (Step 7).
- **`sitemap.ts` now includes project detail URLs** (`/work/[slug]` for every project) — a small,
  obviously-correct gap left over from Phase 2, when no project pages existed yet to list.
- **Known pre-existing issue, out of Phase 3 scope: `Header.tsx` overflows by ~7px at exactly
  320px** (its flex row of wordmark + nav + theme toggle + menu button doesn't quite fit at the
  narrowest supported width). This is unmodified Phase 2 shell code; flagging it here rather than
  patching shell code that wasn't part of this phase's task list.
- **Local-only `.env.local`** (already covered by the repo's blanket `.env*` gitignore rule) holds
  placeholder `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`/`NEXT_PUBLIC_BUNNY_PULL_ZONE` values so pages
  render without the loader's "not set" throw during my own visual verification. Never committed.
- **`<CloudinaryImage>` needed `"use client"` added.** It builds a per-instance `loader` closure
  and passes it to `next/image`, which only works when the component itself renders on the
  client — a Server Component can't serialize a function prop across the RSC boundary. This was
  latent since Phase 2 (the styleguide never actually rendered `<CloudinaryImage>`, and Step 1's
  two usages were both already inside Client Components); it surfaced immediately when
  `ProjectGrid` — a Server Component, for the SSR'd/filtered Video index — rendered it directly.
  Fixed at the component itself, not by pushing `"use client"` up into `ProjectGrid` or the page,
  so server-side filtering stays server-side.
- **Video index filtering is plain `<Link>` elements, zero client JS.** `WorkPage` is an async
  Server Component reading `searchParams.category` directly and filtering server-side;
  `FilterBar` is a Server Component too (App Router's own client-side `<Link>` navigation already
  avoids a full reload and keeps the URL shareable, and the existing `btn` utility's
  `[aria-current]` styling handles the active state) — no manual pushState/shallow-routing code,
  and no "use client" boundary needed at all for the filtering feature itself.
- **Added `<h2 className="sr-only">Projects</h2>`** before the grid on the Video index — the
  page's h1 ("Video") was followed directly by `ProjectGrid`'s h3 card titles with no h2 between
  them (there's no visible section heading here, unlike Home's "Selected Work" head). Keeps
  `ProjectGrid`'s internal heading level (h3) consistent across both of its call sites rather than
  making it conditional.
- **`overflow-wrap: break-word` added directly to the `type-display` `@utility`** in
  `globals.css`, rather than an ad-hoc `break-words` at each call site. Found on the Photography
  page: "Photography" alone, at the minimum display clamp (3.25rem, 800 weight, 125% width-
  stretch), is 525px wide — wider than a 320px column's ~280px content width, with nowhere to
  wrap. This is the same failure mode already fixed once in Step 1 (the Prev/Next project titles);
  baking it into the utility fixes it everywhere `type-display` is used, present and future,
  instead of relying on remembering a modifier class per call site. The Step 1 call sites' now-
  redundant `break-words` classes were removed.
- **`Lightbox` component (new, `src/components/media/Lightbox.tsx`)** is generic over a plain
  `images: string[]` + `initialIndex`, not coupled to `PhotoSeries` — reusable wherever a scoped
  image set needs prev/next/close, per the brief's "build it as reusable" instruction.
- **`PhotoSeriesGrid` uses a 4-item repeating span/aspect-ratio pattern** (portrait 3:4 / wide
  16:9 / ultra-wide 21:9 / square 1:1), deliberately different from Project Detail's 3-item,
  narrower aspect-ratio range — satisfies the brief's "should feel distinctly different" gate on
  both the pattern length and the actual shapes, not just the column math. Mobile is a plain 2-up
  grid (vs. stills' 1-up stack), matching the wireframe's own mobile Photography frame.
- **Series titles render at `type-subhead`, not `type-headline`.** Bible §5.2's type-scale table
  explicitly assigns "Series titles" to `--type-subhead` — caught this before shipping it wrong.
- **Studio is a single space, not three** (see top of this section) — `content/studio.json`
  trimmed to one `StudioSpace` entry; `getStudioSpace()` added to `content.ts` returning it
  directly rather than every caller reaching for `getAllStudioSpaces()[0]`.
- **Significant sitewide bug found and fixed: `--spacing-0` was never defined.** `globals.css`'s
  `@theme` block resets `--spacing-*: initial` and `--spacing: initial` (intentionally, to close
  off Tailwind's default numeric scale and force the Bible's 8 named steps), then only redefines
  `--spacing-1` through `--spacing-8`. Tailwind v4 compiles any "-0" utility (`top-0`, `inset-0`,
  `bottom-0`, `left-0`, `right-0`, …) as `calc(var(--spacing) * 0)` unless a `--spacing-0` token
  exists — with `--spacing` reset and no `--spacing-0`, every "-0" utility sitewide silently
  resolved to an invalid/`auto` value instead of `0`. Found while building the Studio page's
  sticky-bottom-bar WhatsApp CTA (`bottom-0`/`inset-x-0` had no effect at all); checking further,
  **this meant `Header.tsx`'s `sticky top-0` was never actually sticky** (confirmed: after
  scrolling 800px it moved off-screen with the page instead of pinning to `top: 0`) **and
  `MobileNav.tsx`'s `fixed inset-0` scrim/panel may not have reliably covered the full viewport**
  — both pre-existing Phase 2 code, unrelated to anything built in Phase 3 itself. Fixed by adding
  `--spacing-0: 0px` alongside the existing 1–8 scale — a structural "zero," not a ninth scale
  step, so it doesn't reopen arbitrary in-between spacing values (`p-7`, `mt-11`, …) the closed
  scale exists to prevent. Verified after the fix: Header now correctly pins at `top: 0` through
  scroll, MobileNav's overlay covers the full 0,0→viewport rect, and the Studio CTA sits flush at
  the bottom of the mobile viewport.
- **WhatsApp CTA is one link, not two.** The wireframe's mobile frame explicitly calls for a
  sticky bottom bar and the desktop frame shows it inline after the rate rows; rendering it twice
  (one per breakpoint) would violate Bible §1.3's "no content block exists twice in the DOM" rule,
  so it's a single `<a>` whose position/sizing utilities switch entirely via the `md:` breakpoint
  (`fixed` + `inset-x-0 bottom-0` at mobile → `static` + normal flow at desktop).
- **Grip & lighting equipment renders as one row with a list value**, not 5–10 separate labeled
  rows — the content type's "6–10 rows" comment describes the array's own length, and a
  scannable bulleted list under one "Grip & Lighting" label reads better than repeating a near-
  identical label 5 times; each item is still its own line.
- **Home is 3 content sections, not the wireframe's 4** — a genuine contradiction between
  `wireframes.html` (Hero → Selected Work → Photography teaser → Studio teaser → Footer) and this
  phase's own brief text, which is explicit and repeated as a hard gate criterion ("no more than
  three content sections above the footer... resist the urge to add more sections... three
  sections... is the entire page"). Resolved in favor of the brief's explicit, current, gate-
  enforced instruction over the older low-fidelity wireframe — dropped the Photography and Studio
  teaser blocks entirely. Noting this here per the top-level instruction to flag Bible/wireframe
  contradictions rather than silently pick a side.
- **Hero overlay text sits on a flat `--scrim/30` tint, not a gradient or text-shadow** (both
  guardrail violations) — a uniform-opacity color layer is neither. Paired with a new,
  deliberately theme-invariant `--hero-overlay-fg` token (`#F4F0E8`, the same value as dark
  theme's `--text-primary`) since the hero is always scrimmed toward black regardless of the
  site's active theme, so the overlay text needs one constant light color, not one that flips.
- **Hero diagonal clip is `polygon(0 0, 100% 0, 100% 100%, 0 90%)`**, a percentage approximation
  of Bible §2.2's locked −13° wedge angle, not a literal trigonometric −13° cut. A true 13° angle
  computed across a full 100vw-wide, ~80vh-tall box would drop roughly half the box height across
  its width (tan(13°) × a ~1900px viewport run ≈ 440px, on an ~800–900px-tall hero) — wildly more
  aggressive than the logo-scale mark the angle is drawn from. `Footer.tsx`'s existing wedge
  already treats this angle as a percentage-based approximation rather than a computed one; this
  follows the same precedent at hero scale (a 10-percentage-point drop across the full width).
- **Hero video is the first `featured` project's `bunnyVideoId`/`posterImageId`** — no dedicated
  "showreel" asset exists in the content schema, and Bible §6.5 is explicit the hero is a video
  block (not optional, unlike the phase brief's looser "video or image" phrasing). Reusing a real
  featured project keeps this data-driven rather than inventing a new content concept; array order
  decides which one leads, consistent with the `featured` flag's own ordering rule.
- **Home's statement paragraph reuses the exact placeholder line already shipped in
  `styleguide/page.tsx`** as the type-subhead demo copy, rather than drafting new filler text —
  keeps one canonical placeholder positioning line instead of two slightly different ones.
- **Contact page renders 5 link rows, not the wireframe's 4** — the wireframe's greybox only
  shows Instagram/YouTube/Phone/Email, but the brief's Step 6 text explicitly lists WhatsApp as a
  required contact channel too. Added as its own row rather than extending the shared
  `CONTACT_LINKS` array, since that array also drives `Footer.tsx`'s link list, and the Footer's
  own wireframe likewise shows only 4 links, no WhatsApp — keeping `CONTACT_LINKS` at 4 keeps the
  footer wireframe-faithful while the Contact page gets the brief's full 5-channel list.

## Metadata & Open Graph (Step 7)

- **Static pages (home/work/photography/studio/contact) use Next's `opengraph-image.tsx` file
  convention** (`next/og`'s `ImageResponse`), rendering one shared, genuinely-designed 1200×630
  card (`src/lib/og-image.tsx`) — token colors, the wedge motif from `Footer.tsx`'s clip-path,
  heavy tracked caps — per page, not a screenshot. Font is system-ui rather than self-hosted
  Archivo: Satori (the engine behind `ImageResponse`) needs raw font binary data, which
  `next/font`'s build pipeline doesn't expose for reuse, and fetching a font file at request time
  trades reliability for a marginal typographic gain on a share-preview card. The card always
  renders the dark palette regardless of the viewer's site theme — a share card has no theme of
  its own, and Satori has no access to the page's runtime `[data-theme]` anyway.
- **Project detail pages skip `ImageResponse` entirely** and set `openGraph.images` directly to
  `cloudinaryUrl(posterImageId, "ogImage", 1200)` — a real Cloudinary transform of each project's
  own poster, per the brief's explicit instruction for this page type. New `ogImage` preset added
  to `src/lib/media/presets.ts` (`c_fill,g_auto,ar_1200:630`).
- **`generateMetadata` now calls `cloudinaryUrl()` at build time** (via `generateStaticParams`'s
  SSG pass), which throws if `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` is unset — this extends the
  existing "fail loudly on a missing credential" pattern from `cloudinary-loader.ts` /
  `CloudinaryImage.tsx` from "images render broken" to "the build itself fails" for this one code
  path, kept consistent with the rest of the codebase rather than special-cased with a fallback.
  **`next build` now requires the Cloudinary env var to be set** — already true for correct
  images generally, just newly load-bearing for the build to complete too. Flagging clearly since
  the client confirmed no Cloudinary account exists yet (Step 7, Phase 2).
- **Meta description truncation is word-boundary-aware** (`truncateDescription`, ≤155 chars) —
  cuts at the last space before the limit rather than mid-word, appending "…".
- **One known, unresolved 60-char title overage**: `Monsoon Sessions: Ep Collective Live — Talon
  Production House` is 61 characters. That project's own title (37 chars) is within its stated
  18–48ch content budget, but combined with the fixed `— Talon Production House` suffix (26
  chars) it exceeds the SEO title budget by one character. This is a structural tension between
  Phase 2's content-schema title budget and Phase 3's SEO title budget, not something fixable by
  editing real project data or dropping the suffix (which would break the "consistent format"
  requirement and cross-page brand consistency) — flagging honestly rather than silently
  truncating a client-supplied title. Titles at the very top of the 48ch budget will always risk
  this; worth a conversation with the client if it recurs with real content.
- **`sitemap.ts` reads `SITE_URL` from `src/lib/site.ts`** (new shared constant) instead of
  redefining `process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"` locally, and now also
  lists every project detail URL — `robots.ts` does the same. `layout.tsx` gets a new
  `metadataBase: new URL(SITE_URL)` so every page's relative canonical/OG `url` resolves to an
  absolute URL correctly.

## Final verification pass

- **Two more instances of the `--spacing` bug** (see "Studio page" section above) found during the
  final breakpoint sweep, both on the Studio page: `pb-20` (intended clearance under the mobile
  sticky CTA so it wouldn't cover the terms text) and `w-40` (the spec-table label column width) —
  neither "20" nor "40" is a defined `--spacing-N` step, so both silently resolved to nothing.
  Fixed with `pb-7` (a real scale step, 104px — comfortably clears the ~62px CTA bar) and
  `w-[10rem]` (arbitrary value, since a label-column width isn't really a "spacing" choice in the
  Bible's sense). Re-audited every `.tsx` file afterward for any other spacing/sizing utility
  using a number outside 0–8 or already-bracketed arbitrary syntax — none remain anywhere in the
  codebase, Phase 2 or Phase 3.
- **Full guardrail audit via source grep**, not just visual spot-checks: no `rounded`/`gradient`/
  `shadow`/`purple`/`indigo`/`violet` utility usage anywhere in `src/`; the only raw hex values
  outside the token layer are the three in `src/lib/og-image.tsx` (Satori can't read CSS custom
  properties, already documented); no icon-library imports; the only `grid-cols-3` usage is the
  project-detail metadata `<dl>` (a data table, not a card grid — the guardrail targets uniform
  *card* grids specifically); `outline-none` appears exactly once, on the pre-existing Phase 2
  skip-link target (`<main>`), not on any interactive control; `alt=""` appears exactly once, on
  `BunnyPlayer`'s decorative poster overlay, correctly paired with `aria-hidden="true"`.
- **Full breakpoint × page overflow sweep** (320/768/1024/1440/1920, all six templates) via
  `document.body.scrollWidth` vs. `clientWidth` checks — zero overflow anywhere except the
  pre-existing, out-of-scope `Header.tsx` ~7px case already documented above.
- Verified via a full `next build`: zero TypeScript errors, zero lint errors, all 19 routes
  generate successfully (5 static pages + 5 matching `opengraph-image` routes + 3 SSG project
  detail pages + sitemap/robots/styleguide/not-found).

## Content population (Phase 3.5)

- **Logo assets arrived on `master` one commit ahead of this branch's base** (`add talon logo
  assets`, adding `public/images/logo/TALON_Logo_{Light,Dark}Theme.svg`) — cherry-picked directly
  rather than merging, since `git merge-base` confirmed that commit sits cleanly on top of this
  branch's tip with no divergence.
- **Both supplied SVGs are the full color lockup (wordmark + PRODUCTION HOUSE + wedge), one per
  theme — no separate monochrome or wordmark-only cut was supplied.** Bible §2.3 calls for two
  distinct treatments (header: monochrome, wordmark-only, no wedge; footer: full-color lockup,
  large scale, wedge included) using assets that didn't exist until now. Footer uses the supplied
  files directly, unmodified. Header needed a derived asset — see below.
- **`scripts/generate-logo-assets.mjs` (new, dev-only, not part of the build)** mechanically
  derives the header's monochrome/no-wedge wordmark from the supplied full lockup: crops to the
  TALON-only band (excludes "PRODUCTION HOUSE", which sits ~y404+ in the shared 1050×660 source
  and would fuzz at header scale per §2.3's <90px floor anyway) and recolors the wedge-hex paths
  to the file's own dominant letterform ink color. Uses `sharp`, already present as a transitive
  `next` dependency — no new package added. Also generates the favicon set and web manifest icons
  from the same source (full-color TALON+wedge crop — the wedge is the mark's most distinctive
  feature and favicons are browser chrome, not on-page content, so §4.3's "wedge: footer lockup
  only" rule doesn't reach them; `og-image.tsx` already treats the wedge the same way for share
  cards, so this isn't a new exception). Re-run manually if the source logo files ever change.
- **Bug found and fixed during that script's development: deleting the wedge-hex paths (instead of
  recoloring them) left a diagonal bite out of otherwise-solid letter strokes.** The source file
  doesn't draw the wedge only in the gaps *between* letters — where the wedge crosses a letter's
  own stroke, that overlapping region is exported as a separate orange-filled sub-path rather than
  layered on top of a complete letter shape, so simply deleting orange elements left true holes
  (confirmed by rendering onto a flattened background and seeing the letters visibly missing a
  diagonal chunk, not just showing background through natural counters/gaps). Recoloring those
  paths to the surrounding letterform's own ink color (mode of the file's non-wedge fill hexes)
  reunites the stroke into one solid tone instead.
- **Bug found and fixed in the same script: `sharp`'s SVG rasterizer defaults to 72dpi for a bare
  unitless width/height, not 96.** An explicit `density: 96` on the trim-bounding-box render (to
  get a "retina" result) silently rescaled the raster by 96/72 = 1.33× before `trim()` measured
  it, so the reported trim offsets were off by that same factor when mapped back onto the SVG's
  own viewBox units — the derived crop overshot the source canvas (`x:145,w:1105` inside a
  1050-wide band). Fixed by leaving `density` unset (or `72`) specifically for the trim-detection
  render, which keeps 1 raster px = 1 SVG user unit; the final high-res PNG renders still use a
  higher density, just not the measurement step.
- **Theme-conditional logo swap (Header, Footer) renders both variants in the DOM and lets CSS
  (`.theme-logo-light`/`.theme-logo-dark` + `[data-theme="dark"]`, globals.css) decide which
  paints**, rather than reading `next-themes`' `resolvedTheme` in JS and conditionally rendering
  one `<Image>`. The latter would be `undefined` until mount (next-themes can't know the visitor's
  stored/system preference during SSR) and either flash the wrong variant or require a mount-gated
  render, both explicitly ruled out by the brief. Since next-themes already sets `data-theme` via
  a blocking pre-hydration script (`ThemeProvider.tsx`, pre-existing), the CSS-only approach paints
  correctly on first frame with zero client JS and zero hydration mismatch (server and client markup
  are identical — theme is a paint-time decision, not a render-time one). The old `.wordmark`
  `@utility` (a typographic stand-in, per Step 5) is removed now that Header renders the real
  asset. Both `<Image>` instances use `unoptimized` (required — `next.config.ts`'s global custom
  Cloudinary loader would otherwise prepend a `res.cloudinary.com` URL onto a local static path)
  with explicit `width`/`height` matching each cropped asset's real aspect ratio, sized via CSS
  (`h-4`/`h-[clamp(...)]`) so there's no layout shift and no distortion between the two variants
  (light/dark trims differ by ~2% in aspect — visually negligible, not worth forcing identical).
- **Favicon delivered as PNG + a hand-built ICO container (ICONDIR header + raw 16/32px PNG
  payloads, "PNG-in-ICO"), not a redrawn/simplified glyph-only mark.** All current browsers
  support PNG-in-ICO; no icon-conversion package was added. `metadata.icons` in `layout.tsx` lists
  explicit 16/32px PNGs plus a `media: "(prefers-color-scheme: dark)"` pair (the dark-source
  render reads better on a dark tab bar) — this is a different axis from the site's own light/dark
  toggle (OS/browser chrome vs. page content), so it's driven by a media query, not `[data-theme]`.
- **`src/app/manifest.ts` (new)** — Next's manifest file convention, referencing the generated
  192/512px icons; `theme_color`/`background_color` taken directly from Bible §4.3's light-theme
  tokens (`--text-primary` / `--bg`) rather than inventing new values.
- **Contact/WhatsApp values centralized entirely in `src/lib/site.ts`**, per its own existing
  "one file to update" design from Step 5 — no other file needed a change for phone, email,
  Instagram, YouTube, or either WhatsApp number. Phone (`+91 70759 81258`) and WhatsApp
  (`+91 95380 25355`) are different numbers, kept distinct (`tel:` href vs. `WHATSAPP_NUMBER`).
  Instagram href kept exactly as supplied, tracking parameters included — not truncated to a bare
  profile URL, since altering a client-supplied credential value wasn't asked for. `CREDIT.href`
  (CobaltKite Creatives) is left as `"#"`: no real URL was supplied for it, and inventing one would
  violate the brief's "do not invent fake real data" instruction — flagged in the final report as
  a still-open item, not silently left broken.
- **`content/{projects,photography,studio}.json` and `content/clients.json` were not modified.**
  Every entry across all three populated files references fictional clients/films and Cloudinary
  public ids / Bunny video GUIDs that don't match the real `Talon_Production_House` Cloudinary
  folder or library `708480` (verified directly: fetching one placeholder poster URL against the
  now-real cloud name `dhahzowek` returns Cloudinary's own `404` with header
  `x-cld-error: Resource not found - talon/projects/monsoon-sessions/poster` — proving the cloud
  name itself is valid/reachable and the specific asset simply doesn't exist there yet). No real
  Bunny video GUID was supplied anywhere in this phase's brief (only the account-level library id
  and pull-zone hostname), so the Home hero — which already sources its video from the first
  `featured` project's `bunnyVideoId` per the existing Step-5 design — cannot point at a real
  video yet either; the pipeline is fully wired to real infrastructure and will resolve correctly
  the moment real ids are added to `content/projects.json`, with no further code change needed.
  Full punch list of placeholder entries is in the phase completion report, not duplicated here.

## Header logo, revisited (post-Phase 3.5)

- **Header now renders the full-color lockup (`TALON_Logo_{Light,Dark}Theme.svg` — TALON +
  "PRODUCTION HOUSE" + wedge) at `h-6` (64px, ≈102px wide, the Bible §6.2 spacing-scale token —
  no arbitrary value needed), not the cropped monochrome/no-wedge wordmark described above.** This
  is an explicit client override of Bible §2.3's header treatment (monochrome, wordmark-only, no
  wedge, sized well under the 90px full-lockup floor) — the client was shown the size/legibility
  tradeoff (at the old 56px-tall header, "PRODUCTION HOUSE" renders unreadably small) and chose
  full color + subtext + a taller header anyway. `h-6` was picked specifically because it clears
  §2.3's own 90px-wide floor for when the subordinate line is legible (`h-5`/40px only reaches
  ~64px wide, still below that floor — tried first, rejected once measured). `--header-height`
  raised from `56px` to `104px` (the matching `--spacing-7` token) to give the taller lockup clear
  space without cramping against the hairline; nothing else reads `56px` literally
  (`MobileNav.tsx` and `studio/page.tsx`'s sticky offsets both reference the `--header-height`
  token, so they follow automatically). Caught one bug getting here: this repo resets Tailwind's
  default spacing scale to the Bible's own 8-value one (`--spacing-*: initial`, globals.css) — an
  arbitrary class like `h-11` silently resolves to nothing (confirmed via a zero-constrained
  649×408px render) since only `--spacing-0` through `--spacing-8` exist; sizing had to land on one
  of those defined steps. The derived monochrome wordmark assets (`talon-mark-{light,dark}.svg`,
  `scripts/generate-logo-assets.mjs`) are left in place, unused by Header — the script still
  generates the favicon set from the same source and shouldn't be deleted.

## Motion system (Phase 4, Step 1)

- **`rise`'s `visible` state became a dynamic (function-of-`custom`) variant** rather than a plain
  object (`src/lib/motion.ts`). Framer Motion gives a variant's own inline `transition` priority
  over a `transition` prop passed to the component, so a per-item stagger delay has nowhere to live
  except inside the variant itself — the documented Framer Motion pattern for this is a variant
  function receiving `custom`, which is what `rise` is now. `riseReduced` stays a static object
  (no stagger under reduced motion — see below).
- **New `src/components/motion/Reveal.tsx`** is the one implementation of P1 Rise for every
  scroll-triggered reveal site the brief lists (Home featured cards + client logos, Video index
  cards, Photography series headings + images, Project detail metadata/synopsis/stills, Studio
  gallery/spec rows/rate rows, Contact links) — picks `rise` vs. `riseReduced` via Framer Motion's
  `useReducedMotion`, fires once at 20% viewport visibility, threads `index` through as `custom`.
  One implementation, matching the codebase's existing pattern of centralizing shared behavior
  (`ProjectGrid`, `useDialogBehavior`, `Lightbox`).
- **Applied reveals exactly to the brief's named list, not more.** Project detail's Credits list
  and Home's statement paragraph/"Selected Work" heading are deliberately left un-revealed — not
  named in the brief's explicit per-page list, and shaped like the "body text paragraphs don't
  animate in" exclusion. Studio's "equipment section" and "rate card" are staggered per-row (not
  as one block) because Bible §7 P1's own applies-to list names "rate rows" specifically, not "the
  rate card" as a unit; spec rows and Contact's links follow the same per-row treatment for
  consistency with every other repeated-list reveal on the site (index items, gallery images).
- **Wrapping list rows in `Reveal` broke two components' reliance on `:first-child` CSS
  (`first:pt-0` in `ProjectGrid.tsx`, `first:border-t-0` in `studio/page.tsx`'s `SpecRow`/
  `RateRow`).** Nesting each row inside its own new wrapper div makes that row the sole/first child
  of the wrapper regardless of its real position in the list, so the pseudo-class stopped
  distinguishing "first card overall" from "every card." Fixed two different ways depending on
  which component owns the DOM boundary: `ProjectGrid` explicitly checks `i === 0` in the class
  string (the row itself, `<Link>`, is nested one level inside `Reveal`, so first-child can't reach
  it); `SpecRow`/`RateRow` instead render `<Reveal>` itself as their outermost element (no added
  wrapper), so they stay true siblings under `<dl>`/the rate container and `first:border-t-0`
  keeps working unmodified. Verified both against the live DOM after the fix (row-by-row computed
  `padding-top`/`border-top-width` check) rather than trusting the read alone.
- **Home hero extracted into `src/components/home/Hero.tsx`** (new Client Component) purely to host
  the scroll-linked scale (`useScroll` + `useTransform`, 1 to 1.08 across the hero's own scroll
  range via `offset: ["start start", "end start"]`), gated to `undefined` (no transform at all)
  under `useReducedMotion()`. This is scroll-linked, not duration/easing-driven, which is why the
  brief lists "hero media motion" separately from "every animation uses one of the three
  primitives" — it has no timing curve to conflict with Bible §7.
- **Real bug found and fixed: `link-draw` and `btn` in `globals.css` had no touch-device hover
  guard.** `ProjectGrid.tsx`'s `group-hover:` classes turned out to already be safe — confirmed by
  inspecting the actual compiled CSS output, where Tailwind v4 wraps `group-hover` (like `hover`)
  in `@media (hover: hover)` by default (shipped in Tailwind 3.4+, still true in v4). But
  `link-draw`/`btn` are hand-written `&:hover` rules inside `@utility` blocks — raw nested CSS,
  which Tailwind's automatic variant-level media guard does not reach. These two utilities are the
  site's entire hover vocabulary (nav links, every button, filter chips, WhatsApp CTA, theme
  toggle per Bible §7), so this was a real, sitewide "hover state sticks after a tap" bug, not a
  hypothetical one. Fixed by splitting each `&:hover, &:focus-visible` block into a
  `@media (hover: hover) { &:hover {...} }` block plus an unconditional `&:focus-visible {...}`
  block — focus-visible must never be touch-gated, it's a keyboard/AT state. Verified against the
  compiled CSS output directly (media-query-wrapped hover rule, unconditional focus-visible rule
  both present and correctly split), not just by reading the source.
- **Custom cursor: skipped**, per the brief's own instruction that a missing one is invisible while
  a flawed one is the loudest thing on the page. Five simultaneous hard requirements (zero-lag,
  fully touch-invisible, never blocking text selection/click targets, state-changes on every
  interactive element, on-brand design) is real scope for a nice-to-have the brief explicitly
  frames as skippable.
- **`PageTransition.tsx`'s existing 320ms P3 Veil fade is unchanged**, despite the brief's "under
  300ms" framing — 320ms is Bible §7's own locked P3 duration (a token, not a magic number), the
  fade doesn't block interactivity or progressive image loading underneath it, and no loading
  screen exists. Shortening a Bible-defined duration to satisfy a soft brief number would violate
  "tokens, not values" for a 20ms difference with no user-perceptible cost.
