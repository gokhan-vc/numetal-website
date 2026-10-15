import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

import { getBurns, sumHexBalances } from '../src/lib/fees';

const originalFetch = globalThis.fetch;
const originalCaches = (globalThis as any).caches;
const env = { BASE_RPC_URL: 'https://example.invalid/rpc' };
const burnsKey = 'https://numetal.xyz/__burns_v6';

class MemoryCache {
  store = new Map<string, Response>();

  async match(input: Request): Promise<Response | undefined> {
    return this.store.get(input.url)?.clone();
  }

  async put(input: Request, response: Response): Promise<void> {
    this.store.set(input.url, response.clone());
  }

  delete(url: string): void {
    this.store.delete(url);
  }
}

afterEach(() => {
  globalThis.fetch = originalFetch;
  (globalThis as any).caches = originalCaches;
});

test('sumHexBalances returns null when any burn destination is unavailable', () => {
  assert.equal(sumHexBalances(['0x1', null, '0x2']), null);
});

test('sumHexBalances sums complete burn balances, including zero values', () => {
  assert.equal(sumHexBalances(['0x0', '0x2', '0x3']), '5');
});

test('getBurns falls back to last-good data and caches outage responses briefly', async () => {
  const cache = new MemoryCache();
  (globalThis as any).caches = { default: cache };
  const from = '0x' + '1'.repeat(40);
  const tx = '0x' + '2'.repeat(64);
  let remainingTransfers = 1;
  let fail = false;
  let fetches = 0;

  globalThis.fetch = (async (_url: string, init?: RequestInit) => {
    fetches++;
    if (fail) throw new Error('rpc down');
    const body = JSON.parse(String(init?.body));
    if (body.method === 'alchemy_getAssetTransfers') {
      const transfers = remainingTransfers > 0
        ? [{ from, hash: tx, value: 12, metadata: { blockTimestamp: '2026-06-13T00:00:00Z' } }]
        : [];
      remainingTransfers--;
      return new Response(JSON.stringify({ result: { transfers } }));
    }
    return new Response(JSON.stringify({ result: { logs: [{ address: '0x4200000000000000000000000000000000000006' }] } }));
  }) as typeof fetch;

  const first = await getBurns(env);
  assert.equal(fetches, 4);
  assert.equal(first.length, 1);
  assert.equal(first[0].type, 'buyback-burn');

  cache.delete(burnsKey);
  fail = true;
  fetches = 0;

  const fallback = await getBurns(env);
  assert.deepEqual(fallback, first);
  assert.equal(fetches, 3);

  fetches = 0;
  assert.deepEqual(await getBurns(env), first);
  assert.equal(fetches, 0);
});

test('getBurns coalesces concurrent cache misses', async () => {
  const cache = new MemoryCache();
  (globalThis as any).caches = { default: cache };
  let assetTransferCalls = 0;
  let releaseRpc: (() => void) | null = null;
  const rpcGate = new Promise<void>((resolve) => {
    releaseRpc = resolve;
  });

  globalThis.fetch = (async (_url: string, init?: RequestInit) => {
    const body = JSON.parse(String(init?.body));
    assert.equal(body.method, 'alchemy_getAssetTransfers');
    assetTransferCalls++;
    await rpcGate;
    return new Response(JSON.stringify({ result: { transfers: [] } }));
  }) as typeof fetch;

  const first = getBurns(env);
  const second = getBurns(env);
  await Promise.resolve();
  await Promise.resolve();
  assert.equal(assetTransferCalls, 3);

  releaseRpc?.();
  assert.deepEqual(await Promise.all([first, second]), [[], []]);

  assetTransferCalls = 0;
  assert.deepEqual(await getBurns(env), []);
  assert.equal(assetTransferCalls, 0);
});
