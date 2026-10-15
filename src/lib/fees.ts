// Numetal fee engine — ported from the Cloudflare Worker.
// Reads public Base-chain data: $NUMETAL burns/treasury/team balances + DEX price,
// and the buyback/manual-burn feed via Alchemy alchemy_getAssetTransfers.
// env.BASE_RPC_URL (Alchemy) is required only for getBurns; getData uses public RPCs.

const RPCS = [
  'https://mainnet.base.org',
  'https://base.llamarpc.com',
  'https://base-rpc.publicnode.com',
];
const NUM = '0x57EDb7FC54ADa9Ef4E113DC05A168449e63cFbA3';
const BURN = '0x000000000000000000000000000000000000dEaD';
const TEAM = '0xB13Fb67859bC818a7b9Eb7f1380274492B6D648F';
const TREZ = '0x3D9bB085b7E2fd15827d174f20375be385c121c0';
const PAIR = '0xf0ba727d596861455b31d6e444ed3ee41c77709a27f7d787ccf609f6c34dbbd8';
const ZERO = '0x0000000000000000000000000000000000000000';
// $NUMETAL is burned to dEaD, to the zero address, AND to the token contract itself.
const BURN_DESTS = [BURN, NUM, ZERO];
const BURN_LABELS: Record<string, string> = {
  '0x8f49d4d782488e8576c8c54288027c57f4acf521': 'bankr wallet',
  '0xb13fb67859bc818a7b9eb7f1380274492b6d648f': 'team',
  '0x3d9bb085b7e2fd15827d174f20375be385c121c0': 'treasury',
  '0x15813fbeac0ac58fa087c459639f8dc64a9b93c3': 'agentbountydev.eth',
};
const pad = (a: string) => a.slice(2).toLowerCase().padStart(64, '0');
const cacheStore = (): any => (globalThis as any).caches?.default;

export function sumHexBalances(values: readonly (string | null)[]): string | null {
  if (values.some((value) => value == null)) return null;
  return values.reduce((total, value) => total + BigInt(value as string), 0n).toString();
}

async function ethCall(data: string): Promise<string | null> {
  for (const rpc of RPCS) {
    try {
      const r = await fetch(rpc, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_call', params: [{ to: NUM, data }, 'latest'] }),
      });
      const j: any = await r.json();
      if (j && j.result && j.result !== '0x') return j.result;
    } catch {}
  }
  return null;
}

async function getDex(): Promise<any> {
  const cache = cacheStore();
  const key = new Request('https://numetal.xyz/__dexcache');
  const lastKey = new Request('https://numetal.xyz/__dexlastgood');
  if (cache) {
    const hit = await cache.match(key);
    if (hit) { try { return await hit.json(); } catch {} }
  }
  let out: any = { price: null, fdv: null, vol24: null, mcap: null, liq: null, src: null, dexErr: null };
  try {
    const r = await fetch('https://api.geckoterminal.com/api/v2/networks/base/tokens/' + NUM, {
      headers: { accept: 'application/json', 'User-Agent': 'numetal-fee-engine/1.0' },
    });
    if (r.ok) {
      const j: any = await r.json();
      const a = (j.data && j.data.attributes) || {};
      if (a.price_usd) out = { price: a.price_usd, fdv: a.fdv_usd || null, vol24: (a.volume_usd && a.volume_usd.h24) || null, mcap: a.market_cap_usd || null, liq: null, src: 'geckoterminal', dexErr: null };
      else out.dexErr = 'gt:noprice';
    } else out.dexErr = 'gt:' + r.status;
  } catch (e) { out.dexErr = 'gt:' + String(e); }
  if (!out.price) {
    try {
      const r = await fetch('https://api.dexscreener.com/latest/dex/pairs/base/' + PAIR, {
        headers: { 'User-Agent': 'numetal-fee-engine/1.0 (+https://numetal.xyz)', accept: 'application/json' },
      });
      if (r.ok) {
        const d: any = await r.json();
        const ds = (d.pairs && d.pairs[0]) || {};
        if (ds.priceUsd) out = { price: ds.priceUsd, fdv: ds.fdv || null, vol24: (ds.volume && ds.volume.h24) || null, mcap: ds.marketCap || null, liq: (ds.liquidity && ds.liquidity.usd) || null, src: 'dexscreener', dexErr: out.dexErr };
      } else out.dexErr = (out.dexErr ? out.dexErr + ';' : '') + 'ds:' + r.status;
    } catch (e) { out.dexErr = (out.dexErr ? out.dexErr + ';' : '') + 'ds:' + String(e); }
  }
  if (out.price && cache) {
    try {
      await cache.put(key, new Response(JSON.stringify(out), { headers: { 'cache-control': 'public, max-age=60' } }));
      // keep a long-lived last-good price so a transient DEX miss doesn't flicker the tile to "—"
      await cache.put(lastKey, new Response(JSON.stringify(out), { headers: { 'cache-control': 'public, max-age=86400' } }));
    } catch {}
  } else if (!out.price && cache) {
    try { const lg = await cache.match(lastKey); if (lg) { const j: any = await lg.json(); j.stalePrice = true; j.dexErr = out.dexErr; return j; } } catch {}
  }
  return out;
}

async function getDataFresh(): Promise<any> {
  const [bDead, bContract, bZero, team, trez, decRes, supRes, dex] = await Promise.all([
    ethCall('0x70a08231' + pad(BURN)),
    ethCall('0x70a08231' + pad(NUM)),
    ethCall('0x70a08231' + pad(ZERO)),
    ethCall('0x70a08231' + pad(TEAM)),
    ethCall('0x70a08231' + pad(TREZ)),
    ethCall('0x313ce567'),
    ethCall('0x18160ddd'),
    getDex(),
  ]);
  const toStr = (h: string | null) => (h ? BigInt(h).toString() : null);
  return {
    decimals: decRes ? Number(BigInt(decRes)) : 18,
    burned: sumHexBalances([bDead, bContract, bZero]), team: toStr(team), treasury: toStr(trez), supply: toStr(supRes),
    price: dex.price, fdv: dex.fdv, vol24: dex.vol24, mcap: dex.mcap, liq: dex.liq, src: dex.src, dexErr: dex.dexErr,
    ts: Date.now(),
  };
}

export async function getData(): Promise<any> {
  const cache = cacheStore();
  const key = new Request('https://numetal.xyz/__lastgood');
  let fresh: any = null;
  try { fresh = await getDataFresh(); } catch {}
  if (fresh && fresh.burned) {
    if (cache) { try { await cache.put(key, new Response(JSON.stringify(fresh), { headers: { 'cache-control': 'public, max-age=600' } })); } catch {} }
    return fresh;
  }
  if (cache) { try { const hit = await cache.match(key); if (hit) { const lg: any = await hit.json(); lg.stale = true; return lg; } } catch {} }
  return fresh || { decimals: 18, burned: null, team: null, treasury: null, supply: null, price: null, fdv: null, vol24: null, mcap: null, liq: null, src: null, dexErr: 'no-data', ts: Date.now() };
}

export async function getBurns(env: any): Promise<any[]> {
  const cache = cacheStore();
  const key = new Request('https://numetal.xyz/__burns_v6');
  const lastKey = new Request('https://numetal.xyz/__burns_lastgood_v1');
  if (cache) { const hit = await cache.match(key); if (hit) { try { return await hit.json(); } catch {} } }
  const WETH = '0x4200000000000000000000000000000000000006';
  const SWAPS = ['0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67', '0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822'];
  const rpc = async (m: string, p: any) => {
    const r = await fetch(env.BASE_RPC_URL, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: m, params: p }) });
    return (await r.json() as any).result;
  };
  let out: any[] = [];
  try {
    const lists: any[] = await Promise.all(BURN_DESTS.map((dest) => rpc('alchemy_getAssetTransfers', [{ fromBlock: '0x0', toBlock: 'latest', toAddress: dest, contractAddresses: [NUM], category: ['erc20'], withMetadata: true, maxCount: '0x3e8', order: 'desc' }])));
    const merged: any[] = [];
    for (const tr of lists) merged.push(...(((tr && tr.transfers) || []).filter((t: any) => Number(t.value) >= 1)));
    merged.sort((a, b) => String(b.metadata?.blockTimestamp || '').localeCompare(String(a.metadata?.blockTimestamp || '')));
    const list = merged.slice(0, 50);
    out = await Promise.all(list.map(async (t: any) => {
      const from = (t.from || '').toLowerCase();
      let buyback = false;
      try {
        const rc: any = await rpc('eth_getTransactionReceipt', [t.hash]);
        const logs = (rc && rc.logs) || [];
        buyback = logs.some((l: any) => (l.address || '').toLowerCase() === WETH || (l.topics && SWAPS.indexOf(l.topics[0]) >= 0));
      } catch {}
      return { ts: (t.metadata && t.metadata.blockTimestamp) || null, from: t.from, label: BURN_LABELS[from] || null, amount: t.value, tx: t.hash, type: buyback ? 'buyback-burn' : 'manual-burn' };
    }));
    // server-side XSS hardening: only keep canonical hex addresses + tx hashes
    out = out.filter((e: any) => /^0x[0-9a-fA-F]{40}$/.test(e.from || '') && /^0x[0-9a-fA-F]{64}$/.test(e.tx || ''));
  } catch {}
  // 5-min edge cache bounds how often this unauthenticated, CORS-open route hits the
  // metered Alchemy key (env.BASE_RPC_URL) — limits cost-amplification. Pair with a
  // Cloudflare WAF rate-limit rule on /fees/events for a hard ceiling. Burns are
  // infrequent, so a longer TTL costs no meaningful freshness.
  if (out.length && cache) {
    try {
      await cache.put(key, new Response(JSON.stringify(out), { headers: { 'cache-control': 'public, max-age=300' } }));
      await cache.put(lastKey, new Response(JSON.stringify(out), { headers: { 'cache-control': 'public, max-age=86400' } }));
    } catch {}
  } else if (!out.length && cache) {
    try {
      const lastGood = await cache.match(lastKey);
      const fallback = lastGood ? await lastGood.json() : [];
      await cache.put(key, new Response(JSON.stringify(fallback), { headers: { 'cache-control': 'public, max-age=60' } }));
      return fallback;
    } catch {}
  }
  return out;
}
