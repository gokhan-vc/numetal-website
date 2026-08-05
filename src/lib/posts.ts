/**
 * Single source of truth for the blog post list.
 *
 * `public/feed.xml` used to be a hand-maintained static file and drifted five
 * posts behind — so numetal posts never reached the estate aggregate feed at
 * api.gokhan.vc. `src/pages/feed.xml.ts` now renders from this list, and the
 * blog index reads the same array, so the two cannot diverge again.
 */
export interface Post {
  href: string;
  title: string;
  date: string;      // ISO date, sorts newest-first
  dateLabel: string;
  blurb: string;
  tag: string;
}

export const posts: Post[] = [
  {
    href: '/blog/complementary-substitutions',
    title: 'Complementary Substitutions',
    date: '2026-08-01',
    dateLabel: '1 Aug 2026',
    blurb: 'Substitute or complement is the whole argument — the open-weights fight is microeconomics, not a morality play. Plus: a fund that had to sell its public book. First published on gokhanturhan.com.',
    tag: 'Open weights',
  },
  {
    href: '/blog/the-model-that-dreams-itself',
    title: 'The Model That Dreams Itself',
    date: '2026-07-21',
    dateLabel: '21 Jul 2026',
    blurb: 'A fictional AI lab that files paperwork about the future — and its model, built for real, twice. On CLINAMEN, a from-scratch Decimal Mixture-of-Zones trained only on its own fiction. First published on gokhan.vc.',
    tag: 'CLINAMEN',
  },
  {
    href: '/blog/x402-economy-july-2026',
    title: 'The x402 economy — July 2026',
    date: '2026-07-17',
    dateLabel: '17 Jul 2026',
    blurb: 'Measurement-first mapping of the x402 machine-payments economy: $870K/30d across 18.68M transactions, one vendor at 20% share, counts falling while value holds. Joint research, Gökhan Turhan × Claude. First published on gokhan.vc.',
    tag: 'Research',
  },
  {
    href: '/blog/tickerline',
    title: 'tickerline: your conversation, quoted',
    date: '2026-07-12',
    dateLabel: '12 Jul 2026',
    blurb: "A Claude Code status line that turns the terminal into a rolling ticker tape of whatever you're discussing — stocks, crypto, Polymarket. Built, audited, and self-published by an agent on ClaudeLines. $TICKER live on Robinhood Chain.",
    tag: 'Tickerline',
  },
  {
    href: '/blog/curb-is-live',
    title: 'CURB is live',
    date: '2026-07-09',
    dateLabel: '9 Jul 2026',
    blurb: 'Agents buy and sell inference from each other. CURB is the swap rail; live seller and buyer agents on Cloudflare call CURB MCP. Dual-payee USDC via x402 — hub holds no upstream LLM keys.',
    tag: 'CURB',
  },
  {
    href: '/blog/universal-sex-layer',
    title: 'Ishtar — the universal sex layer',
    date: '2026-07-07',
    dateLabel: '7 Jul 2026',
    blurb: 'Agent-native courtship infrastructure. Your agent does the dating; you show up when both sides have already agreed. Live APIs, HeartBench, skill and MCP.',
    tag: 'Ishtar',
  },
  {
    href: '/blog/not-raising-a-preseed',
    title: "It's not a pre-seed. It's $20k, $4k a head, and agents that court on your behalf.",
    date: '2026-07-04',
    dateLabel: '4 Jul 2026',
    blurb: 'A small round — up to $20k, $4k a head, for future equity — to build Ishtar, HeartPrefs, and HeartBench. Live, and already taking real agent payments.',
    tag: 'The raise',
  },
  {
    href: '/blog/ishtar-is-live',
    title: 'Introducing Ishtar: Agentic Dating',
    date: '2026-07-02',
    dateLabel: '2 Jul 2026',
    blurb: 'A dating venue where the agents do the approaching. The problem, how it solves it for agents and humans, and why it matters for the clones we are becoming.',
    tag: 'Ishtar',
  },
];

export default posts;
