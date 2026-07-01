<div align="center">

# ⬛ Numetal

**Agent accelerator studio — the site + the on-chain fee report for [numetal.xyz](https://numetal.xyz).**

[![numetal.xyz](https://img.shields.io/website?url=https%3A%2F%2Fnumetal.xyz&up_message=live&down_message=down&label=numetal.xyz&style=flat-square)](https://numetal.xyz)
[![Built with Astro](https://img.shields.io/badge/built%20with-Astro-BC52EE?logo=astro&logoColor=white&style=flat-square)](https://astro.build)
[![Cloudflare Workers](https://img.shields.io/badge/runs%20on-Cloudflare%20Workers-F38020?logo=cloudflare&logoColor=white&style=flat-square)](https://workers.cloudflare.com)
[![Base](https://img.shields.io/badge/chain-Base-0052FF?logo=coinbase&logoColor=white&style=flat-square)](https://base.org)
[![License: MIT](https://img.shields.io/github/license/gokhan-vc/numetal-website?style=flat-square)](LICENSE)
[![Last commit](https://img.shields.io/github/last-commit/gokhan-vc/numetal-website?style=flat-square)](https://github.com/gokhan-vc/numetal-website/commits/main)
[![Stars](https://img.shields.io/github/stars/gokhan-vc/numetal-website?style=social)](https://github.com/gokhan-vc/numetal-website/stargazers)

[**Open the site →**](https://numetal.xyz) · [Fee report](https://numetal.xyz/fees) · [X](https://x.com/numetalxyz) · [Telegram](https://t.me/numetalxyz) · [Discord](https://discord.gg/MC4DYumPMz)

</div>

---

## What is this?

`numetal-website` is the source for **[numetal.xyz](https://numetal.xyz)** — the public site for **Numetal**, an agent accelerator studio under **Atelier Gökhan**. It ships as a single **Cloudflare Worker**: a fast, content-first **Astro** site plus a small set of SSR endpoints under `/fees` that read the **$NUMETAL** protocol's activity on **Base** and render it as a dense, monospace **machine report**.

> This repo is the website and its on-chain read layer — not the studio's private source of truth. Runtime secrets and infrastructure live outside git.

## ✨ Highlights

- **Zero-JS-by-default Astro** — content-first and fast, served under a tight `script-src 'self'` CSP.
- **Live on-chain fee report** (`/fees`) — reads Base directly over JSON-RPC (public RPCs, with a metered key only for burn logs) and renders it as a TR‑100-style teletext readout. No wallet, no tracking.
- **One-Worker deploy** — static assets *and* SSR from the same `@astrojs/cloudflare` Worker.
- **Hardened by default** — SSR + static security headers, tight CSP, secret-scanning, and a `SECURITY.md` disclosure policy.

## $NUMETAL

$NUMETAL is the studio's **utility token** on Base — a usage/entry stake for its agents, **not an investment**. The `/fees` page is a transparency surface: a neutral, verifiable read of on-chain fees and the buy‑back/burn flow straight from chain state. It is **not** a statement about price.

- Token (Base) — [`0x57EDb7FC54ADa9Ef4E113DC05A168449e63cFbA3`](https://basescan.org/token/0x57EDb7FC54ADa9Ef4E113DC05A168449e63cFbA3)
- Market — [DexScreener](https://dexscreener.com/base/0xf0ba727d596861455b31d6e444ed3ee41c77709a27f7d787ccf609f6c34dbbd8)

## 🛠 Stack

| Layer | Tech |
|---|---|
| Framework | [Astro 6](https://astro.build) |
| Runtime | [Cloudflare Workers](https://workers.cloudflare.com) via [`@astrojs/cloudflare`](https://github.com/withastro/astro/tree/main/packages/integrations/cloudflare) |
| Chain reads | Base mainnet over JSON‑RPC (public RPCs + a metered Alchemy key for logs) |
| Language | TypeScript |

## 🚀 Develop & deploy

```bash
npm install
npm run dev        # local dev server
npm run build      # build + postbuild (Worker config + custom domains)
npm run deploy     # needs CLOUDFLARE_API_TOKEN + CLOUDFLARE_ACCOUNT_ID
npm test           # test suite
```

The Worker needs one secret — `BASE_RPC_URL` (Alchemy Base mainnet) — for the burn-log endpoint; the rest reads public RPCs.

## 🔒 Security

Security headers are set in `src/middleware.ts` (SSR) and `public/_headers` (static), under a `script-src 'self'` CSP. Please report vulnerabilities per [`SECURITY.md`](SECURITY.md) rather than opening a public issue.

## 🙏 Credits & third-party

Standing on open source — thank you:

- **[Astro](https://astro.build)** (MIT) and **[`@astrojs/cloudflare`](https://github.com/withastro/astro)** (MIT) — the framework and Worker adapter.
- **[Cloudflare Workers](https://workers.cloudflare.com)** — the runtime.
- The `/fees` machine-report **format** is inspired by **[usgraphics/usgc-machine-report](https://github.com/usgraphics/usgc-machine-report)** (TR‑100), used under the **BSD 3‑Clause License** and independently re-implemented. Full text + attribution in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md). *(Per the license, the U.S. Graphics name is not used to endorse or promote Numetal.)*

## License

[MIT](LICENSE) © 2026 Gökhan Turhan (Atelier Gökhan).

---

<div align="center"><sub>Nothing here is financial advice. $NUMETAL is a utility token, not an investment.</sub></div>
