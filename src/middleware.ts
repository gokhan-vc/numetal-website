import type { MiddlewareHandler } from 'astro';

// Security headers for ON-DEMAND routes (/fees, /fees/data, /fees/events).
// Prerendered/static pages get the same headers from public/_headers (the
// Cloudflare adapter serves static assets directly, bypassing middleware).
const CSP =
  "default-src 'self'; base-uri 'none'; object-src 'none'; frame-src 'self' https://assets.numetal.xyz https://ishtar.numetal.xyz https://numetal.xyz; frame-ancestors 'none'; " +
  "form-action 'self' https://api.gokhan.vc; img-src 'self' data:; font-src 'self'; style-src 'self' 'unsafe-inline'; " +
  "script-src 'self'; connect-src 'self' https://api.gokhan.vc; manifest-src 'self'; upgrade-insecure-requests";

export const onRequest: MiddlewareHandler = async (context, next) => {
  const res = await next();
  const { pathname } = new URL(context.request.url);
  const h = res.headers;

  h.set('strict-transport-security', 'max-age=31536000; includeSubDomains; preload');
  h.set('x-content-type-options', 'nosniff');

  if (pathname === '/ishtar-deck-embed') {
    h.delete('x-frame-options');
    return res;
  }

  h.set('x-frame-options', 'DENY');

  if (pathname.startsWith('/fees/data') || pathname.startsWith('/fees/events')) {
    h.set('access-control-allow-origin', '*');
    h.set('access-control-allow-methods', 'GET, OPTIONS');
    h.set('cross-origin-resource-policy', 'cross-origin');
  } else {
    h.set('content-security-policy', CSP);
    h.set('referrer-policy', 'strict-origin-when-cross-origin');
    h.set(
      'permissions-policy',
      'accelerometer=(), autoplay=(), camera=(), display-capture=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), interest-cohort=()',
    );
    h.set('cross-origin-opener-policy', 'same-origin-allow-popups');
    h.set('cross-origin-resource-policy', 'same-origin');
  }
  return res;
};
