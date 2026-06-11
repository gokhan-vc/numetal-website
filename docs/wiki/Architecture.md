# Architecture

numetal.xyz is an **Astro 6** app deployed as a **Cloudflare Worker** (the modern Workers-with-static-assets model, via `@astrojs/cloudflare`). Most of the site is prerendered and served from the edge; only the fee endpoints run on demand.

```
                          ┌────────────────────────────────────────┐
   request ──────────────▶│        Cloudflare Worker (numetal-site)│
                          │                                          │
   /  /terms  /privacy ──▶│  env.ASSETS  ──▶ prerendered HTML        │  + public/_headers
   /cookies  /og.png      │                  (static, CDN-cached)    │
                          │                                          │
   /fees                  │  env.ASSETS  ──▶ prerendered shell       │
   /fees.js (client)      │                  + external client JS    │
                          │                                          │
   /fees/data  ──────────▶│  SSR endpoint ──▶ getData()  ── Base RPC │  + src/middleware.ts
   /fees/events ─────────▶│  SSR endpoint ──▶ getBurns() ── Alchemy  │    (security headers)
                          └────────────────────────────────────────┘
```

## Render modes

- **Prerendered (static):** `index`, `terms`, `privacy`, `cookies`, and the `fees` *shell* — `export const prerender = true`, `build.format: 'file'` so they serve at `/terms` (no trailing-slash redirect).
- **On-demand (SSR):** `fees/data.ts`, `fees/events.ts` — `export const prerender = false`. These run in the Worker on each request.

## The fee engine (`src/lib/fees.ts`)

- `getData()` — `eth_call` `balanceOf` for the burn / team / treasury addresses on public Base RPCs, plus total supply + decimals; DEX price from GeckoTerminal → DexScreener (cached via `caches.default`). No secret required.
- `getBurns(env)` — `alchemy_getAssetTransfers` (needs `env.BASE_RPC_URL`) to list ERC-20 transfers to `0x…dEaD`, classifies each as **buyback-burn** vs **manual-burn** by inspecting the tx receipt for WETH/swap logs. **Server-side hardening:** only canonical hex addresses (`^0x[0-9a-fA-F]{40}$`) and tx hashes (`{64}`) are returned, so the client table is XSS-safe.
- The `/fees` page is a static shell with `id="…"` placeholders; **[`public/fees.js`](https://github.com/gokhan-vc/numetal-website/blob/main/public/fees.js)** (external, same-origin → CSP `script-src 'self'`) polls the two endpoints and fills them in.

## Env access (Astro 6)

Astro v6 **removed `Astro.locals.runtime.env`.** Bindings/secrets are read via:

```ts
import { env } from 'cloudflare:workers';
// env.BASE_RPC_URL
```

## Security headers — two mechanisms

The Worker handles SSR routes; static assets are served directly (bypassing middleware), so headers come from **both**:

- **`src/middleware.ts`** → SSR routes (`/fees/*`): CSP, HSTS, CORS for the JSON endpoints.
- **`public/_headers`** → prerendered pages + static assets (Cloudflare Workers static-assets honors `_headers`).

Both emit the same policy. See **[Security & Compliance](Security-and-Compliance)**.
