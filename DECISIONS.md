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
