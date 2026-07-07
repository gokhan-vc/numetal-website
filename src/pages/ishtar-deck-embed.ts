import type { APIRoute } from 'astro';

const EMBED_CSP =
  "default-src 'none'; object-src https://ishtar.numetal.xyz; frame-ancestors 'self' https://ishtar.numetal.xyz https://numetal.xyz https://www.numetal.xyz https://gokhanturhan.com https://www.gokhanturhan.com https://gokhan.vc https://www.gokhan.vc; base-uri 'none'; form-action 'none'";

const HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Ishtar pitch deck</title>
<meta name="robots" content="noindex" />
<style>
  html, body { margin: 0; height: 100%; overflow: hidden; background: #fff; }
  object, embed, iframe { width: 100%; height: 100%; border: 0; display: block; }
</style>
</head>
<body>
  <object data="https://ishtar.numetal.xyz/deck/not-raising-a-preseed/ishtar-deck-not-a-preseed.pdf#toolbar=1&amp;navpanes=1" type="application/pdf" aria-label="Ishtar pitch deck PDF">
    <embed src="https://ishtar.numetal.xyz/deck/not-raising-a-preseed/ishtar-deck-not-a-preseed.pdf#toolbar=1&amp;navpanes=1" type="application/pdf" />
    <p style="padding:1rem;font:14px system-ui,sans-serif">
      Your browser can't embed PDFs.
      <a href="https://ishtar.numetal.xyz/deck/not-raising-a-preseed/ishtar-deck-not-a-preseed.pdf">Download the deck</a>.
    </p>
  </object>
</body>
</html>`;

export const GET: APIRoute = () =>
  new Response(HTML, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'public, max-age=300',
      'content-security-policy': EMBED_CSP,
    },
  });
