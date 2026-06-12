# numetal-website
Astro site for **numetal.xyz** — agent accelerator studio under Atelier Gökhan.
Deployed as a **Cloudflare Worker** (static assets + `/fees` SSR endpoints) via `@astrojs/cloudflare`.

- `npm install && npm run build` (postbuild fixes the Worker config + custom domains)
- `npm run deploy` — needs `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID`
- Secret `BASE_RPC_URL` (Alchemy Base mainnet) is set on the `numetal-site` Worker.
- Security headers: `src/middleware.ts` (SSR) + `public/_headers` (static). CSP = `script-src 'self'`.

## Credits

The `/fees` machine-report format is inspired by the open-source
[`usgraphics/usgc-machine-report`](https://github.com/usgraphics/usgc-machine-report)
(TR-100), used under the BSD 3-Clause License. Independently re-implemented; full
license + attribution in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).
