import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// public/fmt.js is a classic browser script that hangs itself on `window`, so it is
// evaluated here the way a browser evaluates it rather than imported as a module.
const src = readFileSync(new URL('../public/fmt.js', import.meta.url), 'utf8');
const ctx: { window: Record<string, any> } = { window: {} };
vm.createContext(ctx);
vm.runInContext(src, ctx);
const FMT = ctx.window.NMLFMT;

test('usd keeps every significant figure below $1M', () => {
  // The defect: $25,885.77 printed as "$26K".
  assert.equal(FMT.usd(25885.77), '$25,885.77');
  assert.equal(FMT.usd(1000), '$1,000.00');
  assert.equal(FMT.usd(3.4924341406), '$3.49');
});

test('usd abbreviates only millions and billions, and keeps two decimals', () => {
  assert.equal(FMT.usd(1234567.89), '$1.23M');
  assert.equal(FMT.usd(2.5e9), '$2.50B');
});

test('usd returns the empty string it always returned when there is no value', () => {
  assert.equal(FMT.usd(null), '');
  assert.equal(FMT.usd(undefined), '');
  assert.equal(FMT.usd(NaN), '');
});

test('every figure is grouped in one explicit locale, never the reader\'s', () => {
  // The defect: toLocaleString(undefined, …) next to a hardcoded "en-US" path.
  assert.equal(FMT.locale, 'en-US');
  assert.equal(FMT.num(98685987117.35), '98,685,987,117');
  assert.equal(FMT.dateShort(1785007402978), 'Jul 25, 2026');
});

test('price uses subscript-zero notation below a tenth of a cent', () => {
  assert.equal(FMT.price(0.000000259782164), '$0.0₆2597');
  assert.equal(FMT.price(1.5), '$1.50');
  assert.equal(FMT.price(null), '—');
});

test('tok reports absence rather than zero', () => {
  assert.equal(FMT.tok(null, 18), '—');
  assert.equal(FMT.tok('not-a-number', 18), '—');
  assert.equal(FMT.tok('1314012882653095560583908561', 18), '1.31B');
});
