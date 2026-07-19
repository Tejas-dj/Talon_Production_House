# TALON DESIGN BIBLE
Phase 1 design foundation. Master context for Phases 2–5. Every rule here is binding sitewide, at every breakpoint, unless a later phase amends it in writing.

Locked direction, restated for reference: Editorial Brutalist structure, Warm Editorial palette. Grotesque typography, extreme type scale contrast, hard-edged asymmetric grid, zero border radius, no drop shadows, hairline rules as the only dividers, beige-forward light theme with genuine warmth, pitch black dark theme, photography as the only source of color on the page.

---

## 1. Reference deconstruction

### Access disclosure
**Pure Cinema (purecinema.tv):** fetched and read directly — homepage and Work index, full extracted markup. Structural observations below are observed. Pixel-exact type sizes are not recoverable from text extraction, so any numeric size claim for Pure Cinema is marked *inferred from markup hierarchy*, not measured.

**Rectangle Films (rectanglefilms.com):** the site disallows automated access entirely. Direct fetch was blocked at robots level. Everything below about Rectangle Films comes from search-engine-indexed copy (title tag, meta description, homepage body text). Structure, navigation, type, and rhythm for Rectangle Films are therefore **inferred or unknown**, and I say which at each point. Do not treat any Rectangle Films structural claim as observed.

### 1.1 Pure Cinema — observed structure

**Navigation.** At rest: a fixed slim header with the wordmark SVG at left and a hamburger labelled "menu" — there is no inline nav at any width; desktop users get the same hamburger as mobile. On open, the menu is a full overlay listing MOTION / STILLS / ABOUT / JOURNAL / CONTACT. On scroll the header persists (markup shows the header block duplicated for a sticky variant). Mobile behavior is identical to desktop, which is honest but wastes desktop width: two of the three visitor types must click once before they can go anywhere.

**Type sizes.** From markup hierarchy: an oversized split display ("Pure" / "Cinema" as separate h1/h2 lines), a full-caps statement heading ("PURE CINEMA IS A FULL-SERVICE…"), numbered work-list items, a body/intro size, small metadata labels ("San Diego & Beyond", "A FEW OF OUR CLIENTS"), and footer link text. That is roughly **six distinct sizes** *(inferred; extraction cannot measure rendered px)*.

**Display-to-body ratio.** The hero display is viewport-scaled and the body is conventional paragraph size; the ratio is plausibly in the **8:1 to 10:1** range *(inferred)*. The extreme contrast is the single strongest move on the site and the main reason it reads as a production house rather than an agency template.

**Vertical rhythm.** Section spacing is broadly uniform — hero, statement, client marquee, featured work, contact, footer arrive at an even cadence *(inferred from block structure; Framer sections default to uniform padding and nothing in the markup suggests deviation)*. The evenness makes the second half of the page scroll like a checklist.

**Work indexing and reveal.** Homepage: a numbered featured list (1/ through 9/) where each row pairs a client name with a hover-triggered Vimeo loop and a "VIEW PROJECT" link into a case study. The dedicated Work page is **a bare numbered text list of 17 client names** with no visible thumbnails — the video reveals only on hover. On touch devices there is no hover, so the Work index on mobile is a wall of names with zero visual evidence. The markup also shows the entire 17-item list repeated three times (marquee/duplication artifact), which is weight without meaning.

**First eye landing.** The split "Pure / Cinema" display type with an inline autoplaying video strip embedded between the words. What forces it: it is the largest element by an order of magnitude, it is the only moving element above the fold, and everything else above the fold is whisper-small metadata. The hierarchy does its job by starving everything else.

**Footer.** A "Get in touch" block with phone, email, Instagram, LinkedIn each set as oversized repeated-text links with an action label (call / MAIL / FOLLOW / CHAT), followed by a repeated nav, the tagline "EVERY INDUSTRY. EVERY PLATFORM." as a mailto link, and copyright. The footer is effectively the contact page, which is a good instinct — put the conversion where the momentum ends.

### 1.2 Rectangle Films — limited access

From indexed copy only: title positions it as "Video Production Company Bangalore"; the body copy positions a "collective of filmmakers and creative producers working across films, music videos, and visual storytelling," leading with the Karnataka State Film Award for the debut feature *Neeli Hakki* and naming the music video *Tulasi*. This is prestige-first, festival-credential positioning — the site sells taste and pedigree rather than commercial throughput.

Everything structural — nav behavior, type count, rhythm, indexing, footer — is **unknown**. One thing the indexed copy does support: there is no rental, studio, hire, or rate language anywhere in the indexed text, so a commercial studio-rental offering is *inferred absent*.

### 1.3 Five openings Talon will take

1. **The studio-rental page.** Neither reference sells a rentable space (Pure Cinema: observed absent from nav and footer; Rectangle: inferred absent from indexed copy). This is Talon's only page with a price and a direct action, and it will be engineered as a conversion page — specs, gallery, rate card, WhatsApp — not a brochure page. Approach: treat Studio as the site's commercial anchor and give it the most functional, least atmospheric voice on the site (see §3).

2. **A light theme that is actually designed.** Pure Cinema is dark-only (observed). Dark-only is the genre default because it flatters video thumbnails and hides lazy spacing. Talon's beige light theme will be the default theme and will be built first in every layout decision, so it is never a filter applied to a dark design. Approach: all Phase 2 components get designed in light theme, then verified in dark, not the reverse.

3. **A work index that works without hover.** Pure Cinema's Work page is a hover-dependent text list that collapses on touch (observed). Talon's video index shows a visible thumbnail for every project at every width, with hover as enhancement (loop preview) rather than requirement. Approach: thumbnail-forward asymmetric index, filterable, detail page one tap away.

4. **Rhythm as information.** Pure Cinema's uniform section cadence (inferred) makes page position meaningless — you can't feel where you are. Talon varies vertical padding by section role (§6 doctrine), so arriving at the studio teaser *feels* different from scrolling work. Approach: three named padding roles, enforced by token, never improvised.

5. **Structural weight discipline.** Pure Cinema's markup carries triplicated list content, marquee duplication, and Framer runtime overhead (observed). On Indian mobile networks that is rank poison and bounce fuel. Approach: Next.js static rendering, Cloudinary responsive images, Bunny Stream posters instead of autoplaying Vimeo pulls, and a hard rule that no content block exists twice in the DOM.

A sixth, free of charge: Pure Cinema's desktop hamburger (observed) adds one click for the fastest-judging audience. Talon's nav is inline text links at desktop, hamburger only under the mobile breakpoint.

---

## 2. Logo and brand extraction

### 2.1 What the mark is

The wordmark sets TALON in heavy, wide, low-contrast grotesque capitals — near-uniform stroke weight, flat terminals, tight counters, with the O drawn as a rounded rectangle rather than a circle. Beneath it, PRODUCTION HOUSE runs in the same grotesque at a fraction of the size, letterspaced wide to match the wordmark's width. Behind and through the letters cuts a single orange wedge: a hard-edged diagonal that enters high on the left and exits low on the right, descending at a shallow angle of roughly 12–15 degrees. The A's triangular counter and the wedge's point rhyme — the mark contains exactly two shape languages, rectangle and triangle, and nothing else. Negative space does real work: the wedge is read through the gaps between letterforms, so the mark depends on the background color to complete itself.

Implied personality in one line: **industrial confidence with one controlled act of aggression.** Everything is set square and heavy except the single diagonal cut, and that restraint is what makes the cut feel intentional rather than decorative.

### 2.2 The derivation (say this sentence to the client)

*"The entire site is built the way the logo is built: heavy rectangular structure, hairline precision, and exactly one diagonal cut — so every layout decision is your mark, scaled up to a page."*

Concretely, four rules derive from the mark:

1. **Rectangle + triangle only.** Zero border radius everywhere, no ovals, no pills, no soft shapes. The logo's O is the only rounded form permitted on the site.
2. **One diagonal per page, maximum.** The hero media block on Home (and only there) may carry a clip-path edge at the wedge's angle (–13° from horizontal, locked). Every other block on the site is orthogonal. If the diagonal appears twice, it becomes a theme; once, it is a signature.
3. **Weight contrast as hierarchy.** The wordmark pairs a massive element with a small tracked-out subordinate line. The site's type system (§5) replicates exactly this relationship: display size + wide-tracked uppercase metadata style, with the middle sizes deliberately quiet.
4. **Color as event.** In the mark, orange appears once, behind everything. On the site, color appears only in photography and in one accent interaction state. Chromatic scarcity is inherited, not invented.

### 2.3 Logo usage rules

- **Minimum render size:** full lockup (wordmark + PRODUCTION HOUSE + wedge) never below **140px wide**; below that the subordinate line fuzzes. Between 90–140px use wordmark-only (TALON + wedge, no subordinate line). Never below 90px.
- **Clear space:** on all sides, the cap height of the A in TALON at rendered size. Nothing enters this zone, including hairline rules.
- **Color token per theme:** the wedge orange is a brand asset, not a UI token — it is `--logo-wedge: #EE8322` in both themes (sampled from supplied files; confirm against source vector in Phase 2). It is exempt from the "photography is the only color" rule **only in the footer**. Letterforms render in `--text-primary` of the active theme (dark letters on beige, off-white letters on black — matching the two supplied files).
- **Header treatment:** monochrome wordmark-only, letters in `--text-primary`, no wedge. Reasoning: the header persists on every scroll of every page; a permanent orange element would compete with photography and dilute the accent's meaning.
- **Footer treatment:** full-color lockup with the orange wedge, at large scale, as the closing brand moment of every page. The user meets the full mark exactly once per page, at the end — placement mirrors the logo's own logic of a single color event.

---

## 3. Psychological positioning

Three audiences, three tempos, no services menu to route them. The page architecture does the routing instead.

### 3.1 The producer (brand or agency, evaluating execution)

**Needs:** proof of finishing quality within ten seconds; evidence of range; a fast path from thumbnail to full film; a credit block that names real roles. **Leaves when:** the site is slow, the work is buried behind interactions, or copy oversells before the work shows. **Carried by:** Home (first eight seconds) and the Video index → Project detail chain. **What we do for them:** hero opens on work, not words; video index is thumbnail-forward and filterable by type; project detail leads with the film, credits directly beneath, zero adjectives before the play button.

### 3.2 The independent artist (music video, buying vibe)

**Needs:** taste signals — grading, framing, the photography series; a sense that the studio *gets it*; implicit price comfort (a site this restrained says "we're not the cheapest, we're the right ones"). **Leaves when:** the site smells corporate, or when everything looks like ad work with no artistic register. **Carried by:** Photography index (this is the vibe page) and the music-video slice of the Video index. **What we do for them:** photography series are named and curated like exhibitions, not dumped as a grid; the filter on the video index surfaces "Music Video" as a first-class category; Contact is one tap from anywhere with Instagram first in the order, because this audience DMs before it emails.

### 3.3 The renter (photographer or small crew, transactional)

**Needs:** specs, dimensions, equipment list, a number, availability, and a human on WhatsApp within one tap. **Leaves when:** they can't find a price, the specs are vague, or contact means a form into a void. **Carried by:** Studio, exclusively. **What we do for them:** rate card with real numbers on the page (a hidden price reads as an expensive price), equipment specs as a scannable table, WhatsApp CTA pinned within thumb reach on mobile, and the page reachable in one click from the header on every page.

### 3.4 Voice per page

- **Home:** declarative and short. Sentences under twelve words. The page's job is to hand off, not to hold.
- **Video index / Project detail:** archival. Titles, clients, years, roles. The films talk; captions identify.
- **Photography:** curatorial. Series get one-line statements, images get none.
- **Studio:** operational. Numbers, dimensions, inclusions, exact terms. The only page where a full sentence of instruction ("Message us on WhatsApp with your date") is welcome.
- **Contact:** blunt. Four links and nothing else. Its emptiness *is* the confidence.

---

## 4. Color system

### 4.1 Validation of the supplied specification

Measured WCAG contrast ratios (relative-luminance method) on the values as supplied:

| Pairing | Supplied ratio | AA (4.5 normal / 3.0 large) | Verdict |
|---|---|---|---|
| Light: #171614 on #EDE7DC | 14.69 | pass | keep |
| Light: #171614 on #E3DCCF | 13.26 | pass | keep |
| Light: #6B655C on #EDE7DC | 4.69 | pass (normal) | borderline |
| Light: **#6B655C on #E3DCCF** | **4.23** | **FAIL normal text** | **change** |
| Light: **#B8823C on #EDE7DC** | **2.71** | **FAIL all text** | **change (as text)** |
| Dark: #F4F0E8 on #000000 | 18.48 | pass | keep |
| Dark: #F4F0E8 on #0B0B0B | 17.32 | pass | keep |
| Dark: #8A857D on #000000 | 5.73 | pass | keep |
| Dark: #8A857D on #0B0B0B | 5.37 | pass | keep |
| Dark: #B8823C on #000000 | 6.30 | pass | keep |
| Dark: #B8823C on #0B0B0B | 5.90 | pass | keep |

Two changes, with reasoning:

1. **Light muted text: #6B655C → #655F56.** The supplied value fails AA (4.23) the moment muted text sits on an elevated surface, which it will constantly (card metadata). #655F56 measures **5.13 on background, 4.63 on surface** — passes both, and the shift is visually negligible (same hue family, ~4% darker).
2. **Accent becomes theme-resolved.** #B8823C on beige is 2.71 — illegible as text, and the accent's one job is an interaction state, which is almost always text (an active filter, a hovered link). So the token `--accent` resolves to **#82541A in light theme** (measured **5.28 on background, 4.77 on surface** — AA pass) and **#B8823C in dark theme** (6.30 / 5.90 — AA pass). Same pigment family, burnt down for beige, lifted for black. The raw #B8823C survives as `--accent-raw` for the single non-text use permitted (the focus ring in dark theme). This preserves the intent — one warm accent, one meaning — while making it legal.

Hairlines and disabled states are decorative/non-text and are exempt from AA text thresholds by design; both hairline values sit deliberately low-contrast (1.46 light, 1.27 dark) so rules read as etching, not borders.

### 4.2 Accent doctrine

`--accent` appears in **exactly one interaction state sitewide: the active/selected state.** The currently active filter on the video index, the currently active nav item, the pressed state of the WhatsApp CTA. Never hover, never decoration, never headings. When the user sees warm gold, it always means "this is where you are / what you've chosen." One color, one meaning, no exceptions — that is what makes its appearance carry information.

### 4.3 Token table (paste-ready for Phase 2)

```css
:root {
  /* ---- LIGHT (default) ---- */
  --bg:            #EDE7DC;  /* page background */
  --surface:       #E3DCCF;  /* elevated blocks: cards, rate rows, spec tables */
  --text-primary:  #171614;  /* headings, body, all primary reading text */
  --text-muted:    #655F56;  /* metadata, captions, years, secondary labels */
  --rule:          #C9C0B2;  /* hairline dividers, 1px only, the sole divider device */
  --accent:        #82541A;  /* active/selected state ONLY (see §4.2) */
  --accent-raw:    #B8823C;  /* reserved: dark-theme focus ring source value */
  --focus-ring:    #171614;  /* 2px solid outline, offset 2px, on any focused element */
  --selection-bg:  #171614;  /* ::selection background */
  --selection-fg:  #EDE7DC;  /* ::selection text */
  --scrim:         rgba(23, 22, 20, 0.78);  /* lightbox / menu overlay */
  --disabled-fg:   #A39C8F;  /* disabled text: 2.3:1, intentionally sub-AA to read as inert */
  --disabled-bg:   #E3DCCF;  /* disabled fills share surface, no new grey invented */
  --logo-wedge:    #EE8322;  /* brand asset, footer lockup only, both themes */
}

[data-theme="dark"] {
  --bg:            #000000;
  --surface:       #0B0B0B;
  --text-primary:  #F4F0E8;
  --text-muted:    #8A857D;
  --rule:          #1F1F1F;
  --accent:        #B8823C;
  --accent-raw:    #B8823C;
  --focus-ring:    #B8823C;  /* pure white ring on black glares; brand gold at 6.3:1 passes non-text 3:1 */
  --selection-bg:  #F4F0E8;
  --selection-fg:  #000000;
  --scrim:         rgba(0, 0, 0, 0.85);
  --disabled-fg:   #4A463F;
  --disabled-bg:   #0B0B0B;
  --logo-wedge:    #EE8322;
}
```

### 4.4 Semantic roles, one line each

- `--bg` — the page. Photography sits directly on it; nothing else may tint it.
- `--surface` — one step of elevation, used only where content is grouped (spec tables, rate rows, index cards); never nested inside another surface.
- `--text-primary` — every character a user must read.
- `--text-muted` — every character a user may skip: years, counts, roles, captions.
- `--rule` — 1px horizontal or vertical hairlines; the only divider on the site; no other borders exist.
- `--accent` — the active/selected state, nowhere else (§4.2).
- `--focus-ring` — 2px solid outline with 2px offset on all keyboard focus; never removed, never restyled per component.
- `--selection-bg/fg` — text selection inverts to full-contrast; the site feels engineered even when you drag across it.
- `--scrim` — behind lightbox and mobile menu; content under scrim is non-interactive, period.
- `--disabled-fg/bg` — inert states; deliberately low contrast so they read as off, with a `not-allowed` cursor doing the accessibility work alongside `aria-disabled`.
- `--logo-wedge` — footer lockup only; using it anywhere else is a violation of §2.3.

Contrast ratios for the final palette (all measured): light `text-primary` 14.69/13.26, light `text-muted` 5.13/4.63, light `accent` 5.28/4.77, dark `text-primary` 18.48/17.32, dark `text-muted` 5.73/5.37, dark `accent` 6.30/5.90 (each pair = on `--bg` / on `--surface`). **Every text-on-background pairing in both themes passes WCAG AA.**

---

## 5. Typography

### 5.1 Three viable pairings

**A. Archivo (display, Expanded width axis) + Archivo (body) — recommended**
Display: Archivo variable, width 125%, weight 800, caps. Body: Archivo, width 100%, weight 400. **License: SIL OFL, free, Google Fonts / self-hosted.** Rationale: Archivo's wide heavy caps are the closest live match to the logo's letterforms — flat terminals, rounded-rectangle O, industrial counters — so the wordmark and the site type read as one system without licensing the logo's (unknown) source face. Risk: Archivo is common in portfolio sites at default width; mitigated because we run the display exclusively at 125% width and 800 weight, a cut of it that is rarely seen.

**B. Neue Haas Grotesk Display + Neue Haas Grotesk Text**
License: Adobe Fonts (bundled with an existing CC subscription, effectively ₹0 marginal) or Monotype web license ~US$50+/style/year otherwise. Rationale: the canonical grotesque; unimpeachable at extreme sizes and the safest possible answer to "does this look expensive." Risk: it is the *safe* answer — the site risks reading Swiss-tasteful rather than Talon-specific, and it drifts from the logo's wider, squarer letterforms.

**C. PP Neue Montreal (display) + PP Neue Montreal (body)**
License: Pangram Pangram, roughly US$40 per style desktop+web at indie tier; two weights needed ≈ US$80. Rationale: the contemporary studio-scene grotesque — tight apertures, confident at display sizes, instantly signals design literacy to the artist audience. Risk: real money for a bootstrap build, per-style licensing tempts weight-starvation later, and its popularity among exactly this genre of site erodes distinctiveness by the month.

**Recommendation: A.** It is the only pairing that is simultaneously free, variable (one file, one request, no layout-shift cascade), and *derivable from the logo* — which means every type decision traces to the mark, and §2.2's client sentence stays true. B is the fallback if the client reacts against Archivo in review.

### 5.2 The scale — exactly five sizes plus metadata

All values use `clamp(min, preferred, max)`; the preferred term is viewport-driven. Weights and tracking are for Archivo.

| Token | clamp() | Line height | Letter spacing | Weight / width | Used by |
|---|---|---|---|---|---|
| `--type-display` | `clamp(3.25rem, 11vw, 10rem)` | 0.92 | -0.02em | 800 / 125% wdth, caps | Page titles (one per page), hero wordmark scale, footer lockup, next-project link |
| `--type-headline` | `clamp(1.75rem, 4.5vw, 3.25rem)` | 1.05 | -0.01em | 700 / 110% wdth | Section headings, project titles in index rows, studio rate-card section heads |
| `--type-subhead` | `clamp(1.25rem, 2.2vw, 1.625rem)` | 1.25 | 0 | 500 / 100% | Series titles, statement paragraphs on Home, credit-block role groupings |
| `--type-body` | `clamp(1rem, 1.1vw, 1.125rem)` | 1.55 | 0 | 400 / 100% | All reading copy, spec tables, project descriptions, rate card rows |
| `--type-small` | `clamp(0.8125rem, 0.9vw, 0.875rem)` | 1.45 | 0.01em | 400 / 100% | Captions, footnotes, copyright, form-free legal lines |
| `--type-meta` | `clamp(0.6875rem, 0.8vw, 0.75rem)` | 1.2 | **0.14em** | 600 / 100%, **uppercase** | Nav links, filters, years, counts, labels, buttons, eyebrows |

Display-to-body ratio at desktop max: 10rem / 1.125rem ≈ **8.9:1** — the extreme contrast the locked direction demands, and the same massive-over-tiny relationship the logo lockup itself uses. Five sizes is a hard ceiling: any Phase 2+ need must map onto an existing token, and the metadata style absorbs everything label-shaped, which is where sixth sizes usually breed.

### 5.3 Fallback stack

```css
font-family: "Archivo", "Archivo Fallback", Arial, "Helvetica Neue", sans-serif;
```
Phase 2 defines `"Archivo Fallback"` as an `@font-face` over local Arial with `size-adjust: 106%`, `ascent-override: 92%`, `descent-override: 22%` (tune with a font-metrics tool at build time) so the swap is dimensionally near-invisible. Load Archivo variable as a single self-hosted woff2 with `font-display: swap` and preload. Arial is chosen as the metric donor deliberately: it is the most metrically-compatible grotesque universally installed on the devices this site will actually be viewed on in India.

---

## 6. Grid, spacing, and layout doctrine

### 6.1 Grid

- **Columns:** 12, at every breakpoint ≥ 768px; 4 columns below 768px.
- **Gutter:** 24px desktop, 16px below 768px.
- **Max content width:** 1600px, centered; full-bleed elements ignore it by definition.
- **Outer margin:** 48px ≥1120px, 32px ≥768px, 20px below.
- **Breakpoints:** 480 / 768 / 1120 / 1440. Four, no more; a fifth breakpoint is a design decision that failed.

### 6.2 Spacing scale

Eight named values, nothing between them, no arithmetic improvisation:

```
--space-1: 4px    --space-2: 8px    --space-3: 16px   --space-4: 24px
--space-5: 40px   --space-6: 64px   --space-7: 104px  --space-8: 168px
```

The scale is deliberately non-linear (roughly ×1.6 steps at the top). Micro spacing (1–4) is for within-component gaps; macro (5–8) is for between-block and section rhythm. If a layout needs 80px, it actually needs 64 or 104 — pick one.

### 6.3 Section padding by role — not uniform, by rule

Every section on the site is one of three roles, and role sets its vertical padding:

- **Statement sections** (hero, page title blocks, next-project, footer lockup): `--space-8` top and bottom. These are the site breathing.
- **Working sections** (indexes, galleries, spec tables, rate card): `--space-6` top and bottom. Dense, business-like, closer to their neighbors.
- **Interstitial sections** (statement paragraph on Home, series intros, WhatsApp CTA band): `--space-7` top, `--space-5` bottom — asymmetric on purpose, pulling the following section up toward them.

A page therefore has an audible rhythm: long pause, work work work, medium pause, work. Uniform padding is banned; if two adjacent sections share a role, a hairline rule separates them instead of extra air.

### 6.4 Asymmetry doctrine

1. **The 7/5 law.** Split layouts divide at 7/12 and 5/12 (or 8/4), never 6/6. Perfect halves are template DNA.
2. **The left edge is sacred, the right edge drifts.** Text blocks anchor to the left grid edge; media may overhang, offset, or bleed right. The eye gets one dependable rail and one restless one — the same tension as the logo's square letters against its diagonal wedge.
3. **Full bleed is earned by singularity.** A block runs full bleed only when it is the *only* media element in its section (hero video, studio lead image, project detail player). The moment a section holds two or more media items, everything in it sits inside the grid, offset-narrow: starting no earlier than column 2 and ending no later than column 11, with the start column varying between sections.
4. **Stagger indexes, don't tile them.** Any grid of 3+ items offsets alternate items vertically by `--space-5` and varies item column-spans in a repeating asymmetric pattern (e.g. 5-4-3 / 4-5-3 spans). Symmetrical three-column card grids are banned by the aesthetic guardrails and by this rule twice over.
5. **One diagonal per page** (from §2.2), Home hero only, angle locked at –13°.

### 6.5 Three example layouts in grid terms

- **Home hero (desktop ≥1120):** full-bleed video block, height 82vh, bottom edge clipped at –13°; the TALON display type overlays, anchored columns 1–9 baseline-bottom; the meta line ("PRODUCTION HOUSE / BENGALURU") sits columns 10–12, top-aligned to the display cap height. Below the clip, statement paragraph occupies columns 7–12 (interstitial role), columns 1–6 empty — the emptiness is the layout.
- **Video index row (desktop):** item A thumbnail spans columns 1–7, title + meta columns 8–12 top-aligned; next item B thumbnail spans columns 6–12 offset down `--space-5`, title + meta columns 1–5 bottom-aligned. Alternating, with a hairline rule spanning columns 1–12 between pairs.
- **Studio rate card (desktop):** section head (`--type-headline`) columns 1–4, sticky within section; rate rows columns 5–12, each row a `--surface` block: item name columns 5–9, price right-aligned columns 10–12, hairline between rows, WhatsApp CTA full-width of columns 5–12 at the end.

---

## 7. Motion doctrine

Three primitives. Every animated element on the site uses one of them; a fourth animation is a bug.

**P1 — Rise.** *Trigger:* element enters viewport (IntersectionObserver, threshold 0.2), first entry only. *Motion:* translateY(24px → 0) + opacity(0 → 1). *Duration:* **640ms**. *Easing:* `cubic-bezier(0.16, 1, 0.3, 1)` (hard launch, long settle). *Applies to:* section headings, index items, gallery images, rate rows, footer lockup. *Reduced motion:* opacity 0 → 1 at 180ms linear, no translation.

**P2 — Shift.** *Trigger:* hover and focus-visible. *Motion:* the element's underline draws left-to-right (links, scaleX 0 → 1, transform-origin left); project-card thumbnails ease from 92% to 100% image saturation with a 1.015 scale; buttons invert fill and text color. *Duration:* **240ms**. *Easing:* `cubic-bezier(0.4, 0, 0.2, 1)`. *Applies to:* every link, project card, and button — this is the site's entire hover vocabulary. *Reduced motion:* saturation and color changes apply instantly (0ms); the scale component is dropped entirely.

**P3 — Veil.** *Trigger:* state changes — theme toggle, lightbox open/close, mobile menu open/close. *Motion:* opacity crossfade through the scrim/background. *Duration:* **320ms**. *Easing:* `ease-out`. *Applies to:* the root theme transition (background-color and color only — never animate layout properties on theme switch), lightbox scrim + image, menu overlay. *Reduced motion:* instant cut (0ms) for theme and menu; lightbox retains a 120ms opacity fade so the flash isn't jarring.

**Stagger.** Grouped P1 reveals stagger on the fixed irregular sequence **0ms, 70ms, 160ms, 220ms, 330ms**, repeating from 0 for the sixth item onward. The uneven intervals (70/90/60/110 gaps) are deliberate: perfectly even staggers read as a plugin; irregular ones read as editing.

**Interaction states, both themes.**
- *Links:* rest — `--text-primary`, no underline (nav/meta) or 1px underline (in-body); hover/focus — P2 underline draw; active/current — `--accent`, underline held at full width; focus-visible — additionally `--focus-ring` outline, 2px, offset 2px.
- *Project cards:* rest — image at 92% saturation (photography stays the color source, slightly held back), title `--text-primary`; hover/focus — P2 saturation to 100% + 1.015 scale, title unchanged (no color shifting on text inside cards); active (pressed) — scale returns to 1.0 instantly; focus-visible — ring on the whole card.
- *Buttons (WhatsApp CTA, filter chips, theme toggle):* rest — 1px `--rule` border, `--text-primary` label, transparent fill; hover/focus — fill `--text-primary`, label inverts to `--bg` (P2); active/selected — border and label `--accent` (filters), or fill `--accent` with `--bg` label for the WhatsApp pressed state; disabled — `--disabled-fg` on `--disabled-bg`, no hover response, `aria-disabled` set.

---

## 8. Wireframes

Delivered as `wireframes.html` alongside this document: low-fidelity greybox wireframes for all six templates — Home, Video index, Photography index, Studio, Contact, Project detail — at desktop (1200px frame) and mobile (375px frame). Greyboxes only: unstyled structural blocks, dashed outlines, monospace labels, and a character budget annotated directly on every text-bearing block (e.g. `PROJECT TITLE [18–48ch]`). No color, no type styling, no spacing polish — the file is a structural contract, not a draft design. Layout positions in the wireframes follow §6 (7/5 splits, staggered indexes, offset-narrow blocks) so Phase 2 inherits structure and doctrine from the same pair of files.

---

## Done-and-correct verification

- **All eight sections present and complete** — yes, §1–§8 above.
- **Every color pairing measured and AA-passing** — yes; twelve text pairings measured (§4.4), all ≥4.5:1 after the two documented corrections. Hairline/disabled tokens are non-text and intentionally sub-threshold, stated as such.
- **Type scale is exactly five sizes plus metadata style** — yes: display, headline, subhead, body, small, + meta (§5.2).
- **Exactly three motion primitives, each with reduced-motion fallback** — yes: Rise, Shift, Veil (§7).
- **Wireframes cover all six templates at mobile and desktop** — yes, twelve frames in `wireframes.html`.
- **Every typographic and structural choice traces to logo geometry, locked direction, or audience need** — yes: type pairing and scale contrast trace to the mark (§2.2 rule 3, §5.1-A); zero radius, one-diagonal, hairlines, and color scarcity trace to the mark (§2.2 rules 1, 2, 4); asymmetry doctrine and section-role padding trace to the locked direction (§6); index visibility, rate-card presence, and page voices trace to audience needs (§3, §1.3).
- **Specific enough for Phase 2 to begin without a follow-up question** — yes, with the open decisions listed to the client outside this document being the only true unknowns (asset inventory, real rates, WhatsApp number, typeface sign-off).
