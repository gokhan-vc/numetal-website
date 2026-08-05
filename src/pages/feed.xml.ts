/**
 * numetal.xyz/feed.xml — rendered from src/lib/posts.ts, the same array the
 * blog index renders.
 *
 * This replaces a hand-maintained `public/feed.xml`, which had drifted five
 * posts behind (last entry: tickerline, 2026-07-12). Because feedhub's poller
 * builds the estate aggregate feed at api.gokhan.vc from each site's own feed,
 * a stale feed here meant numetal posts never reached the unified feed or the
 * "Latest" line on any /newsletter page.
 *
 * An Astro endpoint shadows a same-named public/ asset at build time, so the
 * static file must stay deleted — not just be left unused.
 */
import type { APIRoute } from 'astro';
import { posts } from '../lib/posts';

const SITE = 'https://numetal.xyz';
const TITLE = 'Numetal Labs';
const DESCRIPTION =
  'Notes and posts from Numetal Labs, an agent accelerator studio under Gökhan Ventures.';

const esc = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

export const GET: APIRoute = () => {
  const items = [...posts]
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
    .map((p) => {
      const url = `${SITE}${p.href}`;
      // Noon UTC keeps the date stable across timezones in reader UIs.
      const pub = new Date(`${p.date}T12:00:00Z`).toUTCString();
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${esc(url)}</link>
      <guid isPermaLink="true">${esc(url)}</guid>
      <pubDate>${pub}</pubDate>
      <description>${esc(p.blurb)}</description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(TITLE)}</title>
    <link>${SITE}</link>
    <description>${esc(DESCRIPTION)}</description>
    <language>en-us</language>
    <atom:link href="${SITE}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
      'cache-control': 'public, max-age=600',
    },
  });
};
