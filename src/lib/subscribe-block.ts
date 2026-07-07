/**
 * In-flow newsletter footnote — Ishtar / Atelier foot-sub pattern for numetal.xyz.
 * Stripe divider + subtle outlined buttons (no currentColor/Canvas fill hack).
 */
export const subscribeBlockCss = `
  .stripe{height:6px;margin:1.4rem 32px 0;background-image:repeating-linear-gradient(135deg,#e10600 0 9px,transparent 9px 18px)}
  .foot-sub{padding:1rem 32px .35rem;color:var(--mut,var(--muted,#7c7c7c));font-family:var(--sans,'Helvetica Neue',Helvetica,Arial,sans-serif)}
  .foot-sub a{color:var(--mut,var(--muted,#7c7c7c));text-decoration:underline}
  .foot-sub a:hover{color:var(--ikb,#002FA7)}
  .foot-sub-copy{margin:0 0 .3rem;font-size:.95em;line-height:1.45;max-width:62ch}
  .foot-sub-copy b,.foot-sub-copy strong{color:var(--ink,#141414);font-weight:600}
  .foot-sub-form{margin:0}
  .foot-sub-row{display:flex;align-items:stretch;gap:8px;width:100%}
  .foot-sub-input{flex:1;min-width:0;padding:10px 12px;border:1px solid currentColor;background:transparent;color:inherit;font:inherit;box-sizing:border-box}
  .foot-sub-input:focus-visible{outline:2px solid var(--ink,#141414);outline-offset:2px}
  .foot-sub-actions{display:flex;flex-shrink:0;gap:8px;align-items:stretch}
  .foot-sub-btn{padding:10px 18px;border:1px solid currentColor;background:transparent;color:inherit;font:inherit;cursor:pointer;white-space:nowrap}
  .foot-sub-btn:hover,.foot-sub-btn:focus-visible{border-color:var(--ink,#141414);color:var(--ink,#141414)}
  .foot-sub-btn--xmtp{font-family:var(--mono,ui-monospace,monospace);font-size:.92em}
  .foot-sub-btn--xmtp:hover,.foot-sub-btn--xmtp:focus-visible{color:#e10600;border-color:#e10600}
  .foot-sub-btn--xmtp:disabled{opacity:.55;cursor:default}
  .foot-sub-status{font-family:var(--mono,ui-monospace,monospace);font-size:12px;margin:.35rem 0 0;min-height:1.2em}
  .foot-sub-status.is-ok{color:var(--ink,#141414)}
  .foot-sub-status.is-err{color:#e10600}
  .foot-sub-rss{margin:.4rem 0 0;font-size:.9em;opacity:.85;line-height:1.4}
  @media(max-width:740px){.stripe,.foot-sub{padding-left:18px;padding-right:18px}.stripe{margin-left:18px;margin-right:18px}}
  @media(max-width:640px){.foot-sub-row{flex-direction:column}.foot-sub-actions{display:grid;grid-template-columns:1fr 1fr;width:100%}.foot-sub-actions .foot-sub-btn{width:100%;white-space:normal}}
  @media(max-width:400px){.foot-sub-actions{grid-template-columns:1fr}}
`;

export const subscribeBlockHtml = `
  <div class="stripe" aria-hidden="true"></div>
  <div class="foot-sub" aria-labelledby="foot-sub-heading" data-xmtp-root>
    <form class="foot-sub-form" method="POST" action="https://api.gokhan.vc/newsletter/subscribe">
      <p class="foot-sub-copy" id="foot-sub-heading">Dispatches from the studio — occasional, low-frequency notes on what we ship. Optional wallet delivery over XMTP. <strong>No spam.</strong></p>
      <div class="foot-sub-row">
        <input type="email" name="email" required placeholder="you@email.com" autocomplete="email" aria-label="Email" class="foot-sub-input">
        <input type="hidden" name="site" value="numetal">
        <div class="foot-sub-actions">
          <button type="submit" class="foot-sub-btn">Subscribe</button>
          <button type="button" class="foot-sub-btn foot-sub-btn--xmtp" data-xmtp-btn data-xmtp-site="numetal">Connect wallet (XMTP)</button>
        </div>
      </div>
    </form>
    <p class="foot-sub-status" data-xmtp-status role="status" aria-live="polite"></p>
    <p class="foot-sub-rss"><strong>Two RSS feeds</strong> — <a href="/feed.xml">this&nbsp;site</a> · <a href="https://api.gokhan.vc/feed.xml">everything</a> (all studio sites).</p>
  </div>`;
