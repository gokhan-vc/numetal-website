/**
 * House document furniture for numetal.xyz — filed-technical-document structure
 * expressed in the site's own tokens (IKB accent, Helvetica/mono stack, dither chrome).
 *
 * Every page gets: a masthead box (org · doc no + rev · status / title block +
 * stamp / bottom meta row), ruled uppercase section heads with flush-right §
 * numbers, and a perforation bar + colophon at the end of the sheet.
 *
 * Doc-number canon: NML-0XX. Revision marks use DOC_DATE.
 */

export const DOC_DATE = '2026-07-17';
export const DOC_REV = 'Rev A';

/** Chrome-level CSS. Relies on page tokens: --ink, --line, --mono, --bgray and
 *  --muted (or --mut on the index sheet); safe fallbacks included.
 *  Ships both themes: the dark scheme (prefers-color-scheme) re-issues the same
 *  document with inverted ink/paper — identical borders, weights and structure.
 *  Accent tokens keep their hue; only the link/text blue gets a dark-legible
 *  counterpart, and brand-blue fills that carry white type stay on the original
 *  fill value. --sheet is defined only in the dark scheme; light falls back to
 *  the original hardcoded sheet white. */
export const docChromeCss = `
  body{font-variant-numeric:tabular-nums}
  :root{color-scheme:light dark}
  @media (prefers-color-scheme:dark){
    :root{--sheet:#181816;--ink:#e8e8e6;--paper:#181816;--bgray:#262624;--line:#3a3a38;--muted:#9a9a98;--mut:#9a9a98;--hard:#7f7f7d;--ikb:#6f8dfa}
    .sheet,.top,footer,.qin,.post,.toc .toclabel,.deck-pdf,.ask{background:var(--sheet)}
    .dither{background-image:radial-gradient(#d9d9d6 .62px,transparent .72px)}
    .btn,.chain.hub,.crt .mast,.ptag,.s-trez,.d-trez{background:#002FA7}
  }
  .docmast{border:2px solid var(--ink,#141414);margin:26px 32px 6px;background:var(--sheet,#fff)}
  .docmast-row{display:flex;flex-wrap:wrap;border-bottom:1px solid var(--line,#c4c4c4)}
  .docmast-cell{font-family:var(--mono,ui-monospace,monospace);font-size:10px;letter-spacing:.16em;text-transform:uppercase;color:var(--muted,var(--mut,#6f6f6f));padding:7px 12px;border-right:1px solid var(--line,#c4c4c4);white-space:nowrap}
  .docmast-row .docmast-cell:first-child{font-weight:700;color:var(--ink,#141414)}
  .docmast-row .docmast-cell:last-child{border-right:0;margin-left:auto;text-align:right}
  .docmast-title{display:flex;justify-content:space-between;align-items:flex-start;gap:14px 22px;padding:18px 18px 16px;border-bottom:1px solid var(--line,#c4c4c4);flex-wrap:wrap}
  .docmast-tt{flex:1 1 340px;min-width:0}
  .docmast-sub{font-family:var(--mono,ui-monospace,monospace);font-size:10.5px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted,var(--mut,#6f6f6f));margin-top:10px}
  .docstamp{flex:0 0 auto;align-self:flex-start;border:2px solid var(--ink,#141414);color:var(--ink,#141414);padding:.3rem .7rem;font-family:var(--mono,ui-monospace,monospace);font-size:11px;font-weight:700;letter-spacing:.22em;text-transform:uppercase;transform:rotate(-1.6deg);white-space:nowrap;margin-top:6px}
  .docmast-foot{border-bottom:0}
  .docmast .upd{margin-bottom:0}
  .docperf{height:10px;margin:26px 32px 0;background-image:repeating-linear-gradient(90deg,var(--ink,#141414) 0 6px,transparent 6px 12px)}
  .doccolo{display:flex;justify-content:space-between;gap:8px 18px;flex-wrap:wrap;border-top:2px solid var(--ink,#141414);margin:12px 32px;padding:10px 0 16px;font-family:var(--mono,ui-monospace,monospace);font-size:10px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted,var(--mut,#6f6f6f))}
  .wrap .docmast,.wrap .docperf,.wrap .doccolo{margin-left:0;margin-right:0}
  .tblwrap{overflow-x:auto;margin:0 0 18px}
  .tblwrap>table{margin-bottom:0}
  @media(max-width:760px){.docmast{margin:20px 18px 6px}.docmast-title{padding:16px 14px 14px}.docperf{margin:22px 18px 0}.doccolo{margin:10px 18px}.docmast-cell{white-space:normal}}
`;

/** Article discipline for blog posts: tiny uppercase ruled h2 with flush-right
 *  section number (CSS counter — markup untouched), fully bordered tables on
 *  the faint tone, bordered figure captions. Pages whose headings carry their
 *  own numbers add class "selfnum" on the article element. */
export const articleDocCss = `
  .article{counter-reset:dsec}
  .article h2{counter-increment:dsec;display:flex;align-items:baseline;gap:.5em;font-family:var(--mono,ui-monospace,monospace);font-size:12px;line-height:1.5;letter-spacing:.2em;text-transform:uppercase;font-weight:700;color:var(--ink,#141414);border-top:0;border-bottom:2px solid var(--ink,#141414);padding:0 0 7px;margin:36px 0 16px}
  .article h2::after{content:"§" counter(dsec);margin-left:auto;font-size:10.5px;letter-spacing:.14em;color:var(--muted,#6f6f6f);font-weight:400}
  .article.selfnum h2::after{content:""}
  .article table{font-variant-numeric:tabular-nums;border-collapse:collapse;border-top:0;border-bottom:0}
  .article th,.article td{border:1px solid var(--ink,#141414);padding:6px 10px}
  .article th{background:var(--bgray,#e7e7e7)}
  .fig{margin:0 0 18px}
  .fig img{width:100%;height:auto;background:#fff;border:1px solid var(--ink,#141414)}
  .fig figcaption{font-family:var(--mono,ui-monospace,monospace);font-size:10.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted,#6f6f6f);margin-top:6px}
  .lens{font-family:var(--mono,ui-monospace,monospace);font-size:12px;color:var(--muted,#6f6f6f)}
  .fn{font-size:11.5px;color:var(--muted,#6f6f6f)}
`;

export interface MastheadOpts {
  docNo: string;      // e.g. "NML-001"
  status: string;     // e.g. "Status: live"
  titleHtml: string;  // h1 (+ byline / eyebrow / kept content elements)
  sub?: string;       // uppercase letterspaced subtitle line
  stamp: string;      // the one rotated stamp
  footLeft: string;   // canonical identifier
  footRight: string;  // license / network tag
}

export function mastheadHtml(o: MastheadOpts): string {
  return `
  <header class="docmast">
    <div class="docmast-row">
      <span class="docmast-cell">Numetal Labs</span>
      <span class="docmast-cell">Doc ${o.docNo} · ${DOC_REV} · ${DOC_DATE}</span>
      <span class="docmast-cell">${o.status}</span>
    </div>
    <div class="docmast-title">
      <div class="docmast-tt">${o.titleHtml}${o.sub ? `<div class="docmast-sub">${o.sub}</div>` : ''}</div>
      <span class="docstamp" aria-hidden="true">${o.stamp}</span>
    </div>
    <div class="docmast-row docmast-foot">
      <span class="docmast-cell">${o.footLeft}</span>
      <span class="docmast-cell">${o.footRight}</span>
    </div>
  </header>`;
}

export function colophonHtml(o: { docNo: string; note: string }): string {
  return `
  <div class="docperf" aria-hidden="true"></div>
  <div class="doccolo"><span>Numetal Labs · Doc ${o.docNo} · ${DOC_REV} · ${DOC_DATE}</span><span>${o.note}</span></div>`;
}
