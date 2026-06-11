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
      if(d.burned!=null){ $("burned").textContent=tok(d.burned,dec); if(d.supply){ try{ var pct=Number(BigInt(d.burned)*10000n/BigInt(d.supply))/100; $("burnedPct").textContent=pct.toFixed(2)+"% of supply · buyback + claim burn"; }catch(e){} } }
      if(d.treasury!=null) $("treasury").textContent=tok(d.treasury,dec);
      if(d.team!=null) $("team").textContent=tok(d.team,dec);
      if(d.price!=null) $("price").textContent=price(d.price);
      if(d.fdv!=null) $("fdv").textContent="FDV "+usd(d.fdv)+(d.vol24?(" · 24h "+usd(d.vol24)):"");
      $("updated").textContent="Updated "+new Date(d.ts||Date.now()).toLocaleTimeString();
    }).catch(function(){ $("updated").textContent="update failed — retrying"; });
  }
  function shortA(a){return a?a.slice(0,6)+"…"+a.slice(-4):"?";}
  function whenTs(ts){if(!ts)return "";try{return new Date(ts).toLocaleString(undefined,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"});}catch(e){return "";}}
  function loadBurns(){
    fetch("/fees/events",{cache:"no-store"}).then(function(r){return r.json();}).then(function(a){
      var tb=$("burnrows");if(!tb)return;
      if(!Array.isArray(a)||!a.length){tb.innerHTML='<tr><td colspan="5" class="empty">No burns recorded yet.</td></tr>';return;}
      tb.innerHTML=a.slice(0,200).map(function(e){
        var isBuy=e.type==="buyback-burn";
        var tag='<span class="tag '+(isBuy?"buyback":"manual")+'">'+(isBuy?"buyback-burn":"manual-burn")+'</span>';
        var lbl=e.label?' <span class="lbl">('+e.label+')</span>':'';
        var from='<a href="https://basescan.org/address/'+e.from+'" target="_blank" rel="noopener">'+shortA(e.from)+'</a>'+lbl;
        var tx=e.tx?'<a href="https://basescan.org/tx/'+e.tx+'" target="_blank" rel="noopener">'+e.tx.slice(0,8)+'…</a>':'';
        var amt=Number(e.amount).toLocaleString(undefined,{maximumFractionDigits:0});
        return '<tr><td>'+whenTs(e.ts)+'</td><td>'+tag+'</td><td class="amt">'+amt+'</td><td>'+from+'</td><td>'+tx+'</td></tr>';
      }).join('');
      var c=$("burncount");if(c)c.textContent=a.length+' burn'+(a.length===1?'':'s')+' recorded';
    }).catch(function(){});
  }
  loadBurns(); setInterval(loadBurns,30000);
  load(); setInterval(load,20000);
  $("refresh").addEventListener("click",function(e){e.preventDefault();$("updated").textContent="refreshing…";load();});
