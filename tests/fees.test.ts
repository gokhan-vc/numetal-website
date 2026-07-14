import assert from 'node:assert/strict';
import test from 'node:test';

import { getBurns, sumHexBalances } from '../src/lib/fees';

class MemoryCache {
  values = new Map<string, Response>();

  async match(request: Request): Promise<Response | undefined> {
    const response = this.values.get(request.url);
    return response ? response.clone() : undefined;
  }

  async put(request: Request, response: Response): Promise<void> {
    this.values.set(request.url, response.clone());
  }

  delete(url: string): void {
    this.values.delete(url);
  }
}

test('sumHexBalances returns null when any burn destination is unavailable', () => {
  assert.equal(sumHexBalances(['0x1', null, '0x2']), null);
});

test('sumHexBalances sums complete burn balances, including zero values', () => {
  assert.equal(sumHexBalances(['0x0', '0x2', '0x3']), '5');
});

test('getBurns falls back to last-good burns and short-caches failures', async () => {
  const originalFetch = globalThis.fetch;
  const originalCaches = (globalThis as any).caches;
  const cache = new MemoryCache();
  const from = '0x1111111111111111111111111111111111111111';
  const tx = '0x' + '2'.repeat(64);
  let fetchCalls = 0;

  (globalThis as any).caches = { default: cache };
  globalThis.fetch = (async (_input: RequestInfo | URL, init?: RequestInit) => {
    fetchCalls++;
    const body = JSON.parse(String(init?.body || '{}'));
    if (body.method === 'alchemy_getAssetTransfers') {
      const toAddress = body.params?.[0]?.toAddress;
      const transfers = toAddress === '0x000000000000000000000000000000000000dEaD'
        ? [{ from, hash: tx, value: 7, metadata: { blockTimestamp: '2026-06-18T00:00:00.000Z' } }]
        : [];
      return new Response(JSON.stringify({ result: { transfers } }));
    }
    if (body.method === 'eth_getTransactionReceipt') {
      return new Response(JSON.stringify({ result: { logs: [] } }));
    }
    return new Response(JSON.stringify({ result: null }));
  }) as typeof fetch;

  try {
    const fresh = await getBurns({ BASE_RPC_URL: 'https://alchemy.example' });
    assert.equal(fresh.length, 1);
    assert.equal(fresh[0].from, from);
    assert.equal(fetchCalls, 4);

    cache.delete('https://numetal.xyz/__burns_v6');
    globalThis.fetch = (async () => {
      fetchCalls++;
      throw new Error('alchemy unavailable');
    }) as typeof fetch;

    fetchCalls = 0;
    const stale = await getBurns({ BASE_RPC_URL: 'https://alchemy.example' });
    assert.deepEqual(stale, fresh);
    assert.equal(fetchCalls, 3);

    fetchCalls = 0;
    const negativeCached = await getBurns({ BASE_RPC_URL: 'https://alchemy.example' });
    assert.deepEqual(negativeCached, fresh);
    assert.equal(fetchCalls, 0);
  } finally {
    globalThis.fetch = originalFetch;
    (globalThis as any).caches = originalCaches;
  }
});
