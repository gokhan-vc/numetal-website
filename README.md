<div align="center">

# Numetal — numetal.xyz

**An agent accelerator studio under [Atelier Gökhan](https://gokhan.vc).**
We ship machines that ship themselves — autonomous agents across **onchain, compute, artistic & cultural markets, and frontier-lab model toolkits.** Chain-agnostic, home on **Base**.

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fnumetal.xyz&label=numetal.xyz)](https://numetal.xyz)
![Astro](https://img.shields.io/badge/Astro-6-BC52EE?logo=astro&logoColor=white)
![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-F38020?logo=cloudflare&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Base](https://img.shields.io/badge/Base-0052FF?logo=coinbase&logoColor=white)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

[Website](https://numetal.xyz) · [Fee engine](https://numetal.xyz/fees) · [Atelier Gökhan](https://gokhan.vc) · [X](https://x.com/goekhan) · [Telegram](https://t.me/goekhanturhan) · [Wiki](../../wiki)

</div>

---

This repository is the source for **numetal.xyz** — the studio's site. It's an [Astro](https://astro.build) app deployed as a **Cloudflare Worker** (static assets + on-demand endpoints), with a **live onchain fee engine** that reads the $NUMETAL buyback & burn stream straight from Base.

## What's here

- **Marketing landing** — the studio, the four markets, the chains (Base · Ethereum · Solana · Hyperliquid · XRP Ledger), and the $NUMETAL fee-distribution policy. Prerendered, static, CDN-fast.
- **Fee engine** (`/fees`) — a live dashboard of $NUMETAL burns, treasury, team, and price, read onchain on every request. Powered by two SSR endpoints:
  - `GET /fees/data` — burned / treasury / team balances + DEX price (public Base RPCs).
  - `GET /fees/events` — the buyback / manual-burn feed (Alchemy `alchemy_getAssetTransfers`).
- **Legal** — `/terms`, `/privacy`, `/cookies` (GDPR + ePrivacy + CCPA; no consent banner, because only strictly-necessary Cloudflare cookies are set).
- **Discoverability** — `robots.txt` (allow-list for legit AI + search crawlers, blocks abusive scrapers), `sitemap.xml`, `feed.xml`, `llms.txt`, JSON-LD, an OG card, and `/.well-known/security.txt`.

## Tech stack

| | |
|---|---|
| Framework | **Astro 6** (`output: 'server'`, `build.format: 'file'`) |
| Hosting | **Cloudflare Workers** (static assets + on-demand routes) via [`@astrojs/cloudflare`](https://docs.astro.build/en/guides/integrations-guide/cloudflare/) |
| Language | TypeScript |
| Chain data | Base public RPCs + Alchemy (`BASE_RPC_URL` secret); GeckoTerminal / DexScreener for price |
| Security | CSP (`script-src 'self'`), HSTS+preload, X-Frame-Options, Permissions-Policy, COOP/CORP — via `src/middleware.ts` (SSR) + `public/_headers` (static) |

## Project structure

```
src/
  layouts/Base.astro      # shared <head>, SEO meta, OG, JSON-LD
  middleware.ts           # security headers for SSR routes
  lib/fees.ts             # the fee-engine logic (RPC reads, burn feed)
  pages/
    index.astro           # landing (prerendered)
    terms|privacy|cookies.astro
    fees.astro            # /fees dashboard (prerendered shell)
    fees/data.ts          # GET /fees/data   (SSR)
    fees/events.ts        # GET /fees/events (SSR)
public/
  _headers, robots.txt, sitemap.xml, feed.xml, llms.txt
  og.png, fees.js, .well-known/security.txt
scripts/fix-wrangler.mjs  # postbuild: Worker name + custom domains + strip unused bindings
docs/wiki/                # wiki source (auto-synced to the GitHub Wiki)
```

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # -> dist/ (postbuild fixes the Worker config)
```

> The `/fees/events` feed needs `BASE_RPC_URL` (an Alchemy Base-mainnet URL). Locally it falls back gracefully; in production it's a Cloudflare Worker secret.

## Deployment

Deployed as the **`numetal-site`** Cloudflare Worker.

```bash
export CLOUDFLARE_API_TOKEN=...    # Workers + Account scope
export CLOUDFLARE_ACCOUNT_ID=...
npm run deploy                      # = astro build + postbuild + wrangler deploy
```

- **Secret:** `BASE_RPC_URL` is set on the Worker (`wrangler secret put BASE_RPC_URL`), not in this repo.
- **Custom domains:** `numetal.xyz` + `www` are attached via the `routes` in the generated Wrangler config (baked in by `scripts/fix-wrangler.mjs`).
- Headers, CSP, HSTS-preload, robots, sitemap and the OG card all ship from this repo.

## Security & compliance

- **No secrets in the repo** (verified across the full history). Onchain addresses are public.
- Strict **CSP** with no inline scripts (the `/fees` client runs from `public/fees.js`).
- **HSTS** `max-age=1y; includeSubDomains; preload`. **DMARC** `p=reject`. **SSL** Full (strict).
- GDPR / ePrivacy / CCPA covered; cookie policy at [`/cookies`](https://numetal.xyz/cookies). Report issues via [`security.txt`](https://numetal.xyz/.well-known/security.txt) → `contact@numetal.xyz`.

## Docs

Long-form docs live in the **[Wiki](../../wiki)** (architecture, deployment, security, development). The wiki is kept in sync from [`docs/wiki/`](docs/wiki/) on every push — edit the markdown there, the wiki updates itself.

## License

The **code** in this repository is [MIT licensed](LICENSE) — use it freely.

The **Numetal** name, logos, brand, site copy, and visual assets (including `og.png`) are © Atelier Gökhan and are **not** licensed for reuse. Build with the code; build your own brand.

---

<div align="center">

Built by **[Gökhan Turhan](https://gokhanturhan.com)** · an [Atelier Gökhan](https://gokhan.vc) studio · on [Base](https://base.org)

</div>

## Credits

The `/fees` dashboard is presented as a live machine report — a dense, boxed, monospace readout (dot-leader rows and `[████  ]` bar gauges) in Numetal's colors. The report format is inspired by and credits the open-source [usgraphics/usgc-machine-report](https://github.com/usgraphics/usgc-machine-report) (TR-100). Numetal's implementation, colors, live data, and copy are its own.
