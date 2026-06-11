
const FEES = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\" />\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n<title>Numetal — fee engine · burns &amp; buybacks</title>\n<meta name=\"description\" content=\"Numetal fee engine — live burns, buybacks, and fee distribution on Base.\" />\n<style>\n  :root{--ikb:#002FA7;--paper:#FAFAF8;--ink:#0A0A0A;--orange:#FF5A1F;--cyan:#06B6D4;--line:#E5E7EB;--muted:#6B7280;\n    --mono:ui-monospace,'SF Mono','SFMono-Regular',Menlo,Consolas,monospace;--sans:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}\n  *{box-sizing:border-box;margin:0;padding:0}\n  html{-webkit-font-smoothing:antialiased}\n  body{background:var(--paper);color:var(--ink);font-family:var(--mono);font-size:15px;line-height:1.5;min-height:100vh;display:flex;flex-direction:column}\n  a{color:var(--ikb);text-decoration:none}a:hover{text-decoration:underline}\n  .wrap{width:100%;max-width:880px;margin:0 auto;padding:0 24px}\n  header{border-bottom:1px solid var(--ink)}\n  .bar0{display:flex;align-items:center;justify-content:space-between;height:56px;max-width:880px;margin:0 auto;padding:0 24px}\n  .mark{display:flex;align-items:center;gap:9px;font-weight:700;letter-spacing:.06em}\n  .mark .sq{width:13px;height:13px;background:var(--ikb)}\n  .mark a{color:var(--ink)}\n  .status-tag{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);display:flex;align-items:center;gap:8px}\n  .dotpulse{width:7px;height:7px;border-radius:50%;background:var(--cyan);animation:pulse 1.8s ease-in-out infinite}\n  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.25}}\n  main{flex:1}\n  .intro{padding:54px 0 30px}\n  .eyebrow{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:22px}\n  h1{font-size:54px;line-height:1.02;font-weight:700;letter-spacing:-.02em}\n  h1 .dot{color:var(--ikb)}\n  .sub{font-family:var(--sans);font-size:16px;color:#444;margin-top:16px;max-width:56ch;line-height:1.55}\n\n  .metrics{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid var(--ink)}\n  .m{padding:20px 18px;border-right:1px solid var(--line)}\n  .m:last-child{border-right:0}\n  .m .k{font-size:11px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}\n  .m .v{font-size:26px;font-weight:700;margin-top:10px;letter-spacing:-.01em}\n  .m .v.burn{color:var(--orange)}\n  .m .s{font-size:12px;color:var(--muted);margin-top:6px}\n  .m .s.cy{color:var(--cyan)}\n\n  .dist{padding:40px 0 8px}\n  .dist-h{display:flex;align-items:center;gap:11px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;font-weight:700}\n  .dist-h .ibar{width:4px;height:17px;background:var(--ikb)}\n  .side{margin-top:24px}\n  .side-head{display:flex;justify-content:space-between;align-items:baseline;gap:12px;margin-bottom:10px}\n  .side-head .nm{font-size:14px;font-weight:700}\n  .side-head .tot{font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:.08em}\n  .barx{display:flex;height:36px;border:1px solid var(--ink)}\n  .seg{display:flex;align-items:center;justify-content:center;font-size:12px;color:#fff;white-space:nowrap;overflow:hidden;border-right:1px solid rgba(255,255,255,.3)}\n  .seg:last-child{border-right:0}\n  .s-team{background:var(--orange)}.s-trez{background:var(--ikb)}.s-burn{background:var(--ink);color:var(--paper)}\n  .leg{display:flex;align-items:center;gap:16px;flex-wrap:wrap;font-size:12px;color:var(--muted);margin:12px 0 4px}\n  .leg .lg{display:flex;align-items:center;gap:7px}\n  .leg .d{width:9px;height:9px}\n  .d-team{background:var(--orange)}.d-trez{background:var(--ikb)}.d-burn{background:var(--ink)}\n\n  .upd{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:12px;color:var(--muted);padding:30px 0 0}\n  .upd a{color:var(--ikb)}\n  .live{width:7px;height:7px;border-radius:50%;background:var(--cyan);display:inline-block;animation:pulse 1.8s ease-in-out infinite}\n\n  footer{border-top:1px solid var(--line);margin-top:40px}\n  .foot{display:flex;justify-content:space-between;flex-wrap:wrap;gap:10px;font-size:12px;color:var(--muted);padding:18px 0}\n  .stream{padding:40px 0 8px}\n  .stream-box{margin-top:18px;border:1px solid var(--ink);max-height:430px;overflow-y:auto}\n  table.strm{width:100%;border-collapse:collapse;font-size:13px}\n  table.strm thead th{position:sticky;top:0;background:var(--paper);text-align:left;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);padding:11px 14px;border-bottom:1px solid var(--ink)}\n  table.strm td{padding:11px 14px;border-bottom:1px solid var(--line);white-space:nowrap}\n  table.strm tbody tr:last-child td{border-bottom:0}\n  table.strm tbody tr:hover td{background:#f4f4f1}\n  .tag{display:inline-block;font-size:10px;font-weight:700;padding:3px 8px;letter-spacing:.03em;text-transform:uppercase}\n  .tag.buyback{background:var(--orange);color:#fff}\n  .tag.manual{background:var(--ink);color:var(--paper)}\n  .strm a{color:var(--ikb)}\n  .strm .amt{font-weight:700}\n  .strm .lbl{color:var(--muted);font-size:11px}\n  .empty{text-align:center;color:var(--muted);padding:26px}\n  .strm-foot{font-size:12px;color:var(--muted);margin-top:11px;display:flex;gap:8px;align-items:center}\n  @media(max-width:680px){h1{font-size:38px}.metrics{grid-template-columns:1fr 1fr}.m{border-bottom:1px solid var(--line)}table.strm{font-size:12px}table.strm td,table.strm th{padding:8px 10px}}\n</style>\n</head>\n<body>\n<header><div class=\"bar0\">\n  <div class=\"mark\"><span class=\"sq\"></span><a href=\"/\">NUMETAL</a></div>\n  <div class=\"status-tag\"><span class=\"dotpulse\"></span>fee engine · live</div>\n</div></header>\n\n<main>\n  <section class=\"wrap intro\">\n    <div class=\"eyebrow\">Fee engine · burns &amp; buybacks</div>\n    <h1>Burns &amp; buybacks<span class=\"dot\">.</span></h1>\n    <p class=\"sub\">Every creator-fee claim splits to team, treasury, and burn — executed onchain on Base. Live, straight from the contracts.</p>\n  </section>\n\n  <section class=\"wrap\">\n    <div class=\"metrics\">\n      <div class=\"m\"><div class=\"k\">$NUMETAL burned</div><div class=\"v burn\" id=\"burned\">—</div><div class=\"s\" id=\"burnedPct\">buyback + claim burn</div></div>\n      <div class=\"m\"><div class=\"k\">Treasury</div><div class=\"v\" id=\"treasury\">—</div><div class=\"s\">$NUMETAL held</div></div>\n      <div class=\"m\"><div class=\"k\">Team</div><div class=\"v\" id=\"team\">—</div><div class=\"s\">$NUMETAL held</div></div>\n      <div class=\"m\"><div class=\"k\">Price</div><div class=\"v\" id=\"price\">—</div><div class=\"s cy\" id=\"fdv\"></div></div>\n    </div>\n  </section>\n\n  <section class=\"wrap stream\">\n    <div class=\"dist-h\"><span class=\"ibar\"></span>Buybacks &amp; burns · live</div>\n    <div class=\"stream-box\">\n      <table class=\"strm\">\n        <thead><tr><th>Time</th><th>Type</th><th>NUMETAL</th><th>From</th><th>Tx</th></tr></thead>\n        <tbody id=\"burnrows\"><tr><td colspan=\"5\" class=\"empty\">loading…</td></tr></tbody>\n      </table>\n    </div>\n    <div class=\"strm-foot\"><span class=\"live\"></span><span id=\"burncount\"></span><span>· every burn to 0x…dEaD · auto-refreshes</span></div>\n  </section>\n\n  <section class=\"wrap dist\">\n    <div class=\"dist-h\"><span class=\"ibar\"></span>Distribution policy</div>\n    <div class=\"leg\"><span class=\"lg\"><span class=\"d d-team\"></span>team</span><span class=\"lg\"><span class=\"d d-trez\"></span>treasury</span><span class=\"lg\"><span class=\"d d-burn\"></span>burn (incl. buyback)</span></div>\n    <div class=\"side\">\n      <div class=\"side-head\"><span class=\"nm\">WETH side</span><span class=\"tot\">100% of claimed WETH</span></div>\n      <div class=\"barx\"><span class=\"seg s-team\" style=\"flex:80 0 0\">80% team</span><span class=\"seg s-trez\" style=\"flex:10 0 0\">10%</span><span class=\"seg s-burn\" style=\"flex:10 0 0\">10%</span></div>\n    </div>\n    <div class=\"side\">\n      <div class=\"side-head\"><span class=\"nm\">$NUMETAL side</span><span class=\"tot\">100% of claimed $NUMETAL</span></div>\n      <div class=\"barx\"><span class=\"seg s-team\" style=\"flex:40 0 0\">40% team</span><span class=\"seg s-trez\" style=\"flex:30 0 0\">30% treasury</span><span class=\"seg s-burn\" style=\"flex:30 0 0\">30% burn</span></div>\n    </div>\n  </section>\n\n  <div class=\"wrap upd\">\n    <span class=\"live\"></span><span id=\"updated\">loading live data…</span>\n    <span>· auto-refreshes every 60s ·</span>\n    <a href=\"#\" id=\"refresh\">refresh now</a>\n  </div>\n</main>\n\n<footer><div class=\"wrap foot\">\n  <span>Numetal · fee engine · Base</span>\n  <span>onchain · USDC · $NUMETAL</span>\n</div></footer>\n\n<script>\n  var $=function(id){return document.getElementById(id);};\n  function abbr(n){\n    if(n==null||isNaN(n)) return \"—\";\n    var a=Math.abs(n);\n    if(a>=1e9) return (n/1e9).toFixed(2)+\"B\";\n    if(a>=1e6) return (n/1e6).toFixed(2)+\"M\";\n    if(a>=1e3) return (n/1e3).toFixed(1)+\"K\";\n    return n.toLocaleString(undefined,{maximumFractionDigits:0});\n  }\n  function tok(raw,dec){ if(raw==null) return \"—\"; try{ var n=Number(BigInt(raw))/Math.pow(10,dec); return abbr(n); }catch(e){ return \"—\"; } }\n  function usd(x){ if(x==null) return \"\"; x=Number(x); if(x>=1e6) return \"$\"+(x/1e6).toFixed(1)+\"M\"; if(x>=1e3) return \"$\"+(x/1e3).toFixed(0)+\"K\"; return \"$\"+x.toFixed(2); }\n  function price(p){ if(p==null) return \"—\"; p=Number(p); if(p>=1) return \"$\"+p.toFixed(2); if(p>=0.001) return \"$\"+p.toPrecision(3); var sub=\"₀₁₂₃₄₅₆₇₈₉\"; var str=p.toFixed(20); var dec=str.slice(str.indexOf(\".\")+1); var z=0; while(z<dec.length&&dec[z]===\"0\")z++; var sig=dec.slice(z,z+4); var zc=String(z).split(\"\").map(function(d){return sub[+d];}).join(\"\"); return \"$0.0\"+zc+sig; }\n  function load(){\n    fetch(\"/fees/data\",{cache:\"no-store\"}).then(function(r){return r.json();}).then(function(d){\n      if(d.error){ $(\"updated\").textContent=\"data source error — retrying\"; return; }\n      var dec=d.decimals||18;\n      if(d.burned!=null){ $(\"burned\").textContent=tok(d.burned,dec); if(d.supply){ try{ var pct=Number(BigInt(d.burned)*10000n/BigInt(d.supply))/100; $(\"burnedPct\").textContent=pct.toFixed(2)+\"% of supply · buyback + claim burn\"; }catch(e){} } }\n      if(d.treasury!=null) $(\"treasury\").textContent=tok(d.treasury,dec);\n      if(d.team!=null) $(\"team\").textContent=tok(d.team,dec);\n      if(d.price!=null) $(\"price\").textContent=price(d.price);\n      if(d.fdv!=null) $(\"fdv\").textContent=\"FDV \"+usd(d.fdv)+(d.vol24?(\" · 24h \"+usd(d.vol24)):\"\");\n      $(\"updated\").textContent=\"Updated \"+new Date(d.ts||Date.now()).toLocaleTimeString();\n    }).catch(function(){ $(\"updated\").textContent=\"update failed — retrying\"; });\n  }\n  function shortA(a){return a?a.slice(0,6)+\"…\"+a.slice(-4):\"?\";}\n  function whenTs(ts){if(!ts)return \"\";try{return new Date(ts).toLocaleString(undefined,{month:\"short\",day:\"numeric\",hour:\"2-digit\",minute:\"2-digit\"});}catch(e){return \"\";}}\n  function loadBurns(){\n    fetch(\"/fees/events\",{cache:\"no-store\"}).then(function(r){return r.json();}).then(function(a){\n      var tb=$(\"burnrows\");if(!tb)return;\n      if(!Array.isArray(a)||!a.length){tb.innerHTML='<tr><td colspan=\"5\" class=\"empty\">No burns recorded yet.</td></tr>';return;}\n      tb.innerHTML=a.slice(0,200).map(function(e){\n        var isBuy=e.type===\"buyback-burn\";\n        var tag='<span class=\"tag '+(isBuy?\"buyback\":\"manual\")+'\">'+(isBuy?\"buyback-burn\":\"manual-burn\")+'</span>';\n        var lbl=e.label?' <span class=\"lbl\">('+e.label+')</span>':'';\n        var from='<a href=\"https://basescan.org/address/'+e.from+'\" target=\"_blank\" rel=\"noopener\">'+shortA(e.from)+'</a>'+lbl;\n        var tx=e.tx?'<a href=\"https://basescan.org/tx/'+e.tx+'\" target=\"_blank\" rel=\"noopener\">'+e.tx.slice(0,8)+'…</a>':'';\n        var amt=Number(e.amount).toLocaleString(undefined,{maximumFractionDigits:0});\n        return '<tr><td>'+whenTs(e.ts)+'</td><td>'+tag+'</td><td class=\"amt\">'+amt+'</td><td>'+from+'</td><td>'+tx+'</td></tr>';\n      }).join('');\n      var c=$(\"burncount\");if(c)c.textContent=a.length+' burn'+(a.length===1?'':'s')+' recorded';\n    }).catch(function(){});\n  }\n  loadBurns(); setInterval(loadBurns,30000);\n  load(); setInterval(load,20000);\n  $(\"refresh\").addEventListener(\"click\",function(e){e.preventDefault();$(\"updated\").textContent=\"refreshing…\";load();});\n</script>\n</body>\n</html>\n";
const RPCS = ["https://mainnet.base.org","https://base.llamarpc.com","https://base-rpc.publicnode.com"];
const NUM  = "0x57EDb7FC54ADa9Ef4E113DC05A168449e63cFbA3";
const BURN = "0x000000000000000000000000000000000000dEaD";
const TEAM = "0xB13Fb67859bC818a7b9Eb7f1380274492B6D648F";
const TREZ = "0x3D9bB085b7E2fd15827d174f20375be385c121c0";
const PAIR = "0xf0ba727d596861455b31d6e444ed3ee41c77709a27f7d787ccf609f6c34dbbd8";
const pad = (a) => a.slice(2).toLowerCase().padStart(64, "0");
async function ethCall(data) {
  for (const rpc of RPCS) {
    try {
      const r = await fetch(rpc, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "eth_call", params: [{ to: NUM, data }, "latest"] }) });
      const j = await r.json();
      if (j && j.result && j.result !== "0x") return j.result;
    } catch (e) {}
  }
  return null;
}
async function getDex() {
  const cache = caches.default;
  const key = new Request("https://numetal.xyz/__dexcache");
  const hit = await cache.match(key);
  if (hit) { try { return await hit.json(); } catch (e) {} }
  let out = { price: null, fdv: null, vol24: null, mcap: null, liq: null, src: null, dexErr: null };
  // primary: GeckoTerminal (CoinGecko onchain) — friendlier to shared IPs than DexScreener
  try {
    const r = await fetch("https://api.geckoterminal.com/api/v2/networks/base/tokens/" + NUM, { headers: { "accept": "application/json", "User-Agent": "numetal-fee-engine/1.0" } });
    if (r.ok) { const j = await r.json(); const a = (j.data && j.data.attributes) || {}; if (a.price_usd) out = { price: a.price_usd, fdv: a.fdv_usd || null, vol24: (a.volume_usd && a.volume_usd.h24) || null, mcap: a.market_cap_usd || null, liq: null, src: "geckoterminal", dexErr: null }; else out.dexErr = "gt:noprice"; }
    else out.dexErr = "gt:" + r.status;
  } catch (e) { out.dexErr = "gt:" + String(e); }
  // fallback: DexScreener
  if (!out.price) {
    try {
      const r = await fetch("https://api.dexscreener.com/latest/dex/pairs/base/" + PAIR, { headers: { "User-Agent": "numetal-fee-engine/1.0 (+https://numetal.xyz)", "accept": "application/json" } });
      if (r.ok) { const d = await r.json(); const ds = (d.pairs && d.pairs[0]) || {}; if (ds.priceUsd) out = { price: ds.priceUsd, fdv: ds.fdv || null, vol24: (ds.volume && ds.volume.h24) || null, mcap: ds.marketCap || null, liq: (ds.liquidity && ds.liquidity.usd) || null, src: "dexscreener", dexErr: out.dexErr }; }
      else out.dexErr = (out.dexErr ? out.dexErr + ";" : "") + "ds:" + r.status;
    } catch (e) { out.dexErr = (out.dexErr ? out.dexErr + ";" : "") + "ds:" + String(e); }
  }
  if (out.price) { try { await cache.put(key, new Response(JSON.stringify(out), { headers: { "cache-control": "public, max-age=60" } })); } catch (e) {} }
  return out;
}
async function _getDataFresh() {
  const [burned, team, trez, decRes, supRes, dex] = await Promise.all([
    ethCall("0x70a08231" + pad(BURN)),
    ethCall("0x70a08231" + pad(TEAM)),
    ethCall("0x70a08231" + pad(TREZ)),
    ethCall("0x313ce567"),
    ethCall("0x18160ddd"),
    getDex(),
  ]);
  const toStr = (h) => h ? BigInt(h).toString() : null;
  return {
    decimals: decRes ? Number(BigInt(decRes)) : 18,
    burned: toStr(burned), team: toStr(team), treasury: toStr(trez), supply: toStr(supRes),
    price: dex.price, fdv: dex.fdv, vol24: dex.vol24, mcap: dex.mcap, liq: dex.liq, src: dex.src, dexErr: dex.dexErr,
    ts: Date.now(),
  };
}
async function getData() {
  const cache = caches.default; const key = new Request("https://numetal.xyz/__lastgood");
  let fresh = null; try { fresh = await _getDataFresh(); } catch (e) {}
  if (fresh && fresh.burned) { try { await cache.put(key, new Response(JSON.stringify(fresh), { headers: { "cache-control": "public, max-age=600" } })); } catch (e) {} return fresh; }
  try { const hit = await cache.match(key); if (hit) { const lg = await hit.json(); lg.stale = true; return lg; } } catch (e) {}
  return fresh || { decimals: 18, burned: null, team: null, treasury: null, supply: null, price: null, fdv: null, vol24: null, mcap: null, liq: null, src: null, dexErr: "no-data", ts: Date.now() };
}
function _abbr(n){ if(n==null||isNaN(n)) return "—"; const a=Math.abs(n); if(a>=1e9) return (n/1e9).toFixed(2)+"B"; if(a>=1e6) return (n/1e6).toFixed(2)+"M"; if(a>=1e3) return (n/1e3).toFixed(1)+"K"; return Math.round(n).toLocaleString(); }
function _tok(raw,dec){ if(raw==null) return "—"; try{ return _abbr(Number(BigInt(raw))/Math.pow(10,dec)); }catch(e){ return "—"; } }
function _price(p){ if(p==null) return "—"; p=Number(p); if(p>=1) return "$"+p.toFixed(2); if(p>=0.001) return "$"+p.toPrecision(3); var sub="₀₁₂₃₄₅₆₇₈₉"; var str=p.toFixed(20); var dec=str.slice(str.indexOf(".")+1); var z=0; while(z<dec.length&&dec[z]==="0")z++; var sig=dec.slice(z,z+4); var zc=String(z).split("").map(function(d){return sub[+d];}).join(""); return "$0.0"+zc+sig; }
function _inject(html,id,val){ if(val==null||val==="—") return html; return html.replace(new RegExp('(id="'+id+'"[^>]*>)[^<]*<'), function(m,p1){return p1+val+'<';}); }
async function _cachedData(){ try{ const hit=await caches.default.match(new Request("https://numetal.xyz/__lastgood")); if(hit) return await hit.json(); }catch(e){} return null; }
async function renderPage(html, landing){ try{ const d=await _cachedData(); if(d){ const dec=d.decimals||18; const ids=landing?{"cs-burned":_tok(d.burned,dec),"cs-treasury":_tok(d.treasury,dec),"cs-team":_tok(d.team,dec),"cs-price":_price(d.price)}:{"burned":_tok(d.burned,dec),"treasury":_tok(d.treasury,dec),"team":_tok(d.team,dec),"price":_price(d.price)}; for(const id in ids) html=_inject(html,id,ids[id]); } }catch(e){} return html; }
const FEE_ENGINE = "0x8f49d4d782488e8576c8c54288027c57f4acf521";
const BURN_LABELS = { "0x8f49d4d782488e8576c8c54288027c57f4acf521": "bankr wallet", "0xb13fb67859bc818a7b9eb7f1380274492b6d648f": "team", "0x3d9bb085b7e2fd15827d174f20375be385c121c0": "treasury" };
async function getBurns(env) {
  const cache = caches.default; const key = new Request("https://numetal.xyz/__burns_v5");
  const hit = await cache.match(key); if (hit) { try { return await hit.json(); } catch (e) {} }
  const WETH = "0x4200000000000000000000000000000000000006";
  const SWAPS = ["0xc42079f94a6350d7e6235f29174924f928cc2ac818eb64fed8004e115fbcca67", "0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822"];
  const rpc = async function (m, p) { const r = await fetch(env.BASE_RPC_URL, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: m, params: p }) }); return (await r.json()).result; };
  let out = [];
  try {
    const tr = await rpc("alchemy_getAssetTransfers", [{ fromBlock: "0x0", toBlock: "latest", toAddress: BURN, contractAddresses: [NUM], category: ["erc20"], withMetadata: true, maxCount: "0x3e8", order: "desc" }]);
    const list = (((tr && tr.transfers) || []).filter(function (t) { return Number(t.value) >= 1; })).slice(0, 50);
    out = await Promise.all(list.map(async function (t) {
      const from = (t.from || "").toLowerCase();
      let buyback = false;
      try { const rc = await rpc("eth_getTransactionReceipt", [t.hash]); const logs = (rc && rc.logs) || []; buyback = logs.some(function (l) { return (l.address || "").toLowerCase() === WETH || (l.topics && SWAPS.indexOf(l.topics[0]) >= 0); }); } catch (e) {}
      return { ts: (t.metadata && t.metadata.blockTimestamp) || null, from: t.from, label: BURN_LABELS[from] || null, amount: t.value, tx: t.hash, type: buyback ? "buyback-burn" : "manual-burn" };
    }));
  } catch (e) {}
  out = out.filter(function (e) { return /^0x[0-9a-fA-F]{40}$/.test(e.from || "") && /^0x[0-9a-fA-F]{64}$/.test(e.tx || ""); });
  if (out.length) { try { await cache.put(key, new Response(JSON.stringify(out), { headers: { "cache-control": "public, max-age=120" } })); } catch (e) {} }
  return out;
}
const SECBASE = {
  "strict-transport-security": "max-age=31536000; includeSubDomains; preload",
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "accelerometer=(), autoplay=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()",
  "cross-origin-opener-policy": "same-origin",
};
const CSP_BASE = "default-src 'self'; base-uri 'none'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; img-src 'self' data:; font-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'; manifest-src 'self'; upgrade-insecure-requests";
const CSP_FEES = CSP_BASE + "; script-src 'self' 'sha256-R/tJfYJsGstBUoD2Y7v79PtbV/kyDaIu6gI67FGtm4w='";
const CSP_HTML = CSP_BASE + "; script-src 'self'";
function htmlSec(res, fees) {
  const r = new Response(res.body, res);
  for (const k in SECBASE) r.headers.set(k, SECBASE[k]);
  r.headers.set("content-security-policy", fees ? CSP_FEES : CSP_HTML);
  r.headers.set("cross-origin-resource-policy", "same-origin");
  return r;
}
function jsonRes(obj, status) {
  return new Response(typeof obj === "string" ? obj : JSON.stringify(obj), { status: status || 200, headers: {
    "content-type": "application/json; charset=utf-8", "cache-control": "no-store",
    "access-control-allow-origin": "*", "access-control-allow-methods": "GET, OPTIONS",
    "x-content-type-options": "nosniff", "cross-origin-resource-policy": "cross-origin",
    "x-frame-options": "DENY", "strict-transport-security": "max-age=31536000; includeSubDomains; preload" } });
}
export default {
  async fetch(req, env) {
    const u = new URL(req.url);
    if (u.pathname === "/fees/data") {
      try { const d = await getData(); if (d && typeof d === "object") delete d.dexErr; return jsonRes(d); }
      catch (e) { return jsonRes({ error: "upstream_unavailable" }, 502); }
    }
    if (u.pathname === "/fees/events") {
      try { return jsonRes(await getBurns(env)); }
      catch (e) { return jsonRes("[]"); }
    }
    if (u.pathname === "/fees" || u.pathname === "/fees/") {
      const res = new Response(await renderPage(FEES, false), { headers: { "content-type": "text/html;charset=UTF-8", "cache-control": "no-store" } });
      return htmlSec(res, true);
    }
    const asset = await env.ASSETS.fetch(req);
    return htmlSec(asset, false);
  },
};
