/**
 * Fills the "Latest:" slot on /newsletter from the estate aggregate feed —
 * api.gokhan.vc/feed.json, which the feedhub poller re-renders every 10 min
 * from all four site feeds (dedup by rel=canonical).
 *
 * The server-rendered link is the no-JS fallback and stays put if anything
 * here fails. Override the source with data-latest-src (Ishtar proxies it
 * same-origin because a zone-level CSP pins connect-src to 'self').
 */
(function () {
  var a = document.querySelector('[data-latest-post]');
  if (!a) return;
  var src = a.getAttribute('data-latest-src') || 'https://api.gokhan.vc/feed.json';
  fetch(src, { credentials: 'omit' })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) {
      var it = d && d.items && d.items[0];
      if (!it || !it.url || !it.title) return;
      a.href = it.url;
      a.textContent = it.title;
    })
    .catch(function () { /* keep the server-rendered fallback */ });
})();
