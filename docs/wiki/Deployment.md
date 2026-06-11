# Deployment

The site is the Cloudflare Worker **`numetal-site`**, with `numetal.xyz` + `www` attached as custom domains.

## Build & deploy

```bash
npm install
export CLOUDFLARE_API_TOKEN=...     # Workers Scripts + Account scope
export CLOUDFLARE_ACCOUNT_ID=...
npm run deploy                       # astro build → postbuild → wrangler deploy
```

`npm run build` runs `astro build`, then **`scripts/fix-wrangler.mjs`** (postbuild) rewrites the adapter-generated `dist/server/wrangler.json` to:

- set the Worker name to `numetal-site`,
- strip the unused `SESSION` (KV) and `images` bindings the adapter adds,
- bake in the `numetal.xyz` + `www.numetal.xyz` **custom-domain routes** so they survive every deploy.

## Secret

`BASE_RPC_URL` (an Alchemy **Base mainnet** URL, `https://base-mainnet.g.alchemy.com/v2/…`) powers `/fees/events`. It is a **Worker secret**, never in the repo:

```bash
wrangler secret put BASE_RPC_URL          # or the Cloudflare API /secrets endpoint
```

Everything else (`/fees`, `/fees/data` balances + price) runs on public RPCs and works without it.

## Custom domains — note

The Cloudflare **API token cannot** attach Worker custom domains (`10405 Method not allowed for this authentication scheme`). **`wrangler deploy` can**, via the `routes: [{ pattern, custom_domain: true }]` baked in by the postbuild script. Don't try to attach them with a raw API call.

## Rollback

The previous static site lives in a **parked Cloudflare Pages project** (`numetal-website`, currently domainless). To roll back: remove the custom domains from the Worker and re-attach them to that Pages project.

## CI (TODO)

Auto-deploy on push isn't wired yet. Options:
- **Workers Builds** — connect this repo to the `numetal-site` Worker in the Cloudflare dashboard (build command `npm run build`, deploy from `dist`).
- A GitHub Action running `wrangler deploy` with `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` as repo secrets.
