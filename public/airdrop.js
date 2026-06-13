(function () {
  var $ = function (id) { return document.getElementById(id); };
  var f = function (n) { return Number(n).toLocaleString("en-US"); };
  var abbr = function (n) { n = Number(n); var a = Math.abs(n); if (a >= 1e9) return (n / 1e9).toFixed(2) + "B"; if (a >= 1e6) return (n / 1e6).toFixed(2) + "M"; if (a >= 1e3) return (n / 1e3).toFixed(1) + "K"; return (Math.round(n * 100) / 100).toString(); };
  var DATA = [];

  function short(a) { return a.slice(0, 12) + "…" + a.slice(-6); }

  function renderTracker(S) {
    var tb = $("tracker"); if (!tb) return;
    tb.innerHTML = (S.status || []).map(function (x) {
      var tag, tx = "—";
      if (x.state === "completed") {
        tag = '<span class="tag t-done">done</span>';
        var txl = x.txs || (x.tx ? [x.tx] : []);
        if (txl.length) tx = txl.map(function (t, i) { return '<a href="https://basescan.org/tx/' + t + '" target="_blank" rel="noopener">' + (txl.length > 1 ? "p" + (i + 1) : t.slice(0, 8) + "…") + "</a>"; }).join(" · ");
      } else if (x.when === "today") {
        tag = '<span class="tag t-today">today</span>';
      } else {
        tag = '<span class="tag t-sched">scheduled</span>';
      }
      return '<tr><td style="font-weight:700">' + x.label + '</td><td style="color:#6B7280">' + x.when +
        '</td><td>' + f(x.amount) + '</td><td>' + tag + '</td><td style="color:#6B7280">' + tx + '</td></tr>';
    }).join("");
  }

  function result(hit, raw) {
    var res = $("result");
    if (!hit) {
      res.innerHTML = '<div class="boxed" style="padding:12px 14px;font-size:13px;color:#6B7280">' +
        (/^0x[0-9a-fA-F]{40}$/.test(raw)
          ? "Not eligible — this address didn’t hold BOUNTY or PLATES at the snapshot (or was a stripped pool/bot)."
          : "Enter a full address to check.") + '</div>';
      return;
    }
    function cell(l, v, right, c) {
      return '<div style="padding:11px 13px;border-bottom:1px solid #E5E7EB;' + (right ? "" : "border-right:1px solid #E5E7EB") +
        '"><div style="font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:#6B7280">' + l +
        '</div><div style="font-weight:700;margin-top:4px;' + (c ? "color:" + c : "") + '">' + v + '</div></div>';
    }
    res.innerHTML = '<div class="boxed">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:11px 13px;border-bottom:1px solid #0A0A0A">' +
      '<span style="font-size:13px">' + short(hit.a) + '</span>' +
      '<span class="tag" style="background:#06B6D4;color:#06303a">eligible · #' + hit.r + '</span></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr">' +
      cell("Bounty held", f(hit.b), 0) + cell("Plates held", f(hit.p), 1) +
      cell("$NUMETAL total", f(hit.t), 0, "#002FA7") + cell("Batches 1·2·3", abbr(hit.t * 0.20) + " · " + abbr(hit.t * 0.36) + " · " + abbr(hit.t * 0.44), 1) +
      '</div></div>';
  }

  function search() {
    var raw = ($("q").value || "").trim();
    var v = raw.toLowerCase();
    if (v.length < 6) { $("result").innerHTML = ""; return; }
    var hit = null;
    for (var i = 0; i < DATA.length; i++) { if (DATA[i].a === v || DATA[i].a.indexOf(v) === 0) { hit = DATA[i]; break; } }
    result(hit, raw);
  }

  var q = $("q");
  if (q) q.addEventListener("input", search);
  var ex = $("ex");
  if (ex) ex.addEventListener("click", function () { $("q").value = "0xb1fd2b6fc1aca584b7ac497546a22a01a684c6be"; search(); });

  fetch("/airdrop-status.json", { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (S) {
    renderTracker(S);
    if (S.recipients) { var a = $("mRec"); if (a) a.textContent = f(S.recipients); }
    var comp = (S.status || []).filter(function (x) { return x.state === "completed"; });
    var done = comp.length;
    var sent = comp.reduce(function (s, x) { return s + (x.amount || 0); }, 0);
    var total = S.total || 500000000;
    var nb = S.batches || (S.status || []).length || 3;
    var hs = $("hstatus");
    if (hs) {
      var msg = done >= nb
        ? "Complete — " + f(total) + " $NUMETAL dispersed to " + f(S.recipients || 657) + " wallets"
        : done + " / " + nb + " batches dispersed · " + f(sent) + " $NUMETAL sent · " + f(total - sent) + " scheduled";
      hs.innerHTML = '<span class="dotp"></span><span>' + msg + '</span>';
    }
  }).catch(function () {});

  fetch("/airdrop.json", { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (d) { DATA = d || []; }).catch(function () {});
})();
