# numetal-website
Astro site for **numetal.xyz** — agent accelerator studio under Atelier Gökhan.
Deployed as a **Cloudflare Worker** (static assets + `/fees` SSR endpoints) via `@astrojs/cloudflare`.

- `npm install && npm run build` (postbuild fixes the Worker config + custom domains)
- `npm run deploy` — needs `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`
- Secret `BASE_RPC_URL` (Alchemy Base mainnet) is set on the `numetal-site` Worker.
- Security headers: `src/middleware.ts` (SSR) + `public/_headers` (static). CSP = `script-src 'self'`.
