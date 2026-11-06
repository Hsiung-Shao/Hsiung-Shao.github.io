# Project Structure

## Technology Stack

| Category | Technology |
|---|---|
| Framework | Astro 5 |
| Pages | Astro components, no client framework islands |
| Styling | Hand-written design system in `src/styles/site.css`, no CSS framework |
| Motion | Astro ClientRouter + CSS hover transitions |
| Content | JSON data + Markdown rendering with marked |
| Deployment | GitHub Pages + GitHub Actions |

## Directory Tree

```text
myweb/
|-- .github/
|   `-- workflows/
|       |-- ci.yml
|       `-- deploy.yml
|-- scripts/
|   |-- lib/
|   |   |-- content-policy.mjs
|   |   `-- git-history.mjs
|   |-- projects.config.json
|   |-- update-site.mjs
|   `-- validate-content.mjs
|-- src/
|   |-- components/
|   |-- data/
|   |   `-- guides/
|   |-- layouts/
|   |-- pages/
|   |   `-- blog/
|   `-- styles/
|-- tests/
|-- public/
|-- CLAUDE.md
|-- astro.config.mjs
|-- package.json
`-- vitest.config.ts
```

## Module Descriptions

- `src/data/projects.json` - Portfolio metadata, development status, visibility, and article links.
- `src/data/posts.json` - Published and draft blog articles.
- `src/data/guides/` - Long-form public usage guides with verified screenshots and procedures.
- `src/pages/blog/` - Static blog index and article routes.
- `src/components/Analytics.astro` - Site-wide GA4 page views and delegated support-link conversion events.
- `src/data/products.json` + `src/data/products.ts` - Content, stat sources, and screenshots for the five `/projects/<slug>` pages.
- `src/components/ProductPage.astro` - Renders a product page from its section types (feature, cards, table, steps, bullets, songs).
- `src/components/Home.astro` - Home page: latest release card, PoE tools, other projects, recent activity and posts.
- `src/pages/downloads.astro` - Download counts with daily-gain charts built at build time and a native series toggle.
- `scripts/lib/products.mjs` - Validates product data before builds.
- `scripts/lib/release-notes.mjs` - Splits GitHub release notes into fix / add / change sections.
- `scripts/lib/download-chart.mjs` - Lays out daily-gain bars in day units, merging gaps left by skipped schedule runs.
- `scripts/projects.config.json` - Source repositories and per-project content policy. Protected entries carry de-identified aliases only.
- `scripts/update-site.mjs` - Generates a review digest from allowed Git histories.
- `scripts/lib/git-history.mjs` - Selects bounded Git log ranges and recovers from rewritten history baselines.
- `scripts/lib/content-policy.mjs` - Shared privacy guardrail: loads protected terms from a CI secret or a gitignored local file, then scans `src/` and `public/` for leaks. Used by both the build validator and the test suite.
- `scripts/validate-content.mjs` - Validates content schema and privacy invariants before builds.
- `tests/` - Vitest suite covering the privacy guardrail, data-layer invariants, Git log range selection, product data validation, release-note splitting, and chart layout.
- `CLAUDE.md` - Working rules for agents: the privacy invariant, the Git log sync handoff, commands, and known pitfalls.
- `.github/workflows/ci.yml` - Pull-request gate: validate, test, build, plus an advisory type check.
- `.github/workflows/deploy.yml` - Builds and deploys to GitHub Pages on pushes to `main`; requires protected terms to be present.

## Content Boundaries

- Personal projects may use `contentPolicy: full` and produce detailed draft articles.
- Client projects must use `tier: protected` and `contentPolicy: technical-only`.
- Client case studies must stay de-identified and may only discuss reusable engineering decisions.
- Paused, archived, and manual projects use `contentPolicy: disabled` for automatic updates.

## Changelog

| Date | Changes |
|---|---|
| 2026-11-06 | Redesign phase 2: blog index and article, projects, activity, now, about, resume, support and contact rebuilt on the same design system; navbar collapses the five product pages into a dropdown; Tailwind, `global.css` and the unused contact form removed; article reading time added. |
| 2026-11-06 | Redesign phase 1 from the Claude Design dark "A" direction: new home, five `/projects/<slug>` product pages (adding MultiStream Hub and Kumori Music), `/downloads` with per-series toggles, redirects from `/poe/*` and `/concepts/*`, and removal of Three.js, React, the concept pages, and the cinematic home. |
| 2026-10-02 | Logged a month of cross-project activity (headless engine rewrite, browser fallback path, extension data-source recovery), drafted three engineering retrospectives, and completed the directory and module inventory. |
| 2026-09-18 | Documented the full Git Log synchronization handoff, including baselines, deduplication, content rules, privacy boundaries, and verification. |
| 2026-09-08 | Made Git activity sync recover safely from rewritten history and refreshed recent project activity. |
| 2026-08-29 | Reactivated AI Music as Kumori Music, documented the first release, and synchronized representative Git activity across maintained projects. |
| 2026-08-27 | Added site-wide GA4 page tracking and distinct click events for all three support methods. |
| 2026-07-22 | Added project lifecycle states, technical case studies, blog links, content validation, and protected-client content rules. |
| 2026-08-01 | Added five public project guides, Awakened PoE Trade-zh-TW, and a sponsorship disclosure page. |
| 2026-08-05 | Reframed the site as an editorial engineering archive, redesigned all primary routes, added project and article indexes, and removed decorative 3D UI from active pages. |
| 2026-08-05 | Added the animated editorial experiment: page wipes, view transitions, scroll reveals, hero parallax, project interactions, and a Git activity timeline. |
| 2026-08-05 | Replaced the editorial presentation with a persistent route-aware Three.js spatial portfolio, real project textures, and a responsive system-console interface across every route. |
| 2026-08-05 | Replaced the perspective data tunnel with a generated signal terrain, moving survey bands, and pulsing field markers. |
| 2026-08-05 | Reworked the spatial portfolio into a solid-form gallery with matte 3D volumes, restrained editorial surfaces, and minimal line-based decoration. |
| 2026-08-05 | Added three isolated homepage concepts for selection: Swiss editorial motion, cinematic WebGL archive, and product-oriented Bento modules. |
| 2026-08-05 | Selected the Cinematic Archive concept as the production homepage while retaining all three comparison routes. |
| 2026-08-05 | Extended the Cinematic Archive system across every public route with unified navigation, route-aware Three.js compositions, editorial content layouts, and a responsive coral footer. |
