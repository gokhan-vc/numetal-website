/**
 * NMLFMT — the house number formatter for numetal.xyz.
 *
 * One copy of the rules for how this estate prints a quantity, so the fee report, the
 * airdrop tracker and (next) the band's bound segments cannot disagree about what
 * $25,885.77 looks like. Classic script, no modules, no BigInt literals: it is loaded
 * with a plain <script defer> ahead of its consumers and hangs itself on window.
 *
 * Two defects fixed on extraction, both from public/fees.js:
 *   · usd() abbreviated everything over $1,000 as "$26K". A treasury figure of
 *     $25,885.77 has six significant figures and the page printed two. Money below
 *     $1M is now printed in full, grouped, to the cent; only millions and billions
 *     abbreviate, and they keep two decimals.
 *   · every toLocaleString / toLocaleDate call passed `undefined` as the locale, so
 *     the same document printed "25.885,77" for a German reader and "25,885.77" for
 *     an American one — while public/airdrop.js, on the sibling page, hardcoded
 *     "en-US". The document is filed in English; the locale is now explicit and one
 *     value, here.
 *
 * public/airdrop.js keeps its own abbr() deliberately: its sub-1,000 branch prints
 * two decimals rather than a grouped integer, and changing what /airdrops renders is
 * not part of this pass.
 */
(function (w) {
  'use strict';

  /* The document is filed in English. Every figure on it is grouped the same way. */
  var LOCALE = 'en-US';

  /** Grouped decimal. num(25885.77) -> "25,886"; num(25885.77, 2) -> "25,885.77". */
  function num(n, maxFrac) {
    n = Number(n);
    if (!isFinite(n)) return '—';
    var f = maxFrac == null ? 0 : maxFrac;
    return n.toLocaleString(LOCALE, { minimumFractionDigits: f, maximumFractionDigits: f });
  }

  /** Token counts, where three significant figures is the point. 8.33M, 1.31B. */
  function abbr(n) {
    if (n == null || isNaN(n)) return '—';
    n = Number(n);
    var a = Math.abs(n);
    if (a >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (a >= 1e6) return (n / 1e6).toFixed(2) + 'M';
    if (a >= 1e3) return (n / 1e3).toFixed(1) + 'K';
    return num(n);
  }

  /** Money. Full to the cent below $1M; abbreviated with two decimals above it. */
  function usd(x) {
    if (x == null) return '';
    x = Number(x);
    if (!isFinite(x)) return '';
    var a = Math.abs(x);
    if (a >= 1e9) return '$' + num(x / 1e9, 2) + 'B';
    if (a >= 1e6) return '$' + num(x / 1e6, 2) + 'M';
    return '$' + num(x, 2);
  }

  /** Unit price, with subscript-zero notation below a tenth of a cent. */
  function price(p) {
    if (p == null) return '—';
    p = Number(p);
    if (!isFinite(p)) return '—';
    if (p >= 1) return '$' + num(p, 2);
    if (p >= 0.001) return '$' + p.toPrecision(3);
    var sub = '₀₁₂₃₄₅₆₇₈₉';
    var str = p.toFixed(20);
    var dec = str.slice(str.indexOf('.') + 1);
    var z = 0;
    while (z < dec.length && dec[z] === '0') z++;
    var sig = dec.slice(z, z + 4);
    var zc = String(z).split('').map(function (d) { return sub[+d]; }).join('');
    return '$0.0' + zc + sig;
  }

  /** Raw on-chain integer + decimals -> abbreviated token amount. */
  function tok(raw, dec) {
    if (raw == null) return '—';
    try {
      return abbr(Number(BigInt(raw)) / Math.pow(10, dec));
    } catch (e) {
      return '—';
    }
  }

  /** Dates carry the document's locale too, not the reader's. */
  function dateShort(ts) {
    try {
      return new Date(ts).toLocaleDateString(LOCALE, { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) { return ''; }
  }

  function timeShort(ts) {
    try {
      return new Date(ts).toLocaleTimeString(LOCALE);
    } catch (e) { return ''; }
  }

  function dateTime(ts) {
    if (!ts) return '';
    try {
      return new Date(ts).toLocaleString(LOCALE, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    } catch (e) { return ''; }
  }

  w.NMLFMT = {
    locale: LOCALE,
    num: num,
    abbr: abbr,
    usd: usd,
    price: price,
    tok: tok,
    dateShort: dateShort,
    timeShort: timeShort,
    dateTime: dateTime
  };
})(window);
