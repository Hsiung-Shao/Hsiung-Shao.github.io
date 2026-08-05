# Project Structure

## Technology Stack

| Category | Technology |
|---|---|
| Framework | Astro 5 |
| Interactive UI | React 19 + TypeScript |
| Styling | Tailwind CSS 4 |
| Motion | Astro ClientRouter + native Web Animations API |
| 3D | Three.js + React Three Fiber |
| Content | JSON data + Markdown rendering with marked |
| Deployment | GitHub Pages + GitHub Actions |

## Directory Tree

```text
myweb/
|-- scripts/
|   |-- projects.config.json
|   |-- update-site.mjs
|   `-- validate-content.mjs
|-- src/
|   |-- components/
|   |   |-- react/
|   |   `-- three/
|   |-- data/
|   |   `-- guides/
|   |-- layouts/
|   |-- pages/
|   |   `-- blog/
|   `-- styles/
|-- public/
|-- astro.config.mjs
`-- package.json
```

## Module Descriptions

- `src/data/projects.json` - Portfolio metadata, development status, visibility, and article links.
- `src/data/posts.json` - Published and draft blog articles.
- `src/data/guides/` - Long-form public usage guides with verified screenshots and procedures.
- `src/pages/blog/` - Static blog index and article routes.
- `src/components/MotionSystem.astro` - Shared page transitions, scroll reveals, progress, parallax, tilt, and reduced-motion behavior.
- `src/components/SpatialScene.astro` - Persistent route-aware Three.js environment with project textures, spatial route artifacts, lifecycle cleanup, and reduced-motion fallback.
- `src/components/react/ProjectCard.tsx` - Interactive portfolio card with status and article actions.
- `scripts/projects.config.json` - Source repositories and per-project content policy.
- `scripts/update-site.mjs` - Generates a review digest from allowed Git histories.
- `scripts/validate-content.mjs` - Validates content schema and privacy invariants before builds.

## Content Boundaries

- Personal projects may use `contentPolicy: full` and produce detailed draft articles.
- Client projects must use `tier: protected` and `contentPolicy: technical-only`.
- Client case studies must stay de-identified and may only discuss reusable engineering decisions.
- Paused, archived, and manual projects use `contentPolicy: disabled` for automatic updates.

## Changelog

| Date | Changes |
|---|---|
| 2026-07-22 | Added project lifecycle states, technical case studies, blog links, content validation, and protected-client content rules. |
| 2026-08-01 | Added five public project guides, Awakened PoE Trade-zh-TW, and a sponsorship disclosure page. |
| 2026-08-05 | Reframed the site as an editorial engineering archive, redesigned all primary routes, added project and article indexes, and removed decorative 3D UI from active pages. |
| 2026-08-05 | Added the animated editorial experiment: page wipes, view transitions, scroll reveals, hero parallax, project interactions, and a Git activity timeline. |
| 2026-08-05 | Replaced the editorial presentation with a persistent route-aware Three.js spatial portfolio, real project textures, and a responsive system-console interface across every route. |
