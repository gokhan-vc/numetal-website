# Security Policy

## Reporting a vulnerability

If you believe you have found a security vulnerability in the Numetal website
(`numetal.xyz`) or this repository, please report it privately.

- **Preferred:** open a [private security advisory](https://github.com/gokhan-vc/numetal-website/security/advisories/new).
- **Email:** contact@numetal.xyz

Please include enough detail to reproduce (URL, request, expected vs actual
behavior) and, where relevant, a proof of concept. Do not open a public issue
for security reports.

We aim to acknowledge reports within 72 hours.

## Scope

In scope:

- The static site and on-demand routes served from this repository
  (`/fees`, `/fees/data`, `/fees/events`, `/airdrops`, and static pages).
- Build, deployment, and CI configuration in this repository.

Out of scope:

- The `$NUMETAL` token contract and on-chain protocol (a separate repository).
- Third-party services the site reads from (Alchemy, GeckoTerminal,
  DexScreener, Cloudflare) — report those to the respective vendor.
- The published airdrop allocation data (`recipients.csv`, `airdrop.json`):
  these are intentionally public, derived from a public on-chain snapshot.

## Handling secrets

This repository contains **no secrets**. The only runtime secret,
`BASE_RPC_URL` (an Alchemy Base-mainnet endpoint), is stored as a Cloudflare
Worker secret and is never committed. Secret scanning and push protection are
enabled on this repository — do not attempt to commit credentials.
