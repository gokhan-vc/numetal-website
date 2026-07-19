# Numetal Wiki

The engineering & ops handbook for **[numetal.xyz](https://numetal.xyz)** — the site of **Numetal**, an agent accelerator studio under [Gökhan Ventures](https://gokhan.vc).

> This wiki is **generated from [`docs/wiki/`](https://github.com/gokhan-vc/numetal-website/tree/main/docs/wiki) in the repo** and synced automatically on every push. Edit the markdown there — not the wiki UI — and it updates itself.

## Pages

- **[Architecture](Architecture)** — Astro + Cloudflare Worker, prerender vs SSR, the fee engine.
- **[Deployment](Deployment)** — build, deploy, secrets, custom domains, rollback.
- **[Security & Compliance](Security-and-Compliance)** — headers, CSP, HSTS, DMARC, GDPR/cookies, AI-crawler policy.
- **[Development](Development)** — local dev, project layout, adding pages, editing the fee logic.

## TL;DR

Numetal is a studio that **builds and backs autonomous agents** across four markets — **onchain, compute, artistic & cultural, and frontier-lab model toolkits** — chain-agnostic, with **Base** as home. The token is **$NUMETAL** (Base). This site is the studio's front door plus a **live onchain fee dashboard** (buybacks & burns) at [`/fees`](https://numetal.xyz/fees).

| | |
|---|---|
| Live site | https://numetal.xyz |
| Stack | Astro 6 · Cloudflare Workers · TypeScript |
| Worker | `numetal-site` |
| Token | $NUMETAL — `0x57EDb7FC54ADa9Ef4E113DC05A168449e63cFbA3` (Base) |
| Contact | `contact@numetal.xyz` |
