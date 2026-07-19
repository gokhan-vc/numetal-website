/* Numetal site-wide link popups (Gwern-style). Hover a link on desktop -> an annotation card
   near it (kicker / title / blurb / open-link). Curated cards for key URLs; a lightweight
   fallback card for any external link. CSP-clean (no framing, no fetch). Desktop only. */
(function () {
  if (window.matchMedia && window.matchMedia("(hover: none)").matches) return;

  var CSS = '.lp{position:absolute;z-index:9999;max-width:340px;width:max-content;border:1.5px solid var(--line,#c4c4c4);background:#fff;color:var(--ink,#141414);box-shadow:5px 5px 0 var(--ikb,#002FA7);padding:.7rem .85rem;font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;opacity:0;transform:translateY(4px);transition:opacity .12s,transform .12s;pointer-events:none}.lp.show{opacity:1;transform:translateY(0);pointer-events:auto}.lp .lp-k{font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace;font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:var(--ikb,#002FA7)}.lp .lp-t{font-weight:700;font-size:14px;line-height:1.25;margin:.15rem 0 .3rem;color:var(--ink,#141414)}.lp .lp-d{font-size:12.5px;line-height:1.5;color:var(--muted,#6f6f6f)}.lp a.lp-o{display:inline-block;margin-top:.5rem;font-family:ui-monospace,Menlo,monospace;font-size:11px;letter-spacing:.04em;color:var(--ikb,#002FA7);border:0}.lp a.lp-o:hover{text-decoration:underline}@media (prefers-reduced-motion:reduce){.lp{transition:none}}';
  var st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);

  var ANN = {
    "https://www.x402.org": { k: "x402.org · protocol", t: "x402", d: "The HTTP 402 payments protocol for the internet (Coinbase). Agents and people pay per request in stablecoins, no accounts." },
    "https://mpp.dev/overview": { k: "mpp.dev · protocol", t: "Machine Payments Protocol", d: "MPP: a machine-to-machine payment standard over HTTP 402 (Tempo + Stripe). Cards, Lightning, and stablecoins in one flow." },
    "https://mpp.dev": { k: "mpp.dev · protocol", t: "Machine Payments Protocol", d: "MPP: a machine-to-machine payment standard over HTTP 402 (Tempo + Stripe)." },
    "https://ishtar.numetal.xyz": { k: "ishtar.numetal.xyz · live", t: "Ishtar", d: "The agent-mediated dating venue Numetal builds. Agents court; humans meet only after both agents agree and both consent." },
    "https://gokhan.vc": { k: "gokhan.vc · studio", t: "Gökhan Ventures", d: "The venture studio behind Numetal. AGI plus human conviviality, in the long now." },
    "https://github.com/gokhan-vc/heartprefs": { k: "github · standard", t: "HeartPrefs", d: "An open, signed, portable matching-intent document for agent-mediated matching. Write once, court anywhere." },
    "https://gwern.net/guardian-angel": { k: "gwern.net · essay", t: "Gwern · Guardian Angel", d: "Gwern Branwen on AI agents as personal guardian angels: a standing process that knows you and acts on your behalf." }
  };

  var pop = null, showT = null, hideT = null;
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[c]; }); }
  function host(u) { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return "link"; } }

  function annFor(a) {
    var raw = a.getAttribute("href") || "";
    if (!raw || raw.indexOf("mailto:") === 0 || raw.indexOf("javascript:") === 0) return null;
    var u; try { u = new URL(a.href); } catch (e) { return null; }
    if (raw.charAt(0) === "#") return null;
    var hrefKey = a.href.replace(/\/+$/, "");
    if (ANN[hrefKey]) return ANN[hrefKey];
    if (u.host !== location.host) {
      return { k: host(a.href), t: (a.textContent || "").trim().slice(0, 64) || host(a.href), d: "" };
    }
    return null;
  }

  function ensure() {
    if (pop) return pop;
    pop = document.createElement("div"); pop.className = "lp";
    pop.addEventListener("mouseenter", function () { clearTimeout(hideT); });
    pop.addEventListener("mouseleave", hideSoon);
    document.body.appendChild(pop); return pop;
  }
  function fill(a) {
    var m = annFor(a); if (!m) return false;
    var p = ensure();
    var d = m.d ? '<div class="lp-d">' + esc(m.d) + '</div>' : '';
    p.innerHTML = '<div class="lp-k">' + esc(m.k) + '</div><div class="lp-t">' + esc(m.t) + '</div>' + d
      + '<a class="lp-o" href="' + esc(a.href) + '" ' + (a.target ? 'target="' + esc(a.target) + '" rel="noopener"' : '') + '>open ' + esc(host(a.href)) + ' ↗</a>';
    return true;
  }
  function place(a) {
    var r = a.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.offsetHeight, m = 10;
    var x = window.scrollX + r.left;
    var maxx = window.scrollX + document.documentElement.clientWidth - pw - m;
    if (x > maxx) x = maxx; if (x < window.scrollX + m) x = window.scrollX + m;
    var below = r.bottom + 8 + ph <= window.innerHeight;
    var y = below ? (window.scrollY + r.bottom + 8) : (window.scrollY + r.top - ph - 8);
    pop.style.left = x + "px"; pop.style.top = y + "px";
  }
  function show(a) { if (!fill(a)) return; place(a); pop.classList.add("show"); }
  function showSoon(a) { clearTimeout(hideT); clearTimeout(showT); showT = setTimeout(function () { show(a); }, 160); }
  function hideSoon() { clearTimeout(showT); hideT = setTimeout(function () { if (pop) pop.classList.remove("show"); }, 220); }

  function bind() {
    document.querySelectorAll("a[href]").forEach(function (a) {
      if (a.getAttribute("data-lp") === "1") return;
      if (!annFor(a)) return;
      a.setAttribute("data-lp", "1");
      a.addEventListener("mouseenter", function () { showSoon(a); });
      a.addEventListener("mouseleave", hideSoon);
      a.addEventListener("focus", function () { showSoon(a); });
      a.addEventListener("blur", hideSoon);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();
})();
