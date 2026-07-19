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
