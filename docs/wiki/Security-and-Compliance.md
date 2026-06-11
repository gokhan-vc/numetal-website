# Security & Compliance

## Response headers

Emitted on every response (SSR via `src/middleware.ts`, static via `public/_headers`):

| Header | Value |
|---|---|
| `Content-Security-Policy` | `default-src 'self'; … style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; frame-ancestors 'none'; object-src 'none'; base-uri 'none'; upgrade-insecure-requests` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` |
| `X-Frame-Options` | `DENY` |
| `X-Content-Type-Options` | `nosniff` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | camera/mic/geo/payment/usb… all `()` |
| `Cross-Origin-Opener-Policy` / `-Resource-Policy` | `same-origin` (JSON endpoints: CORS `*` + CORP `cross-origin`) |

**No inline scripts** — the `/fees` client runs from `public/fees.js`, so the CSP stays `script-src 'self'` with no hashes or `unsafe-inline`. Burn-feed data is hex-validated server-side, so the client table can't be injected.

## Zone (Cloudflare)

- SSL **Full (strict)**, min TLS 1.2 + TLS 1.3, Always-Use-HTTPS, Auto-HTTPS-Rewrites, HTTP/3.
- **DMARC** `p=reject; sp=reject` + aggregate reporting; **DKIM** ✓; SPF `~all` (required for Email Routing — do **not** harden to `-all`).
- WAF OWASP managed ruleset on. "Block AI bots" / "Instruct AI via robots.txt" toggles **OFF** so our own `robots.txt` is authoritative.

## AI-crawler & SEO policy (`public/robots.txt`)

Explicitly **allows** legit AI + search crawlers — GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-User, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended, Googlebot, Bingbot, DuckDuckBot — and **disallows** abusive scrapers (Bytespider, CCBot, etc.). JSON endpoints are kept out of indexes. Plus `sitemap.xml`, `feed.xml`, `llms.txt`, JSON-LD, and `Accept: text/markdown` support (Cloudflare "Markdown for Agents") for clean agent reads.

## Privacy / GDPR / cookies

- **No analytics, no tracking, no marketing cookies.** Only strictly-necessary Cloudflare security cookies (`__cf_bm`, `cf_clearance`), which are **exempt from consent** under ePrivacy Art 5(3) → **no banner**, just a [Cookie Policy](https://numetal.xyz/cookies).
- `/privacy` covers lawful basis (Art 6(1)(f)), data-subject rights (Arts 15–22 + Art 77), CCPA "no sell/share/profile", under-16.
- `/terms` covers acceptable use, sanctions, no-UGC/no-uploads + abuse-takedown, general/global governing law.
- **When PostHog is added** the posture flips: analytics needs opt-in consent → add a banner, update `/cookies`, and loosen the CSP (preferably by reverse-proxying PostHog through the origin to keep `'self'`).

## Reporting

`/.well-known/security.txt` (RFC 9116) → `contact@numetal.xyz`.
