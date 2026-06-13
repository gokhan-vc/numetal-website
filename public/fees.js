var $=function(id){return document.getElementById(id);};
  function abbr(n){
    if(n==null||isNaN(n)) return "—";
    var a=Math.abs(n);
    if(a>=1e9) return (n/1e9).toFixed(2)+"B";
    if(a>=1e6) return (n/1e6).toFixed(2)+"M";
    if(a>=1e3) return (n/1e3).toFixed(1)+"K";
    return n.toLocaleString(undefined,{maximumFractionDigits:0});
  }
  function tok(raw,dec){ if(raw==null) return "—"; try{ var n=Number(BigInt(raw))/Math.pow(10,dec); return abbr(n); }catch(e){ return "—"; } }
  function usd(x){ if(x==null) return ""; x=Number(x); if(x>=1e6) return "$"+(x/1e6).toFixed(1)+"M"; if(x>=1e3) return "$"+(x/1e3).toFixed(0)+"K"; return "$"+x.toFixed(2); }
  function price(p){ if(p==null) return "—"; p=Number(p); if(p>=1) return "$"+p.toFixed(2); if(p>=0.001) return "$"+p.toPrecision(3); var sub="₀₁₂₃₄₅₆₇₈₉"; var str=p.toFixed(20); var dec=str.slice(str.indexOf(".")+1); var z=0; while(z<dec.length&&dec[z]==="0")z++; var sig=dec.slice(z,z+4); var zc=String(z).split("").map(function(d){return sub[+d];}).join(""); return "$0.0"+zc+sig; }
  function load(){
    fetch("/fees/data",{cache:"no-store"}).then(function(r){return r.json();}).then(function(d){
      if(d.error){ $("updated").textContent="data source error — retrying"; return; }
      var dec=d.decimals||18;
      var TOTAL=1e11;
      if(d.burned!=null){ $("burned").textContent=tok(d.burned,dec); if(d.supply){ try{ var pct=Number(BigInt(d.burned)*10000n/BigInt(d.supply))/100; var pe=$("burnedPct"); if(pe)pe.textContent=pct.toFixed(2)+"% supply"; var bbar=$("burnedBar"); if(bbar)bbar.style.width=Math.max(.8,Math.min(100,pct)).toFixed(2)+"%"; }catch(e){} }
        try{ var bt=Number(BigInt(d.burned))/Math.pow(10,dec); var cur=TOTAL-bt; var se=$("supplyNow"); if(se)se.textContent=cur.toLocaleString(undefined,{maximumFractionDigits:0}); }catch(e){} }
      var rd=$("rdate"); if(rd) rd.textContent=new Date(d.ts||Date.now()).toLocaleDateString(undefined,{year:"numeric",month:"short",day:"numeric"});
      if(d.treasury!=null) $("treasury").textContent=tok(d.treasury,dec);
      if(d.team!=null) $("team").textContent=tok(d.team,dec);
      if(d.price!=null) $("price").textContent=price(d.price);
      if(d.fdv!=null) $("fdv").textContent="FDV "+usd(d.fdv)+(d.vol24?(" · 24h "+usd(d.vol24)):"");
      $("updated").textContent="Updated "+new Date(d.ts||Date.now()).toLocaleTimeString();
    }).catch(function(){ $("updated").textContent="update failed — retrying"; });
  }
  function shortA(a){return a?a.slice(0,6)+"…"+a.slice(-4):"?";}
  var ICO={
    bankr:'<svg class="wico" viewBox="0 0 24 24"><path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zM7.5 11.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S9.83 13 9 13s-1.5-.67-1.5-1.5zM16 17H8v-2h8v2zm-1-4c-.83 0-1.5-.67-1.5-1.5S14.17 10 15 10s1.5.67 1.5 1.5S15.83 13 15 13z"/></svg>',
    agentbounty:'<svg class="wico" viewBox="0 0 24 24"><path d="m16.955 8.662 2.12-2.122 1.416 1.414-2.121 2.122zM2 18h20v2H2zm9-14h2v3h-2zM3.543 7.925 4.957 6.51l2.121 2.12-1.414 1.415zM5 16h14c0-3.87-3.13-7-7-7s-7 3.13-7 7z"/></svg>',
    team:'<svg class="wico" viewBox="0 0 24 24"><path d="M12 12.75c1.63 0 3.07.39 4.24.9 1.08.48 1.76 1.56 1.76 2.73V18H6v-1.61c0-1.18.68-2.26 1.76-2.73 1.17-.52 2.61-.91 4.24-.91zM4 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm1.13 1.1c-.37-.06-.74-.1-1.13-.1-.99 0-1.93.21-2.78.58A2.01 2.01 0 0 0 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29zM20 13c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm4 3.43c0-.81-.48-1.53-1.22-1.85A6.95 6.95 0 0 0 20 14c-.39 0-.76.04-1.13.1.4.68.63 1.46.63 2.29V18H24v-1.57zM12 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z"/></svg>',
    treasury:'<svg class="wico" viewBox="0 0 24 24"><path d="M4 10h3v7H4zm6.5 0h3v7h-3zM2 19h20v3H2zm15-9h3v7h-3zm-5-9L2 6v2h20V6z"/></svg>'
  };
  function walletCell(addr,label){
    var l=(label||"").toLowerCase(),nm,ic="";
    if(l.indexOf("bankr")>=0){nm="Bankr";ic=ICO.bankr;}
    else if(l.indexOf("agentbounty")>=0){nm="agentbountydev.eth";ic=ICO.agentbounty;}
    else if(l.indexOf("team")>=0){nm="Team";ic=ICO.team;}
    else if(l.indexOf("treasury")>=0){nm="Treasury";ic=ICO.treasury;}
    else nm=shortA(addr);
    return '<a href="https://basescan.org/address/'+addr+'" target="_blank" rel="noopener">'+ic+nm+'</a>';
  }
  function whenTs(ts){if(!ts)return "";try{return new Date(ts).toLocaleString(undefined,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"});}catch(e){return "";}}
  function rowBurn(e){
    var isBuy=e.type==="buyback-burn";
    var tag='<span class="tag '+(isBuy?"buyback":"manual")+'">'+(isBuy?"buyback-burn":"manual-burn")+'</span>';
    var from=walletCell(e.from,e.label);
    var tx=e.tx?'<a href="https://basescan.org/tx/'+e.tx+'" target="_blank" rel="noopener">'+e.tx.slice(0,8)+'…</a>':'';
    var amt=Number(e.amount).toLocaleString(undefined,{maximumFractionDigits:0});
    return '<tr><td>'+whenTs(e.ts)+'</td><td>'+tag+'</td><td class="amt">'+amt+'</td><td>'+from+'</td><td>'+tx+'</td></tr>';
  }
  function rowRetro(x,dep,depLabel){
    var tag='<span class="tag retro">retrodrop '+x.label+'</span>';
    var from=walletCell(dep,depLabel)+' <span class="lbl">→ '+(x.recipients||0)+'</span>';
    var txl=x.txs||(x.tx?[x.tx]:[]);
    var tx=txl.map(function(t,i){return '<a href="https://basescan.org/tx/'+t+'" target="_blank" rel="noopener">'+(txl.length>1?'p'+(i+1):t.slice(0,8)+'…')+'</a>';}).join(' · ');
    var amt=Number(x.amount).toLocaleString(undefined,{maximumFractionDigits:0});
    return '<tr><td>'+whenTs(x.ts)+'</td><td>'+tag+'</td><td class="amt">'+amt+'</td><td>'+from+'</td><td>'+tx+'</td></tr>';
  }
  function loadBurns(){
    Promise.all([
      fetch("/fees/events",{cache:"no-store"}).then(function(r){return r.json();}).catch(function(){return [];}),
      fetch("/airdrop-status.json",{cache:"no-store"}).then(function(r){return r.json();}).catch(function(){return {status:[]};})
    ]).then(function(arr){
      var burns=Array.isArray(arr[0])?arr[0]:[];
      var bbs=0,mbs=0; burns.forEach(function(e){var a=Number(e.amount)||0; if(e.type==="buyback-burn")bbs+=a; else mbs+=a;}); var btot=bbs+mbs;
      var _b=$("bbVal"); if(_b)_b.textContent=abbr(bbs); var _m=$("mbVal"); if(_m)_m.textContent=abbr(mbs);
      var _bb=$("bbBar"); if(_bb)_bb.style.width=(btot?bbs/btot*100:0).toFixed(1)+"%"; var _mb=$("mbBar"); if(_mb)_mb.style.width=(btot?mbs/btot*100:0).toFixed(1)+"%";
      var _bp=$("bbPct"); if(_bp)_bp.textContent=(btot?bbs/btot*100:0).toFixed(0)+"% burns"; var _mp=$("mbPct"); if(_mp)_mp.textContent=(btot?mbs/btot*100:0).toFixed(0)+"% burns";
      var S=arr[1]||{status:[]};var dep=S.deployer||'';var depLabel=S.deployerLabel||'';
      var retros=(S.status||[]).filter(function(x){return x.state==="completed"&&x.tx;});
      var items=burns.map(function(e){return {k:0,ts:e.ts,e:e};}).concat(retros.map(function(x){return {k:1,ts:x.ts,x:x};}));
      items.sort(function(a,b){return String(b.ts||"").localeCompare(String(a.ts||""));});
      var tb=$("burnrows");if(!tb)return;
      if(!items.length){tb.innerHTML='<tr><td colspan="5" class="empty">No burns recorded yet.</td></tr>';return;}
      tb.innerHTML=items.slice(0,200).map(function(it){return it.k?rowRetro(it.x,dep,depLabel):rowBurn(it.e);}).join('');
      var c=$("burncount");if(c)c.textContent=burns.length+' burn'+(burns.length===1?'':'s')+(retros.length?' · '+retros.length+' retrodrop'+(retros.length===1?'':'s'):'')+' recorded';
    }).catch(function(){});
  }
  loadBurns(); setInterval(loadBurns,30000);
  load(); setInterval(load,20000);
  $("refresh").addEventListener("click",function(e){e.preventDefault();$("updated").textContent="refreshing…";load();});
