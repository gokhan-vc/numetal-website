import assert from 'node:assert/strict';
import test from 'node:test';

import { sumHexBalances } from '../src/lib/fees';

test('sumHexBalances returns null when any burn destination is unavailable', () => {
  assert.equal(sumHexBalances(['0x1', null, '0x2']), null);
});

test('sumHexBalances sums complete burn balances, including zero values', () => {
  assert.equal(sumHexBalances(['0x0', '0x2', '0x3']), '5');
});
