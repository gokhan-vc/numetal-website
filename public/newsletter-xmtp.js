/** Wallet subscribe for studio newsletter over XMTP — POST api.gokhan.vc/newsletter/xmtp/subscribe */
(function () {
  var API = 'https://api.gokhan.vc/newsletter/xmtp/subscribe';

  function subMessage(wallet) {
    return 'Subscribe ' + wallet + ' to the Gökhan Turhan newsletter over XMTP.';
  }

  function setStatus(el, text, kind) {
    if (!el) return;
    el.textContent = text || '';
    el.classList.remove('is-ok', 'is-err');
    if (kind === 'ok') el.classList.add('is-ok');
    if (kind === 'err') el.classList.add('is-err');
  }

  async function onClick(btn) {
    var root = btn.closest('[data-xmtp-root]');
    var statusEl = root ? root.querySelector('[data-xmtp-status]') : null;
    if (!window.ethereum) {
      setStatus(statusEl, 'No browser wallet found. Install MetaMask or another wallet.', 'err');
      return;
    }
    btn.disabled = true;
    setStatus(statusEl, 'Connect wallet…', null);
    try {
      var accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      var addr = accounts[0];
      var wallet = addr.toLowerCase();
      setStatus(statusEl, 'Sign the message in your wallet…', null);
      var message = subMessage(wallet);
      var signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, addr],
      });
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
        setStatus(statusEl, data.error || 'Subscribe failed — try again.', 'err');
        return;
      }
      setStatus(statusEl, 'Subscribed — dispatches will arrive over XMTP.', 'ok');
      btn.textContent = 'XMTP ✓';
    } catch (e) {
      setStatus(statusEl, 'Cancelled or failed — try again.', 'err');
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
