import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';

import { getBurns, sumHexBalances } from '../src/lib/fees';

const originalFetch = globalThis.fetch;
const originalCaches = (globalThis as any).caches;
const env = { BASE_RPC_URL: 'https://alchemy.example' };
const burnsKey = 'https://numetal.xyz/__burns_v6';

class MemoryCache {
  store = new Map<string, Response>();

  async match(request: Request): Promise<Response | undefined> {
    return this.store.get(request.url)?.clone();
  }

  async put(request: Request, response: Response): Promise<void> {
    this.store.set(request.url, response.clone());
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

test('getBurns falls back to last-good burns and short-caches outage responses', async () => {
  const cache = new MemoryCache();
  const from = '0x' + '1'.repeat(40);
  const tx = '0x' + '2'.repeat(64);
  let fetchCalls = 0;

  (globalThis as any).caches = { default: cache };
  globalThis.fetch = (async (_input: RequestInfo | URL, init?: RequestInit) => {
    fetchCalls++;
    const body = JSON.parse(String(init?.body || '{}'));
    if (body.method === 'alchemy_getAssetTransfers') {
      const transfers = body.params?.[0]?.toAddress === '0x000000000000000000000000000000000000dEaD'
        ? [{ from, hash: tx, value: 7, metadata: { blockTimestamp: '2026-06-18T00:00:00.000Z' } }]
        : [];
      return new Response(JSON.stringify({ result: { transfers } }));
    }
    if (body.method === 'eth_getTransactionReceipt') {
      return new Response(JSON.stringify({ result: { logs: [] } }));
    }
    return new Response(JSON.stringify({ result: null }));
  }) as typeof fetch;

  const fresh = await getBurns(env);
  assert.equal(fresh.length, 1);
  assert.equal(fresh[0].from, from);
  assert.equal(fetchCalls, 4);

  cache.delete(burnsKey);
  globalThis.fetch = (async () => {
    fetchCalls++;
    throw new Error('alchemy unavailable');
  }) as typeof fetch;

  fetchCalls = 0;
  const stale = await getBurns(env);
  assert.deepEqual(stale, fresh);
  assert.equal(fetchCalls, 3);

  fetchCalls = 0;
  const negativeCached = await getBurns(env);
  assert.deepEqual(negativeCached, fresh);
  assert.equal(fetchCalls, 0);
});

test('getBurns short-caches an empty fallback when no last-good burns exist', async () => {
  let fetchCalls = 0;
  (globalThis as any).caches = { default: new MemoryCache() };
  globalThis.fetch = (async () => {
    fetchCalls++;
    throw new Error('alchemy unavailable');
  }) as typeof fetch;

  assert.deepEqual(await getBurns(env), []);
  assert.equal(fetchCalls, 3);

  fetchCalls = 0;
  assert.deepEqual(await getBurns(env), []);
  assert.equal(fetchCalls, 0);
});
