# Development

## Setup

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # production build -> dist/
npm run preview    # preview the build locally
```

Node 20+ recommended. The Cloudflare adapter runs `/fees/*` through a local Workers runtime in `dev`.

## Layout

| Path | What |
|---|---|
| `src/layouts/Base.astro` | the `<head>` — title/description/canonical, OG + Twitter, optional `ogImage` + JSON-LD, `<slot/>` |
| `src/pages/*.astro` | pages; pass props to `Base`. Static pages set `export const prerender = true` |
| `src/pages/fees/*.ts` | SSR endpoints; `export const prerender = false` |
| `src/lib/fees.ts` | onchain reads + the burn feed |
| `src/middleware.ts` | security headers for SSR routes |
| `public/*` | served verbatim — `_headers`, `robots.txt`, `sitemap.xml`, `feed.xml`, `llms.txt`, `og.png`, `fees.js`, `security.txt` |

## Adding a page

```astro
---
import Base from '../layouts/Base.astro';
export const prerender = true;
const title = 'Numetal — …';
---
<Base title={title} description="…" canonical="https://numetal.xyz/whatever">
  <!-- markup -->
</Base>
```

If a page needs client JS, **don't inline it** — Astro inlines small `<script>` as `<script type="module">`, which the CSP (`script-src 'self'`) blocks. Put it in `public/foo.js` and reference `<script src="/foo.js" defer is:inline></script>`.

## Editing the fee logic

`src/lib/fees.ts` holds the addresses (`$NUMETAL`, burn/team/treasury, the pair) and the read functions. Endpoints import `env` from `cloudflare:workers` and pass it to `getBurns(env)`. Keep server-side hex validation in place.

## SEO / discoverability files

`public/sitemap.xml`, `public/feed.xml`, `public/llms.txt`, the JSON-LD in `Base.astro`, and `public/og.png` (1200×630) all live in the repo — update them when content changes.

## Editing this wiki

This wiki is generated from `docs/wiki/*.md`. Edit those files and push to `main`; the **Sync Wiki** GitHub Action mirrors them to the GitHub Wiki. Use `[[Page-Name]]`-style links by filename (e.g. `[Architecture](Architecture)`).
