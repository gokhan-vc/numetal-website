/** Wallet subscribe for studio newsletter over XMTP — POST api.gokhan.vc/newsletter/xmtp/subscribe */
(function () {
  var API = 'https://api.gokhan.vc/newsletter/xmtp/subscribe';
  var provider = null;

  function subMessage(wallet) {
    return 'Subscribe ' + wallet + ' to the Gökhan Turhan newsletter over XMTP.';
  }

  function utf8ToHex(str) {
    var bytes = new TextEncoder().encode(str);
    var hex = '';
    for (var i = 0; i < bytes.length; i++) {
      hex += bytes[i].toString(16).padStart(2, '0');
    }
    return '0x' + hex;
  }

  function setStatus(el, text, kind) {
    if (!el) return;
    el.textContent = text || '';
    el.classList.remove('is-ok', 'is-err');
    if (kind === 'ok') el.classList.add('is-ok');
    if (kind === 'err') el.classList.add('is-err');
  }

  function walletRejected(err) {
    var code = err && err.code;
    return (
      code === 4001 ||
      code === 'ACTION_REJECTED' ||
      (err && err.message && /user rejected|user denied|rejected the request/i.test(err.message))
    );
  }

  function networkError(err) {
    var msg = (err && err.message) || '';
    return /failed to fetch|networkerror|network error|cors|load failed/i.test(msg);
  }

  function userMessage(err) {
    if (!err) return 'Something went wrong — try again.';
    if (walletRejected(err)) return 'Wallet request cancelled.';
    if (networkError(err)) return 'Network blocked — could not reach api.gokhan.vc (CORS or CSP).';
    if (err.message) return String(err.message).slice(0, 140);
    return 'Something went wrong — try again.';
  }

  function getProvider() {
    if (provider) return provider;
    if (window.ethereum) return window.ethereum;
    return null;
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('eip6963:announceProvider', function (event) {
      if (!provider && event.detail && event.detail.provider) {
        provider = event.detail.provider;
      }
    });
    window.dispatchEvent(new Event('eip6963:requestProvider'));
  }

  async function onClick(btn) {
    var root = btn.closest('[data-xmtp-root]');
    var statusEl = root ? root.querySelector('[data-xmtp-status]') : null;
    var eth = getProvider();
    if (!eth) {
      setStatus(statusEl, 'No browser wallet found. Install MetaMask or another wallet.', 'err');
      return;
    }
    btn.disabled = true;
    setStatus(statusEl, 'Connect wallet…', null);
    try {
      var accounts = await eth.request({ method: 'eth_requestAccounts' });
      if (!accounts || !accounts[0]) {
        setStatus(statusEl, 'No wallet account returned — unlock your wallet and try again.', 'err');
        return;
      }
      var addr = accounts[0];
      var wallet = addr.toLowerCase();
      if (!/^0x[a-f0-9]{40}$/.test(wallet)) {
        setStatus(statusEl, 'Unexpected wallet address — try another account.', 'err');
        return;
      }
      setStatus(statusEl, 'Sign the message in your wallet…', null);
      var message = subMessage(wallet);
      var signature = await eth.request({
        method: 'personal_sign',
        params: [utf8ToHex(message), addr],
      });
      if (!signature || typeof signature !== 'string') {
        setStatus(statusEl, 'No signature returned — try again.', 'err');
        return;
      }
      var body = { wallet: wallet, signature: signature };
      var site = btn.getAttribute('data-xmtp-site');
      if (site) body.site = site;
      var res = await fetch(API, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      var data = await res.json().catch(function () {
        return {};
      });
      if (!res.ok) {
        setStatus(statusEl, data.error || 'Subscribe failed (' + res.status + ') — try again.', 'err');
        return;
      }
      setStatus(statusEl, 'Subscribed — dispatches will arrive over XMTP.', 'ok');
      btn.textContent = 'XMTP ✓';
    } catch (e) {
      console.error('[newsletter-xmtp]', e);
      setStatus(statusEl, userMessage(e), 'err');
    } finally {
      btn.disabled = false;
    }
  }

  document.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-xmtp-btn]');
    if (!btn) return;
    e.preventDefault();
    onClick(btn);
  });
})();
