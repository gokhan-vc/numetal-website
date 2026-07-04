/* Collapsible headings for blog/newsletter articles — click a heading (or its
   chevron mark) to fold everything under it down to the next same-or-higher
   heading. The mark carries a hover tooltip: "Collapse this heading" when open,
   "Expand this heading" when collapsed. Scoped to the article container, so it
   no-ops on non-article pages. External file so it satisfies script-src 'self'. */
(function () {
  var SEL = ['.post-body', '.article', '.art', '.prose', 'main article', 'article .content'];
  var root = null;
  for (var i = 0; i < SEL.length; i++) { root = document.querySelector(SEL[i]); if (root) break; }
  if (!root) return;
  var heads = [].slice.call(root.querySelectorAll('h1, h2, h3'));
  if (!heads.length) return;

  var css =
    '.hcoll{all:unset;box-sizing:border-box;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;' +
    'width:1.25em;height:1.25em;margin-right:.32em;vertical-align:baseline;color:var(--red,#e10600);font-size:.66em;' +
    'line-height:1;position:relative;opacity:.5;transition:opacity .12s}' +
    'h1:hover>.hcoll,h2:hover>.hcoll,h3:hover>.hcoll,.hcoll:hover,.hcoll:focus-visible{opacity:1}' +
    '.hcoll::after{content:attr(data-tip);position:absolute;left:0;top:135%;white-space:nowrap;' +
    'background:#141414;color:#fff;font:500 10px/1.4 ui-monospace,Menlo,Consolas,monospace;letter-spacing:.03em;' +
    'padding:3px 7px;border-radius:3px;opacity:0;pointer-events:none;transition:opacity .1s;z-index:9999}' +
    '.hcoll:hover::after,.hcoll:focus-visible::after{opacity:1}' +
    '.hcoll-h{cursor:pointer}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var lvl = function (h) { return +h.tagName.charAt(1); };

  heads.forEach(function (h) {
    var l = lvl(h);
    var body = [];
    var n = h.nextElementSibling;
    while (n) {
      if (/^H[1-6]$/.test(n.tagName) && (+n.tagName.charAt(1)) <= l) break;
      body.push(n);
      n = n.nextElementSibling;
    }
    if (!body.length) return; // nothing to fold

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'hcoll';
    btn.textContent = '▾'; // ▾
    btn.setAttribute('aria-label', 'Toggle this section');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('data-tip', 'Collapse this heading');
    h.insertBefore(btn, h.firstChild);
    h.classList.add('hcoll-h');

    var collapsed = false;
    function toggle(e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      collapsed = !collapsed;
      for (var i = 0; i < body.length; i++) { body[i].style.display = collapsed ? 'none' : ''; }
      btn.textContent = collapsed ? '▸' : '▾'; // ▸ / ▾
      btn.setAttribute('aria-expanded', String(!collapsed));
      btn.setAttribute('data-tip', collapsed ? 'Expand this heading' : 'Collapse this heading');
    }
    btn.addEventListener('click', toggle);
    h.addEventListener('click', function (e) {
      if (e.target === btn || btn.contains(e.target)) return; // button handles itself
      if (e.target.closest && e.target.closest('a')) return;  // don't hijack permalink/hanchor links
      toggle(e);
    });
  });
})();
